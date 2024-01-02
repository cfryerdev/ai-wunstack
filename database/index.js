import { Client } from 'pg';

const setupDatabase = async () => {
    const client = new Client({
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE
    });
    await client.query(`CREATE TABLE IF NOT EXISTS conversations (
        conversation_id serial PRIMARY KEY,
        user_id serial NOT NULL,
        title VARCHAR (255) NOT NULL,
        created_on TIMESTAMP NOT NULL,
        updated_on TIMESTAMP NOT NULL
    );`);
    await client.query(`CREATE TABLE IF NOT EXISTS conversations_messages (
        message_id serial PRIMARY KEY,
        conversation_id serial NOT NULL,
        message VARCHAR NOT NULL,
        from_bot BOOLEAN NOT NULL,
        created_on TIMESTAMP NOT NULL,
        CONSTRAINT fk_conversations
      		FOREIGN KEY(conversation_id) 
	  			REFERENCES conversations(conversation_id)
    );`);
};

console.log('Setting up database...');
await setupDatabase();
console.log('Finished!');