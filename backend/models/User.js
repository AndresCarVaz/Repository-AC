const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    email: { type: String, required: [true, 'El correo es obligatorio'], unique: true },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] },
    fecha_nacimiento: { type: Date, required: [true, 'La fecha de nacimiento es obligatoria'] },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'inactivo' },
    fecha_registro: { type: Date, default: Date.now }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);
