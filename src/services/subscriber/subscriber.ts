// src/services/notificationService.ts
import { createClient } from 'redis';
import { pool } from '../../utils/db';
import { v4 as uuidv4 } from 'uuid';

interface RedisConfig {
  url: string;
}

export class Subscriber {
  private redisSubscriber;
  constructor(redisConfig: RedisConfig) {
    this.redisSubscriber = createClient(redisConfig);
    this.redisSubscriber.on('error', (err) => console.error('Redis Client Error', err));
    this.redisSubscriber.connect().then(() => {
      console.log('Redis subscriber connected');
    }); // Connect to Redis server
  }

  getNotificationBody = (messageType: 'create' | 'update', taskId: string, status: string) => {
    switch(messageType) {
      case 'create':
        return `Task ${taskId} created with status ${status}`;
      case 'update':
        return `Task ${taskId} status changed to ${status}`;
    }
  }

// Subscribe to the 'task_updates' channel
  subscribeMessage = () => {
    return this.redisSubscriber.subscribe('task_updates', async (message: string) => {
      const { taskId, status, userId, messageType } = JSON.parse(message);
      try {
        console.log(`Received message: ${message}`);
        let notificationBody = this.getNotificationBody(messageType, taskId, status);
        await pool.query(
          `INSERT INTO notifications (id, user_id, task_id, message, created_at)
           VALUES ($1, $2, $3, $4, NOW())`,
          [uuidv4(), userId, taskId, notificationBody]
        );
      } catch (err) {
        console.error('Error saving notification:', err);
      }
    });
  }
}
