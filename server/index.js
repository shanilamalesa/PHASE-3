const express = require("express");
const cors = require("cors");
const env = require("./config/env");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/payments", require("./routes/payments.routes"));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});