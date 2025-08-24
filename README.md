# CodeConnect - Developer Collaboration Platform

A full-stack collaborative platform where developers can share projects, connect, and collaborate. Built with modern web technologies including Node.js, Express.js, MongoDB, React.js, and TailwindCSS.

## 🚀 Features

### Core Features

- **User Authentication** - Secure registration and login system with JWT tokens
- **Project Management** - Create, view, and manage development projects
- **Interactive Dashboard** - Real-time overview of projects and collaborations
- **Responsive Design** - Seamless experience across all devices using TailwindCSS

### Project Features

- **Project Sharing** - Share your projects with the developer community
- **Technology Tags** - Categorize projects by technologies used
- **GitHub Integration** - Link projects to GitHub repositories
- **Live Demo Links** - Showcase working demos of your projects
- **Collaboration System** - Connect with other developers and collaborate
- **Like System** - Appreciate and bookmark interesting projects

### User Interface

- **Modern Design** - Clean, professional interface with TailwindCSS
- **Intuitive Navigation** - Easy-to-use navigation between different sections
- **Interactive Components** - Smooth transitions and hover effects
- **Mobile Responsive** - Optimized for all screen sizes

## 🛠️ Tech Stack

### Frontend

- **React.js** - Component-based UI library
- **TailwindCSS** - Utility-first CSS framework
- **JavaScript ES6+** - Modern JavaScript features
- **Babel** - JavaScript transpiler for browser compatibility

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling library
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing library
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd codeconnect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   MONGO_URI=mongodb://localhost:27017/codeconnect
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5001
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Run the application**

   ```bash
   npm start
   # or
   node server.js
   ```

6. **Access the application**
   Open your browser and navigate to `http://127.0.0.1:5500/index.html`

## 📁 Project Structure

```
codeconnect/
├── server.js          # Main server file with Express routes
├── index.html          # Frontend React application
├── package.json        # Node.js dependencies and scripts
├── .env               # Environment variables
└── README.md          # Project documentation
```

## 🌟 API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login existing user

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/my` - Get user's projects
- `POST /api/projects/:id/like` - Like/unlike a project
- `POST /api/projects/:id/collaborate` - Join as collaborator

## 🎯 Usage

### Getting Started

1. **Register** - Create a new account with username, email, and password
2. **Login** - Access your account with email and password
3. **Dashboard** - View your projects and platform statistics
4. **Create Projects** - Share your development projects with the community
5. **Explore** - Discover projects from other developers
6. **Collaborate** - Connect with developers and join interesting projects

### Creating a Project

1. Navigate to "Create Project" section
2. Fill in project details:
   - **Title** - Name of your project
   - **Description** - Detailed description of what your project does
   - **Technologies** - Comma-separated list of technologies used
   - **GitHub URL** - Link to your repository (optional)
   - **Demo URL** - Link to live demo (optional)
3. Submit to share with the community

## 🔧 Development

### Adding New Features

The application is built with a modular structure making it easy to add new features:

1. **Backend Routes** - Add new API endpoints in `server.js`
2. **Frontend Components** - Create new React components in `index.html`
3. **Database Models** - Extend MongoDB schemas as needed

### Customization

- **Styling** - Modify TailwindCSS classes for custom design
- **Functionality** - Add new features like messaging, teams, or advanced search
- **Database** - Extend schemas for additional data requirements

## 🚀 Deployment

### Local Development

The application runs on:

- **Backend**: `http://localhost:5001`
- **Frontend**: `http://127.0.0.1:5500`

### Production Deployment

1. Set up production MongoDB instance
2. Configure environment variables for production
3. Deploy backend to platforms like Heroku, Vercel, or AWS
4. Deploy frontend to static hosting services
5. Update CORS settings for production domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ by [Subhojit Ghosh]

## 🙏 Acknowledgments

- React.js community for the amazing library
- TailwindCSS for the excellent utility-first CSS framework
- MongoDB for the flexible NoSQL database
- Express.js for the robust web framework

---

**CodeConnect** - Where developers connect, collaborate, and create amazing projects together! 🚀
