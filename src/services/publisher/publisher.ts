// src/services/pubSubService.ts
import { createClient } from 'redis';
import { redisConfig } from '../../utils/message-broker';

const redisPublisher = createClient(redisConfig);

redisPublisher.on('error', (err) => console.error('Redis Client Error', err));

redisPublisher.connect().then(() => {
    console.log('Redis publisher connected');
}); ; // Connect to Redis server

export const publishTaskUpdate = async (taskId: string, status: string, userId: string, messageType: 'create' | 'update') => {
  const message = JSON.stringify({ taskId, status, userId, messageType });
  await redisPublisher.publish('task_updates', message);
};
