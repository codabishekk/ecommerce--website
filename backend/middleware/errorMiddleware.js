// ─── 404 Not Found ───────────────────────────────────────────────────────────
const notFound = (req, res, next) => {
    const error = new Error(`Route not found – ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// ─── Global Error Handler ─────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
    // Don't log expected token errors as "SERVER_ERROR"
    if (err.name !== "TokenExpiredError" && err.name !== "JsonWebTokenError") {
        console.error("SERVER_ERROR:", err);
    }
    // Use error's own status if available, otherwise check res.statusCode, else default to 500
    let statusCode = err.statusCode || err.status || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message;

    // Mongoose: bad ObjectId format
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 404;
        message = "Resource not found – invalid ID";
    }

    // Mongoose: duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired – please log in again";
    }

    // Multer errors
    if (err.code === "LIMIT_FILE_SIZE") {
        statusCode = 400;
        message = "File too large – maximum size allowed is 25MB";
    }

    // Mongoose validation errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = { notFound, errorHandler };
