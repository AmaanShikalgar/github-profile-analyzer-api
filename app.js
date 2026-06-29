require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const profileRoutes = require("./routes/profileRoutes");

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

async function testDB() {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL connected");
        connection.release();
    } catch (err) {
        console.error("MySQL not connected",err);
    }
}

testDB();

app.use("/", profileRoutes);


app.get("/", (req, res) => {
    res.send("GitHub Profile Analyzer API is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});