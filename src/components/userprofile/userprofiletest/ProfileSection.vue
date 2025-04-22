<template>
    <div class="profile-section">
        <div class="section-header">
            <div class="title-container">
                <span class="section-badge">Datos personales</span>
                <h3 class="section-title">Mi Perfil</h3>
                <p class="section-subtitle">Gestiona tu información personal</p>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-primary action-btn" @click="toggleEditMode">
                    <i class="fas fa-pencil-alt me-2"></i>{{ readonly ? 'Editar' : 'Cancelar' }}
                </button>
                <button v-if="!readonly" class="btn btn-primary action-btn" @click="fetchUpdatedUser">
                    <i class="fas fa-pencil-alt me-2"></i>Actualizar
                </button>
            </div>
        </div>

        <!-- Información Personal -->
        <div v-if="user" class="card info-card">
            <div class="card-glow"></div>
            <div class="card-header">
                <i class="fas fa-id-card header-icon"></i>
                <h4>Información Personal</h4>
            </div>
            <div class="card-body">
                <div class="row g-4">
                    <!-- Nombre completo -->
                    <div class="col-md-6">
                        <div class="info-item">
                            <div class="info-icon-wrapper bg-light-blue">
                                <i class="fas fa-user text-blue"></i>
                            </div>
                            <div class="info-text">
                                <label class="info-label" for="first-name-input">Nombre</label>
                                <input
                                    id="first-name-input"
                                    type="text"
                                    class="info-value form-control text-center"
                                    v-model="localUser.first_name"
                                    :readonly="readonly"
                                    placeholder="Ingrese su nombre">
                            </div>
                            <div class="info-text">
                                <label class="info-label" for="last-name-input">Apellido</label>
                                <input
                                    id="last-name-input"
                                    type="text"
                                    class="info-value form-control text-center"
                                    v-model="localUser.last_name"
                                    :readonly="readonly"
                                    placeholder="Ingrese su apellido">
                            </div>
                        </div>
                    </div>
                    <!-- Correo electrónico -->
                    <div class="col-md-6">
                        <div class="info-item">
                            <div class="info-icon-wrapper bg-light-purple">
                                <i class="fas fa-envelope text-purple"></i>
                            </div>
                            <div class="info-text">
                                <label class="info-label" for="email-input">Correo electrónico</label>
                                <input
                                    id="email-input"
                                    type="email"
                                    class="info-value form-control text-center"
                                    v-model="localUser.email"
                                    readonly
                                    placeholder="Ingrese su correo electrónico">
                            </div>
                        </div>
                    </div>
                    <!-- Teléfono -->
                    <div class="col-md-6">
                        <div class="info-item">
                            <div class="info-icon-wrapper bg-light-orange">
                                <i class="fas fa-phone text-orange"></i>
                            </div>
                            <div class="info-text">
                                <label class="info-label" for="phone-input">Teléfono</label>
                                <input
                                    id="phone-input"
                                    type="tel"
                                    class="info-value form-control text-center"
                                    v-model="localUser.phone"
                                    :readonly="readonly"
                                    placeholder="Ingrese su número de teléfono">
                            </div>
                        </div>
                    </div>
                    <!-- DUI -->
                    <div class="col-md-6">
                        <div class="info-item">
                            <div class="info-icon-wrapper bg-light-teal">
                                <i class="fas fa-hashtag text-teal"></i>
                            </div>
                            <div class="info-text">
                                <label class="info-label" for="dui-input">DUI (Documento Único de Identidad)</label>
                                <input
                                    id="dui-input"
                                    type="text"
                                    class="info-value form-control text-center"
                                    v-model="localUser.dui"
                                    readonly
                                    placeholder="Ingrese su DUI">
                            </div>
                        </div>
                    </div>
                    <!-- Fecha de nacimiento -->
                    <div class="col-md-6">
                        <div class="info-item">
                            <div class="info-icon-wrapper bg-light-indigo">
                                <i class="fas fa-calendar-alt text-indigo"></i>
                            </div>
                            <div class="info-text">
                                <label class="info-label" for="date-of-birth-input">Fecha de nacimiento</label>
                                <input
                                    id="date-of-birth-input"
                                    type="date"
                                    class="info-value form-control text-center"
                                    v-model="localUser.date_of_birth"
                                    :readonly="readonly"
                                    placeholder="Ingrese su fecha de nacimiento">
                            </div>
                        </div>
                    </div>
                    <!-- Dirección -->
                    <div class="col-md-6">
                        <div class="info-item">
                            <div class="info-icon-wrapper bg-light-green">
                                <i class="fas fa-map-marker-alt text-green"></i>
                            </div>
                            <div class="info-text">
                                <label class="info-label" for="address-input">Dirección</label>
                                <input
                                    id="address-input"
                                    type="text"
                                    class="info-value form-control text-center"
                                    v-model="localUser.home_address"
                                    :readonly="readonly"
                                    placeholder="Ingrese su dirección">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading-indicator">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando información personal...</p>
        </div>

        <!-- Contacto de emergencia -->
        <div v-if="user" class="card info-card mt-4">
            <div class="emergency-glow"></div>
            <div class="card-header">
                <i class="fas fa-heartbeat header-icon text-danger"></i>
                <h4>Contacto de emergencia</h4>
            </div>
            <div class="card-body">
                <div class="info-item emergency-contact">
                    <div class="info-icon-wrapper bg-light-red">
                        <i class="fas fa-phone-volume text-red"></i>
                    </div>
                    <div class="info-text">
                        <label class="info-label" for="emergency-contact-name">Contacto de emergencia</label>
                        <div class="d-flex align-items-center">
                            <input
                                id="emergency-contact-name"
                                type="text"
                                class="info-value form-control me-2"
                                v-model="localUser.emergency_contact_name"
                                :readonly="readonly"
                                placeholder="Nombre del contacto">
                            <input
                                id="emergency-contact-phone"
                                type="tel"
                                class="info-value form-control"
                                v-model="localUser.emergency_contact_phone"
                                :readonly="readonly"
                                placeholder="Teléfono del contacto">
                        </div>
                    </div>
                    <div class="emergency-action">
                        <button class="btn btn-sm btn-link">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import swal from "sweetalert2";

