import pool from './config/db';
import fs from 'fs';
import path from 'path';

const initDb = async () => {
  console.log('Starting database initialization...');
  try {
    const schemaPath = path.join(__dirname, '../db_schema.sql');
    console.log('Reading schema from:', schemaPath);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const statements = schema.split(';').filter(stmt => stmt.trim() !== '');
    console.log(`Found ${statements.length} statements to execute.`);

    for (const statement of statements) {
      console.log('Executing statement:', statement.substring(0, 50) + '...');
      await pool.query(statement);
    }

    console.log('Database tables initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    console.log('Initialization finished.');
    process.exit();
  }
};

initDb();
