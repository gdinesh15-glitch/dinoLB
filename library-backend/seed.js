const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const adminExists = await User.findOne({ userId: 'admin' });
        
        if (adminExists) {
            console.log('Admin user already exists. Skipping seed.');
            process.exit();
        }

        const admin = new User({
            userId: 'admin',
            name: 'System Administrator',
            password: 'admin123', // Hashed by the model's pre-save hook
            role: 'Admin',
            department: 'IT/Management'
        });

        await admin.save();
        console.log('Default Admin user created successfully!');
        console.log('User ID: admin');
        console.log('Password: admin123');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
