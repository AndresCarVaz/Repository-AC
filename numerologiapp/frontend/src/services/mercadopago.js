import api from './api';

/**
 * Crea una preferencia de pago en Mercado Pago.
 * @param {number} monto - Monto a cobrar (default: 25)
 * @returns {{ preference_id, init_point, sandbox_init_point }}
 */
export const crearPreferenciaPago = async (monto = 25) => {
    const { data } = await api.post('/mercadopago/create-preference', { monto });
    return data;
};

/**
 * Verifica el resultado de un pago en Mercado Pago.
 * @param {{ payment_id, status, external_reference }} params - Params de la URL de retorno de MP
 */
export const verificarPago = async (params) => {
    const { data } = await api.get('/mercadopago/verify-payment', { params });
    return data;
};
