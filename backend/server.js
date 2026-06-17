import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expense-tracker')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
