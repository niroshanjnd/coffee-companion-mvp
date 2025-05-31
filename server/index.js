import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.js';
import verificationRoutes from './routes/verification.js'; // ✅ New route

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.resolve('server/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir)); // serve uploaded files

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/verification', verificationRoutes); // ✅ Register the route

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
