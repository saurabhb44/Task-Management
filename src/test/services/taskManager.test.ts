import { TaskManager } from '../../services/tasks/taskManager';
import {
    describe,
    expect,
    it,
    jest,
    beforeEach,
} from '@jest/globals';


describe('Task Management Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    
    describe('Task Creation Method', () => {
        it('should create a new task', async () => {
            const newTask = {
                title: 'Test Task',
                description: 'Description of test task',
                status: 'pending',
                priority: 'medium',
                project_id: 'f91e86d0-14d2-4ccd-ae44-5c4945e4ab3e',
                assigned_user_id: '6d43d2f0-7b08-455b-a42e-9fa86f64fbe6',
                due_date: '2024-12-31'
            };
            const createdTask = {
                id: 'random_generated_uuid',
                title: 'Test Task',
                description: 'Description of test task',
                status: 'pending',
                priority: 'medium',
                project_id: 'f91e86d0-14d2-4ccd-ae44-5c4945e4ab3e',
                assigned_user_id: '6d43d2f0-7b08-455b-a42e-9fa86f64fbe6',
                due_date: '2024-12-31'
            }

            const dbQueryMock = jest.spyOn(TaskManager.prototype, 'generalQuery');
            const uuidMock = jest.spyOn(TaskManager.prototype, 'generateTaskId');
            const publisherMock = jest.spyOn(TaskManager.prototype, 'publishMessageOnMessageBroker');

            dbQueryMock.mockResolvedValueOnce({ rows: [createdTask] });
            uuidMock.mockReturnValue('random_generated_uuid');
            publisherMock.mockResolvedValueOnce();

            const taskCreate = await new TaskManager().createTask(newTask);
            
            expect(taskCreate).toStrictEqual(createdTask);
            expect(dbQueryMock).toHaveBeenCalledTimes(1);
            expect(uuidMock).toHaveBeenCalledTimes(1);
            expect(publisherMock).toHaveBeenCalledTimes(1);
        });
    });
});