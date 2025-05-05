<template>
    <div class="notifications-section">
        <div class="section-header">
            <div class="title-container">
                <span class="section-badge">Centro de notificaciones</span>
                <h3 class="section-title">Notificaciones</h3>
                <p class="section-subtitle">Configura las notificaciones que deseas recibir</p>
            </div>
        </div>

        <!-- Configuración de Notificaciones -->
        <div class="card settings-card">
            <div class="glow-effect"></div>
            <div class="card-header">
                <i class="fas fa-bell header-icon"></i>
                <h4>Personaliza tus preferencias de notificaciones</h4>
            </div>
            <div class="card-body">

                <!-- Notificaciones de Correo - Tips de Salud -->
                <div class="setting-item">
                    <div class="setting-icon-wrapper bg-light-purple">
                        <i class="fas fa-envelope text-purple"></i>
                    </div>
                    <div class="setting-content">
                        <div class="setting-header">
                            <div>
                                <h5 class="setting-title">Tips de salud por correo</h5>
                                <p class="setting-description">Recibe consejos y recomendaciones de salud periódicamente en tu correo</p>
                            </div>
                            <div class="form-check form-switch large-switch">
                                <input id="healthTipsSwitch" v-model="healthTipsEnabled" class="form-check-input" role="switch"
                                       type="checkbox">
                            </div>
                        </div>
                        <div class="setting-details">
                            <div :class="{'setting-detail-disabled': !healthTipsEnabled}" class="setting-detail-item">
                                <i class="fas fa-heart me-2"></i>
                                <span>Consejos personalizados para mejorar tu bienestar</span>
                            </div>
                            <div :class="{'setting-detail-disabled': !healthTipsEnabled}" class="setting-detail-item">
                                <i class="fas fa-calendar-alt me-2"></i>
                                <span>Recibirás aproximadamente un correo semanal con información relevante</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="setting-divider">

                <!-- Notificaciones de seguridad -->
                <div class="setting-item">
                    <div class="setting-icon-wrapper bg-light-green">
                        <i class="fas fa-shield-alt text-green"></i>
                    </div>
                    <div class="setting-content">
                        <div class="setting-header">
                            <div>
                                <h5 class="setting-title">Notificaciones de seguridad</h5>
                                <p class="setting-description">Recibe alertas sobre actividades sospechosas</p>
                            </div>
                            <div class="form-check form-switch large-switch">
                                <input id="loginAlertsSwitch" v-model="loginAlertsEnabled" class="form-check-input" role="switch"
                                       type="checkbox">
                            </div>
                        </div>
                        <div class="setting-details">
                            <div :class="{'setting-detail-disabled': !loginAlertsEnabled}" class="setting-detail-item">
                                <i class="fas fa-user-secret me-2"></i>
                                <span>Recibe notificaciones cuando se detecte un inicio de sesión desde un dispositivo desconocido</span>
                            </div>
                            <div :class="{'setting-detail-disabled': !loginAlertsEnabled}" class="setting-detail-item">
                                <i class="fas fa-globe-americas me-2"></i>
                                <span>Alertas de ubicaciones inusuales para inicios de sesión</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="setting-divider">

                <!-- Notificaciones de la aplicación -->
                <div class="setting-item">
                    <div class="setting-icon-wrapper bg-light-blue">
                        <i class="fas fa-mobile-alt text-blue"></i>
                    </div>
                    <div class="setting-content">
                        <div class="setting-header">
                            <div>
                                <h5 class="setting-title">Notificaciones de la aplicación</h5>
                                <p class="setting-description">Configura qué notificaciones deseas recibir en la aplicación</p>
                            </div>
                            <div class="form-check form-switch large-switch">
                                <input id="appNotificationsSwitch" v-model="appNotificationsEnabled" class="form-check-input" role="switch"
                                       type="checkbox">
                            </div>
                        </div>
                        <div class="setting-details">
                            <div :class="{'setting-detail-disabled': !appNotificationsEnabled}" class="setting-detail-item">
                                <i class="fas fa-calendar-check me-2"></i>
                                <span>Recordatorios de citas y consultas</span>
                            </div>
                            <div :class="{'setting-detail-disabled': !appNotificationsEnabled}" class="setting-detail-item">
                                <i class="fas fa-comment-medical me-2"></i>
                                <span>Notificaciones de mensajes y comunicaciones</span>
                            </div>
                            <div :class="{'setting-detail-disabled': !appNotificationsEnabled}" class="setting-detail-item">
                                <i class="fas fa-clipboard-list me-2"></i>
                                <span>Actualizaciones sobre tu historial médico</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Preferencias de comunicación -->
        <div class="card settings-card mt-4">
            <div class="glow-effect"></div>
            <div class="card-header">
                <i class="fas fa-sliders-h header-icon"></i>
                <h4>Preferencias de comunicación</h4>
            </div>
            <div class="card-body">
                <div class="setting-item">
                    <div class="setting-icon-wrapper bg-light-yellow">
                        <i class="fas fa-paper-plane text-yellow"></i>
                    </div>
                    <div class="setting-content">
                        <div class="setting-header">
                            <div>
                                <h5 class="setting-title">Canales de comunicación</h5>
                                <p class="setting-description">Elige cómo quieres recibir nuestras comunicaciones</p>
                            </div>
                        </div>
                        <div class="communication-channels mt-3">
                            <div class="channel-item">
                                <div class="form-check form-switch">
                                    <input id="emailChannel" v-model="emailEnabled" class="form-check-input" type="checkbox">
                                    <label class="form-check-label" for="emailChannel">
                                        <i class="fas fa-envelope me-2"></i>
                                        Correo electrónico
                                    </label>
                                </div>
                            </div>
                            <div class="channel-item">
                                <div class="form-check form-switch">
                                    <input id="smsChannel" v-model="smsEnabled" class="form-check-input" type="checkbox">
                                    <label class="form-check-label" for="smsChannel">
                                        <i class="fas fa-sms me-2"></i>
                                        Mensajes SMS
                                    </label>
                                </div>
                            </div>
                            <div class="channel-item">
                                <div class="form-check form-switch">
                                    <input id="pushChannel" v-model="pushEnabled" class="form-check-input" type="checkbox">
                                    <label class="form-check-label" for="pushChannel">
                                        <i class="fas fa-bell me-2"></i>
                                        Notificaciones push
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="frequency-selector mt-4">
                            <label class="form-label">Frecuencia de comunicaciones</label>
                            <select v-model="communicationFrequency" class="form-select">
                                <option value="immediate">En tiempo real (inmediato)</option>
                                <option value="daily">Resumen diario</option>
                                <option value="weekly">Resumen semanal</option>
                                <option value="monthly">Resumen mensual</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botón para guardar cambios -->
        <div class="action-buttons mt-4">
            <button class="btn btn-primary action-btn" @click="saveNotificationSettings">
                <i class="fas fa-save me-2"></i>
                Guardar preferencias
            </button>
        </div>
    </div>
