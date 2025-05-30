const express = require('express');
const app = express();
const cors = require('cors');
const usersRoutes = require('./routes/users');
const path = require('path');
const fs = require('fs');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir)); // To serve uploaded files

// Routes
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
