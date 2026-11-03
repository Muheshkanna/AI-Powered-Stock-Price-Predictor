import { User } from './models/User.js';
import { prisma, pool } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

export async function seedUser() {
  try {
    console.log('Connecting to PostgreSQL for user seeding...');

    const existingUser = await User.findByEmail('test@example.com');
    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      return existingUser;
    }

    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    console.log('Successfully seeded test user:', user.email);
    return user;
  } catch (error) {
    console.error('User seeding error:', error.message || error);
  } finally {
    await prisma.$disconnect();
    await pool.end().catch(() => {});
  }
}

if (process.argv[1] && process.argv[1].endsWith('seedUser.js')) {
  seedUser();
}
