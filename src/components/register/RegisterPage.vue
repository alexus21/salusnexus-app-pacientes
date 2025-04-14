<template>
    <div class="register-page">
        <!-- Elementos decorativos de fondo -->
        <div class="decorative-element decorative-element-1"></div>
        <div class="decorative-element decorative-element-2"></div>
        <div class="decorative-element decorative-element-3"></div>
        
        <div class="register-container">
            <div class="left-panel">
                <span class="badge bg-primary-soft mb-3">Plataforma Médica</span>
                <h1 class="welcome-text">Crea tu cuenta</h1>
                <p class="account-text">Únase a nuestra plataforma médica</p>
                
                <!-- Ilustración médica -->
                <div class="medical-illustration">
                    <div class="doctor-image-container">
                        <img src="/loginRegister.png" alt="Profesional médico" class="doctor-image">
                        <div class="medical-cross"></div>
                    </div>
                </div>
                
                <div class="features-container">
                    <div class="login-feature-item">
                        <i class="fas fa-user-shield feature-icon"></i>
                        <span>Registro rápido y seguro</span>
                    </div>
                    <div class="login-feature-item">
                        <i class="fas fa-clipboard-check feature-icon"></i>
                        <span>Gestión de historial médico</span>
                    </div>
                    <div class="login-feature-item">
                        <i class="fas fa-calendar-alt feature-icon"></i>
                        <span>Agende sus citas fácilmente</span>
                    </div>
                </div>
                
                <p class="new-account-text">¿Ya tiene una cuenta?</p>
                <router-link to="/login" class="login-btn-link">Iniciar sesión</router-link>
            </div>
            
            <div class="right-panel">
                <h2 class="register-title">Crear cuenta</h2>
                <div class="steps-indicator">
                    <div class="step active">
                        <div class="step-number">1</div>
                        <span class="step-text">Datos personales</span>
                    </div>
                    <div class="step-connector"></div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <span class="step-text">Verificación</span>
                    </div>
                </div>
                
                <form @submit.prevent="register">
                    <div class="register-form-container">
                        <!-- Columna izquierda -->
                        <div class="form-column">
                            <div class="input-group">
                                <span class="input-icon">
                                    <i class="fas fa-user"></i>
                                </span>
                                <input type="text" id="first_name" v-model="patient_form.first_name" 
                                       class="form-control" placeholder="Nombre" required>
                            </div>
                            
                            <div class="input-group">
                                <span class="input-icon">
                                    <i class="fas fa-user"></i>
                                </span>
                                <input type="text" id="last_name" v-model="patient_form.last_name" 
                                       class="form-control" placeholder="Apellidos" required>
                            </div>
                            
                            <div class="input-group">
                                <span class="input-icon">
                                    <i class="fas fa-birthday-cake"></i>
                                </span>
                                <input
                                    id="date_of_birth"
                                    type="date"
                                    v-model="patient_form.date_of_birth"
                                    class="form-control"
                                    readonly
                                    placeholder="Fecha de Nacimiento"
                                    @click="showDatePicker"
                                />
                            </div>
                            <DatePicker
                                class="form-control d-none"
                                id="datePicker"
                                expanded
                                title-position="right"
                                v-model="patient_form.date_of_birth"
                                mode="date"
                                :max-date="maxDate"
                                :min-date="minDate"
                                :value="new Date()"
                                transition="fade"
                                locale="es-SV"
                                timezone="UTC"
                                @dayclick="handleDayClick"
                            />
                            
                            <div class="input-group">
                                <span class="input-icon">
                                    <i class="fas fa-venus-mars"></i>
                                </span>
                                <select id="gender" v-model="patient_form.gender" class="form-control" required>
                                    <option value="" disabled selected>Seleccione género</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Columna derecha -->
                        <div class="form-column">
                            <div class="input-group">
                                <span class="input-icon">
                                    <i class="fas fa-phone"></i>
                                </span>
                                <input type="tel"
                                       id="phone"
                                       v-model="patient_form.phone"
                                       class="form-control"
                                       placeholder="Teléfono"
                                       maxlength="8"
                                       @input="formatPhone"
                                       required>
                            </div>
                            
                            <div class="input-group">
                                <span class="input-icon">
                                    <i class="fas fa-envelope"></i>
                                </span>
                                <input type="email" id="email" v-model="patient_form.email" 
                                       class="form-control" placeholder="Correo electrónico" required>
                            </div>
                            
                            <div class="input-group">
                                <span class="input-icon">
                                    <i class="fas fa-lock"></i>
                                </span>
                                <input type="password" id="password" v-model="patient_form.password" 
                                       class="form-control" placeholder="Contraseña" minlength="8" maxlength="20" required>
                            </div>
                            
                            <div class="input-group">
                                <span class="input-icon">
                                    <i class="fas fa-lock"></i>
                                </span>
                                <input type="password" id="confirm_password" v-model="patient_form.confirm_password" 
                                       class="form-control" placeholder="Confirmar contraseña" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="terms-section">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="terms" v-model="patient_form.accept_terms" required>
                            <label class="form-check-label" for="terms">
                                Acepto los <a href="#" @click.prevent="showTerms">términos y condiciones</a>
                            </label>
                        </div>
                    </div>
                    
                    <div class="emergency-info-note">
                        <i class="fas fa-info-circle me-2"></i>
                        <span>La información de contacto de emergencia se solicitará después de verificar su cuenta</span>
                    </div>
                    
                    <button type="submit" class="register-btn" :disabled="!canSubmit">
                        <i class="fas fa-user-plus me-2"></i>Crear cuenta
                    </button>
                </form>
            </div>
        </div>
        
        <!-- Modal para términos y condiciones -->
        <div class="terms-modal" v-if="showTermsModal">
            <div class="terms-modal-content">
                <h3 class="terms-modal-title">Términos y Condiciones de Uso</h3>
                <div class="terms-modal-body">
                    <h4>1. Aceptación de Términos</h4>
                    <p>Al registrarse en nuestro sistema, usted acepta estos términos y condiciones en su totalidad.</p>
                    
                    <h4>2. Privacidad de Datos</h4>
                    <p>- Sus datos personales serán tratados con estricta confidencialidad.</p>
                    <p>- La información médica será accesible solo por personal autorizado.</p>
                    <p>- No compartiremos su información con terceros sin su consentimiento.</p>
                    
                    <h4>3. Responsabilidades del Paciente</h4>
                    <p>- Proporcionar información veraz y actualizada.</p>
                    <p>- Mantener sus datos de contacto actualizados.</p>
                    <p>- Cumplir con las citas programadas o cancelar con anticipación.</p>
                    
                    <h4>4. Uso del Servicio</h4>
                    <p>- El acceso a la plataforma es personal e intransferible.</p>
                    <p>- Debe mantener seguras sus credenciales de acceso.</p>
                    <p>- No está permitido el uso fraudulento del sistema.</p>
                    
                    <h4>5. Comunicaciones</h4>
                    <p>Acepta recibir notificaciones relacionadas con sus citas y tratamientos médicos.</p>
                </div>
                <div class="terms-modal-footer">
                    <button class="btn-close-terms" @click="closeTerms">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert2';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

