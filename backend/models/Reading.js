const { Schema, model } = require('mongoose');

const ReadingSchema = Schema({
    usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tipo: { type: String, enum: ['principal', 'diaria'], required: true },
    contenido: { type: String, required: true },
    fecha_generacion: { type: Date, default: Date.now }
});

ReadingSchema.methods.toJSON = function() {
    const { __v, _id, ...reading } = this.toObject();
    return { id: _id, ...reading };
}

module.exports = model('Reading', ReadingSchema);
