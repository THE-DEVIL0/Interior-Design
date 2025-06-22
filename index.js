import express from 'express';
import dotenv from 'dotenv';
import connectToDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/user.model.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// import userRoutes from './routes/userRoutes.js';
// app.use('/api/users', userRoutes);

// Home Route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Connect to DB and start server
const startServer = async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
startServer