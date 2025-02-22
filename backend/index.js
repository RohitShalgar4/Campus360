import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import dotenv from "dotenv";
import studentRoute from "./routes/studentRoute.js";
import adminRoute from "./routes/adminRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import loginRoute from "./routes/loginRoute.js";
import facilityRoute from "./routes/facilityRoute.js";
import bookingRoute from "./routes/bookingRoute.js";

dotenv.config({});
connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5173'];

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

app.use("/api/v1/student", studentRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/doctor", doctorRoute);
app.use("/api/v1/auth", loginRoute);
app.use("/api/v1/facilities", facilityRoute);
app.use("/api/v1/bookings", bookingRoute);

app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
});
