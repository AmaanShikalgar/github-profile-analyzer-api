const axios = require("axios");
const pool = require("../config/db");

const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "github-profile-analyzer"
};

exports.getAllProfiles = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM github_profiles");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    const username = req.params.username;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM github_profiles WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
    }
};

exports.analyzeProfile = async (req, res) => {
    const username = req.params.username;

    try {
        const { data } = await axios.get(
            `https://api.github.com/users/${username}`, { headers })

        const reposResponse = await axios.get(
            `https://api.github.com/users/${username}/repos`, { headers })

        const repos = reposResponse.data;

        const languageCount = {};

        repos.forEach(repo => {
            if (repo.language) {
                languageCount[repo.language] =
                    (languageCount[repo.language] || 0) + 1;
            }
        });

        let topLanguage = null;
        let maxCount = 0;

        for (let lang in languageCount) {
            if (languageCount[lang] > maxCount) {
                maxCount = languageCount[lang];
                topLanguage = lang;
            }
        }

        const profile = {
            username: data.login,
            name: data.name || "N/A",
            bio: data.bio || "N/A",
            avatar_url: data.avatar_url || "",
            location: data.location || "N/A",
            public_repos: data.public_repos || 0,
            followers: data.followers || 0,
            following: data.following || 0,
            top_language:topLanguage || "Not available"
        };

        const sql = `
            INSERT INTO github_profiles 
            (username, name, bio, avatar_url, location, public_repos, followers, following,top_language)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                bio = VALUES(bio),
                avatar_url = VALUES(avatar_url),
                location = VALUES(location),
                public_repos = VALUES(public_repos),
                followers = VALUES(followers),
                following = VALUES(following),
                top_language = VALUES(top_language)
        `;

        await pool.query(sql, [
            profile.username,
            profile.name,
            profile.bio,
            profile.avatar_url,
            profile.location,
            profile.public_repos,
            profile.followers,
            profile.following,
            profile.top_language
        ]);

        res.json({
            message: "Analysis stored successfully",
            profile
        });

    } catch (err) {
        res.status(404).json({
            message: "GitHub user not found",
            error: err.message
        });
    }
};

exports.deleteProfile = async (req, res) => {
    const username = req.params.username;

    try {
        const [result] = await pool.query(
            "DELETE FROM github_profiles WHERE username = ?",
            [username]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ message: `Profile @${username} deleted successfully` });
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
    }
};