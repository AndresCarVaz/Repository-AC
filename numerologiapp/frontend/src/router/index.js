import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

const routes = [
    {
        path: '/',
        component: () => import('../layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('../views/DashboardView.vue')
            },
            {
                path: 'lecturas',
                name: 'readings',
                component: () => import('../views/ReadingsView.vue')
            },
            {
                path: 'pagos',
                name: 'payments',
                component: () => import('../views/PaymentsView.vue')
            },
            {
                path: 'admin',
                name: 'admin',
                component: () => import('../views/AdminView.vue'),
                meta: { requiresAdmin: true }
            },
            {
                path: 'pagos/exito',
                name: 'payment-success',
                component: () => import('../views/PaymentResultView.vue')
            },
            {
                path: 'pagos/fallo',
                name: 'payment-failure',
                component: () => import('../views/PaymentResultView.vue')
            },
            {
                path: 'pagos/pendiente',
                name: 'payment-pending',
                component: () => import('../views/PaymentResultView.vue')
            }
        ]
    },
    {
        path: '/auth',
        component: () => import('../layouts/AuthLayout.vue'),
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('../views/LoginView.vue')
            },
            {
                path: 'registro',
                name: 'register',
                component: () => import('../views/RegisterView.vue')
            }
        ]
    },
    {
        path: '/:catchAll(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// Route Guards
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth) {
        if (!authStore.isLoggedIn) {
            // Try to renew token before redirecting
            if (localStorage.getItem('token')) {
                const result = await authStore.renewToken();
                if (result.ok) {
                    return next();
                }
            }
            return next({ name: 'login' });
        }
        return next();
    }

    if (to.meta.requiresAdmin && !authStore.isAdmin) {
        return next({ name: 'dashboard' });
    }

    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (authStore.isLoggedIn && to.path.startsWith('/auth')) {
        return next({ name: 'dashboard' });
    }

    next();
});

export default router;
