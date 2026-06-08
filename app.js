const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const pool = require('./config/db');
const axios = require('axios');
const { error } = require('node:console');

const app = express();

app.use(express.json());

async function testDB(){
    try{
        const connection = await pool.getConnection();
        console.log("MySQL connected")
        connection.release();
    }catch(err){
        console.log("MySQL not connected")
        console.log(err.message);
    }
}

testDB();

const PORT = process.env.PORT || 3000;


app.get("/",(req,res)=>{
    res.status(200).send("GitHub Profile Analyzer API is running")
})

app.get("/profiles",async (req,res)=>{
    try{
        const [rows] = await pool.query(
            "SELECT * FROM github_profiles"
        );
        res.status(200).json(rows);
    }catch(err){
        res.status(500).json({
            message:"Database error",
            error:err.message
        });
    };
});

app.get("/test/:username", async (req, res) => {
    const username = req.params.username;

    try{
        const response = await axios.get(
            `https://api.github.com/users/${username}`
        );
        res.status(200).json(response.data)
    }catch(err){
        res.status(404).json({
            message:"GitHub user not found",
            error:error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});