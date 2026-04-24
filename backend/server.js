import "dotenv/config";
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  port: Number(process.env.DB_PORT) || 3307,
});

db.getConnection((err, conn) => {
  if (err) throw err;
  console.log("Connected to MySQL");
  conn.release();
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Missing auth token" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

const createJwt = (id, email, isAdmin = false) => jwt.sign({ id, email, isAdmin }, JWT_SECRET, { expiresIn: "2h" });

app.post("/signup", async (req, res) => {
  const { email, password, first_name, last_name, grad_year, major } = req.body;

  if (!email || !password || !first_name || !last_name || !grad_year || !major) {
    return res.status(400).json({ error: "Email, password, first name, last name, grad year, and major are required" });
  }

  db.query("SELECT user_id FROM Users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Email already registered" });

    const password_hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO Users (email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)",
      [email, first_name, last_name, password_hash],
      (insertErr, insertResult) => {
        if (insertErr) return res.status(500).json({ error: "Account creation failed. Please try again." });

        const userId = insertResult.insertId;
        db.query("INSERT INTO Student (user_id, grad_year, major) VALUES (?, ?, ?)", [userId, grad_year, major], (studentErr) => {
          if (studentErr) {
            console.error("Could not create student profile", studentErr.message);
          }
          const token = createJwt(userId, email, false);
          res.json({ token, user: { id: userId, email, first_name, last_name, isAdmin: false } });
        });
      }
    );
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  db.query(
    `SELECT u.user_id, u.email, u.first_name, u.last_name, u.password_hash,
            CASE WHEN a.user_id IS NOT NULL THEN 1 ELSE 0 END AS isAdmin
     FROM Users u
     LEFT JOIN Administrator a ON u.user_id = a.user_id
     WHERE u.email = ?`,
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Invalid login. Please check your credentials." });
      if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

      const user = results[0];
      const isValid = await bcrypt.compare(password, user.password_hash || "");

      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = createJwt(user.user_id, user.email, Boolean(user.isAdmin));
      res.json({
        token,
        user: { id: user.user_id, email: user.email, first_name: user.first_name, last_name: user.last_name, isAdmin: Boolean(user.isAdmin) },
      });
    }
  );
});

app.put("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required" });
  }

  db.query("SELECT password_hash FROM Users WHERE user_id = ?", [req.user.id], async (err, results) => {
    if (err) return res.status(500).json({ error: "Password change failed. Please try again." });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const currentHash = results[0].password_hash || "";
    const isValid = await bcrypt.compare(currentPassword, currentHash);

    if (!isValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    db.query("UPDATE Users SET password_hash = ? WHERE user_id = ?", [newHash, req.user.id], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: "Password change failed. Please try again." });
      res.json({ message: "Password updated successfully" });
    });
  });
});

