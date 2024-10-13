CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id)
);

CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'pending',
    priority task_priority NOT NULL DEFAULT 'medium',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    project_id UUID REFERENCES projects(id),
    assigned_user_id UUID REFERENCES users(id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    author_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    task_id UUID REFERENCES tasks(id),
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE previous_status AS ENUM('pending', 'in_progress', 'completed');
CREATE TYPE new_status AS ENUM('pending', 'in_progress', 'completed');
CREATE TABLE task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id),
    changed_by UUID REFERENCES users(id),
    previous_status previous_status,
    new_status new_status,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX idx_comments_task_id ON comments(task_id);
CREATE INDEX idx_comments_content ON comments USING GIN (content gin_trgm_ops);


SELECT DISTINCT tasks.*
        FROM tasks
        LEFT JOIN comments ON comments.task_id = tasks.id
     AND comments.content ILIKE '%' || $1 || '%' WHERE 1=1 AND tasks.project_id = $2 AND tasks.status = $3 AND tasks.due_date < NOW() + INTERVAL '$9 days' AND comments.id IS NOT NULL