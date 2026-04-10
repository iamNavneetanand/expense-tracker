require('dotenv').config();   // ✅ MUST be first

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { db } = require('./db/db');
const { readdirSync } = require('fs');

const app = express();

const PORT = process.env.PORT;

//middlewares
app.use(express.json());
app.use(helmet());

app.use(cors({
    origin: process.env.CLIENT_URL,  // better practice
    credentials: true,
}));

// ⭐ Health check
app.get('/', (req, res) => {
    res.send('Budget Wise API is running 🚀');
});

// 🔥 Load all routes automatically
readdirSync('./routes').map((route) => {
    app.use('/api/v1', require('./routes/' + route));
});

// ✅ Auth routes
app.use('/api/v1/auth', require('./routes/authRoutes'));

// ⭐ Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: "Something went wrong",
    });
});

const server = () => {
    db();
    app.listen(PORT, () => {
        console.log('Server running on port:', PORT);
    });
};

server();