const dotenv = require("dotenv");
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
const Car = require('../models/Car');

dotenv.config();
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
});

const createCar = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            msg: 'Unauthorized. Token missing or invalid.',
        });
    }

    const token = authHeader.split(' ')[1];

    const { model, price, phone, city, images } = req.body;
    
    if (!images || images.length === 0 || images.length > 10) {
        return res.status(400).json({
            success: false,
            msg: 'Invalid number of files. Only 10 files allowed.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const uploadPromises = images.map(async (base64Image) => {
            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                resource_type: 'image',
            });

            return uploadResponse.secure_url;
        });

        const imageUrls = await Promise.all(uploadPromises);

        const newCar = new Car({ model, price, phone, city, images: imageUrls, user: userId });

        await newCar.save();

        res.status(201).json({
            success: true,
            msg: 'Car created successfully!',
            imageUrls
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                msg: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }

        res.status(500).json({
            success: false,
            msg: 'An error occurred. Please try again later.' + error.message,
        });
    }
};

module.exports = { createCar }; 