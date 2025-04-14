<template>
    <div class="login-page">
        <!-- Elementos decorativos de fondo -->
        <div class="decorative-element decorative-element-1"></div>
        <div class="decorative-element decorative-element-2"></div>
        <div class="decorative-element decorative-element-3"></div>
        
        <div class="login-container">
            <div class="left-panel">
                <span class="badge bg-primary-soft mb-3">Plataforma Médica</span>
                <h1 class="welcome-text">Acceso Profesional</h1>
                <div class="features-container">
                    <div class="login-feature-item">
                        <i class="fas fa-laptop-medical feature-icon"></i>
                        <span>Ingrese a su espacio de gestión clínica</span>
                    </div>
                    <div class="login-feature-item">
                        <i class="fas fa-shield-alt feature-icon"></i>
                        <span>Acceso seguro y confidencial</span>
                    </div>
                    <div class="login-feature-item">
                        <i class="fas fa-sync feature-icon"></i>
                        <span>Información en tiempo real</span>
                    </div>
                </div>
                
                <!-- Ilustración médica -->
                <div class="medical-illustration">
                    <div class="doctor-image-container">
                        <img src="/loginRegister.png" alt="Profesional médico" class="doctor-image">
                        <div class="medical-cross"></div>
                    </div>
                </div>
                
                <p class="new-account-text">¿Aún no tiene una cuenta?</p>
                <router-link to="/register" class="register-btn">Crear cuenta</router-link>
            </div>
            <div class="right-panel">
                <h2 class="login-title">Iniciar Sesión</h2>
                
                <form @submit.prevent="login">
                    <div class="input-group">
                        <input type="email" id="email" v-model="form.email" class="form-control"
                               placeholder="Usuario o Correo Electrónico" required>
                        <span class="input-icon">
                            <i class="fas fa-user"></i>
                        </span>
                    </div>
                    
                    <div class="input-group">
                        <input type="password" id="password" v-model="form.password"
                               class="form-control" placeholder="Contraseña" required>
                        <span class="input-icon">
                            <i class="fas fa-lock"></i>
                        </span>
                    </div>
                    
                    <div class="forgot-password">
                        <a href="#" @click.prevent="forgotPassword">¿Olvidaste tu contraseña?</a>
                    </div>
                    
                    <button type="submit" class="login-btn">
                        <i class="fas fa-sign-in-alt me-2"></i>Acceder al sistema
                    </button>
                </form>
                
                <div class="account-options">
                    <router-link to="/register" class="create-account-mobile">Crear cuenta</router-link>
                </div>
                
                <!-- Iconos médicos decorativos -->
                <div class="medical-icons">
                    <div class="icon-item"><i class="fas fa-heartbeat"></i></div>
                    <div class="icon-item"><i class="fas fa-stethoscope"></i></div>
                    <div class="icon-item"><i class="fas fa-user-md"></i></div>
                    <div class="icon-item"><i class="fas fa-pills"></i></div>
                    <div class="icon-item"><i class="fas fa-hospital"></i></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert2';

const API_URL = process.env.VUE_APP_API_URL;

export default {
    name: 'LoginPage',
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            errors: {}
        };
    },
    methods: {
        login() {
            fetch(API_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.form)
            })
                .then(response => response.json())
                .then(responseData => {
                    console.log(responseData);
                    if (!responseData.status) {
                        if (responseData.errors) {
                            this.errors = responseData.errors;
                            const errorMessages = Object.values(responseData.errors).join('\n');
                            swal.fire({
                                icon: 'error',
                                title: '¡Error!',
                                text: errorMessages,
                            });
                            return;
                        }

                        swal.fire({
                            icon: 'error',
                            title: '¡Error!',
                            text: responseData.message,
                        });
                        return;
                    }

                    // Guardamos los datos de respuesta
                    const token = responseData.data.access_token;

                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(responseData.data.user));
                    this.$router.push({ name: 'loginHome' });
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        },
        forgotPassword() {
            this.$router.push({name: 'Home'});
        }
    }
};
</script>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 50%, #F8FBFF 100%);
    position: relative;
    overflow: hidden;
}

/* Elementos decorativos de fondo - similares al HomeComponent */
.decorative-element {
    position: absolute;
    border-radius: 50%;
    opacity: 0.2;
    background: linear-gradient(45deg, #0d6efd, #36b9cc);
    z-index: 0;
}

.decorative-element-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    left: -150px;
}

.decorative-element-2 {
    width: 100px;
    height: 100px;
    bottom: 50px;
    left: 15%;
}

.decorative-element-3 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    right: 10%;
}

.login-container {
    display: flex;
    width: 900px;
    min-height: 500px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    position: relative;
    z-index: 1;
    background-color: white;
}

