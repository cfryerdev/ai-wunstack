import { Client } from 'pg';

/** Setup a database connection */
const client = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
});

const getConversations = async ({ user_id }) => {
    await client.connect();
    const res = await client.query(`
        SELECT conversation_id, title, created_on, updated_on
        FROM conversations 
        WHERE user_id = $1`, 
    [user_id]);
    return res;
};

const storeConversation = async ({ conversation_id, user_id, title }) => {
    await client.connect();
    const queryText = `
        INSERT INTO conversations(conversation_id, user_id, title) 
        VALUES($1, $2, $3) 
        RETURNING conversation_id`
    await client.query(queryText, [conversation_id, user_id, title])
};

/** What we export for use with other services or routes */
export default {
    getConversations,
    storeConversation
}