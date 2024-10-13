import { pool } from "../utils/db";

export class GeneralQueryDao {
    async query (query: string, values: any[]) {
        return await pool.query(query, values);
    }
}