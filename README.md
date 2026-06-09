# GitHub Profile Analyzer API

A backend REST API built with Node.js and Express.js that fetches public GitHub user profile data, analyzes key insights, and stores them in a MySQL database for later retrieval.

## Live API
https://github-profile-analyzer-api-9622.up.railway.app

---

## Tech Stack
- **Node.js** — Runtime
- **Express.js** — Web framework
- **MySQL** — Database (via mysql2)
- **Axios** — HTTP requests to GitHub API
- **dotenv** — Environment variable management
- **GitHub REST API** — Third-party API for fetching profile data

---

## Features
- Fetch public profile data from GitHub using username
- Analyze and store useful insights:
  - Public repository count
  - Followers & following count
  - Location & bio
  - Avatar URL
  - Top programming language (analyzed from all public repos)
- UPSERT logic — re-analyzing a profile updates existing data
- REST API to fetch all stored profiles
- REST API to fetch a single profile by username
- GitHub token support for higher rate limits (5000 req/hr vs 60)

---

## Folder Structure
```
github-profile-analyzer-api/
├── config/
│   └── db.js
├── controllers/
│   └── profileController.js
├── routes/
│   └── profileRoutes.js
├── .env
├── app.js
├── package.json
|── github-analyzer.postman_collection.json
└── README.md
```

---

## Environment Variables
Create a `.env` file in the root directory:
```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=your_mysql_port
PORT=3000
GITHUB_TOKEN=your_github_personal_access_token
```

---

## Database Schema
```sql
CREATE TABLE github_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    public_repos INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    location VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    top_language VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Health Check
```
GET /
```
Response:
```json
{ "message": "Server is running" }
```

### Analyze GitHub Profile
```
POST /analyze/:username
```
Example: `POST /analyze/AmaanShikalgar`

Response:
```json
{
    "message": "Analysis stored successfully",
    "profile": {
        "username": "AmaanShikalgar",
        "name": "Amaan Shikalgar",
        "bio": "N/A",
        "avatar_url": "https://avatars.githubusercontent.com/u/112558635?v=4",
        "location": "Pune",
        "public_repos": 33,
        "followers": 9,
        "following": 5,
        "top_language": "JavaScript"
    }
}
```

### Get All Stored Profiles
```
GET /profiles
```

### Get Single Profile
```
GET /profiles/:username
```
Example: `GET /profiles/torvalds`

---

## 🏃 Run Locally

1. Clone the repository
```bash
git clone https://github.com/AmaanShikalgar/github-profile-analyzer-api.git

cd github-profile-analyzer-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Fill in your DB credentials and GitHub token
```

4. Create the database table — run the SQL from the schema section above in your MySQL client

5. Start the server
```bash
npm start
```
Server runs on `http://localhost:3000`

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| express | Web framework |
| mysql2 | MySQL database driver |
| axios | HTTP requests to GitHub API |
| dotenv | Environment variable management |
| cors | Cross-origin request handling |

---

## 🔗 Submission
- **GitHub Repository:** https://github.com/AmaanShikalgar/github-profile-analyzer-api
- **Live API URL:** https://github-profile-analyzer-api-9622.up.railway.app
- **Postman Collection:** Included in repository as `github-analyzer.postman_collection.json`