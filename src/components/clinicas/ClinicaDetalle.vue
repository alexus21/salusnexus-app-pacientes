<template>
    <div class="clinic-detail-page">
        <!-- Hero Section with Background Overlay -->
        <div class="clinic-hero" :style="`background-image: url('${API_URL_IMAGE}/${clinic.facade_photo}')`">
            <div class="overlay"></div>
            <div class="container position-relative">
                <!-- Breadcrumb -->
                <nav aria-label="breadcrumb" class="breadcrumb-container">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <router-link :to="{ name: 'loginHome' }">
                                <i class="fas fa-home"></i> Clínicas
                            </router-link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">{{ clinic.clinic_name }}</li>
                    </ol>
                </nav>

                <!-- Loading State -->
                <div v-if="loading" class="loading-container">
                    <div class="spinner-border text-light" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="text-light mt-3">Cargando información de la clínica...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="error-container">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        {{ error }}
                    </div>
                    <button class="btn btn-primary" @click="fetchClinic">
                        <i class="fas fa-sync-alt me-2"></i> Reintentar
                    </button>
                </div>

                <!-- Clinic Header Info -->
                <div v-else class="clinic-hero-content">
                    <div class="clinic-specialty">
                        <span class="specialty-badge" :class="getSpecialtyClass(clinic.speciality_name)">
                            {{ clinic.speciality_name }}
                        </span>
                    </div>
                    <h1 class="clinic-name">{{ clinic.clinic_name }}</h1>
                    <div class="clinic-meta">
                        <div class="meta-item location">
                            <i class="fas fa-map-marker-alt"></i>
                            {{ clinic.address }}, {{clinic.city_name}}
                        </div>
