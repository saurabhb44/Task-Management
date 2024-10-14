import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const queryTaskRequestSchema = {
    type: 'object',
    properties: {
        project_id: {
            type: 'string'
        }, 
        status: {
            enum: ['pending', 'in_progress', 'completed']
        }, 
        priority: {
            enum: ['low', 'medium', 'high']
        },
        keyword: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
        }, 
        assigned_user_id: {
            type: 'string'
        }, 
        days: {
            type: 'integer',
        },
    },
    anyOf: [
        { required: ['status'] }, 
        { required: ['priority'] }, 
        { required: ['project_id'] }, 
        { required: ['assigned_user_id'] }, 
        { required: ['days'] },
        { required: ['keyword'] }
    ],
    additionalProperties: false,
};

const ajv = new Ajv();
addFormats(ajv);
const validateQueryTaskSchema = ajv.compile(queryTaskRequestSchema);

export { validateQueryTaskSchema };
