// server.js
import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MySQL
const db = mysql.createPool({
  host: "localhost",
  user: "root",       // your MySQL username
  password: "1234",
  database: "EventFinder",
  port: 3306,
});

db.getConnection((err, conn) => {
  if (err) throw err;
  console.log("Connected to MySQL");
  conn.release();
});

// =====================
// EVENTS ROUTES
// =====================

// GET all events
app.get("/events", (req, res) => {
  const sql = `
    SELECT e.event_id AS id, e.title AS name, e.description, e.location,
           e.start_time AS date, end_time, e.capacity, e.org_id AS club_id,
           o.org_name AS club_name
    FROM Event e
    JOIN OrganizationClub o ON e.org_id = o.org_id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// CREATE event
app.post("/events", (req, res) => {
  const { title, description, location, start_time, end_time, capacity, org_id } = req.body;
  const sql = `
    INSERT INTO Event (title, description, location, start_time, end_time, capacity, org_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, description, location, start_time, end_time, capacity, org_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

// UPDATE event
app.put("/events/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, location, start_time, end_time, capacity, org_id } = req.body;
  const sql = `
    UPDATE Event
    SET title = ?, description = ?, location = ?, start_time = ?, end_time = ?, capacity = ?, org_id = ?
    WHERE event_id = ?
  `;
  db.query(sql, [title, description, location, start_time, end_time, capacity, org_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Event not found" });
    res.json({ id, ...req.body });
  });
});

// DELETE event
app.delete("/events/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Event WHERE event_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Deleted successfully" });
  });
});

// GET clubs
app.get("/clubs", (req, res) => {
  const sql = "SELECT org_id AS id, org_name AS name FROM OrganizationClub";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});