</template>

<script>
import swal from "sweetalert2";
const API_URL = process.env.VUE_APP_API_URL;

export default {
    name: 'NotificationsSection',
    props: {
        user: {
            type: Object,
            default: null
        },
        readonly: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            // Configuración de notificaciones
            healthTipsEnabled: true,
            loginAlertsEnabled: true,
            appNotificationsEnabled: true,
            
            // Canales de comunicación
            emailEnabled: true,
            smsEnabled: false,
            pushEnabled: true,
            
            // Frecuencia
            communicationFrequency: 'weekly',
            
            // Estado
            isLoading: false
        };
    },
    mounted() {
        this.healthTipsEnabled = this.user.wants_health_tips;
        this.loginAlertsEnabled = this.user.wants_security_notifications;
        this.appNotificationsEnabled = this.user.wants_app_notifications;
    },
    methods: {
        async saveNotificationSettings() {
            this.isLoading = true;
            
            try {
                // Simular guardado (aquí se implementaría la llamada real a la API)
                console.log("wants_health_tips: " + this.healthTipsEnabled);
                console.log("wants_security_notifications: " + this.loginAlertsEnabled)
                console.log("wants_app_notifications: " + this.appNotificationsEnabled)
                // await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await fetch(API_URL + '/patients/update-notifications-preferences', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        wants_health_tips: this.healthTipsEnabled,
                        wants_security_notifications: this.loginAlertsEnabled,
                        wants_app_notifications: this.appNotificationsEnabled,
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al guardar preferencias');
                }

                const data = await response.json();

                if (!data.status) {
                    swal.fire({
                        title: 'Error',
                        text: 'No se pudieron guardar tus preferencias. Inténtalo de nuevo más tarde.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }
                
                // Mensaje de éxito
                swal.fire({
                    title: 'Preferencias guardadas',
                    text: 'Tus preferencias de notificación se han actualizado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    this.$router.push({name: 'PatientProfile' }).then(() => {
                        window.location.reload();
                    });
                })
            } catch (error) {
                console.error('Error al guardar preferencias:', error);
                swal.fire({
                    title: 'Error',
                    text: 'No se pudieron guardar tus preferencias. Inténtalo de nuevo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
.notifications-section {
    position: relative;
}

.section-header {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #E5E7EB;
    position: relative;
}

.section-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    border-radius: 3px;
}

.title-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.section-badge {
    display: inline-block;
    padding: 4px 12px;
    background-color: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 10px;
}

.section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 6px 0;
}

.section-subtitle {
    font-size: 0.95rem;
    color: #6B7280;
    margin: 0;
}

.card.settings-card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    background-color: #FFFFFF;
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
    margin-bottom: 30px;
}

.card.settings-card:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    transform: translateY(-3px);
}

.glow-effect {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    transition: all 0.3s ease;
    opacity: 0.8;
    box-shadow: 0 2px 15px rgba(13, 110, 253, 0.3);
}

.card-header {
    background-color: #F9FAFB;
    border-bottom: 1px solid #E5E7EB;
    padding: 18px 25px;
    display: flex;
    align-items: center;
}

.header-icon {
    font-size: 1.25rem;
    color: #0d6efd;
    margin-right: 15px;
}

.card-header h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
}

