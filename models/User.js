const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  app: {
    type: String,
    required: true,
    trim: true
  },
  apm: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  contraseña: {
    type: String,
    required: true
  },
  id_rol: {
    type: String,
    required: true,
    enum: ['67d769c4127234da43055a62', '67d769c4127234da43055a63']
  }
}, {
  timestamps: true
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.contraseña);
};

module.exports = mongoose.model('User', UserSchema);