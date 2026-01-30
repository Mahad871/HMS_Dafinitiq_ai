import express, { Request, Response } from 'express';
import passport from '../config/passport';
import {
  register,
  registerValidation,
  login,
  loginValidation,
  googleCallback,
  getProfile,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Only enable Google OAuth routes if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback as any
  );
} else {
  // Return error if Google OAuth is not configured
  router.get('/google', (req: Request, res: Response) => {
    res.status(503).json({ 
      message: 'Google OAuth is not configured. Please use email/password authentication.' 
    });
  });
  
  router.get('/google/callback', (req: Request, res: Response) => {
    res.status(503).json({ 
      message: 'Google OAuth is not configured.' 
    });
  });
}

router.get('/profile', authenticate as any, getProfile as any);

export default router;
