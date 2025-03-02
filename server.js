const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize"); // Security against NoSQL injection
const helmet = require("helmet"); // Security headers
const xss = require("xss-clean"); // Prevent XSS attacks
const bodyParser = require("body-parser");
const cors = require("cors");

// Load environment variables early
dotenv.config({ path: "./config/config.env" });

//connection done

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security middleware
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Import routes (moved here to prevent undefined reference)
const auth = require("./routes/user");
const newsRoutes = require("./routes/news");

// Debugging logs (now placed correctly after importing)
console.log("Auth module:", auth);

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/news", newsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`.red);
  server.close(() => process.exit(1));
});
