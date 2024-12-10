const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    model: { 
        type: String, 
        equired: [true, 'Car model is required'],
        minlength: [3, 'Model name should be at least 3 characters'],
        maxlength: [100, 'Model name should be less than 100 characters']
    },
    price: { 
        type: Number, 
        required: [true, 'Price is required'],
        min: [1, 'Price must be greater than 0']
    },
    phone: { 
        type: String, 
        required: [true, 'Phone number is required'],
        match: [/^\d{11}$/, 'Phone number must be 11 digits']
    },
    city: { 
        type: String, 
        required: [true, 'City is required'],
        minlength: [3, 'City name should be at least 3 characters'],
        maxlength: [100, 'City name should be less than 100 characters']
    },
    images: { 
        type: [String], 
        required: [true, 'At least one image URL is required'],
        validate: {
            validator: function(value) {
                return value.every(url => /^https?:\/\/\S+\.\S+/.test(url));
            },
            message: 'Invalid image URL format',
        }
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'User ID is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('Cars', CarSchema);