const API_URL = process.env.VUE_APP_API_URL;

export default {
    name: 'ProfileSection',
    props: {
        user: {
            type: Object,
            default: null
        },
        profile_photo: {
            type: String,
            default: null
        }
    },
    data(){
        return {
            readonly: true,
            localUser: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                dui: '',
                date_of_birth: '',
                home_address: '',
                emergency_contact_name: '',
                emergency_contact_phone: ''
            }
        }
    },
    mounted() {
        if (this.user) {
            this.localUser = {
                first_name: this.user.first_name,
                last_name: this.user.last_name,
                email: this.user.email,
                phone: this.user.phone,
                dui: this.user.dui,
                date_of_birth: this.user.date_of_birth,
                home_address: this.user.home_address,
                emergency_contact_name: this.user.emergency_contact_name,
                emergency_contact_phone: this.user.emergency_contact_phone
            };
        } else{
            const user = localStorage.getItem('user');
            if (user) {
                this.localUser = JSON.parse(user);
            } else {
                console.error('No se encontró el usuario en localStorage');
            }
        }
    },
    methods: {
        toggleEditMode() {
            this.readonly = !this.readonly;
            console.log(this.localUser);
        },
        async fetchUpdatedUser() {
            this.readonly = !this.readonly;
            try {
                const response = await fetch(API_URL + '/update/' + this.user.user_id, {
                    method: "PATCH",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.localUser)
                });

                if (!response.ok) {
                    throw new Error('Error fetching user data');
                }

                const data = await response.json();

                if(!data.status){
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }

                swal.fire({
                    icon: 'success',
                    title: 'Actualización exitosa',
                    text: 'Los datos se han actualizado correctamente.',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    localStorage.setItem('user', JSON.stringify(data.data));
                    window.location.reload();
                })
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    }
}
</script>

<style scoped>
.profile-section {
    position: relative;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
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
    color: #0a2d5e;
    margin: 0 0 6px 0;
    position: relative;
}

.section-subtitle {
    font-size: 0.95rem;
    color: #6B7280;
    margin: 0;
}

.action-btn {
    padding: 8px 16px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.25);
    background: linear-gradient(145deg, #0d6efd, #0b5ed7);
    border: none;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(13, 110, 253, 0.35);
}

.card.info-card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(13, 110, 253, 0.08);
    background-color: #FFFFFF;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
}

.card.info-card:hover {
    box-shadow: 0 15px 40px rgba(13, 110, 253, 0.12);
    transform: translateY(-3px);
}

