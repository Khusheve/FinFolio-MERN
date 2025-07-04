const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const stockRoutes = require('./routes/stocks');
app.use('/api/stocks', stockRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));



// Example route
app.get('/', (req, res) => {
  res.send('FinFolio backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
