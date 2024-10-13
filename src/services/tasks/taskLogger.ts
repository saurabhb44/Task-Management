import { pool } from "../../utils/db";
import { v4 as uuidv4 } from 'uuid';

export const logTaskUpdate = async (taskId: string, oldStatus: string, newStatus: string, userId: string) => {
    try {
        await pool.query(
            `INSERT INTO task_logs (id, task_id, previous_status, new_status, changed_by) 
             VALUES ($1, $2, $3, $4, $5)`,
            [uuidv4(), taskId, oldStatus, newStatus, userId]
        );
    } catch (error) {
        console.log('Unexpected error occurred while logging task ', error);
    }
};
  