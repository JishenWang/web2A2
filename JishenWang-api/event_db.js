const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',       
  password: '@wjswjs180180.', 
  database: 'charityevents_db',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 
};

const pool = mysql.createPool(dbConfig);

async function testDbConnection() {
  let connection;
  try {
    console.log('Attempting to connect to the database...');
    console.log('Connection parameters:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    connection = await pool.getConnection();
    console.log('Database connection successful!');
    return true;
  } catch (err) {
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Error: Incorrect username or password!');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('Error: Database does not exist! Please execute charityevents_db.sql to create the database first');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Error: Connection refused! Please check if the MySQL service is running');
    } else {
      console.error('Database connection error:', err.code, err.message);
    }
    throw err; 
  } finally {
    if (connection) {
      connection.release(); 
    }
  }
}

module.exports = { pool, testDbConnection };