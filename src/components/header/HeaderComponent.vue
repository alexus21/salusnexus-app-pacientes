<template>
    <header>
        <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
                <!-- Logo con efecto de brillo -->
                <a class="navbar-brand" href="#" @click.prevent="handleLogoClick">
                    <span class="brand-highlight"></span>
                    <i class="fas fa-heartbeat brand-icon"></i> Salus Nexus
                </a>

                <!-- Botón para colapsar con efecto hover -->
                <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Menú de navegación mejorado -->
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/">
                                <i class="fas fa-home nav-icon"></i>Inicio
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <i class="fas fa-info-circle nav-icon"></i>Acerca
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">
                                <i class="fas fa-envelope nav-icon"></i>Contacto
                            </a>
                        </li>
                        
                        <!-- Botones para móviles (visible solo en pantallas < lg) -->
                        <li class="nav-item d-lg-none" v-if="!isLogged">
                            <a class="nav-link auth-link" href="#" @click.prevent="handleRegisterClick">
                                <span class="material-icons">person_add</span> Registrarme
                            </a>
                        </li>
                        <li class="nav-item d-lg-none" v-if="!isLogged">
                            <a class="nav-link auth-link" href="#" @click.prevent="handleLoginClick">
                                <span class="material-icons">login</span> Iniciar sesión
                            </a>
                        </li>
                        <li class="nav-item d-lg-none" v-if="isLogged">
                            <a class="nav-link auth-link" href="#" @click.prevent="handleProfileClick">
                                <span class="material-icons">person</span> Mi perfil
                            </a>
                        </li>
                        <li class="nav-item d-lg-none" v-if="isLogged">
                            <a class="nav-link auth-link" href="#" @click.prevent="handleLogout">
                                <span class="material-icons">logout</span> Cerrar sesión
                            </a>
                        </li>
                    </ul>

                    <!-- Botones para escritorio mejorados (visible solo en pantallas >= lg) -->
                    <div class="d-none d-lg-flex auth-btn-container">
                        <button class="btn btn-outline-light border  border-1 text-black auth-btn"
                                id="btnRegister"
                                @click="handleRegisterClick"
                                v-if="!isLogged">
                            <span class="material-icons">person_add</span> Registrarme
                        </button>

                        <button class="btn btn-primary text-center auth-btn"
                                id="btnLogin"
                                @click="handleLoginClick"
                                v-if="!isLogged">
                            <span class="material-icons">login</span> Iniciar sesión
                        </button>

                        <button class="btn btn-outline-light border border-1 text-black auth-btn"
                                id="btnProfile"
                                @click="handleProfileClick"
                                v-if="isLogged">
                            <span class="material-icons">person</span> Mi perfil
                        </button>

                        <button class="btn btn-primary text-center auth-btn"
                                id="btnLogout"
                                @click="handleLogout"
                                v-if="isLogged">
                            <span class="material-icons">logout</span> Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
import swal from "sweetalert2";
import {validateAuth} from "@/utils/auth";

const API_URL = process.env.VUE_APP_API_URL;

export default {
    name: 'HeaderComponent',
    methods: {
        handleRegisterClick() {
            this.$router.push({name: 'Register'});
        },
        handleLoginClick() {
            this.$router.push({name: 'Login'});
        },
        handleProfileClick() {
            this.$router.push({name: 'UserProfile'});
        },
        handleLogoClick() {
            // this.$router.push({name: 'Dashboard'});
            this.$router.push({name: 'Home'});
        },
        handleLogout() {
            swal.fire({
                title: "¿Estás seguro?",
                text: "¿Quieres cerrar sesión?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, cerrar sesión",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#434ed1",
                cancelButtonColor: "#d1434e",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(API_URL + "/logout", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            if (responseData.status) {
                                localStorage.clear();
                                this.isLogged = false;
                                window.location.reload();
                            } else {
                                swal.fire({
                                    icon: "error",
                                    title: "¡Error!",
                                    text: responseData.message,
                                });
                            }
                        });
                }
            })
        },
    },
    data() {
        return {
            showRegisterComponent: false,
            showLoginComponent: false,
            show: false,
            isLogged: false,
        }
    },
    async mounted() {
        this.isLogged = await validateAuth();
    }
};
</script>

