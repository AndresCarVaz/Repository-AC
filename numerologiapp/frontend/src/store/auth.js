import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
    const token = ref(localStorage.getItem('token') || null);
    const loading = ref(false);
    const error = ref(null);

    const isLoggedIn = computed(() => !!token.value);
    const isMemberActive = computed(() => user.value?.estado === 'activo');
    const isAdmin = computed(() => user.value?.role === 'ADMIN_ROLE');

    const setUser = (userData, tokenData) => {
        user.value = userData;
        token.value = tokenData;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', tokenData);
    };

    const login = async (email, password) => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data.user, data.token);
            return { ok: true };
        } catch (err) {
            error.value = err.response?.data?.msg || 'Error al iniciar sesión';
            return { ok: false, msg: error.value };
        } finally {
            loading.value = false;
        }
    };

    const register = async (nombre, email, password, fecha_nacimiento) => {
        loading.value = true;
        error.value = null;
        try {
            const { data } = await api.post('/auth/register', { nombre, email, password, fecha_nacimiento });
            setUser(data.user, data.token);
            return { ok: true };
        } catch (err) {
            error.value = err.response?.data?.msg || 'Error al registrarse';
            return { ok: false, msg: error.value };
        } finally {
            loading.value = false;
        }
    };

    const renewToken = async () => {
        try {
            const { data } = await api.get('/auth/renew');
            setUser(data.user, data.token);
            return { ok: true };
        } catch {
            logout();
            return { ok: false };
        }
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const refreshUser = (updatedUser) => {
        user.value = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return {
        user, token, loading, error,
        isLoggedIn, isMemberActive, isAdmin,
        login, register, renewToken, logout, refreshUser
    };
});
