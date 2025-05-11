const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const app = express();


const PORT = 3000;



// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mysql7",
    database: "RestaurantDB"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
        return;
    }
    console.log("Connected to MySQL Database.");
});

app.post("/api/signup", async (req, res) => {
    const { username, fname, lname, password } = req.body;

    if (!username || !fname || !lname || !password) {
        return res.status(400).send("All fields are required.");
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = "INSERT INTO signup (username, fname, lname, password) VALUES (?, ?, ?, ?)";
        const values = [username, fname, lname, hashedPassword];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database insert error:", err);
                return res.status(500).send("Failed to store user.");
            }

            console.log("User data inserted with ID:", result.insertId);
            res.status(200).send("User successfully registered and stored in database!");
        });
    } catch (err) {
        console.error("Hashing error:", err);
        res.status(500).send("Internal server error.");
    }
});

const jwt = require("jsonwebtoken");
const SECRET_KEY = "Admin123";

app.post('/api/Login', async (req, res) => {
  const { username, password } = req.body;

  // 1. Special case: hardcoded admin
  if (username === 'admin' && password === 'Admin123') {
    const token = jwt.sign({ username, role: 'admin' }, SECRET_KEY, { expiresIn: "1h" });
    return res.json({ message: "Admin login successful", token, role: 'admin' });
  }

  // 2. Normal user login from DB
  const query = 'SELECT * FROM signup WHERE Username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal server error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    const user = results[0];
    const hashFromDB = user.Password;

    if (!hashFromDB) {
      return res.status(500).send("Password hash not found in database.");
    }

    const isMatch = await bcrypt.compare(password, hashFromDB);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }

    const role = user.Role || 'user';
    const token = jwt.sign({ username, role }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role });
  });
});



app.post("/api/customer", (req, res) => {
    const { passport_id, name, email, contact } = req.body;

    if (!passport_id || !name || !email || !contact) {
        return res.status(400).send("All fields are required.");
    }

    const sql = "INSERT INTO customer (passport_id, name, email, Contact_No) VALUES (?, ?, ?, ?)";
    db.query(sql, [passport_id, name, email, contact], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err.message);
            res.status(500).send("Database insertion error");
        } else {
            res.status(200).send("Customer data inserted successfully");
        }
    });
});


app.post("/api/discounts",authenticateAdmin, (req, res) => {
    const { discountId, discountPercentage, description } = req.body;

    if (!discountId || !discountPercentage || !description) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const sql = "INSERT INTO discounts (Discount_id, Discount_Percentage, Description) VALUES (?, ?, ?)";
    db.query(sql, [discountId, discountPercentage, description], (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ message: "Discount ID already exists." });
            }
            console.error("Insert failed:", err);
            return res.status(500).json({ message: "Database error." });
        }
        res.status(201).json({ message: "Discount added to database." });
    });
});

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err || user.role !== "admin") return res.sendStatus(403);
    req.user = user;
    next();
  });
}


app.post("/api/menu", authenticateAdmin, (req, res) => {
  const { menuId, category } = req.body;

  if (!menuId || !category) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql = "INSERT INTO menu (Menu_id, Category) VALUES (?, ?)";
  db.query(sql, [menuId, category], (err, result) => {
    if (err) {
      console.error("Error inserting into menu:", err);
      return res.status(500).json({ message: "Database insert failed." });
    }

    res.json({ message: "Menu item added successfully!" });
  });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});