// middleware/auth.js
import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user ID to request
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/login');
  }
}
