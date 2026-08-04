const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ─── Route Imports ────────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── App Init ─────────────────────────────────────────────────────────────────
const app = express();

// ─── Trust Render's reverse proxy (required for rate-limit & IP detection) ────
app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://sholash-life-science-1.onrender.com',
    'https://sholash-life-science.onrender.com',
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    noSniff: false, // Don't set X-Content-Type-Options to prevent MIME type sniffing
}));

// Global rate limiter: 200 requests per 15 minutes per real IP
// trust proxy (set above) ensures req.ip is the real client IP on Render
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, please try again later." },
});
app.use(limiter);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── MIME Types Configuration ─────────────────────────────────────────────────
const express_static_options = {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        }
    }
};

// ─── Custom MIME Type Middleware ──────────────────────────────────────────────
app.use('/assets', (req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (req.path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    }
    next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ success: true, message: "Sholash Life Science API is running 🚀" });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/admin", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/upload", uploadRoutes);

// ─── Serve Frontend ───────────────────────────────────────────────────────────
const frontendPath = path.join(__dirname, "../FrontEnd/dist");
const { spawn } = require('child_process');

console.log(`Frontend path: ${frontendPath}`);
console.log(`Frontend directory exists: ${require('fs').existsSync(frontendPath)}`);

// Check if frontend is built, if not, build it
if (!require('fs').existsSync(frontendPath) || !require('fs').existsSync(path.join(frontendPath, 'assets'))) {
    console.log('Frontend not built, building now...');
    try {
        // Use spawn instead of execSync for better control
        const buildProcess = spawn('npm', ['run', 'build'], {
            cwd: path.join(__dirname, '../FrontEnd'),
            stdio: 'inherit',
            shell: true
        });

        buildProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Frontend build completed successfully');
            } else {
                console.error(`Frontend build failed with code ${code}`);
            }
        });

        buildProcess.on('error', (error) => {
            console.error('Frontend build error:', error.message);
        });

        // Wait for build to complete (simple approach)
        setTimeout(() => {
            console.log('Build process initiated, continuing with server startup...');
        }, 1000);

    } catch (error) {
        console.error('Frontend build failed:', error.message);
    }
}

if (require('fs').existsSync(frontendPath)) {
    const assetsPath = path.join(frontendPath, 'assets');
    console.log(`Assets directory exists: ${require('fs').existsSync(assetsPath)}`);
    if (require('fs').existsSync(assetsPath)) {
        const files = require('fs').readdirSync(assetsPath);
        console.log(`Assets files: ${files.join(', ')}`);
    }
}

// Support both root and admin-prefixed static paths used by Render access patterns
app.use('/admin/dist', express.static(frontendPath, express_static_options));
app.use('/admin', express.static(frontendPath, express_static_options));
app.use(express.static(frontendPath, express_static_options));

// Catch-all to serve index.html for any frontend routes (SPA)
app.get(/.*/, (req, res, next) => {
    // Skip API calls and static asset requests
    if (req.url.startsWith('/api') || req.url.match(/\.(js|css|png|jpg|jpeg|svg|ico|webp|woff|woff2|ttf|eot|map)$/)) {
        return next();
    }
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅  Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
