const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
dotenv.config();
app.use(cors());
app.use(express.json());


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use(cors({ origin: 'https://siet-qb-5qpb.vercel.app/', credentials: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend server is running 🚀");
});
