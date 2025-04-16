<template>
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3">
            <!-- User Profile Card -->
            <div class="profile-card mt-3 text-center">
                <img :src="profile_photo" :alt="`${user?.first_name || ''} profile picture`" class="profile-photo">
                <p class="fw-bold mt-3">{{ userFullName }}</p>
                <p class="text-secondary">{{ user?.email || 'Cargando...' }}</p>
                <button
                        class="edit-profile-button"
                        @click="toggleEditMode"
                >
                    {{ readonly ? 'Editar' : 'Cancelar' }}
                </button>
            </div>

            <hr/>

            <!-- Navigation Menu -->
            <nav class="sidebar-menu">
                <button
                        v-for="(item, index) in menuItems"
                        :key="index"
                        class="sidebar-button"
                        :class="{ active: activeSection === item.section }"
                        @click="setActiveSection(item.section)"
                >
                    <i :class="item.icon + ' me-2'"></i>
                    {{ item.label }}
                </button>

                <hr style="margin-top: 40%"/>
                <button
                        class="btn sidebar-button-logout" @click="logout">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    Cerrar sesión
                </button>
            </nav>
        </div>

        <!-- Main Content Area -->
        <div class="col-md-9">
            <component
                    :is="activeComponent"
                    :user="user"
                    :readonly="readonly"
            />
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
import MyProfileComponent from "@/components/userprofile/subcomponents/MyProfileComponent.vue";
import MySubscriptionComponent from "@/components/userprofile/subcomponents/MySubscription.vue";
import LogoutComponent from "@/components/logout/LogoutComponent.vue";

const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;

export default {
    name: 'UserProfileComponent',
    components: {
        MyProfileComponent,
        MySubscriptionComponent,
        LogoutComponent,
    },

    data() {
        return {
            user: null,
            profile_photo: null,
            subscription_type: '',
            readonly: true,
            activeSection: 'profile',
            menuItems: [
                {section: 'profile', label: 'Mi Perfil', icon: 'fa-solid fa-user', component: 'MyProfileComponent'},
                {
                    section: 'subscription',
                    label: 'Mi Suscripción',
                    icon: 'fa-solid fa-credit-card',
                    component: 'MySubscriptionComponent'
                },
                {section: 'security', label: 'Seguridad', icon: 'fa-solid fa-shield', component: null},
                {section: 'notifications', label: 'Notificaciones', icon: 'fa-solid fa-bell', component: null},
                {section: 'settings', label: 'Configuración', icon: 'fa-solid fa-gear', component: null}
            ]
        };
    },

    computed: {
        userFullName() {
            if (!this.user) return 'Cargando...';
            const firstName = this.user.first_name.split(' ')[0];
            const lastName = this.user.last_name.split(' ')[0];
            return `${firstName} ${lastName}`;
        },

        activeComponent() {
            const activeMenuItem = this.menuItems.find(item => item.section === this.activeSection);
            return activeMenuItem?.component || null;
        },

        isVerified() {
            return this.user?.verified || false;
        }
    },

    async mounted() {
        await this.loadUserData();
    },

    methods: {
        ...LogoutComponent.methods,
        async loadUserData() {
            try {
                this.user = JSON.parse(localStorage.getItem('user'));

                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (this.user) {
                    this.profile_photo = `${API_URL_IMAGE}/${this.user.profile_photo_path}`;
                    this.setSubscriptionType();
                    await this.checkVerificationStatus();
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        },

        setSubscriptionType() {
            if (!this.user.subscription_type) {
                this.subscription_type = 'Cargando...';
                return;
            }

            this.subscription_type = this.user.subscription_type === 'paciente_gratis'
                ? 'Gratuito'
                : 'Premium';
        },

        async checkVerificationStatus() {
            if (!this.isVerified) {
                await this.showVerificationAlert();
            }
        },

        async showVerificationAlert() {
            const result = await Swal.fire({
                icon: 'warning',
                iconColor: '#D69656',
                title: '¡Atención!',
                text: 'Tu cuenta no está verificada. Por favor verifica tu cuenta para acceder a todas las funciones.',
                confirmButtonText: 'Verificar',
                confirmButtonColor: '#5660d6',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
                allowEscapeKey: false,
                allowOutsideClick: false,
            });

            if (result.isConfirmed) {
                this.$router.push({name: 'VerifyPatientAccount'});
            }
        },

        toggleEditMode() {
            this.readonly = !this.readonly;
        },

        setActiveSection(section) {
            this.activeSection = section;
        },

        navigateToSubscriptionPlans() {
            this.$router.push({name: 'SubscriptionPlans'});
        }
    }
};
</script>

<style scoped>
.row {
    overflow-x: hidden;
    width: 100%;
}

.profile-photo {
    border-radius: 50%;
    width: 150px;
    height: 125px;
    object-fit: cover;
}

.profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.edit-profile-button {
    background-color: #f0f7ff;
    color: #0c8ce3;
    border: #0c8ce3 solid 1px;
    border-radius: 5px;
    width: 200px;
    height: 35px;
    transition: all 0.3s ease;
}

.edit-profile-button:hover {
    background-color: #0c8ce3;
    color: #ffffff;
    font-weight: bold;
}

.sidebar-button {
    background-color: #f0f7ff;
    color: #0c8ce3;
    border: 0;
    height: 50px;
    text-align: start;
    padding-left: 10%;
    width: 100%;
    transition: all 0.3s ease;
}

.sidebar-button:hover, .sidebar-button.active {
    background-color: #0c8ce3;
    color: #ffffff;
    font-weight: bold;
}

.sidebar-button-logout {
    background-color: #f0f7ff;
    color: #bd635b;
    border: 0;
    height: 50px;
    text-align: start;
    padding-left: 10%;
    width: 100%;
    transition: all 0.3s ease;
}

.sidebar-button-logout:hover, .sidebar-button-logout.active {
    background-color: #bd635b;
    color: #ffffff;
    font-weight: bold;
}

.sidebar-menu {
    display: flex;
    flex-direction: column;
}

input {
    border: none;
    border-bottom: #434ed1 solid 1px;
    border-radius: 5px;
    transition: border-bottom 0.3s ease;
}

input:focus {
    outline: none;
    border-bottom: #434ed1 solid 2px;
}
</style>