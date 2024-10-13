import cron from 'node-cron';
import { pool } from '../../utils/db';
import { v4 as uuidv4 } from 'uuid';

export class TaskNotificationScheduler {
  cron (interval: string) {
    cron.schedule(interval, async () => {
      const result = await pool.query(
        `SELECT * FROM tasks WHERE due_date = NOW() + INTERVAL '1 day'`
      );
    
      result.rows.forEach(async (task) => {
        pool.query(
          `INSERT INTO notifications (id, user_id, task_id, message) VALUES ($1, $2, $3, $4)`,
          [uuidv4(), task.assigned_user_id, task.id, `Task ${task.title} is due tomorrow`]
        );
      });
    });
  }

}
