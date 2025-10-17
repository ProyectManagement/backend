const express = require('express');
const { login, verifyToken } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Rutas de autenticación
router.post('/login', login);
router.get('/verify', auth, verifyToken);

// Ruta temporal para debug - ver usuarios
router.get('/debug-users', async (req, res) => {
  try {
    const users = await User.find().select('nombre correo id_rol');
    res.json({
      success: true,
      total: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta temporal para crear usuario de prueba
router.post('/create-test-user', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    
    // Eliminar usuario si existe
    await User.deleteOne({ correo: 'car@gmail.com' });
    
    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash('123456789', 12);
    const user = new User({
      nombre: 'Carlos',
      app: 'Test',
      apm: 'User',
      correo: 'car@gmail.com',
      contraseña: hashedPassword,
      id_rol: '67d769c4127234da43055a63'
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Usuario de prueba creado',
      user: {
        correo: user.correo,
        contraseña_plana: '123456789'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;