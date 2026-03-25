const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

let _client = null;
let _preference = null;
let _payment = null;

function getClient() {
    if (!_client) {
        _client = new MercadoPagoConfig({
            accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
        });
    }
    return _client;
}

function getPreference() {
    if (!_preference) {
        _preference = new Preference(getClient());
    }
    return _preference;
}

function getPayment() {
    if (!_payment) {
        _payment = new Payment(getClient());
    }
    return _payment;
}

module.exports = { getClient, getPreference, getPayment };