<style scoped>
.navbar {
    padding: 1rem;
    background: linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 100%);
    box-shadow: 0 2px 15px rgba(208, 208, 208, 0.15);
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
}

/* Estilo del logo */
.navbar-brand {
    font-weight: 700;
    color: #1a2b48;
    display: flex;
    align-items: center;
    position: relative;
    transition: all 0.3s ease;
}

.navbar-brand:hover {
    transform: translateY(-2px);
    color: #0d6efd;
}

.brand-icon {
    color: #0d6efd;
    margin-right: 8px;
    font-size: 1.2rem;
}

.brand-highlight {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(13,110,253,0.1) 0%, rgba(255,255,255,0) 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.navbar-brand:hover .brand-highlight {
    opacity: 1;
}

/* Mejoras para elementos de navegación */
.nav-link {
    color: #1a2b48;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    margin: 0 2px;
}

.nav-icon {
    margin-right: 8px;
    font-size: 0.9rem;
    color: #0d6efd;
}

.nav-link:hover {
    color: #0d6efd;
    background-color: rgba(13, 110, 253, 0.05);
}

.nav-link.active {
    color: #0d6efd;
    font-weight: 600;
    background-color: rgba(13, 110, 253, 0.08);
}

.nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 3px;
    background-color: #0d6efd;
    border-radius: 3px;
}

.material-icons {
    vertical-align: middle;
    margin-right: 5px;
}

/* Contenedor de botones con animación */
.auth-btn-container {
    display: flex;
    gap: 15px;
    position: relative;
}

/* Estilos para los botones con efectos mejorados */
#btnRegister, #btnProfile, #btnLogin, #btnLogout, .auth-btn {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0.5rem 1.25rem;
    width: auto;
    min-width: 150px;
    height: auto;
    border-radius: 0.375rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

/* Efecto de relleno en hover */
#btnRegister::after, #btnProfile::after, .auth-btn:not(.btn-primary)::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(13, 110, 253, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: -1;
}

#btnRegister:hover::after, #btnProfile:hover::after, .auth-btn:not(.btn-primary):hover::after {
    transform: translateX(0);
}

#btnLogin, #btnLogout {
    margin-left: 15px;
    position: relative;
}

#btnLogin::after, #btnLogout::after, .auth-btn.btn-primary::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: -1;
}

#btnLogin:hover::after, #btnLogout:hover::after, .auth-btn.btn-primary:hover::after {
    transform: translateX(0);
}

/* Efectos hover para los botones */
.auth-btn:hover, #btnRegister:hover, #btnProfile:hover, #btnLogin:hover, #btnLogout:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* Estilos para los links de autenticación en el menú móvil */
.auth-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    margin-top: 0.25rem;
    transition: all 0.3s ease;
}

.auth-link:hover, .auth-link:focus {
    background-color: rgba(13, 110, 253, 0.08);
    color: #0d6efd;
    transform: translateX(5px);
}

/* Botón toggler para móvil */
.navbar-toggler {
    border: none;
    padding: 0.5rem;
    transition: all 0.3s ease;
    border-radius: 0.375rem;
    background-color: transparent;
}

.navbar-toggler:hover {
    background-color: rgba(13, 110, 253, 0.08);
}

.navbar-toggler:focus {
    box-shadow: none;
    outline: none;
}

.navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(26, 43, 72, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    transition: all 0.3s ease;
}

/* Media queries */
@media (max-width: 991px) {
    .navbar-collapse {
        margin-top: 1rem;
        padding: 1rem;
        background-color: rgba(255, 255, 255, 0.95);
        border-radius: 0.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    
    .nav-link {
        border-radius: 0.5rem;
        margin: 2px 0;
    }
    
    .nav-link:hover {
        padding-left: 1.5rem;
    }
}

@media (min-width: 992px) {
    .navbar-nav {
        gap: 5px;
    }
}
</style>