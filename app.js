// Load environment variables from .env file
require('dotenv').config();

var express = require('express');
var app = express();

// --- Database Setup (using mssql driver) ---
const sql = require('mssql');

// Configure the database connection pool using environment variables
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || '127.0.0.1',
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '1433', 10),
    options: {
        encrypt: true,
        trustServerCertificate: true // Set back to false if using proxy
        // trustServerCertificate: true // Set to true ONLY if connecting directly and accepting risk
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Make pool accessible globally in this module
let pool;

// --- MOVE testDbConnection DEFINITION HERE ---
// Optional: Test the connection pool after connecting
async function testDbConnection() {
    // Ensure pool exists before trying to use it in test
    if (!pool) {
        console.error("Cannot run test query: Database pool is not initialized.");
        return;
    }
    try {
        const result = await pool.request().query('SELECT GETDATE() as now'); // SQL Server equivalent of NOW()
        console.log('Database test query successful. Server time:', result.recordset[0].now);
    } catch (err) {
        console.error('Database test query failed:', err);
    }
}
// --- END MOVED DEFINITION ---


// Function to establish connection (call this once)
async function connectDb() {
    try {
        console.log("Attempting to connect to SQL Server...");
        pool = await new sql.ConnectionPool(dbConfig).connect();
        console.log('Successfully connected to SQL Server Database Pool.');
        // Optional: Test query after connection
        // Now testDbConnection is defined when this line is reached
        await testDbConnection();
    } catch (err) {
        console.error('Database Connection Failed! Bad Config:', err);
        process.exit(1); // Exit if DB connection fails on startup
    }
}


// Call connectDb function to establish the pool on startup
// Ensure both function definitions above exist before this call
connectDb();

// --- End Database Setup ---


// --- Routes ---
// ... (Your routes remain the same) ...
app.get('/', function (req, res) {
    res.json({ response: "Hey There! This is Shubham this is a test" });
});

app.get('/will', function (req, res) {
    res.json({ response: "Hello World! this is /will page" });
});

app.get('/ready', function (req, res) {
    res.json({ response: " Great!, It works!" });
});

app.get('/asset', async (req, res) => {
    if (!pool) {
         return res.status(503).json({ error: 'Database connection not available' });
    }
    const queryText = 'SELECT * FROM asset';
    try {
        const result = await pool.request().query(queryText);
        console.log(`Successfully fetched ${result.recordset.length} assets`);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('Error executing query:', err.stack);
        res.status(500).json({ error: 'Failed to retrieve assets', details: err.message });
    }
});
// --- End Routes ---

// --- Server Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Export the app (useful for testing)
module.exports = app;