.card-body {
    padding: 25px;
}

.setting-item {
    display: flex;
    padding: 25px 0;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.setting-item:not(:last-child) {
    border-bottom: 1px solid #F3F4F6;
}

.setting-icon-wrapper {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.setting-item:hover .setting-icon-wrapper {
    transform: scale(1.1) rotate(5deg);
}

.setting-icon-wrapper i {
    font-size: 22px;
}

/* Colores específicos para iconos */
.bg-light-blue {
    background: linear-gradient(145deg, #E0F2FE, #dceefb);
}

.text-blue {
    color: #0284C7;
}

.bg-light-purple {
    background: linear-gradient(145deg, #EDE9FE, #e5e1fa);
}

.text-purple {
    color: #7C3AED;
}

.bg-light-green {
    background: linear-gradient(145deg, #DCFCE7, #d2f5de);
}

.text-green {
    color: #22C55E;
}

.bg-light-yellow {
    background: linear-gradient(145deg, #FEF3C7, #faedc8);
}

.text-yellow {
    color: #D97706;
}

.setting-content {
    flex-grow: 1;
}

.setting-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
}

.setting-title {
    font-size: 1.15rem;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 5px;
}

.setting-description {
    font-size: 0.9rem;
    color: #6B7280;
    margin-bottom: 0;
    line-height: 1.5;
}

.setting-divider {
    border: none;
    height: 1px;
    background-color: #F3F4F6;
    margin: 0;
}

/* Form Switch Estilos */
.large-switch {
    margin: 0;
}

.large-switch .form-check-input {
    width: 3em;
    height: 1.5em;
    cursor: pointer;
    background-color: #E5E7EB;
    border-color: #E5E7EB;
    box-shadow: none !important;
    transition: all 0.3s ease;
}

.large-switch .form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.setting-details {
    background-color: #F9FAFB;
    border-radius: 8px;
    padding: 12px 15px;
    margin-top: 15px;
}

.setting-detail-item {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #4B5563;
    margin-bottom: 8px;
    transition: all 0.3s ease;
}

.setting-detail-item:last-child {
    margin-bottom: 0;
}

.setting-detail-item i {
    color: #0d6efd;
}

.setting-detail-disabled {
    opacity: 0.5;
}

/* Canales de comunicación */
.communication-channels {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.channel-item {
    background-color: #F9FAFB;
    border-radius: 8px;
    padding: 12px 15px;
}

.form-check-label {
    display: flex;
    align-items: center;
    font-size: 0.95rem;
    color: #4B5563;
    cursor: pointer;
}

.frequency-selector {
    max-width: 400px;
}

.form-label {
    font-weight: 500;
    font-size: 0.9rem;
    color: #374151;
    margin-bottom: 8px;
}

.form-select {
    border-radius: 8px;
    border: 1px solid #D1D5DB;
    padding: 10px 12px;
    font-size: 0.9rem;
    background-color: #F9FAFB;
    transition: all 0.3s ease;
}

.form-select:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Botón de acción */
.action-buttons {
    display: flex;
    justify-content: flex-end;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    padding: 10px 22px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    background: linear-gradient(145deg, #0d6efd, #0b5ed7);
    border: none;
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.25);
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(13, 110, 253, 0.3);
}

/* Responsive */
/* Tablets (768px to 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
    .section-title {
        font-size: 1.6rem;
    }

    .card-header {
        padding: 15px 20px;
    }

    .card-body {
        padding: 20px;
    }

    .setting-item {
        padding: 20px 0;
    }

    .setting-icon-wrapper {
        width: 38px;
        height: 38px;
    }

    .frequency-selector {
        max-width: 100%;
    }
}

/* Mobile devices (up to 767px) */
@media (max-width: 767.98px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .card-body {
        padding: 20px;
    }

    .setting-item {
        flex-direction: column;
        padding: 20px 0;
    }

    .setting-icon-wrapper {
        margin-bottom: 15px;
        margin-right: 0;
    }

    .setting-header {
        flex-direction: row;
        align-items: center;
    }

    .action-buttons {
        justify-content: center;
    }

    .action-btn {
        width: 100%;
    }
}

/* Small mobile devices (576px and down) */
@media (max-width: 575.98px) {
    .section-title {
        font-size: 1.35rem;
    }

    .section-subtitle {
        font-size: 0.85rem;
    }

    .card-header h4 {
        font-size: 1rem;
    }

    .header-icon {
        font-size: 1.1rem;
        margin-right: 10px;
    }

    .setting-title {
        font-size: 1rem;
    }

    .setting-description {
        font-size: 0.85rem;
    }

    .form-control, .form-select {
        font-size: 0.85rem;
        padding: 8px 10px;
    }

    .large-switch .form-check-input {
        width: 2.5em;
        height: 1.3em;
    }

    .setting-detail-item {
        font-size: 0.8rem;
    }

    .channel-item {
        padding: 10px 12px;
    }

    .form-check-label {
        font-size: 0.85rem;
    }
}

/* Extra small mobile devices (375px and down) */
@media (max-width: 375px) {
    .section-badge {
        font-size: 0.65rem;
        padding: 2px 8px;
    }

    .section-title {
        font-size: 1.25rem;
    }

    .card-body {
        padding: 12px 10px;
    }

    .card-header {
        padding: 12px 15px;
    }

    .action-btn {
        font-size: 0.85rem;
        padding: 6px 12px;
    }

    .setting-title {
        font-size: 0.95rem;
    }

    .setting-description {
        font-size: 0.8rem;
    }

    .form-label {
        font-size: 0.8rem;
    }
}
</style> 