.card-glow {
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

.emergency-glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #ef4444, #ff6b6b);
    transition: all 0.3s ease;
    opacity: 0.8;
    box-shadow: 0 2px 15px rgba(239, 68, 68, 0.3);
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
    font-size: 1.1rem;
    font-weight: 600;
    color: #0a2d5e;
    display: flex;
    align-items: center;
}

.card-body {
    padding: 25px;
    background-color: #FFFFFF;
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230d6efd' fill-opacity='0.02' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

.info-item {
    display: flex;
    align-items: center;
    background-color: #F8FBFF;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid rgba(13, 110, 253, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.info-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 0;
    background: linear-gradient(180deg, #0d6efd, #0088cc);
    transition: height 0.3s ease;
}

.info-item:hover {
    border-color: rgba(13, 110, 253, 0.3);
    box-shadow: 0 8px 16px rgba(13, 110, 253, 0.1);
    transform: translateY(-2px);
}

.info-item:hover::before {
    height: 100%;
}

.info-icon-wrapper {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 18px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.info-item:hover .info-icon-wrapper {
    transform: scale(1.08) rotate(5deg);
}

.info-icon-wrapper i {
    font-size: 20px;
}

/* Colores específicos para iconos - mejorados con gradientes sutiles */
.bg-light-blue {
    background: linear-gradient(145deg, #E0F2FE, #dceefb);
}

.text-blue {
    color: #0d6efd;
}

.bg-light-purple {
    background: linear-gradient(145deg, #EDE9FE, #e5e1fa);
}

.text-purple {
    color: #7C3AED;
}

.bg-light-orange {
    background: linear-gradient(145deg, #FFF7ED, #fff1e1);
}

.text-orange {
    color: #F97316;
}

.bg-light-teal {
    background: linear-gradient(145deg, #E0F2F7, #d6ecf2);
}

.text-teal {
    color: #14B8A6;
}

.bg-light-indigo {
    background: linear-gradient(145deg, #E0E7FF, #d6defa);
}

.text-indigo {
    color: #4F46E5;
}

.bg-light-green {
    background: linear-gradient(145deg, #DCFCE7, #d2f5de);
}

.text-green {
    color: #22C55E;
}

.bg-light-red {
    background: linear-gradient(145deg, #FEE2E2, #f9d7d7);
}

.text-red {
    color: #EF4444;
}

.info-text {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.info-label {
    font-size: 0.75rem;
    color: #6B7280;
    margin-bottom: 4px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 0.95rem;
    color: #0a2d5e;
    font-weight: 500;
}

/* Estilos específicos para contacto de emergencia */
.emergency-contact {
    border-left: 3px solid rgba(239, 68, 68, 0.7);
}

.emergency-action {
    margin-left: 10px;
}

.emergency-action .btn-link {
    color: #6B7280;
    padding: 5px 8px;
    transition: all 0.3s ease;
}

.emergency-action .btn-link:hover {
    color: #EF4444;
    background-color: rgba(239, 68, 68, 0.1);
    border-radius: 5px;
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

    .info-icon-wrapper {
        width: 38px;
        height: 38px;
    }

    .info-item {
        padding: 12px;
    }
}

/* Mobile devices (up to 767px) */
@media (max-width: 767.98px) {
    .section-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .action-btn {
        margin-top: 15px;
        align-self: flex-start;
    }

    .card-header, .card-body {
        padding: 15px;
    }

    .info-item {
        padding: 12px;
    }

    .info-icon-wrapper {
        width: 35px;
        height: 35px;
        margin-right: 12px;
    }

    .info-icon-wrapper i {
        font-size: 16px;
    }

    .info-label {
        font-size: 0.7rem;
    }

    .info-value {
        font-size: 0.9rem;
    }

    .section-badge {
        font-size: 0.7rem;
        padding: 3px 10px;
    }

    .section-title {
        font-size: 1.5rem;
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

    .info-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .info-icon-wrapper {
        margin-bottom: 10px;
        width: 38px;
        height: 38px;
    }

    .emergency-contact {
        flex-direction: row;
    }

    .emergency-contact .info-icon-wrapper {
        margin-bottom: 0;
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
}

.loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.1);
    margin-bottom: 20px;
}

.loading-indicator p {
    margin-top: 15px;
    color: #6B7280;
}
</style> 