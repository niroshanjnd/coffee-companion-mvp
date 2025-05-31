// server/routes/verification.js
import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../db.js';

const router = express.Router();
const upload = multer({ dest: 'server/uploads/' });

router.post('/upload', authenticateToken, upload.single('document'), async (req, res) => {
  const userId = req.user.userId;
  const filePath = req.file.path;

  try {
    await pool.query(
      'INSERT INTO verification_documents (user_id, document_id, file_path) VALUES ($1, $2, $3)',
      [userId, req.body.documentId || 'N/A', filePath]
    );
    res.status(201).json({ message: 'Document uploaded successfully.' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

router.get('/status', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      'SELECT status FROM verification_documents WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT 1',
      [userId]
    );
    res.status(200).json({ status: result.rows[0]?.status || 'not uploaded' });
  } catch (err) {
    console.error('Status error:', err);
    res.status(500).json({ error: 'Failed to get verification status' });
  }
});

export default router;
