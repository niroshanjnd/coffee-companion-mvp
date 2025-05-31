import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();


// Get current logged-in user
router.get('/me', authenticateToken, async (req, res) => {
     console.log("🧪 Token decoded user:", req.user); // ADD THIS
  try {
    const result = await db.query(
      'SELECT id, name, email, suburb, is_verified FROM application_users WHERE id = $1',
      [req.user.userId]
    );
    console.log("✅ User fetched from DB:", result.rows[0]); // ADD THIS
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user');
  }
});

// Get users by suburb
router.get('/location/:suburb', authenticateToken, async (req, res) => {
  try {
    const suburb = req.params.suburb;
    const result = await db.query(
      'SELECT id, name, email FROM application_users WHERE suburb = $1',
      [suburb]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users by suburb');
  }
});

// Get all users (admin or for user list)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, suburb, created_at FROM application_users ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST /api/users/verify
router.post('/verify', authenticateToken, upload.single('documentFile'), async (req, res) => {
  const userId = req.user.userId;
  const documentId = req.body.documentId;
  const documentPath = req.file ? req.file.path : null;

  console.log('🪪 Verification received:', { userId, documentId, documentPath });

  // TODO: Save to DB and mark user as pending verification

  return res.status(200).json({ message: 'Verification submitted' });
});

export default router;
