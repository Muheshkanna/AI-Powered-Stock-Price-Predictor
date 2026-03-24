import mongoose from 'mongoose';
import { User } from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_finance_app';

async function seedUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for user seeding...');

    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('User already exists.');
    } else {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
      console.log('Successfully seeded test user.');
    }
  } catch (error) {
    console.error('User seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedUser();
