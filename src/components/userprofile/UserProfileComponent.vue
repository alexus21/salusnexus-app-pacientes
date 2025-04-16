<template>
    <div class="row">
        <div class="col-md-3">
            <div class="row">
                <div class="row d-flex justify-content-center">
                    <div class="row d-flex justify-content-center">
                        <img :src="profile_photo" alt="profile picture" class="img-fluid">
                    </div>
                    <div class="row d-flex justify-content-center mt-3">
                        <p class="fw-bold">{{
                                user ? user.first_name.split(' ')[0] + ' ' + user.last_name.split(' ')[0] : 'Cargando...'
                            }}</p>
                    </div>
                    <div class="row d-flex justify-content-center">
                        <p class="text-secondary">{{
                                user ? user.email : 'Cargando...'
                            }}</p>
                    </div>
                    <div class="row d-flex justify-content-center mt-3">
                        <button class="edit-profile-button"
                                id="btnEditar"
                                @click="handleEditProfile">
                            Editar
                        </button>
                    </div>
                </div>
            </div>
            <hr/>
            <div class="row">
                <button class="sidebar-buttons">
                    <i class="fa-solid fa-user me-2"></i>
                    Mi Perfil
                </button>
                <button class="sidebar-buttons">
                    <i class="fa-solid fa-credit-card me-2"></i>
                    Mi Suscripción</button>
                <button class="sidebar-buttons">
                    <i class="fa-solid fa-shield me-2"></i>
                    Seguridad
                </button>
                <button class="sidebar-buttons">
                    <i class="fa-solid fa-bell me-2"></i>
                    Notificaciones
                </button>
                <button class="sidebar-buttons">
                    <i class="fa-solid fa-gear me-2"></i>
                    Configuración
                </button>
            </div>
        </div>
        <div class="col-md-auto">
            <div class="row">
                <div class="row main-top-bar">
                    <p class="fw-bold mt-3 d-flex justify-content-start">Mi perfil</p>
                    <p class="fw-light d-flex justify-content-start">Gestionar tu información personal</p>
                </div>
            </div>
            <MyProfileComponent :user="user" :readonly="readonly" />
        </div>
    </div>
</template>

<script>
import swal from "sweetalert2";
import MyProfileComponent from "@/components/userprofile/subcomponents/MyProfileComponent.vue";

// const API_URL = process.env.VUE_APP_API_URL;
const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;

export default {
    name: 'UserProfileComponent',
    components: {MyProfileComponent},
    data() {
        return {
            user: null,
            loading: true,
            isVerified: null,
            profile_photo: null,
            subscription_type: '',
            readonly: true
        }
    },
    computed: {
        SubscriptionButtonText() {
            if (!this.subscription_type) {
                return 'Cargando...';
            }
            return this.subscription_type === 'Gratuito' ? 'Actualizar a Premium' : 'Cambiar a Gratuito';
        }
    },
    async mounted() {
        await this.loadUserData();
    },
    methods: {
        async loadUserData() {
            this.user = JSON.parse(localStorage.getItem('user'));
            //Esperar un segundo para simular la carga de datos
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.isVerified = this.user.verified;
            this.profile_photo = API_URL_IMAGE + '/' + this.user.profile_photo_path;
            await this.showAlertIsNotVerified();

            if (!this.user.subscription_type) {
                this.subscription_type = 'Cargando...';
                return;
            }

            this.user.subscription_type === 'paciente_gratis' ? this.subscription_type = 'Gratuito' : this.subscription_type = 'Premium';
        },
        async showAlertIsNotVerified() {
            if (!this.isVerified) {
                swal.fire({
                    icon: 'warning',
                    iconColor: '#D69656',
                    title: '¡Atención!',
                    text: 'Tu cuenta no está verificada. Por favor verifica tu cuenta para acceder a todas las funciones.',
                    confirmButtonText: 'Verificar',
                    confirmButtonColor: '#5660d6',
                    cancelButtonText: 'Cancelar',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$router.push({name: 'VerifyPatientAccount'});
                    }
                });
            }
        },
        handleSwitchSubscription() {
            this.$router.push({name: 'SubscriptionPlans'});
        },
        handleEditProfile() {
            this.readonly = !this.readonly;
        },
        handleCancelEditProfile() {
            this.readonly = !this.readonly;
        }
    },
}
</script>

<style scoped>
img {
    border-radius: 50%;
    width: 150px;
    height: 125px;
    object-fit: cover;
}

.p-name {
    font-size: 15px;
    font-weight: bold;
    font-family: 'Arial Black', sans-serif, 'Comic Sans MS', cursive;
}

#btnCancelar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 200px;
    height: 50px;
}

input {
    border: none;
    border-bottom: #434ed1 solid 1px;
    border-radius: 5px;
}

input:focus {
    outline: none;
    border-bottom: #434ed1 solid 2px;
}

.edit-profile-button{
    background-color: #f0f7ff;
    color: #4f5bf7;
    border: #4f5bf7 solid 1px;
    border-radius: 5px;
    width: 200px;
    height: 35px;
}

.edit-profile-button:hover {
    background-color: #4f5bf7;
    color: #ffffff;
    font-weight: bold;
}

.sidebar-buttons {
    background-color: #f0f7ff;
    color: #6275f0;
    border: 0;
    height: 50px;
    text-align: start;
    padding-left: 10%;
}

.sidebar-buttons:hover {
    background-color: #4f5bf7;
    color: #ffffff;
    font-weight: bold;
}

.main-top-bar{
    background-color: #0a2d5e;
    width: 75vw;
    display: flex;
    justify-content: flex-start;
}

</style>