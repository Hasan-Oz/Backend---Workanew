import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import passport from 'passport';

const router = Router();

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Register Error:", error); 
    res.status(500).json({ error: "Registration failed. Username or Email might already exist." });
  }
});


// 2. LOGIN (Email/Password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    // Check if user exists AND has a password
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET || "fallback-dev-secret";

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      secret, 
      { expiresIn: '1h' }
    );

    res.json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});
// 3. GOOGLE LOGIN

router.get('/google', passport.authenticate('google', { session: false }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as any;
    
    const secret = process.env.JWT_SECRET || "fallback-dev-secret";
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });

    // Send user back to Frontend
    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);


// 4. FACEBOOK LOGIN
router.get('/facebook', passport.authenticate('facebook', { session: false }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as any;
    const secret = process.env.JWT_SECRET || "fallback-dev-secret";
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '1h' });

    res.redirect(`http://localhost:5173/login-success?token=${token}`);
  }
);

export default router;