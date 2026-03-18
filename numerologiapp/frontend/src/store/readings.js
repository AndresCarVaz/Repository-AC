import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useReadingsStore = defineStore('readings', () => {
    const readings = ref([]);
    const currentReading = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const fetchReadings = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.get('/readings');
            readings.value = data.readings;
        } catch (err) {
            error.value = err.response?.data?.msg || 'Error al cargar las lecturas';
        } finally {
            loading.value = false;
        }
    };

    const generateMainReading = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.post('/readings/main');
            currentReading.value = data.reading;
            readings.value.unshift(data.reading);
            return { ok: true, reading: data.reading };
        } catch (err) {
            error.value = err.response?.data?.msg || 'Error al generar la lectura principal';
            return { ok: false, msg: error.value };
        } finally {
            loading.value = false;
        }
    };

    const generateDailyReading = async () => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.post('/readings/daily');
            currentReading.value = data.reading;
            readings.value.unshift(data.reading);
            return { ok: true, reading: data.reading };
        } catch (err) {
            error.value = err.response?.data?.msg || 'Error al generar la lectura diaria';
            return { ok: false, msg: error.value };
        } finally {
            loading.value = false;
        }
    };

    const clearCurrentReading = () => {
        currentReading.value = null;
    };

    return {
        readings, currentReading, loading, error,
        fetchReadings, generateMainReading, generateDailyReading, clearCurrentReading
    };
});