app.get("/events", authenticateToken, (req, res) => {
  const sql = req.user.isAdmin
    ? `
      SELECT e.event_id AS id, e.title AS name, e.description, e.location,
             e.start_time AS date, e.end_time, e.capacity, e.org_id AS club_id,
             e.created_by, o.org_name AS club_name
      FROM Event e
      JOIN OrganizationClub o ON e.org_id = o.org_id
    `
    : `
      SELECT e.event_id AS id, e.title AS name, e.description, e.location,
             e.start_time AS date, e.end_time, e.capacity, e.org_id AS club_id,
             e.created_by, o.org_name AS club_name
      FROM Event e
      JOIN OrganizationClub o ON e.org_id = o.org_id
      JOIN Membership m ON o.org_id = m.org_id
      WHERE m.student_id = ?
    `;
  db.query(sql, req.user.isAdmin ? [] : [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/events", authenticateToken, (req, res) => {
  const { title, description, location, start_time, end_time, capacity, org_id } = req.body;
  const sql = `
    INSERT INTO Event (title, description, location, start_time, end_time, capacity, org_id, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, description, location, start_time, end_time, capacity, org_id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body, created_by: req.user.id });
  });
});

app.put("/events/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, location, start_time, end_time, capacity, org_id } = req.body;

  db.query("SELECT created_by FROM Event WHERE event_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Event not found" });
    if (results[0].created_by !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "You may only update your own events" });
    }

    const sql = `
      UPDATE Event
      SET title = ?, description = ?, location = ?, start_time = ?, end_time = ?, capacity = ?, org_id = ?
      WHERE event_id = ?
    `;

    db.query(sql, [title, description, location, start_time, end_time, capacity, org_id, id], (updateErr, result) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      res.json({ id, ...req.body, created_by: req.user.id });
    });
  });
});

app.delete("/events/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.query("SELECT created_by FROM Event WHERE event_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Event not found" });
    if (results[0].created_by !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "You may only delete your own events" });
    }

    db.query("DELETE FROM EventRegistration WHERE event_id = ?", [id], (deleteRegErr) => {
      if (deleteRegErr) return res.status(500).json({ error: deleteRegErr.message });
      db.query("DELETE FROM Event WHERE event_id = ?", [id], (deleteErr, result) => {
        if (deleteErr) return res.status(500).json({ error: deleteErr.message });
        res.json({ message: "Deleted successfully" });
      });
    });
  });
});

app.get("/clubs", authenticateToken, (req, res) => {
  const sql = `SELECT 
  oc.org_id AS id,
  oc.org_name AS name,
  oc.category,
  (m.student_id IS NOT NULL) AS is_member
  FROM OrganizationClub oc
  LEFT JOIN Membership m 
  ON oc.org_id = m.org_id 
 AND m.student_id = ?;`;
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/clubs", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Admin access required" });
  const { name, description, category } = req.body;
  if (!name || !category) return res.status(400).json({ error: "Club name and category are required" });

  const sql = "INSERT INTO OrganizationClub (org_name, description, category, created_at) VALUES (?, ?, ?, NOW())";
  db.query(sql, [name, description || "", category], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, description, category });
  });
});

app.delete("/clubs/:id", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Admin access required" });
  const orgId = Number(req.params.id);
  if (!orgId) return res.status(400).json({ error: "Invalid club ID" });

  db.query("DELETE FROM EventRegistration WHERE event_id IN (SELECT event_id FROM Event WHERE org_id = ?)", [orgId], (deleteRegErr) => {
    if (deleteRegErr) return res.status(500).json({ error: deleteRegErr.message });
    db.query("DELETE FROM Event WHERE org_id = ?", [orgId], (deleteEventErr) => {
      if (deleteEventErr) return res.status(500).json({ error: deleteEventErr.message });
      db.query("DELETE FROM Membership WHERE org_id = ?", [orgId], (deleteMembershipErr) => {
        if (deleteMembershipErr) return res.status(500).json({ error: deleteMembershipErr.message });
        db.query("DELETE FROM OrganizationClub WHERE org_id = ?", [orgId], (deleteClubErr, result) => {
          if (deleteClubErr) return res.status(500).json({ error: deleteClubErr.message });
          if (result.affectedRows === 0) return res.status(404).json({ error: "Club not found" });
          res.json({ message: "Club deleted successfully" });
        });
      });
    });
  });
});

app.post("/clubs/:id/join", authenticateToken, (req, res) => {
  const orgId = Number(req.params.id);
  if (!orgId) return res.status(400).json({ error: "Invalid club ID" });

  const sql = "INSERT IGNORE INTO Membership (student_id, org_id, join_date, role, status) VALUES (?, ?, NOW(), ?, ?)";
  db.query(sql, [req.user.id, orgId, "Member", "Active"], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Joined club successfully" });
  });
});
app.delete("/clubs/:id/join", authenticateToken, (req, res) => {
  const orgId = Number(req.params.id);
  if (!orgId) return res.status(400).json({ error: "Invalid club ID" });

  const sql = "DELETE FROM Membership WHERE student_id = ? AND org_id = ?";
  db.query(sql, [req.user.id, orgId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Not a member of this club" });
    res.json({ message: "Left club successfully" });
  });
});
app.post("/events/:id/rsvp", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { rsvp_status } = req.body;
  if (!rsvp_status) return res.status(400).json({ error: "RSVP status is required" });

  const sql = `
    INSERT INTO EventRegistration (student_id, event_id, rsvp_status, registered_at)
    VALUES (?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE rsvp_status = VALUES(rsvp_status), registered_at = VALUES(registered_at)
  `;

  db.query(sql, [req.user.id, id, rsvp_status], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "RSVP saved successfully" });
  });
});

app.delete("/events/:id/rsvp", authenticateToken, (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM EventRegistration WHERE student_id = ? AND event_id = ?";
  db.query(sql, [req.user.id, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "RSVP cancelled successfully" });
  });
});

app.get("/my-events", authenticateToken, (req, res) => {
  const createdSql = `
    SELECT e.event_id AS id, e.title AS name, e.description, e.location,
           e.start_time AS date, e.end_time, e.capacity, e.org_id AS club_id,
           e.created_by, o.org_name AS club_name, 'Host' AS rsvp_status
    FROM Event e
    JOIN OrganizationClub o ON e.org_id = o.org_id
    WHERE e.created_by = ?
  `;

  const registeredSql = `
    SELECT e.event_id AS id, e.title AS name, e.description, e.location,
           e.start_time AS date, e.end_time, e.capacity, e.org_id AS club_id,
           e.created_by, o.org_name AS club_name, er.rsvp_status
    FROM Event e
    JOIN OrganizationClub o ON e.org_id = o.org_id
    JOIN EventRegistration er ON e.event_id = er.event_id
    WHERE er.student_id = ?
  `;

  db.query(createdSql, [req.user.id], (err, createdEvents) => {
    if (err) return res.status(500).json({ error: err.message });
    db.query(registeredSql, [req.user.id], (regErr, registeredEvents) => {
      if (regErr) return res.status(500).json({ error: regErr.message });
      const eventMap = new Map();
      [...createdEvents, ...registeredEvents].forEach((event) => {
        eventMap.set(event.id, event);
      });
      res.json(Array.from(eventMap.values()));
    });
  });
});

app.get("/users", authenticateToken, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Admin access required" });

  const sql = `
    SELECT u.user_id AS id, u.email, u.first_name, u.last_name,
           s.grad_year, s.major,
           CASE WHEN a.user_id IS NOT NULL THEN 1 ELSE 0 END AS isAdmin
    FROM Users u
    LEFT JOIN Student s ON u.user_id = s.user_id
    LEFT JOIN Administrator a ON u.user_id = a.user_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Users fetched:", results.length);
    res.json(results);
  });
});

app.put("/users/:id", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Admin access required" });
  const { id } = req.params;
  const { email, first_name, last_name, grad_year, major, password } = req.body;

  if (!email || !first_name || !last_name) {
    return res.status(400).json({ error: "Email, first name, and last name are required" });
  }

  db.query("SELECT user_id FROM Users WHERE user_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    let password_hash = null;
    if (password) {
      password_hash = bcrypt.hashSync(password, 10);
    }

    const updateUserSql = password
      ? "UPDATE Users SET email = ?, first_name = ?, last_name = ?, password_hash = ? WHERE user_id = ?"
      : "UPDATE Users SET email = ?, first_name = ?, last_name = ? WHERE user_id = ?";
    const params = password
      ? [email, first_name, last_name, password_hash, id]
      : [email, first_name, last_name, id];

    db.query(updateUserSql, params, (updateErr) => {
      if (updateErr) return res.status(500).json({ error: updateErr.message });

      const updateStudentSql = "UPDATE Student SET grad_year = ?, major = ? WHERE user_id = ?";
      db.query(updateStudentSql, [grad_year, major, id], (studentErr) => {
        if (studentErr) return res.status(500).json({ error: studentErr.message });
        res.json({ message: "User updated successfully" });
      });
    });
  });
});

app.post("/users", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Admin access required" });
  const { email, password, first_name, last_name, grad_year, major } = req.body;

  if (!email || !password || !first_name || !last_name || !grad_year || !major) {
    return res.status(400).json({ error: "Email, password, first name, last name, grad year, and major are required" });
  }

  db.query("SELECT user_id FROM Users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(409).json({ error: "Email already registered" });

    const password_hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO Users (email, first_name, last_name, password_hash) VALUES (?, ?, ?, ?)",
      [email, first_name, last_name, password_hash],
      (insertErr, insertResult) => {
        if (insertErr) return res.status(500).json({ error: insertErr.message });

        const userId = insertResult.insertId;
        db.query("INSERT INTO Student (user_id, grad_year, major) VALUES (?, ?, ?)", [userId, grad_year, major], (studentErr) => {
          if (studentErr) return res.status(500).json({ error: studentErr.message });
          res.json({ id: userId, email, first_name, last_name, grad_year, major });
        });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
