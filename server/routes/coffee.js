import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/coffee-shops', async (req, res) => {
  const { suburb, lat, lng } = req.query;
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

    const results = await Promise.all(
      googleRes.data.results.map(async (place) => {
        const detailsRes = await axios.get(
          'https://maps.googleapis.com/maps/api/place/details/json',
          {
            params: {
              key: apiKey,
              place_id: place.place_id,
              fields: 'opening_hours',
            },
          }
        );

        const distance = getDistanceInKm(
          lat,
          lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

        return {
          name: place.name,
          address: place.formatted_address,
          distance: distance.toFixed(2), // km
          openingHours: detailsRes.data.result.opening_hours?.weekday_text || [],
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error('Google API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch coffee shop details' });
  }
});

// Helper function
function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}


export default router;