.left-panel {
    width: 40%;
    background: linear-gradient(135deg, rgba(13, 110, 253, 0.2) 0%, rgba(10, 88, 202, 0.3) 100%);
    color: #1a2b48;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
}

/* Blobs similares a los del HomeComponent para el panel izquierdo */
.left-panel::before {
    content: '';
    position: absolute;
    top: 45%;
    left: 50%;
    width: 550px;
    height: 550px;
    background: linear-gradient(135deg, rgba(173, 216, 255, 0.65) 0%, rgba(13, 110, 253, 0.2) 100%);
    transform: translate(-50%, -50%);
    border-radius: 70% 60% 65% 55%;
    z-index: -1;
    animation: pulseBlob 8s infinite alternate;
}

.left-panel::after {
    content: '';
    position: absolute;
    top: 55%;
    left: 45%;
    width: 450px;
    height: 450px;
    background: linear-gradient(135deg, rgba(208, 235, 255, 0.6) 0%, rgba(54, 185, 204, 0.15) 100%);
    transform: translate(-50%, -50%);
    border-radius: 55% 65% 70% 45%;
    z-index: -1;
    animation: pulseBlob 8s infinite alternate;
    animation-delay: 2s;
}

/* Estilo de badge similar al HomeComponent */
.bg-primary-soft {
    background-color: rgba(13, 110, 253, 0.15);
    color: #0d6efd;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    display: inline-block;
    position: relative;
    z-index: 2;
}

.welcome-text {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
    color: #0a2d5e;
}

.features-container {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 25px;
    position: relative;
    z-index: 2;
    animation: fadeInUp 1s;
}

.login-feature-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    background-color: transparent;
    padding: 0.5rem 0;
    border-radius: 0;
    transition: all 0.3s ease;
    text-align: left;
    border-left: 3px solid rgba(255, 255, 255, 0.5);
    padding-left: 0.8rem;
}

.login-feature-item:hover {
    transform: none;
    box-shadow: none;
}

.login-feature-item .feature-icon {
    color: white;
    font-size: 1rem;
    min-width: 20px;
    text-align: center;
    opacity: 0.8;
}

.login-feature-item span {
    color: white;
    font-weight: 400;
    font-size: 0.95rem;
    opacity: 0.9;
}

.account-text {
    margin-bottom: 20px;
    position: relative;
    z-index: 2;
    color: #0a2d5e;
}

.new-account-text {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
    color: #0a2d5e;
    font-size: 0.95rem;
}

.register-btn {
    display: inline-block;
    background-color: #0d6efd;
    color: white;
    padding: 10px 25px;
    border: none;
    border-radius: 25px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
    width: fit-content;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.15);
}

.register-btn:hover {
    background-color: #0b5ed7;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(13, 110, 253, 0.2);
}

.right-panel {
    width: 60%;
    padding: 40px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
}

/* Patrón de fondo para el panel derecho */
.right-panel::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230d6efd' fill-opacity='0.03' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 1;
    z-index: 0;
}

.login-title {
    font-size: 24px;
    margin-bottom: 30px;
    text-align: center;
    color: #1a2b48;
    font-weight: 600;
    position: relative;
    z-index: 1;
}

.input-group {
    position: relative;
    margin-bottom: 20px;
    z-index: 1;
}

.form-control {
    width: 100%;
    padding: 15px 15px 15px 50px;
    border: 1px solid #ddd;
    border-radius: 25px;
    font-size: 16px;
    transition: all 0.3s ease;
    background-color: rgba(255, 255, 255, 0.9);
}

.form-control:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
    background-color: white;
}

.input-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #0d6efd;
    display: flex;
    align-items: center;
    justify-content: center;
}

.forgot-password {
    text-align: right;
    margin-bottom: 30px;
    z-index: 1;
    position: relative;
}

.forgot-password a {
    color: #666;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
}

.forgot-password a:hover {
    color: #0d6efd;
    text-decoration: underline;
}

.login-btn {
    width: 100%;
    padding: 15px;
    background-color: #0d6efd !important;
    color: white !important;
    border: none !important;
    border-radius: 25px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.15);
}

.login-btn:hover {
    background-color: #0b5ed7 !important;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(13, 110, 253, 0.2);
}

.login-btn i {
    margin-right: 8px;
}

/* Iconos médicos decorativos en el panel derecho */
.medical-icons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: 2rem;
    opacity: 0.15;
    position: relative;
    z-index: 1;
}

.icon-item {
    font-size: 1.5rem;
    color: #0d6efd;
}

