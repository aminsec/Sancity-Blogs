<h1 align="center">
Sancity Blogs
  <br>
</h1>

<p align="center">
  <a href="#Features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#installation--setup">Installation & Setup</a> •
  <a href="#contribution">Contribution</a> •
  <a href="#license">License</a>
</p>

---
## Sancity Blogs
Sancity Blog is a modern, microservices-based blogging platform with AI-powered features. Built with Node.js and React, it offers real-time chat, AI-generated summaries, and secure private blog sharing using magic links.

## Features

- **User Authentication**: Secure account creation and login with JWT.
- **Blog Management**: Write, publish, and manage blogs.
- **Chat System**: Real-time chat with WebSocket.
- **Public & Private Blogs**: Control access to your content.
- **Magic Link Sharing**: Share private blogs via temporary magic links (valid for 5 minutes).
- **Notifications**: Stay updated on interactions with your blogs.
- **Like & Save Blogs**: Engage with and store blogs of interest.
- **Comments & Likes**: Comment on blogs and like others' comments.
- **Search**: Find blogs on any topic.
- **AI-Powered Summarization**: Summarize blogs for quick reading (limited to 5 times per day).
- **AI-Generated Blogs**: Auto-generated blogs published every 30 minutes.

## Tech Stack

| Technology  | Purpose  |
|------------|---------|
| **Node.js**  | Backend development |
| **Express.js** | Web framework for backend |
| **React.js**  | Frontend development |
| **MySQL**  | Primary database |
| **Sequelize** | ORM for database connections |
| **WebSockets** | Real-time chat communication |
| **JWT**  | Authentication system |
| **REST API** | API communication between frontend & backend |
| **Docker & Docker Compose** | Containerized deployment |
| **Nginx**  | Reverse proxy |
| **Apache**  | Static file hosting |
| **AI Integration** | Blog summarization and auto-generation |

## Project Structure

```
Sancity-Blogs/
├── node-api/  # Node.js microservices
├── reverse-proxy-nginx/  # Nginx reverse proxy configuration
├── static/  # Apache static file hosting
├── webapp/  # React app
├── compose.yml  # Docker setup
└── README.md  # Project documentation
```

## Installation & Setup

### Prerequisites
- Docker & Docker Compose installed
- Port 8081 must be free

### Setup Guide
#### 1. Update Hosts File
##### macOS / Linux:
```sh
echo "127.0.0.1 sancity.blog" | sudo tee -a /etc/hosts
echo "127.0.0.1 ws.sancity.blog" | sudo tee -a /etc/hosts
```
##### Windows:
1. Open Notepad as Administrator.
2. Open the file: `C:\Windows\System32\drivers\etc\hosts`
3. Add the following lines at the end:
```
127.0.0.1 sancity.blog
127.0.0.1 ws.sancity.blog
```
4. Save and close.

#### 2. Clone the Repository
```sh
git clone git@github.com:aminsec/Sancity-Blogs.git
cd Sancity-Blogs/
```

#### 3. Start the Application with Docker
```sh
docker-compose up -d
```

#### 4. Access the Application
- [http://sancity.blog](http://sancity.blog)

## Contribution
Contributions are welcome! Feel free to submit issues and pull requests.

## License
MIT License © 2025 Mohammand Amin Choopani (aminsec)