<!--                        <div class="meta-item rating">
                            <div class="stars">
                                <i v-for="n in 5" :key="n"
                                    :class="['fas', n <= Math.floor(clinic.rating) ? 'fa-star' : (n - 0.5 <= clinic.rating ? 'fa-star-half-alt' : 'far fa-star')]"></i>
                            </div>
                            <span class="rating-value">{{ clinic.rating }}</span>
                            <span class="reviews-count">({{ clinic.reviewsCount }} valoraciones)</span>
                        </div>-->
                        <div class="clinic-badges">
                            <span v-for="(badge, idx) in clinic.badges" :key="idx" :class="['badge', getBadgeClass(badge)]">
                                <i :class="getBadgeIcon(badge)"></i>
                                {{ badge }}
                            </span>
                        </div>
                    </div>
                    <div class="hero-actions">
                        <button class="btn btn-light btn-icon">
                            <i class="far fa-heart"></i>
                            <span>Guardar</span>
                        </button>
                        <button 
                            v-if="clinic.subscription_type !== 'profesional_gratis'"
                            class="btn btn-primary btn-icon" 
                            @click="openAppointmentModal">
                            <i class="fas fa-calendar-plus"></i>
                            <span>Agendar cita</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container py-5">
            <!-- Main Content Area -->
            <div class="row g-4" v-if="!loading && !error">
                <div class="col-lg-8">
                    <!-- Gallery Section -->
                    <div class="card mb-4">
                        <div class="card-body p-0">
                            <div class="gallery-grid">
                                <div class="gallery-main">
                                    <img :src="API_URL_IMAGE + '/' + clinic.facade_photo" :alt="clinic.clinic_name" class="rounded">
                                    <div class="image-label">Fachada</div>
                                </div>
                                <div class="gallery-item">
                                    <img :src="API_URL_IMAGE + '/' + clinic.waiting_room_photo" :alt="clinic.clinic_name" class="rounded">
                                    <div class="image-label">Sala de espera</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- About Section -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="section-heading">
                                <h2>Acerca de la clínica</h2>
                            </div>
                            <p class="clinic-description">
                                {{ clinic.description }}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Services Section -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="section-heading">
                                <h2>Servicios</h2>
                            </div>
                            <div class="services-grid">
                                <div v-for="(service, idx) in clinic.services" :key="idx" class="service-item">
                                    <div class="service-icon">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="service-text">{{ service }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Reviews Section -->
                    <div class="card mb-4 reviews-card">
                        <div class="card-body">
                            <div class="section-heading d-flex justify-content-between align-items-center">
                                <h2>Reseñas y Valoraciones</h2>
                                <div class="reviews-summary" v-if="reviews.length > 0">
                                    <div class="rating-overview">
                                        <div class="rating-score">
                                            {{ averageRating.toFixed(1) }}
                                            <span class="rating-max">/5</span>
                                        </div>
                                        <div class="rating-stars">
                                            <i v-for="n in 5" :key="n" 
                                               :class="['fas', n <= Math.round(averageRating) ? 'fa-star' : 'fa-star text-muted opacity-25']"></i>
                                        </div>
                                        <div class="rating-count">{{ reviews.length }} valoraciones</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Loading state -->
                            <div v-if="loadingReviews" class="reviews-loading text-center py-4">
                                <div class="spinner-pulse"></div>
                                <p class="mt-3 text-muted">Cargando reseñas...</p>
                            </div>

                            <!-- Empty state -->
                            <div v-else-if="reviews.length === 0" class="reviews-empty text-center py-4">
                                <div class="empty-icon">
                                    <i class="far fa-comment-dots"></i>
                                </div>
                                <h4 class="mt-3">No hay reseñas disponibles</h4>
                                <p class="text-muted">Esta clínica aún no tiene reseñas de pacientes.</p>
                            </div>

                            <!-- Reviews list -->
                            <div v-else class="reviews-container">
                                <div class="rating-bars mb-4">
                                    <div v-for="star in 5" :key="star" class="rating-bar-item">
                                        <div class="rating-label">{{ star }} <i class="fas fa-star"></i></div>
                                        <div class="rating-bar-container">
                                            <div class="rating-bar" :style="`width: ${getRatingPercentage(star)}%`"></div>
                                        </div>
                                        <div class="rating-count">{{ getStarCount(star) }}</div>
                                    </div>
                                </div>

                                <div class="reviews-list">
                                    <div v-for="review in reviews" :key="review.id" class="review-item">
                                        <div class="review-header">
                                            <div class="reviewer-info">
                                                <div class="reviewer-avatar">
                                                    <img :src="getProfileImage(review.profile_photo_path)" 
                                                         :alt="review.patient_first_name"
                                                         @error="handleAvatarError">
                                                </div>
                                                <div class="reviewer-details">
                                                    <h5 class="reviewer-name">{{ review.patient_first_name }} {{ review.patient_last_name }}</h5>
                                                    <div class="review-date">{{ formatReviewDate(review.review_datetime) }}</div>
                                                </div>
                                            </div>
                                            <div class="review-rating">
                                                <i v-for="n in 5" :key="n" 
                                                   :class="['fas', 'fa-star', n <= review.rating ? 'active' : '']"></i>
                                            </div>
                                        </div>
                                        <div v-if="review.comment" class="review-content">
                                            <p>{{ review.comment }}</p>
                                        </div>
                                        <div v-if="review.professional_response" class="review-response">
                                            <div class="response-header">
                                                <i class="fas fa-reply me-2"></i>
                                                <span>Respuesta del profesional</span>
                                                <small class="ms-2 text-muted" v-if="review.response_datetime">
                                                    {{ formatReviewDate(review.response_datetime) }}
                                                </small>
                                            </div>
                                            <p>{{ review.professional_response }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Schedule Section -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="section-heading">
                                <h2>Horarios de atención</h2>
                            </div>
                            <div class="schedule-grid">
                                <div v-for="schedule in schedules" :key="schedule.id" class="schedule-item">
                                    <div class="day-badge">{{ schedule.day_of_the_week }}</div>
                                    <div class="schedule-time">
                                        <i class="far fa-clock"></i>
                                        {{ formatTime(schedule.start_time) }} - {{ formatTime(schedule.end_time) }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="col-lg-4">
                    <!-- Stats Card -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="section-heading">
                                <h2>Estadísticas</h2>
                            </div>
                            <div class="stats-container">
                                <div class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-calendar-check"></i>
                                    </div>
                                    <div class="stat-content">
                                        <div class="stat-number">{{ clinic.years_of_experience }}</div>
                                        <div class="stat-label">Años de experiencia</div>
                                    </div>
                                </div>
                                
                                <div v-if="clinic.doctors" class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-user-md"></i>
                                    </div>
                                    <div class="stat-content">
                                        <div class="stat-number">{{ clinic.doctors }}</div>
                                        <div class="stat-label">Médicos</div>
                                    </div>
                                </div>
                                
                                <div v-if="clinic.patients" class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="stat-content">
                                        <div class="stat-number">+{{ clinic.patients }}</div>
                                        <div class="stat-label">Pacientes atendidos</div>
                                    </div>
                                </div>
                                
                                <div v-if="clinic.specialtiesCount" class="stat-card">
                                    <div class="stat-icon">
                                        <i class="fas fa-stethoscope"></i>
                                    </div>
                                    <div class="stat-content">
                                        <div class="stat-number">{{ clinic.specialtiesCount }}</div>
                                        <div class="stat-label">Especialidades</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Card -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="section-heading">
                                <h2>Contacto</h2>
                            </div>
                            <ul class="contact-list">
                                <li class="contact-item">
                                    <div class="contact-icon">
                                        <i class="fas fa-phone"></i>
                                    </div>
                                    <div class="contact-content">
                                        <a :href="`tel:${clinic.phone}`">{{ clinic.phone }}</a>
                                    </div>
                                </li>
                                <li class="contact-item">
                                    <div class="contact-icon">
                                        <i class="fas fa-envelope"></i>
                                    </div>
                                    <div class="contact-content">
                                        <a :href="`mailto:${clinic.email}`">{{ clinic.email }}</a>
                                    </div>
                                </li>
                                <li v-if="clinic.website" class="contact-item">
                                    <div class="contact-icon">
                                        <i class="fas fa-globe"></i>
                                    </div>
                                    <div class="contact-content">
                                        <a :href="clinic.website" target="_blank" rel="noopener noreferrer">
                                            {{ clinic.website }}
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Location Card -->
                    <div class="card">
                        <div class="card-body">
                            <div class="section-heading">
                                <h2>Ubicación</h2>
                            </div>
                            <div class="location-map">
                                <div class="map-placeholder">
                                    <i class="fas fa-map-marked-alt"></i>
                                    <span>Mapa no disponible</span>
                                </div>
                            </div>
                            <div class="location-address">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>{{ clinic.fullAddress }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Appointment Modal -->
        <AddAppointment ref="addNewAppointmentModal" :clinic="clinic" :schedules="schedules" />
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
                id: null,
                clinic_name: '',
                speciality_name: '',
                address: '',
                city_name: '',
                rating: 0,
                reviewsCount: 0,
                badges: [],
                description: '',
                services: [],
                doctors: 0,
                patients: 0,
                years_of_experience: 0,
                specialtiesCount: 0,
                facade_photo: '',
                phone: '',
                email: '',
                website: '',
                fullAddress: ''
            },
            API_URL_IMAGE: API_URL_IMAGE,
            schedules: [],
            loading: true,
            error: null,
            reviews: [],
            loadingReviews: true,
            reviewStats: {
                average: 0,
                total: 0,
                distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            }
        };
    },
    computed: {
        averageRating() {
            return this.reviewStats.average;
        }
    },
    created() {
        // Get clinic ID from route params
        const clinicId = this.$route.params.id;
        
        if (!clinicId) {
            this.error = "ID de clínica no proporcionado";
            this.loading = false;
            return;
        }
        
        // Fetch clinic data
        this.fetchClinic();
    },
    methods: {
        formatTime(time) {
            const [hours, minutes] = time.split(':');
            const period = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM/PM
            return `${formattedHours}:${minutes} ${period}`;
        },
        async fetchClinic() {
            try {
                this.loading = true;
                
                const clinicId = this.$route.params.id;
                console.log('Fetching clinic with ID:', clinicId);
                
                const response = await fetch(`${API_URL}/medical-clinics/show/${clinicId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error de respuesta: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();

                if (!data.status) {
                    throw new Error('Error en la respuesta API: ' + (data.message || 'Sin mensaje'));
                }

                this.clinic = data.data;
                
                // Set fullAddress if not provided by API
                if (!this.clinic.fullAddress && this.clinic.address) {
                    this.clinic.fullAddress = `${this.clinic.address}, ${this.clinic.city_name || ''}`;
                }
                
                // Fetch schedules after clinic data loads successfully
                this.fetchSchedules();
                
                // Fetch reviews
                this.fetchReviews();
                
            } catch (error) {
                console.error('Error al obtener datos de la clínica:', error);
                this.error = `Error al cargar la clínica: ${error.message}`;
            } finally {
                this.loading = false;
            }
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
                if (!this.clinic.id) {
                    console.warn('No clinic ID available for fetching schedules');
                    return;
                }
                
                const response = await fetch(`${API_URL}/schedules/get/clinic/${this.clinic.id}`, {
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
                    console.error('Error fetching schedules:', data);
                    return;
                }

                this.schedules = data.data;
            } catch (error) {
                console.error("Error fetching schedules:", error);
            }
        },
        async fetchReviews() {
            try {
                this.loadingReviews = true;
                const clinicId = this.$route.params.id;
                
                if (!clinicId) {
                    console.warn('No clinic ID available for fetching reviews');
                    this.loadingReviews = false;
                    return;
                }
                
                const response = await fetch(`${API_URL}/reviews/get/by-clinic/${clinicId}`, {
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
                
                // Set reviews
                this.reviews = data.data || [];
                
                // Calculate review statistics
                this.calculateReviewStats();
                
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                this.loadingReviews = false;
            }
        },
        calculateReviewStats() {
            // Reset statistics
            this.reviewStats = {
                average: 0,
                total: this.reviews.length,
                distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
            };
            
            if (this.reviews.length === 0) return;
            
            // Calculate total rating
            let totalRating = 0;
            
            // Count ratings by star
            this.reviews.forEach(review => {
                totalRating += review.rating;
                
                // Increment the count for this rating
                if (review.rating >= 1 && review.rating <= 5) {
                    this.reviewStats.distribution[review.rating]++;
                }
            });
            
            // Calculate average
            this.reviewStats.average = totalRating / this.reviews.length;
        },
        getRatingPercentage(star) {
            if (this.reviewStats.total === 0) return 0;
            
            const count = this.reviewStats.distribution[star] || 0;
            return (count / this.reviewStats.total) * 100;
        },
        getStarCount(star) {
            return this.reviewStats.distribution[star] || 0;
        },
        getProfileImage(photoPath) {
            if (!photoPath) return 'https://via.placeholder.com/150?text=Usuario';
            return `${API_URL_IMAGE}/${photoPath}`;
        },
        handleAvatarError(event) {
            event.target.src = 'https://via.placeholder.com/150?text=Usuario';
        },
        formatReviewDate(dateString) {
            if (!dateString) return '';
            
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (error) {
                console.error('Error formatting date:', error);
                return dateString;
            }
        }
    },
};
</script>

<style scoped>
/* General Styles */
.clinic-detail-page {
    background-color: #f8f9fa;
    color: #212529;
    font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    min-height: 100vh;
}

/* Hero Section */
.clinic-hero {
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 400px;
    display: flex;
    align-items: flex-end;
    padding-bottom: 2rem;
    color: white;
    transition: all 0.5s ease;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8));
    z-index: 1;
}

.clinic-hero .container {
    position: relative;
    z-index: 2;
}

/* Breadcrumb */
.breadcrumb-container {
    padding-top: 1.5rem;
}

.breadcrumb {
    background-color: transparent;
    padding: 0;
    margin-bottom: 2rem;
}

.breadcrumb-item a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
}

.breadcrumb-item a:hover {
    color: white;
}

.breadcrumb-item.active {
    color: rgba(255, 255, 255, 0.7);
}

.breadcrumb-item+.breadcrumb-item::before {
    color: rgba(255, 255, 255, 0.6);
}

/* Loading & Error States */
.loading-container, .error-container {
    text-align: center;
    padding: 3rem 0;
    animation: fadeIn 0.5s ease;
}

/* Hero Content */
.clinic-hero-content {
    max-width: 800px;
    animation: fadeInUp 0.5s ease-out;
}

.clinic-name {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
}

.clinic-meta {
    margin-bottom: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: center;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
}

.meta-item i {
    color: rgba(255, 255, 255, 0.8);
}

.meta-item.rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.stars {
    display: flex;
    color: #FFD700;
    font-size: 1rem;
}

.rating-value {
    font-weight: 600;
    font-size: 1rem;
}

.reviews-count {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
}

.clinic-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.4rem 0.8rem;
    border-radius: 50px;
    font-weight: 500;
    font-size: 0.8rem;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    transition: all 0.3s ease;
}

.badge:hover {
    transform: translateY(-2px);
    background-color: rgba(255, 255, 255, 0.3);
}

.hero-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.btn-icon {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    border-radius: 50px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-light {
    background-color: rgba(255, 255, 255, 0.9);
    color: #444;
    border: none;
}

.btn-light:hover {
    background-color: white;
    transform: translateY(-2px);
}

.btn-primary {
    background-color: #0d6efd;
    border: none;
}

.btn-primary:hover {
    background-color: #0b5ed7;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
}

/* Specialty Badge */
.specialty-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
}

.specialty-blue {
    background-color: rgba(13, 110, 253, 0.8);
}

.specialty-red {
    background-color: rgba(220, 53, 69, 0.8);
}

.specialty-green {
    background-color: rgba(25, 135, 84, 0.8);
}

.specialty-orange {
    background-color: rgba(253, 126, 20, 0.8);
}

.specialty-purple {
    background-color: rgba(111, 66, 193, 0.8);
}

.specialty-pink {
    background-color: rgba(214, 51, 132, 0.8);
}

.specialty-default {
    background-color: rgba(108, 117, 125, 0.8);
}

/* Badge classes */
.badge-certified {
    background-color: rgba(13, 110, 253, 0.8);
}

.badge-popular {
    background-color: rgba(255, 193, 7, 0.8);
}

.badge-recommended {
    background-color: rgba(25, 135, 84, 0.8);
}

.badge-new {
    background-color: rgba(220, 53, 69, 0.8);
}

.badge-default {
    background-color: rgba(108, 117, 125, 0.8);
}

/* Cards Styling */
.card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    transition: all 0.3s ease;
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
}

.card:nth-child(2) {
    animation-delay: 0.1s;
}

.card:nth-child(3) {
    animation-delay: 0.2s;
}

.card:nth-child(4) {
    animation-delay: 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.card-body {
    padding: 1.5rem;
}

.section-heading {
    margin-bottom: 1.2rem;
    position: relative;
}

.section-heading h2 {
    font-size: 1.4rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 0;
    position: relative;
    display: inline-block;
}

.section-heading h2::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.5rem;
    width: 40px;
    height: 3px;
    background-color: #0d6efd;
    border-radius: 3px;
}

/* Gallery */
.gallery-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 1rem;
    height: 320px;
    padding: 1rem;
}

.gallery-main, .gallery-item {
    position: relative;
    height: 100%;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.gallery-main:hover, .gallery-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.gallery-main img, .gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.gallery-main:hover img, .gallery-item:hover img {
    transform: scale(1.05);
}

.image-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.8rem 1rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.9;
    transition: all 0.3s ease;
}

.gallery-main:hover .image-label, .gallery-item:hover .image-label {
    padding-bottom: 1.2rem;
    opacity: 1;
}

/* Description */
.clinic-description {
    color: #6c757d;
    line-height: 1.7;
    font-size: 1rem;
}

/* Services */
.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.service-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.7rem;
    border-radius: 10px;
    transition: all 0.2s ease;
}

.service-item:hover {
    background-color: rgba(13, 110, 253, 0.05);
    transform: translateX(5px);
}

.service-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(25, 135, 84, 0.1);
    color: #198754;
}

.service-text {
    font-size: 0.95rem;
    color: #495057;
}

/* Schedule */
.schedule-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
}

.schedule-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-radius: 10px;
    background-color: #f8f9fa;
    transition: all 0.2s ease;
}

.schedule-item:hover {
    background-color: rgba(13, 110, 253, 0.05);
    transform: translateX(5px);
}

.day-badge {
    display: inline-block;
    padding: 0.3rem 0.8rem;
    background-color: #0d6efd;
    color: white;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
}

.schedule-time {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #495057;
    font-size: 0.9rem;
}

/* Stats */
.stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 1rem;
}

.stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
    padding: 1.2rem 0.8rem;
    border-radius: 10px;
    background-color: #f8f9fa;
    transition: all 0.3s ease;
    text-align: center;
}

.stat-card:hover {
    background-color: #0d6efd;
    color: white;
    transform: translateY(-5px);
}

.stat-card:hover .stat-icon {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
}

.stat-card:hover .stat-number,
.stat-card:hover .stat-label {
    color: white;
}

.stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
    font-size: 1.2rem;
    transition: all 0.3s ease;
}

.stat-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #212529;
    transition: all 0.3s ease;
}

.stat-label {
    font-size: 0.85rem;
    color: #6c757d;
    transition: all 0.3s ease;
}

/* Contact list */
.contact-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 10px;
    transition: all 0.2s ease;
}

.contact-item:hover {
    background-color: rgba(13, 110, 253, 0.05);
    transform: translateX(5px);
}

.contact-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
}

.contact-content a {
    color: #495057;
    text-decoration: none;
    transition: color 0.2s ease;
}

.contact-content a:hover {
    color: #0d6efd;
}

/* Location */
.location-map {
    height: 180px;
    background-color: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 1rem;
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
    gap: 0.5rem;
    font-size: 0.9rem;
}

.map-placeholder i {
    font-size: 2rem;
    color: #0d6efd;
    animation: pulse 1.5s infinite ease-in-out;
}

.location-address {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    color: #495057;
    font-size: 0.9rem;
    padding: 0.5rem;
}

.location-address i {
    color: #0d6efd;
    margin-top: 0.2rem;
}

/* Reviews Styling */
.reviews-card {
    overflow: visible;
}

.reviews-summary {
    display: flex;
    align-items: center;
    justify-content: center;
}

.rating-overview {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    padding: 0.8rem;
    background-color: #f8f9fa;
    transition: all 0.3s ease;
}

.rating-overview:hover {
    background-color: #e9ecef;
}

.rating-score {
    font-size: 2rem;
    font-weight: 700;
    color: #0d6efd;
    line-height: 1;
}

.rating-max {
    font-size: 1rem;
    color: #adb5bd;
    font-weight: 400;
}

.rating-stars {
    margin: 0.5rem 0;
    color: #ffc107;
    font-size: 1.2rem;
}

.rating-count {
    font-size: 0.85rem;
    color: #6c757d;
}

.reviews-loading {
    animation: fadeIn 0.5s ease;
}

.spinner-pulse {
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #0d6efd;
    opacity: 0.7;
    animation: pulse 1.5s infinite ease-in-out;
}

.reviews-empty {
    animation: fadeIn 0.5s ease;
}

.empty-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border-radius: 50%;
    background-color: #f8f9fa;
    color: #adb5bd;
    font-size: 1.5rem;
}

.rating-bars {
    padding: 1rem 0;
    border-bottom: 1px solid #e9ecef;
}

.rating-bar-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.rating-label {
    min-width: 40px;
    font-size: 0.9rem;
    color: #6c757d;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.rating-label i {
    color: #ffc107;
    font-size: 0.8rem;
}

.rating-bar-container {
    flex: 1;
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
}

.rating-bar {
    height: 100%;
    background-color: #0d6efd;
    border-radius: 4px;
    transition: width 1s ease-in-out;
}

.rating-count {
    min-width: 30px;
    text-align: right;
    font-size: 0.9rem;
    color: #6c757d;
}

.reviews-list {
    margin-top: 1.5rem;
}

.review-item {
    padding: 1.2rem;
    border-radius: 12px;
    background-color: #f8f9fa;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
    animation: fadeInUp 0.5s ease-out;
    animation-fill-mode: both;
}

.review-item:nth-child(1) {
    animation-delay: 0.1s;
}

.review-item:nth-child(2) {
    animation-delay: 0.2s;
}

.review-item:nth-child(3) {
    animation-delay: 0.3s;
}

.review-item:nth-child(4) {
    animation-delay: 0.4s;
}

.review-item:nth-child(5) {
    animation-delay: 0.5s;
}

.review-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    background-color: white;
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.reviewer-info {
    display: flex;
    align-items: center;
    gap: 0.8rem;
}

.reviewer-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #e9ecef;
    transition: all 0.3s ease;
}

.reviewer-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.review-item:hover .reviewer-avatar {
    border-color: #0d6efd;
}

.reviewer-details {
    display: flex;
    flex-direction: column;
}

.reviewer-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
    color: #212529;
}

.review-date {
    font-size: 0.8rem;
    color: #6c757d;
}

.review-rating {
    display: flex;
    gap: 0.2rem;
    font-size: 0.9rem;
    color: #ced4da;
}

.review-rating i.active {
    color: #ffc107;
}

.review-content {
    margin-bottom: 1rem;
    color: #6c757d;
    font-size: 0.95rem;
    line-height: 1.6;
}

.review-response {
    background-color: #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    margin-top: 0.5rem;
}

.response-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #495057;
}

.review-response p {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 0;
    line-height: 1.6;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        opacity: 0.7;
    }
    50% {
        transform: scale(1.05);
        opacity: 1;
    }
    100% {
        transform: scale(0.95);
        opacity: 0.7;
    }
}

/* Responsive Adjustments */
@media (max-width: 992px) {
    .clinic-name {
        font-size: 2rem;
    }
    
    .gallery-grid {
        height: 280px;
    }
    
    .stats-container {
        grid-template-columns: repeat(2, 1fr);
    }

    .reviews-summary {
        margin-top: 1rem;
    }

    .section-heading {
        flex-direction: column;
        align-items: flex-start;
    }
}

@media (max-width: 768px) {
    .clinic-hero {
        min-height: 300px;
    }
    
    .clinic-name {
        font-size: 1.8rem;
    }
    
    .meta-item {
        font-size: 0.9rem;
    }
    
    .hero-actions {
        flex-direction: column;
        width: 100%;
    }
    
    .hero-actions .btn {
        width: 100%;
        justify-content: center;
    }
    
    .gallery-grid {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
        height: auto;
        gap: 1rem;
    }
    
    .gallery-main, .gallery-item {
        height: 220px;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
    }
    
    .schedule-grid {
        grid-template-columns: 1fr;
    }

    .review-header {
        flex-direction: column;
        gap: 0.5rem;
    }

    .review-rating {
        align-self: flex-start;
    }
}

@media (max-width: 576px) {
    .clinic-hero {
        min-height: 250px;
    }
    
    .clinic-name {
        font-size: 1.5rem;
    }
    
    .specialty-badge {
        font-size: 0.75rem;
        padding: 0.4rem 0.8rem;
    }
    
    .badge {
        font-size: 0.7rem;
    }
    
    .section-heading h2 {
        font-size: 1.2rem;
    }
    
    .stats-container {
        grid-template-columns: 1fr 1fr;
    }

    .reviewer-avatar {
        width: 40px;
        height: 40px;
    }

    .reviewer-name {
        font-size: 0.9rem;
    }
}
</style> 