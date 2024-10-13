import { Request, Response } from 'express';
import { TaskManager } from '../services/tasks/taskManager';

const taskManager = new TaskManager();

export const createTask = async (req: Request, res: Response) => {
    const { title, description, status, priority, project_id, assigned_user_id, due_date } = req.body;
    try {
        const params = {
            title, 
            description, 
            status, 
            priority, 
            project_id, 
            assigned_user_id,
            due_date 
        }
        const result = await taskManager.createTask(params);
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, priority, assigned_user_id } = req.body;

    try {
        const task = await taskManager.getTask(id);

        if (task.rowCount === 0) {
            res.status(404).send('Task not Found');
            return;
        }
        const oldTask = task.rows[0];

        // If no user is sent in request then assigned user doesn't change
        const updatedAssignedUser = assigned_user_id || oldTask.assigned_user_id;

        const params = {
            status, priority, updatedAssignedUser
        }
        const result = await taskManager.updateTask(oldTask, params, id, req.userId);        
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export const queryTasks = async (req: Request, res: Response) => {
    const { project_id, assigned_user_id, status, priority, days, keyword } = req.query;
    const params = {
        project_id, assigned_user_id, status, priority, days, keyword
    }
    try {
        const result = await taskManager.queryTask(params);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

