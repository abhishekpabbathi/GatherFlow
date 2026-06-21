const express  = require("express");
const cors     = require("cors");
const dotenv   = require("dotenv");
dotenv.config();

const connectDB    = require("./config/db");
const userRoutes   = require("./routes/userRoutes");
const adminRoutes  = require("./routes/adminRoutes");   // ← NEW
const limiter      = require("./middleware/rateLimit");

const app = express();
connectDB();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(limiter);

app.get("/", (req, res) => res.send("🚀 GatherFlow API Running..."));
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);   // ← NEW

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
