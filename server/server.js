const http = require("http");
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'mysql' 
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS patient (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dateOfBirth DATETIME NOT NULL
)`;

connection.query(createTableQuery, (err, result) => {
  if (err) throw err;
  console.log("Table created or already exists.");
});

let lastRequestBody = null;
let totalRequests = 0;

const server = http.createServer((req, res) => {
  totalRequests++;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

req.on("end", () => {
  try {
    lastRequestBody = body;
    const serializedBody = JSON.parse(lastRequestBody);
    const { query } = serializedBody;

    connection.query(query, (err, result, fields) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error executing query." }));
        return;
      }
      if (query.trim().toLowerCase().startsWith("select")) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } else {
        connection.query('SELECT * FROM patient', (selectErr, selectResult) => {
          if (selectErr) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Error fetching updated data." }));
            return;
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(selectResult));
        });
      }
    });
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Bad request. Failed to parse JSON body." }));
  }
});
  } else {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed. Only POST is supported." }));
  }
});

const PORT = process.env.PORT || 8083;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
