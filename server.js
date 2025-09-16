require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// App init
const app = express();

// ✅ CORS Middleware (sabse upar rakho)
app.use(cors({
  origin: "https://evanta.netlify.app",   // sirf aapka frontend domain allow hoga
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Preflight request handle karo (important for POST/PUT)
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads folder for images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import Routes
const userRoutes = require("./routes/userRoutes");
const remarkRoutes = require("./routes/remarkRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bannerRoutes = require("./routes/bannerRoutes");

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/remarks", remarkRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/banners", bannerRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});

// Connect to MongoDB
const connectDB = require("./config/db");

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stop server if DB connection fails
  });
