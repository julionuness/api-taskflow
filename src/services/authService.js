const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const userRepository = new UserRepository();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

const register = async (userData) => {
  try {
    const { name, email, password } = userData;

    // Verificar se email já existe
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  } catch (error) {
    console.error('Register service error:', error);
    throw error;
  }
};

const login = async (credentials) => {
  try {
    const { email, password } = credentials;

    // Buscar usuário por email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    const token = generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await userRepository.findById(id);
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Get user service error:', error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await userRepository.findByEmail(email);
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Get user by email service error:', error);
    throw error;
  }
};

module.exports = {
  register,
  login,
  getUserById,
  getUserByEmail
};