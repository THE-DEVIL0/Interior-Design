import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken"; // At top of file
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import User from "./models/user.model.js";
import auth from "./middleware/auth.js";
import RenovationBooking from './models/renovationBooking.model.js';
import FurnitureOrder from './models/furnitureOrder.model.js';
import FurnitureModel from './models/furniture.model.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cookieParser());

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// import userRoutes from './routes/userRoutes.js';
// app.use('/api/users', userRoutes);

// Home Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Register Route
app.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// Login Route
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// POST /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("LOGIN BODY:", req.body);

  if (!email || !password) {
    return res
      .status(400)
      .render("login", { error: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found with email:", email);
      return res
        .status(400)
        .render("login", { error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch");
      return res
        .status(400)
        .render("login", { error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Login successful for:", user.email);
    res.redirect("/services");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword, phone, address } = req.body;

  // Validate all fields
  if (!name || !email || !password || !confirmPassword || !phone || !address) {
    return res
      .status(400)
      .render("register", { error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .render("register", { error: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .render("register", { error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    await newUser.save();

    res.redirect("/login");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


import Furniture from './models/furniture.model.js';



app.get('/services', auth, async (req, res) => {
  const tab = req.query.tab || 'services';

  let bookings = [];
  let orders = [];

  if (tab === 'bookings') {
    bookings = await RenovationBooking.find({ user: req.user.id }).sort({ createdAt: -1 });
    orders = await FurnitureOrder.find({ user: req.user.id })
      .populate('furniture') // populate furniture details
      .sort({ createdAt: -1 });
  }

  res.render('services', { tab, bookings, orders });
});




app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.get("/book-renovation", (req, res) => {
  res.render("bookRenovation");
});



app.get('/buy-furniture', auth, async (req, res) => {
  try {
    const furnitureList = await FurnitureModel.find({});
    res.render('buyFurniture', { furnitureList });
  } catch (err) {
    console.error(err);
    res.send("Error loading furniture items.");
  }
});

app.post('/buy-furniture/:id', auth, async (req, res) => {
  const furnitureId = req.params.id;
  const quantity = parseInt(req.body.quantity, 10) || 1;

  try {
    const item = await Furniture.findById(furnitureId);
    if (!item) return res.status(404).send('Furniture item not found.');

    await FurnitureOrder.create({
      user: req.user.id,
      furniture: item._id,
      quantity
    });

    res.redirect('/services?tab=bookings');
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).send('Something went wrong while placing the order.');
  }
});


app.get('/book-renovation/:title', auth, async (req, res) => {
  const { title } = req.params;

  try {
    const user = await User.findById(req.user.id);
    res.render('renovationForm', {
      title,
      error: null,
      address: user.address || '', // send the user's address if available
    });
  } catch (err) {
    console.error(err);
    res.redirect('/services');
  }
});

app.post('/book-renovation/:title', auth, async (req, res) => {
  const { title } = req.params;
  const { preferredDate, address, notes } = req.body;

  if (!preferredDate || !address) {
    return res.render('renovationForm', {
      title,
      error: 'Preferred date and address are required',
    });
  }

  const scheduledDate = new Date(preferredDate);
  scheduledDate.setDate(scheduledDate.getDate() + 1);

  try {
    await RenovationBooking.create({
      user: req.user.id,
      serviceType: title,
      preferredDate: new Date(preferredDate),
      scheduledDate,
      address,
      notes,
    });

    res.redirect('/services?tab=bookings');
  } catch (err) {
    console.error(err);
    res.render('renovationForm', {
      title,
      error: 'An error occurred while booking. Please try again.',
    });
  }
});

app.get("/my-Bookings", auth, (req, res) => {
  res.render("myBookings"); // Or however you're showing services
});



// Start server after DB connection
const startServer = async () => {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
