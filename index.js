const express = require('express');
const helmet = require('helmet');
const app = express();
app.use(express.json());
require("dotenv").config();
const cors = require('cors');
app.use(cors({
    origin: [
      '',
      'http://localhost:3000'
    ],
    credentials: true
  }));

app.use(helmet());
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
app.get('/', (req, res) => {
    res.send('Hello in Khaled Gammal ');  
});
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 