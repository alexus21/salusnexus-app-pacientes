<template>
    <HeaderComponent v-if="!hideHeader" @open-register-component="showRegisterModal" @open-login-component="showLoginModal" />
    <RegisterComponent v-if="showRegisterComponent" @close="showRegisterComponent = false" />
    <LoginComponent v-if="showLoginComponent" @close="showLoginComponent = false" />
    <router-view></router-view>
</template>

<script>

import HeaderComponent from "@/components/header/HeaderComponent.vue";
import LoginPage from "@/components/login/LoginPage.vue";
import RegisterPage from "@/components/register/RegisterPage.vue";

export default {
    name: 'App',
    components: {
        HeaderComponent,
        RegisterComponent: RegisterPage,
        LoginComponent: LoginPage
    },
    data(){
        return {
            showRegisterComponent: false,
            showLoginComponent: false
        }
    },
    computed: {
        hideHeader() {
            return this.$route.meta.hideHeader || false;
        }
    },
    methods: {
        showRegisterModal() {
            this.showRegisterComponent = true;
        },
        showLoginModal() {
            this.$router.push({name: 'Login'});
        },
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

/* Estilos globales para modales */
.modal-backdrop {
    z-index: 1040 !important;
}

.modal {
    z-index: 1050 !important;
}

/* Asegurar que las imágenes principales tengan un z-index bajo */
.home-image, img.home-image {
    z-index: 1 !important;
}

/* Asegurar que SweetAlert2 siempre sea visible */
.swal2-container {
    z-index: 10000 !important;
}

.swal2-popup {
    z-index: 10001 !important;
}
</style>
