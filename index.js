const express = require('express');
const helmet = require('helmet');
const app = express();
app.use(express.json());
require("dotenv").config();
const cors = require('cors');

const defaultOrigins = [
    'http://localhost:3000',
    'https://khaled-el-gammal.vercel.app',
    'https://khaledelgammal.com',
    'https://www.khaledelgammal.com',
];

const allowedOrigins = (process.env.FRONTEND_URL || defaultOrigins.join(','))
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
const mongoose = require('mongoose');
const url = process.env.MONGO_URL;

mongoose.connect(url).then(()=>{
    console.log("Connected to MongoDB")
})

const productRoutes = require('./routes/product.route');
app.use('/api/products', productRoutes);

const galleryRoutes = require('./routes/gallery.route');
app.use('/api/gallery', galleryRoutes);

const contactRoutes = require('./routes/contact.route');
app.use('/api/contact', contactRoutes);

const businessRoutes = require('./routes/business.route');
app.use('/api/business', businessRoutes);

const customizeRoutes = require('./routes/customize.route');
app.use('/api/customize', customizeRoutes);

const userRoutes = require('./routes/user.route');
app.use('/api/users', userRoutes);

const adminRoutes = require('./routes/admin.route');
app.use('/api/admin', adminRoutes);

const checkoutRoutes = require('./routes/checkout.route');
app.use('/api/checkout', checkoutRoutes);

const shippingRoutes = require('./routes/shipping.route');
app.use('/api/shipping', shippingRoutes);

const categoryRoutes = require('./routes/category.route');
app.use('/api/categories', categoryRoutes);
app.get('/', (req, res) => {
    res.send('Hello in Khaled Gammal ');  
});
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'Image must be under 10MB' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: err.message || 'Too many files uploaded' });
    }
    if (err.message && err.message.includes('Only images are allowed')) {
        return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});