# Codely 🚀

A real-time remote interview platform that bridges the gap between candidates and recruiters with live coding, video calls, and automated feedback.

<!-- Add your project banner/hero image here -->
![Codely Banner](D:/academics/coding/web dev/backend dev/projects/Codely/Frontend/public/Image_for_README.md.png)

## 🌐 Live Demo

Experience Codely: [https://codely-app.vercel.app](https://codely-app.vercel.app)

## 📸 Screenshots

### Dashboard
![Dashboard](./assets/dashboard.png)

### Live Interview Session
![Interview Session](./assets/interview-session.png)

### Code Editor
![Code Editor](./assets/code-editor.png)

### Video Call Interface
![Video Call](./assets/video-call.png)

## ✨ Features

- **💻 VSCode-Powered Editor**: Familiar, high-performance coding environment for seamless interview experience
- **🔒 Secure Code Execution**: Isolated logic execution in a secure environment to prevent vulnerabilities
- **🎥 1-on-1 Video & Chat**: Fully integrated video calls with screen sharing and recording capabilities
- **🧠 Automated Feedback**: Instant success/fail notifications based on test case results
- **⚙️ Advanced Workflow**: Room locking for privacy and background job processing
- **📊 Live Stats Dashboard**: Real-time data fetching and caching for performance insights

## 🛠️ Tech Stack

### Frontend
- **React** with Vite for blazing-fast development
- **TanStack Query** for efficient data fetching and caching
- **Clerk** for authentication
- **Stream** for real-time video and chat

### Backend
- **Node.js** with Express
- **MongoDB** for database
- **Inngest** for async task and background job management
- **Stream** for video/chat infrastructure

### Deployment
- **Frontend**: Vercel
- **Backend**: Render & Sevalla (free-tier friendly)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB instance
- Clerk account
- Stream account
- Inngest account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codely.git
cd codely
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=3000
DB_URL=your_mongodb_connection_string

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000
VITE_STREAM_API_KEY=your_stream_api_key
```

Start the frontend development server:

```bash
npm run dev
```

The application should now be running at `http://localhost:5173`

## 🔑 Environment Variables

### Backend Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `DB_URL` | MongoDB connection string |
| `INNGEST_EVENT_KEY` | Inngest event key for background jobs |
| `INNGEST_SIGNING_KEY` | Inngest signing key for security |
| `STREAM_API_KEY` | Stream API key for video/chat |
| `STREAM_SECRET_KEY` | Stream secret key |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key for auth |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend Variables

| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_API_URL` | Backend API URL |
| `VITE_STREAM_API_KEY` | Stream API key |

## 📦 Project Structure

```
codely/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── utils/
    ├── .env
    └── package.json
```

## 🎯 Key Technical Highlights

- **Real-time Collaboration**: Powered by Stream for seamless video and chat integration
- **Background Job Processing**: Inngest handles async tasks like test case execution and notifications
- **Secure Authentication**: Clerk manages user sessions in development mode
- **Optimized Performance**: TanStack Query for intelligent caching and data synchronization
- **Isolated Code Execution**: Secure sandbox environment for running candidate code

## 🚧 Production Notes

This portfolio version runs in **Clerk's Development Environment** to remain accessible without requiring a custom domain. For production deployment with custom domains, you'll need to upgrade to Clerk's production instance.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built with ❤️ as a #BuildInPublic project

## 🙏 Acknowledgments

- Stream for real-time communication infrastructure
- Clerk for seamless authentication
- Inngest for reliable background job processing
- The open-source community for incredible tools and support

---

⭐ Star this repo if you find it helpful!