const API_URL = process.env.VUE_APP_API_URL;

export default {
    name: 'RegisterPage',
    components: {
        DatePicker,
    },
    data() {
        return {
            patient_form: {
                first_name: '',
                last_name: '',
                phone: '',
                email: '',
                date_of_birth: new Date().toISOString().split('T')[0],
                gender: '',
                emergency_contact_name: '',  // Mantenemos por compatibilidad con API
                emergency_contact_phone: '', // Mantenemos por compatibilidad con API
                password: '',
                confirm_password: '',
                accept_terms: false,
                user_rol: 'paciente'
            },
            errors: {},
            showTermsModal: false,
            date: new Date(),
            minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
            maxDate: new Date()
        };
    },
    computed: {
        canSubmit() {
            return this.patient_form.accept_terms &&
                this.patient_form.password.length >= 8 &&
                this.patient_form.password === this.patient_form.confirm_password &&
                this.patient_form.password !== '';
        }
    },
    methods: {
        async register() {
            // Ensure emergency contact fields are not empty
            this.patient_form = {
                ...this.patient_form,
                emergency_contact_name: this.patient_form.emergency_contact_name || 'Pendiente',
                emergency_contact_phone: this.patient_form.emergency_contact_phone || '0000000000',
            };

            // Show loading alert
            swal.fire({
                title: "Cargando...",
                text: "Por favor, espere mientras se crea su cuenta...",
                timerProgressBar: true,
                didOpen: () => {
                    swal.showLoading();
                },
            });

            try {
                // Make the API request
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.patient_form),
                });

                const data = await response.json();

                // Handle errors in the response
                if (!data.status) {
                    const errorMessage = data.errors
                        ? Object.values(data.errors).join('\n')
                        : 'Ocurrió un error al registrar el paciente';
                    swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: errorMessage,
                    });
                    return;
                }

                // Clear local storage and save the token
                localStorage.setItem("token", data.data.access_token);
                localStorage.setItem("user", JSON.stringify(data.data.user));

                // Show success alert and redirect
                swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Su cuenta ha sido creada correctamente',
                }).then(() => {
                    if (localStorage.getItem('selected_plan') === 'avanzado') {
                        this.$router.push({ name: 'AddPaymentMethod' });
                    } else {
                        this.$router.push({ name: 'Home' });
                    }
                });
            } catch (error) {
                // Handle network or unexpected errors
                console.error('Error:', error);
                swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'Ocurrió un error al registrar el paciente. Por favor, inténtelo de nuevo.',
                });
            }
        },
        showTerms() {
            this.showTermsModal = true;
        },
        closeTerms() {
            this.showTermsModal = false;
        },
        handleDayClick(day) {
            const selectedDate = day.date.toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];

            if (selectedDate <= today) {
                this.patient_form.date_of_birth = selectedDate;
            } else {
                console.log('Selected date is in the future and not allowed.');
            }

            this.hideDatePicker();
        },
        showDatePicker() {
            const datePicker = document.getElementById('datePicker');
            datePicker.classList.remove('d-none');
        },
        hideDatePicker() {
            const datePicker = document.getElementById('datePicker');
            datePicker.classList.add('d-none');
        },
        formatPhone() {
            // Eliminar cualquier carácter que no sea dígito
            let value = this.patient_form.phone.replace(/\D/g, '');

            // Verificar si el primer dígito es 2, 6 o 7
            if (value.length > 0 && !/^[267]/.test(value)) {
                // Si el primer dígito no es 2, 6 ni 7, borrar todo
                this.patient_form.phone = '';
            } else {
                // Si hay más de 8 dígitos, truncar a 8
                if (value.length > 8) {
                    value = value.slice(0, 8);
                }
                // Formatear el número de teléfono
                this.patient_form.phone = value;
            }
        },
    }
};
</script>

