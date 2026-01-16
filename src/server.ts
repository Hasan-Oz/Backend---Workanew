import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import './config/passport';

import authRoutes from './routes/auth';
import workshopRoutes from './routes/workshops';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopRoutes);

app.get('/', (req, res) => {
  res.send('API is running! 🚀 Go to /api/workshops to see data.');
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});