import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import studentRoute from "./routes/studentRoute.js";
import adminRoute from "./routes/adminRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import loginRoute from "./routes/loginRoute.js";
import complaintRoute from "./routes/complaintsRoute.js";
import facilityRoute from "./routes/facilityRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import { electionRouter } from './routes/electionRoutes.js';
import studentViolationRoute from "./routes/studentViolationRoutes.js";

dotenv.config({});
connectDB(); // Connect to the database

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// CORS Configuration
const allowedOrigins = ['http://localhost:5173']; // Combined allowed origins

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error('Not allowed by CORS')); // Block the request
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow cookies and auth headers
  })
);

// Routes
app.use("/api/v1/student", studentRoute);     // Student routes
app.use("/api/v1/admin", adminRoute);         // Admin routes
app.use("/api/v1/doctor", doctorRoute);    // Doctor routes
app.use("/api/v1/auth", loginRoute);          // Authentication routes
app.use("/api/complaints", complaintRoute);   // Complaints routes
app.use("/api/v1/facilities", facilityRoute); // Facility routes
app.use("/api/v1/bookings", bookingRoute);    // Booking routes
app.use("/api/v1/elections", electionRouter); // Election routes
app.use("/api/v1/students", studentViolationRoute);
// app.use("/api/v1/doctor/
// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Hostel Management System API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});