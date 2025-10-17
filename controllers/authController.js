const User = require('../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    console.log('📧 Intentando login para:', correo);

    // Validar campos
    if (!correo || !contraseña) {
      return res.status(400).json({ 
        success: false,
        message: 'Correo y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ correo });
    console.log('👤 Usuario encontrado:', user);
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    console.log('🔐 Comparando contraseñas...');

    // Verificar contraseña
    const isMatch = await user.comparePassword(contraseña);
    console.log('✅ Contraseña coincide:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Contraseña incorrecta' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user._id,
        rol: user.id_rol,
        correo: user.correo
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    console.log('🎉 Login exitoso para:', user.correo);

    res.json({
      success: true,
      message: '✅ Login exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        app: user.app,
        apm: user.apm,
        correo: user.correo,
        id_rol: user.id_rol
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al verificar token' 
    });
  }
};

module.exports = { login, verifyToken };