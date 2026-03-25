const { Schema, model } = require('mongoose');

const PaymentSchema = Schema({
    usuario_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    monto: { type: Number, required: true },
    fecha_pago: { type: Date, default: Date.now },
    fecha_vencimiento: { type: Date, required: true },
    metodo: { type: String, required: true },
    // Mercado Pago fields
    mpPreferenceId: { type: String, default: null },
    mpPaymentId: { type: String, default: null },
    estado: { type: String, enum: ['pendiente', 'aprobado', 'rechazado'], default: 'pendiente' }
});

PaymentSchema.methods.toJSON = function() {
    const { __v, _id, ...payment } = this.toObject();
    return { id: _id, ...payment };
}

module.exports = model('Payment', PaymentSchema);
