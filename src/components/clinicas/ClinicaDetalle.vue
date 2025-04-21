<template>
    <div class="container py-4">
        <div class="row">
            <!-- Breadcrumb -->
            <div class="col-12 mb-4">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <router-link :to="{ name: 'loginHome' }">Clínicas</router-link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">{{ clinic.clinic_name }}</li>
                    </ol>
                </nav>
            </div>

            <!-- Encabezado de la clínica -->
            <div class="col-12 mb-4">
                <div class="clinic-header">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h1 class="clinic-name mb-2">{{ clinic.clinic_name }}</h1>
                            <div class="clinic-meta">
                                <div class="clinic-specialty mb-2">
                                  <span class="specialty-badge" :class="getSpecialtyClass(clinic.speciality_name)">
                                    {{ clinic.speciality_name }}
                                  </span>
                                </div>
                                <div class="clinic-location mb-2">
                                    <i class="fas fa-map-marker-alt me-2"></i>
                                    {{ clinic.address }}, {{clinic.city_name}}
                                </div>
                                <div class="clinic-rating d-flex align-items-center mb-3">
                                    <div class="stars me-2">
                                        <i v-for="n in 5" :key="n"
                                           :class="['fas', n <= Math.floor(clinic.rating) ? 'fa-star' : (n - 0.5 <= clinic.rating ? 'fa-star-half-alt' : 'far fa-star')]"></i>
                                    </div>
                                    <span class="rating-value">{{ clinic.rating }}</span>
                                    <span class="text-muted ms-2">({{ clinic.reviewsCount }} valoraciones)</span>
                                </div>
                                <div class="clinic-badges">
                                  <span v-for="(badge, idx) in clinic.badges" :key="idx" :class="['badge me-2', getBadgeClass(badge)]">
                                    <i :class="getBadgeIcon(badge)" class="me-1"></i>
                                    {{ badge }}
                                  </span>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="clinic-actions text-md-end mt-3 mt-md-0">
                                <button class="btn btn-outline-primary me-2">
                                    <i class="far fa-heart me-1"></i> Guardar
                                </button>
                                <button class="btn btn-primary" @click="openAppointmentModal">
                                    <i class="fas fa-calendar-plus me-1"></i> Agendar cita
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Galería de imágenes -->
            <div class="col-12 mb-4">
                <div class="clinic-gallery">
                    <div class="row g-3">
                        <div class="col-md-8">
                            <div class="gallery-main">
                                <img :src="API_URL_IMAGE + '/' + clinic.facade_photo" :alt="clinic.clinic_name" class="img-fluid rounded">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="row g-3">
                                <div class="col-md-12 col-6">
                                    <div class="gallery-thumb">
                                        <img src="/clinic/clinic_02.jpeg" alt="Imagen de clínica"
                                             class="img-fluid rounded">
                                    </div>
                                </div>
                                <div class="col-md-12 col-6">
                                    <div class="gallery-thumb position-relative">
                                        <img src="/clinic/clinic_03.jpeg" alt="Imagen de clínica"
                                             class="img-fluid rounded">
                                        <div class="more-photos">
                                            <span>+5 fotos</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Información principal y estadísticas -->
            <div class="col-lg-8 mb-4">
                <div class="clinic-info card">
                    <div class="card-body">
                        <h2 class="card-title">Acerca de la clínica</h2>
                        <p class="clinic-description">
                            {{ clinic.description }}
                        </p>

                        <h3 class="section-title mt-4">Servicios</h3>
                        <div class="clinic-services">
                            <div class="row">
                                <div v-for="(service, idx) in clinic.services" :key="idx"
                                     class="col-md-6 col-lg-4 mb-3">
                                    <div class="service-item">
                                        <i class="fas fa-check-circle text-success me-2"></i>
                                        {{ service }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 class="section-title mt-4">Horarios de atención</h3>
                        <div class="clinic-schedule">
                            <div class="row">
                                <div v-for="schedule in schedules" :key="schedule.id" class="col-md-6">
                                    <div class="schedule-item d-flex justify-content-between">
                                        <span class="badge bg-primary">{{ schedule.day_of_the_week }}</span>
                                        Desde {{ formatTime(schedule.start_time) }} hasta {{ formatTime(schedule.end_time) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar con estadísticas y contacto -->
            <div class="col-lg-4 mb-4">
                <div class="clinic-sidebar">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h3 class="card-title">Estadísticas</h3>
                            <div class="clinic-stats">
                                <div class="stat-item d-flex align-items-center mb-3">
                                    <div class="stat-icon bg-light-blue">
                                        <i class="fas fa-user-md text-blue"></i>
                                    </div>
                                    <div class="stat-info">
                                        <div class="stat-value">{{ clinic.doctors }}</div>
                                        <div class="stat-label">Médicos</div>
                                    </div>
                                </div>
                                <div class="stat-item d-flex align-items-center mb-3">
                                    <div class="stat-icon bg-light-green">
                                        <i class="fas fa-users text-green"></i>
                                    </div>
                                    <div class="stat-info">
                                        <div class="stat-value">+{{ clinic.patients }}</div>
                                        <div class="stat-label">Pacientes atendidos</div>
                                    </div>
                                </div>
                                <div class="stat-item d-flex align-items-center mb-3">
                                    <div class="stat-icon bg-light-purple">
                                        <i class="fas fa-calendar-check text-purple"></i>
                                    </div>
                                    <div class="stat-info">
                                        <div class="stat-value">{{ clinic.years_of_experience }}</div>
                                        <div class="stat-label">Años de experiencia</div>
                                    </div>
                                </div>
                                <div class="stat-item d-flex align-items-center">
                                    <div class="stat-icon bg-light-orange">
                                        <i class="fas fa-clinic-medical text-orange"></i>
                                    </div>
                                    <div class="stat-info">
                                        <div class="stat-value">{{ clinic.specialtiesCount }}</div>
                                        <div class="stat-label">Especialidades</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-4">
                        <div class="card-body">
                            <h3 class="card-title">Contacto</h3>
                            <div class="contact-info">
                                <div class="contact-item d-flex align-items-center mb-3">
                                    <div class="contact-icon">
                                        <i class="fas fa-phone"></i>
                                    </div>
                                    <div class="contact-detail">
                                        {{ clinic.phone }}
                                    </div>
                                </div>
                                <div class="contact-item d-flex align-items-center mb-3">
                                    <div class="contact-icon">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <div class="contact-detail">
                                        {{ clinic.email }}
                                    </div>
                                </div>
                                <div class="contact-item d-flex align-items-center">
                                    <div class="contact-icon">
                                        <i class="fas fa-globe"></i>
                                    </div>
                                    <div class="contact-detail">
                                        <a :href="clinic.website" target="_blank"
                                           rel="noopener noreferrer">{{ clinic.website || '' }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-body">
                            <h3 class="card-title">Ubicación</h3>
                            <div class="clinic-map rounded">
                                <div class="map-placeholder d-flex justify-content-center align-items-center">
                                    <i class="fas fa-map-marked-alt"></i>
                                    <span>Mapa no disponible</span>
                                </div>
                            </div>
                            <div class="clinic-address mt-3">
                                <i class="fas fa-map-marker-alt me-2"></i>
                                {{ clinic.fullAddress }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddAppointment ref="addNewAppointmentModal" :clinic="clinic" :schedules="schedules" />
        </div>
    </div>
</template>

<script>

import AddAppointment from "@/components/appointments/modules/AddAppointment.vue";
import swal from "sweetalert2";

const API_URL = process.env.VUE_APP_API_URL;
const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;

export default {
    name: 'ClinicaDetalle',
    components: {AddAppointment},
    data() {
        return {
            clinic: {
                id: 1,
                name: 'Clínica San Rafael',
                specialty: 'Medicina General',
                location: 'Col. Escalón, San Salvador',
                fullAddress: 'Av. La Revolución #123, Col. Escalón, San Salvador, El Salvador',
                doctors: 12,
                patients: 1240,
                rating: 4.8,
                reviewsCount: 156,
                yearsExperience: 15,
                specialtiesCount: 5,
                availability: 'Hoy',
                image: '/clinic/clinic_01.jpeg',
                phone: '+503 2222-3333',
                email: 'contacto@clinicasanrafael.com',
                website: 'www.clinicasanrafael.com',
                badges: ['Certificada', 'Recomendada'],
                description: 'Clínica San Rafael es un centro médico con más de 15 años de experiencia brindando servicios de salud de alta calidad. Contamos con médicos especialistas altamente capacitados y tecnología de vanguardia para ofrecer diagnósticos precisos y tratamientos efectivos. Nuestro objetivo es proporcionar atención médica integral y personalizada para el bienestar de nuestros pacientes.',
                services: [
                    'Consulta general',
                    'Exámenes médicos',
                    'Pediatría',
                    'Ginecología',
                    'Cardiología',
                    'Dermatología',
                    'Rayos X',
                    'Ultrasonografía',
                    'Laboratorio clínico'
                ],
                schedule: [
                    {day: 'Lunes', hours: '7:00 - 19:00', closed: false},
                    {day: 'Martes', hours: '7:00 - 19:00', closed: false},
                    {day: 'Miércoles', hours: '7:00 - 19:00', closed: false},
                    {day: 'Jueves', hours: '7:00 - 19:00', closed: false},
                    {day: 'Viernes', hours: '7:00 - 19:00', closed: false},
                    {day: 'Sábado', hours: '8:00 - 13:00', closed: false},
                    {day: 'Domingo', hours: '', closed: true}
                ]
            },
            API_URL_IMAGE: API_URL_IMAGE,
            schedules: [],
        };
    },
    mounted() {
        // En una implementación real, aquí cargaríamos los datos de la clínica
        // basados en el ID de la ruta
        const clinicId = this.$route.params.id;
        console.log('ID de la clínica:', clinicId);
        // Simularíamos una llamada a API: this.loadClinicData(clinicId);
        this.fetchClinic().then(() => {
            this.fetchSchedules();
        });
    },
    methods: {
        /*loadData(){
            this.clinic = JSON.parse(localStorage.getItem('clinics'))[this.$route.params.id];
        },*/
        formatTime(time) {
            const [hours, minutes] = time.split(':');
            const period = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM/PM
            return `${formattedHours}:${minutes} ${period}`;
        },
        async fetchClinic() {
            const response = await fetch(API_URL + '/medical-clinics/show/' + this.$route.params.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                console.error('Error al obtener clínicas:', response.statusText);
                return;
            }

            const data = await response.json();

            if (!data.status) {
                console.error('Error al obtener datos');
                return;
            }

            this.clinic = data.data;
        },
        getSpecialtyClass(specialty) {
            const classes = {
                'Medicina General': 'specialty-blue',
                'Cardiología': 'specialty-red',
                'Medicina Interna': 'specialty-green',
                'Pediatría': 'specialty-orange',
                'Neurología': 'specialty-purple',
                'Ginecología': 'specialty-pink',
                'Dermatología': 'specialty-pink'
            };
            return classes[specialty] || 'specialty-default';
        },
        getBadgeClass(badge) {
            const classes = {
                'Certificada': 'badge-certified',
                'Popular': 'badge-popular',
                'Recomendada': 'badge-recommended',
                'Nueva': 'badge-new'
            };
            return classes[badge] || 'badge-default';
        },
        getBadgeIcon(badge) {
            const icons = {
                'Certificada': 'fas fa-certificate',
                'Popular': 'fas fa-award',
                'Recomendada': 'fas fa-thumbs-up',
                'Nueva': 'fas fa-bolt'
            };
            return icons[badge] || 'fas fa-tag';
        },
        openAppointmentModal() {
            if (this.schedules.length === 0) {
                swal.fire({
                    icon: 'info',
                    title: 'Atención',
                    text: 'No hay horarios disponibles para esta clínica.',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
            this.$refs.addNewAppointmentModal.open();
        },
        async fetchSchedules() {
            try {
                const response = await fetch(`${API_URL}/schedules/get/clinic/` + this.clinic.id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (!data.status) {
                    console.log('Error', data);
                    return;
                }

                this.schedules = data.data;
                console.log(this.schedules);
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        },
    },
};
</script>

<style scoped>
/* Estilos generales */
.container {
    max-width: 1200px;
}

/* Breadcrumb */
.breadcrumb {
    background-color: transparent;
    padding: 0;
}

.breadcrumb-item a {
    color: #0d6efd;
    text-decoration: none;
}

.breadcrumb-item.active {
    color: #6c757d;
}

/* Encabezado de la clínica */
.clinic-header {
    margin-bottom: 20px;
}

.clinic-name {
    font-size: 2rem;
    font-weight: 700;
    color: #1a2b48;
}

.specialty-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
}

.specialty-blue {
    background-color: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
}

.specialty-red {
    background-color: rgba(220, 53, 69, 0.1);
    color: #dc3545;
}

.specialty-green {
    background-color: rgba(25, 135, 84, 0.1);
    color: #198754;
}

.specialty-orange {
    background-color: rgba(253, 126, 20, 0.1);
    color: #fd7e14;
}

.specialty-purple {
    background-color: rgba(111, 66, 193, 0.1);
    color: #6f42c1;
}

.specialty-pink {
    background-color: rgba(214, 51, 132, 0.1);
    color: #d63384;
}

.clinic-location {
    color: #6c757d;
    font-size: 0.95rem;
}

.clinic-rating {
    margin-bottom: 15px;
}

.stars i {
    color: #ffc107;
    font-size: 0.9rem;
}

.rating-value {
    font-weight: 600;
    color: #1a2b48;
}

.badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.75rem;
}

.badge-certified {
    background-color: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
}

.badge-popular {
    background-color: rgba(255, 193, 7, 0.1);
    color: #ffc107;
}

.badge-recommended {
    background-color: rgba(25, 135, 84, 0.1);
    color: #198754;
}

.badge-new {
    background-color: rgba(220, 53, 69, 0.1);
    color: #dc3545;
}

/* Botones de acción */
.clinic-actions .btn {
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.btn-outline-primary {
    color: #0d6efd;
    border-color: #0d6efd;
}

.btn-outline-primary:hover {
    background-color: #0d6efd;
    color: white;
}

.btn-primary {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.btn-primary:hover {
    background-color: #0b5ed7;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.25);
}

/* Galería de imágenes */
.clinic-gallery {
    margin-bottom: 30px;
}

.gallery-main img,
.gallery-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.gallery-main {
    height: 300px;
    overflow: hidden;
}

.gallery-thumb {
    height: 145px;
    overflow: hidden;
    position: relative;
}

.more-photos {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    border-radius: 8px;
}

/* Tarjetas de información */
.card {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border: none;
    overflow: hidden;
    margin-bottom: 20px;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a2b48;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;
}

.card-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background-color: #0d6efd;
    border-radius: 3px;
}

/* Detalles de la clínica */
.clinic-description {
    color: #6c757d;
    line-height: 1.6;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a2b48;
    margin-bottom: 15px;
}

.service-item {
    padding: 8px 0;
    color: #495057;
}

.service-item i {
    color: #198754;
}

.schedule-item {
    padding: 8px 0;
    color: #495057;
    border-bottom: 1px solid #f1f1f1;
}

.schedule-item:last-child {
    border-bottom: none;
}

.day {
    font-weight: 500;
}

.hours {
    color: #6c757d;
}

/* Estadísticas en el sidebar */
.stat-item {
    margin-bottom: 15px;
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    transition: all 0.3s ease;
}

.stat-icon i {
    font-size: 1.25rem;
}

.bg-light-blue {
    background: linear-gradient(145deg, #E0F2FE, #dceefb);
}

.text-blue {
    color: #0d6efd;
}

.bg-light-green {
    background: linear-gradient(145deg, #DCFCE7, #d2f5de);
}

.text-green {
    color: #198754;
}

.bg-light-purple {
    background: linear-gradient(145deg, #EDE9FE, #e5e1fa);
}

.text-purple {
    color: #6f42c1;
}

.bg-light-orange {
    background: linear-gradient(145deg, #FFF7ED, #fff1e1);
}

.text-orange {
    color: #fd7e14;
}

.stat-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a2b48;
}

.stat-label {
    font-size: 0.85rem;
    color: #6c757d;
}

/* Información de contacto */
.contact-item {
    padding: 8px 0;
}

.contact-icon {
    width: 36px;
    height: 36px;
    background-color: #f8f9fa;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    color: #0d6efd;
}

.contact-detail {
    color: #495057;
}

.contact-detail a {
    color: #0d6efd;
    text-decoration: none;
}

/* Mapa */
.clinic-map {
    height: 180px;
    background-color: #f8f9fa;
    margin-bottom: 10px;
    overflow: hidden;
}

.map-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #6c757d;
    gap: 10px;
}

.map-placeholder i {
    font-size: 2rem;
    color: #0d6efd;
}

.clinic-address {
    font-size: 0.9rem;
    color: #6c757d;
}

/* Responsividad */
@media (max-width: 992px) {
    .gallery-main {
        height: 250px;
    }

    .gallery-thumb {
        height: 120px;
    }
}

@media (max-width: 768px) {
    .clinic-name {
        font-size: 1.5rem;
    }

    .clinic-actions {
        text-align: left;
        margin-top: 20px;
    }

    .gallery-main {
        height: 200px;
        margin-bottom: 15px;
    }
}
</style> 