// src/routes/taskRoutes.ts
import { Router } from 'express';
import { createTask, updateTask, queryTasks } from '../controllers/taskController';
import { verifyJWTToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/tasks', verifyJWTToken, createTask);
router.put('/tasks/:id', verifyJWTToken, updateTask);
router.get('/tasks/query', verifyJWTToken, queryTasks);

export default router;