<style scoped>
/* Estilos generales similares a LoginPage */
.register-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 50%, #F8FBFF 100%);
    position: relative;
    overflow: hidden;
}

/* Elementos decorativos de fondo */
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

.register-container {
    display: flex;
    width: 900px;
    min-height: 600px;
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

/* Estilos para el panel izquierdo */
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

.account-text {
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

.new-account-text {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 2;
    color: white;
    font-size: 0.95rem;
}

.login-btn-link {
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

.login-btn-link:hover {
    background-color: #0b5ed7;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(13, 110, 253, 0.2);
}

/* Ilustración médica */
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

/* Panel derecho (formulario) */
.right-panel {
    width: 60%;
    padding: 40px;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-y: auto;
}

.register-title {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: #1a2b48;
    font-weight: 600;
    position: relative;
    z-index: 1;
}

/* Indicador de pasos */
.steps-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.step-number {
    width: 36px;
    height: 36px;
    background-color: #e9ecef;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #6c757d;
    margin-bottom: 8px;
}

.step.active .step-number {
    background-color: #0d6efd;
    color: white;
}

.step-text {
    font-size: 0.85rem;
    color: #6c757d;
}

.step.active .step-text {
    color: #0d6efd;
    font-weight: 500;
}

.step-connector {
    height: 2px;
    background-color: #e9ecef;
    width: 100px;
    margin: 0 15px;
    margin-bottom: 28px;
}

/* Formulario de registro */
.register-form-container {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.form-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-group {
    position: relative;
    margin-bottom: 5px;
    z-index: 1;
}

.form-control {
    width: 100%;
    padding: 15px 15px 15px 50px;
    border: 1px solid #ddd;
    border-radius: 25px;
    font-size: 14px;
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

.terms-section {
    margin: 20px 0;
    padding: 15px;
    background-color: rgba(13, 110, 253, 0.05);
    border-radius: 10px;
}

.terms-section a {
    color: #0d6efd;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
}

.terms-section a:hover {
    text-decoration: underline;
}

.form-check {
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-check-input {
    margin-top: 0;
}

.emergency-info-note {
    background-color: rgba(255, 193, 7, 0.1);
    border-left: 3px solid #ffc107;
    padding: 12px 15px;
    margin-bottom: 20px;
    border-radius: 5px;
    font-size: 14px;
    color: #664d03;
}

.register-btn {
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

.register-btn:hover:not(:disabled) {
    background-color: #0b5ed7 !important;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(13, 110, 253, 0.2);
}

.register-btn:disabled {
    background-color: #ccc !important;
    cursor: not-allowed;
    opacity: 0.7;
}

/* Modal de términos y condiciones */
.terms-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.terms-modal-content {
    background-color: white;
    border-radius: 10px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    overflow: auto;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.terms-modal-title {
    padding: 20px;
    margin: 0;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    position: sticky;
    top: 0;
    z-index: 1;
}

.terms-modal-body {
    padding: 20px;
}

.terms-modal-body h4 {
    color: #0d6efd;
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 18px;
}

.terms-modal-footer {
    padding: 15px 20px;
    text-align: right;
    border-top: 1px solid #dee2e6;
}

.btn-close-terms {
    padding: 8px 15px;
    background-color: #0d6efd;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-close-terms:hover {
    background-color: #0b5ed7;
}

/* Estilos para el DatePicker */
:deep(.vc-container) {
    --day-content-transition: all .1s ease-in;
    --day-popover-transition: all .1s ease-in;
    --day-border-radius: 50%;
    border: none;
    width: 100%;
}

:deep(.vc-weeks) {
    padding: 0;
}

:deep(.vc-day) {
    padding: 5px 0;
}

:deep(.vc-day-content) {
    font-size: 14px;
    font-weight: 500;
    height: 32px;
    width: 32px;
}

:deep(.vc-day-content:hover) {
    background-color: #e9ecef;
    color: #0d6efd;
}

:deep(.vc-highlight) {
    background-color: #0d6efd;
    color: white;
}

:deep(.vc-title) {
    font-weight: 600;
    color: #1a2b48;
}

:deep(.vc-arrow) {
    padding: 8px;
}

:deep(.vc-nav-title) {
    color: #0d6efd;
    font-weight: 600;
}

/* Animaciones */
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

/* Media queries para responsive */
@media (max-width: 768px) {
    .register-container {
        flex-direction: column;
        width: 90%;
        max-width: 500px;
        height: auto;
    }
    
    .left-panel, .right-panel {
        width: 100%;
    }
    
    .left-panel {
        padding: 30px 20px;
        border-radius: 20px 20px 0 0;
    }
    
    .right-panel {
        padding: 30px 20px;
        border-radius: 0 0 20px 20px;
    }
    
    .register-form-container {
        flex-direction: column;
        gap: 10px;
    }
    
    .welcome-text {
        font-size: 24px;
    }
    
    .medical-illustration img {
        width: 100%;
        max-width: 120px;
        height: auto;
        object-fit: contain;
    }
    
    .doctor-image-container {
        padding: 10px;
    }
    
    .medical-cross {
        width: 18px;
        height: 18px;
    }
    
    .medical-cross:before {
        width: 10px;
        height: 3px;
    }
    
    .medical-cross:after {
        width: 3px;
        height: 10px;
    }
    
    .step-connector {
        width: 60px;
    }

    #datePicker {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        max-width: 90vw;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }

    /* Hide features on very small screens but keep medical illustration visible when possible */
    .features-container {
        display: none;
    }
    
    .medical-illustration {
        margin: 1rem 0;
    }
}

@media (max-width: 480px) {
    /* Only hide medical illustration on extremely small screens */
    .medical-illustration {
        display: none;
    }
}
</style> 