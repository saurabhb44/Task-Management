import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const createTaskRequestSchema = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        }, 
        description: {
            type: 'string'
        },
        status: {
            enum: ['pending', 'in_progress', 'completed']
        }, 
        priority: {
            enum: ['low', 'medium', 'high']
        },
        project_id: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
        }, 
        assigned_user_id: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
        }, 
        due_date: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
        },
    },
    required: ['title', 'description', 'status', 'priority', 'project_id', 'assigned_user_id', 'due_date'],
    additionalProperties: false,
};

const ajv = new Ajv();
addFormats(ajv);
const validateCreateTaskSchema = ajv.compile(createTaskRequestSchema);

export { validateCreateTaskSchema };
