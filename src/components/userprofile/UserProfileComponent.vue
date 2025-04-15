<template>
    <div class="row m-5">
        <div class="col-md-4">
            <div class="row d-flex justify-content-center">
                <div class="row d-flex justify-content-center">
                    <img :src="profile_photo" alt="profile picture" class="img-fluid">
                </div>
                <div class="row d-flex justify-content-center mt-3">
                    <p class="p-name text-primary">{{
                            user ? user.first_name.split(' ')[0] + ' ' + user.last_name.split(' ')[0] : 'Cargando...'
                        }}</p>
                </div>
                <div class="col d-flex justify-content-center mt-3">
                    <button class="btn btn-outline-light border border-black border-1 text-black" id="btnCancelar"
                            @click="handleCancelEditProfile">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" id="btnEditar" @click="handleEditProfile">Editar</button>
                </div>
            </div>
            <div class="row d-flex justify-content-center mt-5">
                <div class="col d-flex justify-content-center mt-3">
                    <p>
                        Plan actual: {{ user ? subscription_type : 'Cargando...' }}
                    </p>
                </div>

                <div class="col d-flex justify-content-center mt-3">
                    <button class="btn btn-primary"
                            id="btnActualizarPlan"
                            v-if="subscription_type"
                            @click="handleSwitchSubscription">
                        {{ SubscriptionButtonText }}
                    </button>
                </div>
            </div>
        </div>

        <div class="col-md-8">
            <div class="row d-flex justify-content-center mt-5 text-start">
                <h3>Información personal</h3>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">person </span>
                        <input type="text"
                               class="form-control w-50"
                               :value="user ? user.first_name.split(' ')[0] + ' ' + user.last_name.split(' ')[0] : 'Cargando...'"
                               :readonly="readonly">
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">email </span>
                        <input type="text"
                               class="form-control w-50"
                               :value="user ? user.email : 'Cargando...'"
                               readonly>
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">phone </span>
                        <input type="text"
                               class="form-control w-50"
                               :value="user ? user.phone : 'Cargando...'"
                               :readonly="readonly">
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">home </span>
                        <input type="text"
                               class="form-control w-50"
                               :value="user ? user.home_address : 'Cargando...'"
                               :readonly="readonly">
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">emergency </span>
                        <input type="text"
                               class="form-control w-50"
                               :value="user ? user.emergency_contact_name : 'Cargando...'"
                               :readonly="readonly">
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">contact_emergency </span>
                        <input type="text"
                               class="form-control w-50"
                               :value="user ? user.emergency_contact_phone : 'Cargando...'"
                               :readonly="readonly">
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">calendar_month</span>
                        <input type="date"
                               class="form-control w-50"
                               :value="user ? user.date_of_birth : 'Cargando...'"
                               :readonly="readonly">
                    </li>
                </ul>
            </div>
            <div class="row d-flex justify-content-center mt-5 text-start">
                <h3>Información de ubicación</h3>

            </div>
        </div>
    </div>
</template>

<script>
import swal from "sweetalert2";

// const API_URL = process.env.VUE_APP_API_URL;
const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;

export default {
    name: 'UserProfileComponent',
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
    width: 300px; /* Ajusta el tamaño según sea necesario */
    height: 250px; /* Ajusta el tamaño según sea necesario */
    object-fit: cover; /* Asegura que la imagen se recorte para llenar el contenedor */
}

.p-name {
    font-size: 35px;
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

#btnEditar {
    margin-left: 15px;
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

.list-group-item {
    border-bottom: none !important;
}

</style>