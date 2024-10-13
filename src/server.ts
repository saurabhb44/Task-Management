// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import { pool } from './utils/db';
import taskRoutes from './routes/taskRoutes';
import { Subscriber } from './services/subscriber/subscriber';
import { redisConfig } from './utils/message-broker';
import { TaskNotificationScheduler } from './services/schedulers/taskNotificationScheduler';
import 'dotenv/config';

const cronInterval = process.env.CRON_INTERVAL as string ||'0 8 * * *';

const app = express();

// Middleware
app.use(bodyParser.json());
pool.connect().then(() => {
  console.log('DB connected!');

  // Start subscriber after DB is connected
  new Subscriber(redisConfig).subscribeMessage();

  // Start cron-job after DB is connected
  new TaskNotificationScheduler().cron(cronInterval);
});

// Routes
app.use('/api', taskRoutes);

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
