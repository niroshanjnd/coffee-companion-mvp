import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/coffee-shops', async (req, res) => {
  const suburb = req.query.suburb;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const googleRes = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: `coffee shops in ${suburb}, Australia`,
          key: apiKey,
        },
      }
    );

    const simplified = googleRes.data.results.map((place) => ({
      name: place.name,
      address: place.formatted_address,
    }));

    res.json(simplified);
  } catch (error) {
    console.error('Google API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch coffee shops' });
  }
});

export default router;
