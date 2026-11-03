import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';

export class UserModel {
  static async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  static async findById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async create({ name, email, password }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  static format(user) {
    if (!user) return null;
    return {
      id: user.id,
      _id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export const User = UserModel;
export default UserModel;
