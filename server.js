const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = 3000;

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
  if (err) {
    console.error("Eroare la deschiderea bazei de date:", err.message);
    process.exit(1);
  }
  console.log("Baza de date a fost deschisa.");
});

// Create tables
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL, imageUrl TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS comenzi (id INTEGER PRIMARY KEY, produs_id INTEGER, nume TEXT, email TEXT, telefon TEXT, cantitate INTEGER)"
  );

  // Add sample product if table is empty
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (row.count === 0) {
      db.run(
        "INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)",
        ["Produs 1", "Descriere produs 1", 99.99, "/images/prod1.jpg"],
        () => console.log("Produsul a fost adaugat")
      );
    }
  });
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(
  session({
    secret:
      process.env.SESSION_SECRET ||
      "o-parola-puternica-pentru-sesiune-1234567890",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res
      .status(400)
      .json({ error: "Name is required and must be a non-empty string" });
  }
  if (!price || typeof price !== "number" || price <= 0) {
    return res
      .status(400)
      .json({ error: "Price is required and must be a positive number" });
  }
  next();
};

const validateComanda = (req, res, next) => {
  const { produs_id, nume, cantitate } = req.body;
  if (!produs_id || !Number.isInteger(produs_id) || produs_id <= 0) {
    return res
      .status(400)
      .json({ error: "Produs ID is required and must be a positive integer" });
  }
  if (!nume || typeof nume !== "string" || nume.trim() === "") {
    return res
      .status(400)
      .json({ error: "Nume is required and must be a non-empty string" });
  }
  if (!cantitate || !Number.isInteger(cantitate) || cantitate <= 0) {
    return res
      .status(400)
      .json({ error: "Cantitate is required and must be a positive integer" });
  }
  next();
};

// Login page
app.get("/admin/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Login route
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "parola123";

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    req.session.user = { email };
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Logout route
app.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logout successful" });
  });
});

// Admin page
app.get("/admin", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Admin CRUD routes for products
app.get("/admin/products", requireAuth, (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/admin/products", requireAuth, validateProduct, (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  db.run(
    "INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)",
    [name, description || null, price, imageUrl || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put("/admin/products/:id", requireAuth, validateProduct, (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const { id } = req.params;
  db.run(
    "UPDATE products SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?",
    [name, description || null, price, imageUrl || null, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Product not found" });
      res.json({ message: "Product updated" });
    }
  );
});

app.delete("/admin/products/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  });
});

// Admin CRUD routes for comenzi
app.get("/admin/comenzi", requireAuth, (req, res) => {
  db.all("SELECT * FROM comenzi", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/admin/comenzi", requireAuth, validateComanda, (req, res) => {
  const { produs_id, nume, email, telefon, cantitate } = req.body;
  db.run(
    "INSERT INTO comenzi (produs_id, nume, email, telefon, cantitate) VALUES (?, ?, ?, ?, ?)",
    [produs_id, nume, email || null, telefon || null, cantitate],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put("/admin/comenzi/:id", requireAuth, validateComanda, (req, res) => {
  const { produs_id, nume, email, telefon, cantitate } = req.body;
  const { id } = req.params;
  db.run(
    "UPDATE comenzi SET produs_id = ?, nume = ?, email = ?, telefon = ?, cantitate = ? WHERE id = ?",
    [produs_id, nume, email || null, telefon || null, cantitate, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Order not found" });
      res.json({ message: "Order updated" });
    }
  );
});

app.delete("/admin/comenzi/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM comenzi WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted" });
  });
});

// Public API routes
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/comenzi", (req, res) => {
  db.all("SELECT * FROM comenzi", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/comanda", (req, res) => {
  const { produs_id, nume, email, telefon, cantitate } = req.body;
  db.run(
    "INSERT INTO comenzi (produs_id, nume, email, telefon, cantitate) VALUES (?, ?, ?, ?, ?)",
    [produs_id, nume, email || null, telefon || null, cantitate],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: this.lastID,
        produs_id,
        nume,
        email,
        telefon,
        cantitate,
      });
    }
  );
});

// Serve static files for frontend
app.use(express.static(path.join(__dirname, "client", "build")));

// Fallback for frontend routes
app.get(["/", "/products", "/order", "/contact"], (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start server
const server = app.listen(port, () => {
  console.log(`Serverul ruleaza pe http://localhost:${port}`);
  console.log(`Admin login disponibil la http://localhost:${port}/admin/login`);
});

server.on("error", (err) => {
  console.error("Eroare la pornirea serverului:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
