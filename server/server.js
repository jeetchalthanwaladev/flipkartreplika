const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const { connectDB, initializeDatabase } = require("./config/db");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FlipKart API is running",
  });
});


app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Frontend and backend connected successfully",
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(initializeDatabase)
  .catch(() => process.exit(1));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

