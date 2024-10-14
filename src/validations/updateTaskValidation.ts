import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const updateTaskRequestSchema = {
    type: 'object',
    properties: {
        status: {
            enum: ['pending', 'in_progress', 'completed']
        }, 
        priority: {
            enum: ['low', 'medium', 'high']
        },
        assigned_user_id: {
            type: 'string'
        }
    },
    anyOf: [{ required: ['status'] }, { required: ['priority'] }],
    additionalProperties: false,
};

const ajv = new Ajv();
addFormats(ajv);
const validateUpdateTaskSchema = ajv.compile(updateTaskRequestSchema);

export { validateUpdateTaskSchema };
