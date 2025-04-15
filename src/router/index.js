import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "@/components/home/HomeComponent.vue";
import LoginHome from "@/components/dashboard/LoginHome.vue";
import SubscriptionPlansComponent
    from "@/components/subscriptionplan/SubscriptionPlansComponent.vue";
import LoginPage from "@/components/login/LoginPage.vue";
import RegisterPage from "@/components/register/RegisterPage.vue";
import AddPaymentMethodComponent from "@/components/paymentmethod/AddPaymentMethodComponent.vue";

import {validateAuth} from "@/utils/auth";
import VerifyAccountComponent from "@/components/verifyaccount/VerifyAccountComponent.vue";
import UserProfileComponent from "@/components/userprofile/UserProfileComponent.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeComponent,
        beforeEnter: async (to, from, next) => {
            const isAuthenticated = await validateAuth();
            if (isAuthenticated) {
                next({ name: 'loginHome' });
            } else {
                next();
            }
        }
    },
    {
        path: '/login-home',
        name: 'loginHome',
        component: LoginHome,
        meta: {
            requiresAuth: true,
            hideHeader: true
        }
    },
    {
        path: '/home',
        redirect: '/'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: {
            hideHeader: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: {
            hideHeader: true
        }
    },
    {
        path: '/agregar-pago',
        name: 'AddPaymentMethod',
        component: AddPaymentMethodComponent,
        meta: {
            requiresAuth: true,
            hideHeader: true
        }
    },
    {
        path: '/perfil',
        name: 'UserProfile',
        component: UserProfileComponent,
        meta: {
            requiresAuth: true,
            hideHeader: false
        }
    },
    {
        path: '/paciente/verificar',
        name: 'VerifyPatientAccount',
        component: VerifyAccountComponent,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/planes/pacientes',
        name: 'SubscriptionPlans',
        component: SubscriptionPlansComponent,
        meta: {
            hideHeader: true
        }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const isAuthenticated = await validateAuth();
        if (!isAuthenticated) {
            next({name: 'Home'});
        } else {
            next();
        }
    } else if (to.path === '/login' || to.path === '/register') {
        const isAuthenticated = await validateAuth();
        if (isAuthenticated) {
            next({name: 'loginHome'});
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;