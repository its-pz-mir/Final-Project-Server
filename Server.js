const express = require("express");
const authRouter = require("./routes/AuthRoute");
const dbConnect = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express();

const corsOptions = {
    origin: "http://localhost:5173", // Correct origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials: true, // Required for cookies
};

// Use CORS middleware
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser())
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Usman is great",
    })
})

app.use("/api/user", authRouter)

const port = process.env.PORT || 5000;
dbConnect().then(() => {
    app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
})