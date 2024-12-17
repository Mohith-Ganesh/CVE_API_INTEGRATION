// app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cveRoutes = require('./routes/cveRoutes');
const cors=require('cors')
const app = express();

// Middleware
app.use(cors())
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/api/cves', cveRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('NVD CVE API Server is running.');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // Deprecated in Mongoose 6
})
.then(() => {
    console.log('Connected to MongoDB');
    // Start Server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('Failed to connect to MongoDB', err);
});
