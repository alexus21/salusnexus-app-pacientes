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
                    <button class="btn btn-outline-light border border-black border-1 text-black" id="btnCancelar">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" id="btnEditar">Editar</button>
                </div>
            </div>
            <div class="row d-flex justify-content-center mt-5 text-start">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">person </span>
                        {{ user ? user.first_name + ' ' + user.last_name : 'Cargando...' }}
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">email </span>
                        {{ user ? user.email : 'Cargando...' }}
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">phone </span>
                        {{ user ? user.phone : 'Cargando...' }}
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">home </span>
                        {{ user ? user.home_address : 'Cargando...' }}
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">emergency </span>
                        {{ user ? user.emergency_contact_name : 'Cargando...' }}
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">contact_emergency </span>
                        {{ user ? user.emergency_contact_phone : 'Cargando...' }}
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <span class="material-icons text-primary me-3">calendar_month</span>
                        {{
                            user ? new Date(user.date_of_birth + 'T00:00:00Z').toLocaleDateString('es-ES', {timeZone: 'UTC'}) : 'Cargando...'
                        }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-md-8">
            <div class="row d-flex justify-content-center ms-5 text-start">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Nombre completo:
                        {{ user ? user.first_name + ' ' + user.last_name : 'Cargando...' }}
                    </li>
                    <li class="list-group-item">Correo electrónico: {{ user ? user.email : 'Cargando...' }}</li>
                    <li class="list-group-item">Teléfono: {{ user ? user.phone : 'Cargando...' }}</li>
                    <li class="list-group-item">Dirección: {{ user ? user.home_address : 'Cargando...' }}</li>
                </ul>
            </div>
            <div class="row d-flex justify-content-center mt-5">
                <div class="card" style="width: 18rem;">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">An item</li>
                        <li class="list-group-item">A second item</li>
                        <li class="list-group-item">A third item</li>
                    </ul>
                </div>
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

</style>