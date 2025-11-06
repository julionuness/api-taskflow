const authService = require('../services/authService');
const { HTTP_STATUS } = require('../utils/constants');

const register = async (req, res) => {
  console.log("=== REGISTER DEBUG ===");
  console.log("req.body:", req.body);
  console.log("req.body type:", typeof req.body);
  console.log("req.body keys:", Object.keys(req.body || {}));

  try {
    const result = await authService.register(req.body);
    console.log("Service result:", result);
    res.status(HTTP_STATUS.CREATED).json({
      message: 'Usuário registrado com sucesso',
      ...result
    });
  } catch (error) {
    console.log("Error:", error.message);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(HTTP_STATUS.OK).json({
      message: 'Login realizado com sucesso',
      ...result
    });
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Usuário não encontrado'
      });
    }
    res.status(HTTP_STATUS.OK).json(user);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Email é obrigatório'
      });
    }

    const user = await authService.getUserByEmail(email);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        error: 'Usuário não encontrado'
      });
    }

    // Retornar apenas dados públicos
    res.status(HTTP_STATUS.OK).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getUserByEmail
};