// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// CORS configuration for Express 4.x
const corsOptions = {
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost:3000",
    "http://localhost:5001",
    "http://127.0.0.1:5001",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Serve static files from root directory (for HTML, CSS, JS files)
app.use(express.static("."));

// Serve static files from client directory
app.use("/client", express.static("client"));

/** ---------- MongoDB ---------- */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

/** ---------- Schemas ---------- */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  github: { type: String },
  demo: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  files: [
    {
      originalName: String,
      filename: String,
      path: String,
      size: Number,
      mimetype: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  projectFolder: { type: String }, // Main project folder path
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Project = mongoose.model("Project", projectSchema);

/** ---------- Auth middleware ---------- */
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, username: decoded.username };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Configure multer for multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectId = req.body.projectId || Date.now();
    const projectDir = `uploads/${projectId}`;

    // Create project directory if it doesn't exist
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }

    cb(null, projectDir);
  },
  filename: (req, file, cb) => {
    // Keep original filename
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 20, // Max 20 files
  },
  fileFilter: (req, file, cb) => {
    // Allow common web development files and document types
    const allowedTypes = [
      "text/html",
      "text/css",
      "text/javascript",
      "application/javascript",
      "text/plain",
      "application/json",
      "text/markdown",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "image/webp",
      "application/zip",
      "application/x-zip-compressed",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
    ];

    // Also check by file extension for broader compatibility
    const allowedExtensions =
      /\.(html|css|js|json|md|txt|jpg|jpeg|png|gif|svg|zip|pdf|pptx|ppt|docx|doc|xlsx|xls|webp)$/i;

    if (
      allowedTypes.includes(file.mimetype) ||
      allowedExtensions.test(file.originalname)
    ) {
      cb(null, true);
    } else {
      console.log(
        `Rejected file: ${file.originalname} with MIME type: ${file.mimetype}`
      );
      cb(new Error(`File type not allowed: ${file.originalname}`), false);
    }
  },
});

// Middleware for creating uploads directory if not exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 50MB." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ message: "Too many files. Maximum is 20 files." });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({ message: "Unexpected field name for file upload." });
    }
  }
  if (err.message.includes("File type not allowed")) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

/** ---------- Routes ---------- */
app.get("/", (_req, res) => res.send("API running"));

app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    // Use username as email if email not provided
    const userEmail = email || `${username}@codeconnect.local`;

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email: userEmail, password: hashed });
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
    res.status(400).json({ message: err.message || "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Login failed" });
  }
});

app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const { title, description, technologies, github, demo } = req.body || {};
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description are required" });
    }
    const project = await Project.create({
      title,
      description,
      technologies: technologies || [],
      github,
      demo,
      owner: req.user.id,
    });

    // Populate owner info before returning
    await project.populate("owner", "username");
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message || "Create project failed" });
  }
});

app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "username")
      .populate("collaborators", "username")
      .sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        message: err.message || "Fetch projects failed",
      });
  }
});

// Get user's projects
app.get("/api/projects/my", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .populate("owner", "username")
      .populate("collaborators", "username")
      .sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        message: err.message || "Fetch user projects failed",
      });
  }
});

// Like/Unlike project
app.post("/api/projects/:id/like", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userIndex = project.likes.indexOf(req.user.id);
    if (userIndex > -1) {
      // Unlike
      project.likes.splice(userIndex, 1);
    } else {
      // Like
      project.likes.push(req.user.id);
    }

    await project.save();
    res.json({ likes: project.likes.length, liked: userIndex === -1 });
  } catch (err) {
    res.status(400).json({ message: err.message || "Like/unlike failed" });
  }
});

// Add collaborator to project
app.post("/api/projects/:id/collaborate", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.collaborators.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a collaborator" });
    }

    project.collaborators.push(req.user.id);
    await project.save();

    await project.populate("collaborators", "username");
    res.json({
      message: "Added as collaborator",
      collaborators: project.collaborators,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message || "Collaboration request failed" });
  }
});

// Upload multiple project files
app.post(
  "/api/projects/upload",
  authMiddleware,
  (req, res, next) => {
    upload.array("files", 20)(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const { title, description, technologies, github, demo } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          message: "Title and description are required",
        });
      }

      // Create project folder name
      const projectFolder = `project_${Date.now()}_${req.user.id}`;

      // Process uploaded files (if any)
      const files = req.files
        ? req.files.map((file) => ({
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
          }))
        : [];

      const project = await Project.create({
        title,
        description,
        technologies: technologies ? JSON.parse(technologies) : [],
        github,
        demo,
        owner: req.user.id,
        files,
        projectFolder,
      });

      await project.populate("owner", "username");
      res.status(201).json({ success: true, project });
    } catch (err) {
      console.error("Project creation error:", err);
      res
        .status(400)
        .json({
          success: false,
          message: err.message || "Project creation failed",
        });
    }
  }
);

// Download project file
app.get(
  "/api/projects/:projectId/files/:filename",
  authMiddleware,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const file = project.files.find(
        (f) => f.filename === req.params.filename
      );
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      res.download(file.path, file.originalName);
    } catch (err) {
      res.status(400).json({ message: err.message || "Download failed" });
    }
  }
);

// Get project file content (for preview)
app.get(
  "/api/projects/:projectId/files/:filename/content",
  authMiddleware,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      const file = project.files.find(
        (f) => f.filename === req.params.filename
      );
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Only allow text files for preview
      const textTypes = [
        "text/html",
        "text/css",
        "text/javascript",
        "application/javascript",
        "text/plain",
        "application/json",
      ];
      if (
        textTypes.includes(file.mimetype) ||
        file.originalName.match(/\.(html|css|js|json|md|txt)$/i)
      ) {
        const content = fs.readFileSync(file.path, "utf8");
        res.json({
          content,
          filename: file.originalName,
          mimetype: file.mimetype,
        });
      } else {
        res
          .status(400)
          .json({ message: "File type not supported for preview" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message || "Preview failed" });
    }
  }
);

// Add comments to projects
app.post("/api/projects/:id/comment", authMiddleware, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.comments) project.comments = [];
    project.comments.push({
      user: req.user.id,
      comment,
      createdAt: new Date(),
    });
    await project.save();

    await project.populate("comments.user", "username");
    res.json({ message: "Comment added", comments: project.comments });
  } catch (err) {
    res.status(400).json({ message: err.message || "Add comment failed" });
  }
});

// Delete project
app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user owns the project
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this project" });
    }

    // Delete the project files from uploads directory
    if (project.files && project.files.length > 0) {
      const fs = require("fs");
      const path = require("path");

      project.files.forEach((file) => {
        const filePath = path.join(__dirname, "uploads", file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res
      .status(400)
      .json({
        success: false,
        message: err.message || "Delete project failed",
      });
  }
});

/** ---------- Start ---------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
