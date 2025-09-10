const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const dinersRouter = require('./routes/diners.routes');
const campaignsRouter = require('./routes/campaigns.routes');
const authRouter = require('./routes/auth.routes');
const aiRouter = require('./routes/ai.routes');
const { authenticateToken } = require('./middleware/auth.middleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: [
        'https://get-more-diners-jqi2.onrender.com',
        'http://localhost:3001',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/diners', dinersRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/ai', aiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        message: err.message || 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
