// src/services/pubSubService.ts
import { createClient } from 'redis';
import { redisConfig } from '../../utils/message-broker';
import { sleep } from '../../utils/utils';

const MAX_RETRIES = 5;

const redisPublisher = createClient(redisConfig);

redisPublisher.on('error', (err) => console.error('Redis Client Error', err));

redisPublisher.connect().then(() => {
    console.log('Redis publisher connected');
});; // Connect to Redis server

const publishTaskUpdateWithRetries = async (channel: string, message: string, attempt: number = 1) => {
    try {
        await redisPublisher.publish(channel, message);
        console.log('Successfully published message.')
    } catch (error) {
        console.log('Error publishing message ', error);
        if (attempt < MAX_RETRIES) {
            const retryDelay = 1000 * 2 ** (attempt - 1); // Exponential backoff (1s, 2s, 4s, etc.)
            console.log(`Retrying in ${retryDelay / 1000} seconds...`);
            await sleep(retryDelay);
            await publishTaskUpdateWithRetries(channel, message, attempt + 1);
        }  else {
            console.error(`Failed to publish task after ${MAX_RETRIES} attempts: ${message}`);
            // Optionally: Log the failure for further analysis or alerting
        }
    }
};
export const publishTaskUpdate = async (taskId: string, status: string, userId: string, messageType: 'create' | 'update') => {
    const message = JSON.stringify({ taskId, status, userId, messageType });
    await publishTaskUpdateWithRetries('task_updates', message);
}
