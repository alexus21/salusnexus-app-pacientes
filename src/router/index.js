import {createRouter, createWebHistory} from "vue-router";
import HomeComponent from "@/components/home/HomeComponent.vue";
// import LoginHome from "@/components/dashboard/LoginHome.vue";
import SubscriptionPlansComponent
    from "@/components/subscriptionplan/SubscriptionPlansComponent.vue";
import LoginPage from "@/components/login/LoginPage.vue";
import RegisterPage from "@/components/register/RegisterPage.vue";
import AddPaymentMethodComponent from "@/components/paymentmethod/AddPaymentMethodComponent.vue";
import ClinicasComponent from "@/components/clinicas/ClinicasComponent.vue";
import ReviewsComponent from "@/components/reviews/ReviewsComponent.vue";

import {validateAuth} from "@/utils/auth";
import VerifyAccountComponent from "@/components/verifyaccount/VerifyAccountComponent.vue";
import UserProfileComponent from "@/components/userprofile/UserProfileComponent.vue";
import PatientSettingsLayout from "@/components/userprofile/userprofiletest/PatientSettingsLayout.vue";
import ProfileSection from "@/components/userprofile/userprofiletest/ProfileSection.vue";
import SubscriptionSection from "@/components/userprofile/userprofiletest/SubscriptionSection.vue";
import SecuritySection from "@/components/userprofile/userprofiletest/SecuritySection.vue";
import NotificationsSection from "@/components/userprofile/userprofiletest/NotificationsSection.vue";
import DiseasesSelectionComponent from "@/components/verifyaccount/DiseasesSelectionComponent.vue";

// Placeholder components - create these files later
const PatientConfigurationSection = { template: '<div><h2>Configuración</h2><p>Contenido de Configuración...</p></div>' };

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
        component: ClinicasComponent,
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
        redirect: '/paciente/configuracion/perfil',
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
        path: '/paciente/condiciones-medicas',
        name: 'PatientDiseasesSelection',
        component: DiseasesSelectionComponent,
        meta: {
            requiresAuth: true,
            hideHeader: true
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
        path: '/paciente/configuracion',
        component: PatientSettingsLayout,
        meta: { requiresAuth: false, hideHeader: true },
        children: [
            {
                path: '',
                redirect: 'perfil'
            },
            {
                path: 'perfil',
                name: 'PatientProfile',
                component: ProfileSection
            },
            {
                path: 'suscripcion',
                name: 'PatientSubscription',
                component: SubscriptionSection
            },
            {
                path: 'seguridad',
                name: 'PatientSecurity',
                component: SecuritySection
            },
            {
                path: 'notificaciones',
                name: 'PatientNotifications',
                component: NotificationsSection
            },
            {
                path: 'configuracion',
                name: 'PatientConfiguration',
                component: PatientConfigurationSection
            }
        ]
    },
    {
        path: '/clinica/:id',
        name: 'ClinicaDetalle',
        component: () => import('@/components/clinicas/ClinicaDetalle.vue'),
        meta: {
            requiresAuth: false,
            hideHeader: false
        }
    },
    {
        path: '/paciente/resenas',
        name: 'PatientReviews',
        component: ReviewsComponent,
        meta: {
            requiresAuth: true,
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