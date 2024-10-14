import { GeneralQueryDao } from "../../dao/generalQueryDao";
import { v4 as uuidv4 } from 'uuid';
import { publishTaskUpdate } from "../publisher/publisher";
import { logTaskUpdate } from "./taskLogger";

export class TaskManager {
    private generalQueryDao: GeneralQueryDao;

    constructor() {
        this.generalQueryDao = new GeneralQueryDao();
    }

    generateTaskId () {
        return uuidv4();
    }

    async generalQuery(query: string, values: any[]): Promise<any> {
        return await this.generalQueryDao.query(query, values);
    }

    async getTask(task_id: string) {
        return await this.generalQueryDao.query(`SELECT * FROM tasks WHERE id = $1`, [task_id]);
    }

    async publishMessageOnMessageBroker (taskId: string, status: string, assigned_user_id: string, type: 'create' | 'update') {
        return await publishTaskUpdate(taskId, status, assigned_user_id, type);
    }

    async createTask(params) {
        const taskId = this.generateTaskId();
        const query = `INSERT INTO tasks (id, title, description, status, priority, project_id, assigned_user_id, due_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const values = [
            taskId,
            params.title,
            params.description,
            params.status,
            params.priority,
            params.project_id,
            params.assigned_user_id,
            params.due_date
        ];
        const result = await this.generalQuery(query, values);
        this.publishMessageOnMessageBroker(taskId, params.status, params.assigned_user_id, 'create');
        return result.rows[0];
    }

    async updateTask(oldTask, params, taskId: string, userId: string) {
        const result = await this.generalQuery(
            `UPDATE tasks SET status = $1, priority = $2, assigned_user_id = $3 WHERE id = $4 RETURNING *`,
            [params.status, params.priority, params.assigned_user_id, taskId]
        );

        logTaskUpdate(taskId, oldTask.status, params.status, userId);
        publishTaskUpdate(taskId, params.status, params.assigned_user_id, 'update');
        return result.rows[0];
    }

    async queryTask(params) {
        let query = `
            SELECT DISTINCT tasks.*
            FROM tasks
            LEFT JOIN comments ON comments.task_id = tasks.id
        `;
        const values: (string | number)[] = [];

        if (params.keyword) {
            query += ` AND comments.content ILIKE '%' || $${values.length + 1} || '%'`;
            values.push(params.keyword as string);
        }

        query += ` WHERE 1=1 `;  // starting condition, to add filters dynamically

        if (params.project_id) {
            query += ` AND tasks.project_id = $${values.length + 1}`;
            values.push(params.project_id as string);
        }
        if (params.assigned_user_id) {
            query += ` AND tasks.assigned_user_id = $${values.length + 1}`;
            values.push(params.assigned_user_id as string);
        }
        if (params.status) {
            query += ` AND tasks.status = $${values.length + 1}`;
            values.push(params.status as string);
        }
        if (params.priority) {
            query += ` AND tasks.priority = $${values.length + 1}`;
            values.push(params.priority as string);
        }
        if (params.days) {
            query += ` AND tasks.due_date < NOW() + INTERVAL '$${params.days} days'`;
        }

        // Filter tasks that have at least one matching comment (only if keyword is passed)
        if (params.keyword) {
            query += ` AND comments.id IS NOT NULL`;
        }

        const result = await this.generalQuery(query, values);
        return result.rows;
    }
}