.scroll-indicator {
    position: relative;
    display: inline-block;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: rgba(13, 110, 253, 0.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.scroll-down {
    color: #0d6efd;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulseBlob {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        transform: translate(-50%, -50%) scale(1.05);
    }
}

/* Ilustración médica en el panel izquierdo */
.medical-illustration {
    margin: 1.5rem 0;
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
}

.doctor-image-container {
    border-radius: 16px;
    padding: 15px;
    position: relative;
    overflow: hidden;
}

.medical-cross {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.medical-cross:before, .medical-cross:after {
    content: '';
    position: absolute;
    background-color: #0d6efd;
}

.medical-cross:before {
    width: 14px;
    height: 4px;
    border-radius: 2px;
}

.medical-cross:after {
    width: 4px;
    height: 14px;
    border-radius: 2px;
}

.doctor-image {
    max-width: 210px;
    height: auto;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.doctor-image:hover {
    transform: scale(1.02);
}

.account-options {
    text-align: center;
    margin: 15px 0;
    position: relative;
    z-index: 10;
}

.create-account-mobile {
    display: none;
    color: #0d6efd;
    text-decoration: none;
    font-weight: 600;
    padding: 8px 15px;
    border-radius: 20px;
    border: 1px solid #0d6efd;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    position: relative;
    z-index: 10;
}

.create-account-mobile:hover, 
.create-account-mobile:focus {
    background-color: rgba(13, 110, 253, 0.1);
    color: #0b5ed7;
}

@media (max-width: 768px) {
    .login-container {
        flex-direction: column;
        width: 90%;
        max-width: 400px;
        height: auto;
        border-radius: 20px;
    }
    
    .left-panel, .right-panel {
        width: 100%;
    }
    
    .left-panel {
        border-radius: 20px 20px 0 0;
        padding: 30px 20px;
        text-align: center;
        align-items: center;
        position: relative;
        min-height: 260px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }
    
    .right-panel {
        padding: 30px;
        border-radius: 0 0 20px 20px;
    }
    
    /* Reposicionamiento para la imagen del doctor */
    .medical-illustration {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
    }
    
    .doctor-image-container {
        padding: 0;
        border-radius: 0;
        width: 100%;
        text-align: center;
        box-shadow: none;
        display: flex;
        justify-content: center;
    }
    
    .doctor-image {
        max-width: 170px;
        margin-bottom: -5px;
    }
    
    .medical-cross {
        top: 10px;
        right: 25%;
    }
    
    /* Ajustar texto para que no se sobreponga con la imagen */
    .welcome-text {
        font-size: 24px;
        margin-bottom: 10px;
        margin-top: 0;
    }
    
    .new-account-text {
        position: absolute;
        bottom: 85px;
        left: 0;
        width: 100%;
        text-align: center;
        margin: 0;
        font-weight: 600;
        color: #0a2d5e;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 5px 0;
        border-radius: 20px;
        width: 80%;
        left: 10%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
    }
    
    .register-btn {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        margin: 0;
        z-index: 10;
        background-color: #0d6efd;
        padding: 10px 20px;
        box-shadow: 0 4px 10px rgba(13, 110, 253, 0.25);
        border: 2px solid #ffffff;
        font-weight: 600;
    }
    
    .register-btn:hover, .register-btn:active {
        background-color: #0b5ed7;
        box-shadow: 0 6px 12px rgba(13, 110, 253, 0.3);
        transform: translateX(-50%) translateY(-2px);
    }
    
    /* Hide features*/
    .features-container {
        display: none;
    }
    
    .input-group {
        margin-bottom: 15px;
    }
    
    .form-control {
        font-size: 14px;
    }
    
    .login-title {
        font-size: 20px;
        margin-bottom: 20px;
    }
    
    .forgot-password {
        margin-bottom: 20px;
    }
    
    .login-btn {
        margin-top: 10px;
    }
    
    .medical-icons {
        margin-top: 1.5rem;
    }
    
    /* En móvil, mostrar el enlace de crear cuenta en el panel derecho */
    .create-account-mobile {
        display: inline-block;
    }
    
    /* Ocultar el texto y botón en el panel izquierdo en móvil */
    .new-account-text, .register-btn {
        display: none;
    }
}

/* Estilos específicos para pantallas muy estrechas */
@media (max-width: 360px) {
    .left-panel {
        min-height: 240px;
        padding-top: 20px;
    }
    
    .doctor-image {
        max-width: 150px;
    }
    
    .new-account-text {
        bottom: 75px;
        width: 90%;
        left: 5%;
        font-size: 0.9rem;
    }
    
    .register-btn {
        bottom: 35px;
        padding: 8px 20px;
        font-size: 0.95rem;
    }
}
</style> 