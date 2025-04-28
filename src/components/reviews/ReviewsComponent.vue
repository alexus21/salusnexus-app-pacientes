<template>
    <div>
        <!-- Custom Header (similar to ClinicasComponent) -->
        <div class="custom-header">
            <div class="container-fluid">
                <div class="header-content">
                    <!-- Logo section -->
                    <div class="header-logo">
                        <i class="fas fa-heartbeat text-primary me-2"></i>
                        <span class="header-title">Salus Nexus</span>
                    </div>

                    <!-- User profile section -->
                    <div class="header-user">
                        <!-- Profile dropdown -->
                        <div class="dropdown">
                            <!-- Show profile image if available -->
                            <img
                                v-if="hasProfileImage"
                                :src="userProfileImage"
                                class="profile-image dropdown-toggle"
                                id="profileDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                alt="Perfil"
                            >
                            <!-- Show initials if no profile image -->
                            <div
                                v-else
                                class="profile-initials dropdown-toggle"
                                id="profileDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {{ userInitials }}
                            </div>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                                <li>
                                    <router-link to="/perfil" class="dropdown-item">
                                        <i class="fas fa-user me-2"></i> Ir al perfil
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="/loginHome" class="dropdown-item">
                                        <i class="fas fa-clinic-medical me-2"></i> Clínicas
                                    </router-link>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#" @click.prevent="logout">
                                        <i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-container">
            <!-- Page Title and Description -->
            <div class="reviews-header">
                <div class="reviews-header-content">
                    <h1 class="reviews-title">Mis Reseñas Médicas</h1>
                    <p class="reviews-description">
                        Gestiona y visualiza las valoraciones que has dado a tus citas médicas
                    </p>
                </div>
            </div>

            <!-- Stats Cards Row -->
            <div class="stats-row">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="stats-content">
                        <h3 class="stats-value">{{ averageRating }}</h3>
                        <p class="stats-label">Valoración media</p>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="fas fa-clipboard-check"></i>
                    </div>
                    <div class="stats-content">
                        <h3 class="stats-value">{{ totalAppointments }}</h3>
                        <p class="stats-label">Citas completadas</p>
                    </div>
                </div>

                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="fas fa-hospital"></i>
                    </div>
                    <div class="stats-content">
                        <h3 class="stats-value">{{ uniqueClinics }}</h3>
                        <p class="stats-label">Clínicas visitadas</p>
                    </div>
                </div>
            </div>

            <!-- Filters and Search -->
            <div class="filters-container">
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="Buscar por nombre de clínica o doctor..."
                        class="search-input"
                        @input="filterReviews"
                    >
                </div>

                <div class="filter-buttons">
                    <button
                        v-for="(filter, index) in filterOptions"
                        :key="index"
                        :class="['filter-btn', { active: activeFilter === filter.value }]"
                        @click="setFilter(filter.value)"
                    >
                        <i :class="filter.icon"></i> {{ filter.label }}
                    </button>
                </div>
            </div>

            <!-- Reviews Container -->
            <div class="reviews-container">
                <!-- Loading State -->
                <div v-if="isLoading" class="loading-state">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando tus reseñas...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="filteredAppointments.length === 0" class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-comment-slash"></i>
                    </div>
                    <h3 class="empty-title">No se encontraron reseñas</h3>
                    <p class="empty-message">
                        {{ emptyStateMessage }}
                    </p>
                </div>

                <!-- Reviews List -->
                <div v-else class="reviews-list">
                    <review-card
                        v-for="appointment in filteredAppointments"
                        :key="appointment.appointment_id"
                        :appointment="appointment"
                        @update-rating="updateRating"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ReviewCard from './ReviewCard.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';

const API_URL = process.env.VUE_APP_API_URL;
const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;

export default {
    name: 'ReviewsComponent',
    components: {
        ReviewCard
    },
    data() {
        return {
            appointments: [],
            isLoading: true,
            hasProfileImage: false,
            userProfileImage: '',
            userData: null,
            searchQuery: '',
            activeFilter: 'all',
            filterOptions: [
                {label: 'Todas', value: 'all', icon: 'fas fa-th-list'},
                {label: 'Con Reseña', value: 'reviewed', icon: 'fas fa-star'},
                {label: 'Sin Reseña', value: 'unreviewed', icon: 'fas fa-star-half-alt'},
                {label: 'Recientes', value: 'recent', icon: 'fas fa-clock'}
            ]
        };
    },
    computed: {
        userInitials() {
            if (!this.userData) return '??';

            const firstName = this.userData.first_name || '';
            const lastName = this.userData.last_name || '';

            const firstInitial = firstName.charAt(0).toUpperCase();
            const lastInitial = lastName.charAt(0).toUpperCase();

            return firstInitial + lastInitial;
        },
        filteredAppointments() {
            let result = [...this.appointments];

            // Apply search filter
            if (this.searchQuery.trim() !== '') {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(appointment =>
                    appointment.clinic_name.toLowerCase().includes(query) ||
                    `${appointment.first_name} ${appointment.last_name}`.toLowerCase().includes(query)
                );
            }

            // Apply category filter
            if (this.activeFilter === 'reviewed') {
                result = result.filter(appointment => appointment.rating !== null);
            } else if (this.activeFilter === 'unreviewed') {
                result = result.filter(appointment => appointment.rating === null);
            } else if (this.activeFilter === 'recent') {
                result.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
            }

            return result;
        },
        averageRating() {
            const ratedAppointments = this.appointments.filter(app => app.rating !== null);
            if (ratedAppointments.length === 0) return '0.0';

            const sum = ratedAppointments.reduce((total, app) => total + app.rating, 0);
            return (sum / ratedAppointments.length).toFixed(1);
        },
        totalAppointments() {
            return this.appointments.length;
        },
        uniqueClinics() {
            const clinicIds = new Set(this.appointments.map(app => app.clinic_id));
            return clinicIds.size;
        },
        emptyStateMessage() {
            if (this.appointments.length === 0) {
                return 'Aún no has tenido citas médicas para valorar. Cuando tengas citas completadas, aparecerán aquí.';
            }

            if (this.activeFilter === 'reviewed') {
                return 'No has valorado ninguna de tus citas todavía. ¡Añade tu primera valoración!';
            }

            if (this.activeFilter === 'unreviewed') {
                return '¡Felicidades! Has valorado todas tus citas médicas.';
            }

            return 'No se encontraron resultados para tu búsqueda. Intenta con otros términos.';
        }
    },
    async mounted() {
        await this.checkUserProfile();
        await this.loadUserProfileImage();
        await this.fetchAppointments();

        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    },
    methods: {
        async checkUserProfile() {
            try {
                this.userData = JSON.parse(localStorage.getItem('user'));
                if (!this.userData) {
                    const response = await fetch(`${API_URL}/userprofile`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) {
                        return;
                    }

                    const data = await response.json();
                    if (!data.status) {
                        return;
                    }

                    this.userData = data.data;
                    localStorage.setItem('user', JSON.stringify(this.userData));
                }
            } catch (error) {
                console.error('Error checking user profile:', error);
            }
        },

        async loadUserProfileImage() {
            try {
                if (!this.userData) {
                    this.userData = JSON.parse(localStorage.getItem('user'));
                }

                if (this.userData && this.userData.profile_photo_path) {
                    this.userProfileImage = `${API_URL_IMAGE}/${this.userData.profile_photo_path}`;
                    this.hasProfileImage = true;
                } else {
                    this.hasProfileImage = false;
                }
            } catch (error) {
                console.error('Error loading profile image:', error);
                this.hasProfileImage = false;
            }
        },

        async fetchAppointments() {
            this.isLoading = true;
            try {
                const response = await fetch(`${API_URL}/appointments/by-patient`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    console.error('Error fetching appointments:', response.statusText);
                    return;
                }

                const data = await response.json();

                if (data.status) {
                    this.appointments = data.data;

                    // Process data - ensure all appointments have rating properties
                    this.appointments = this.appointments.map(appointment => {
                        // Convertir cadenas vacías a null para consistencia
                        const comment = appointment.comment === '' ? null : appointment.comment;
                        
                        return {
                            ...appointment,
                            rating: appointment.rating || null,
                            comment: comment
                        };
                    });
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                this.isLoading = false;
            }
        },

        filterReviews() {
            // The filtering is handled by the computed property
        },

        setFilter(filterValue) {
            this.activeFilter = filterValue;
        },

        updateRating(appointmentId, newRating, comment) {
            // Find and update the appointment
            const index = this.appointments.findIndex(app => app.appointment_id === appointmentId);
            if (index !== -1) {
                this.appointments[index].rating = newRating;
                this.appointments[index].comment = comment;
                this.saveRating(appointmentId, newRating, comment);
            }
        },

        /* eslint-disable */
        async saveRating(appointmentId, rating, comment) {
            try {
                // This would be a real API call in production
                console.log(`Saving rating ${rating} and comment for appointment ${appointmentId}`);
                
                // Simulate API call for now
                // In a real scenario, this would be an actual API endpoint
                /*
                const response = await fetch(`${API_URL}/appointments/rate`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({
                    appointment_id: appointmentId,
                    rating: rating,
                    comment: comment
                  })
                });

                if (!response.ok) {
                  throw new Error('Failed to save rating');
                }

                const data = await response.json();
                if (!data.status) {
                  throw new Error(data.message || 'Failed to save rating');
                }
                */
            } catch (error) {
                console.error('Error saving rating:', error);
                // Revert the rating in case of error
                const index = this.appointments.findIndex(app => app.appointment_id === appointmentId);
                if (index !== -1) {
                    // Restore previous rating and comment
                    this.appointments[index].rating = this.appointments[index].original_rating || null;
                    this.appointments[index].comment = this.appointments[index].original_comment || null;
                }
            }
        },

        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.$router.push({name: 'Login'});
        }
    }
};
</script>

<style scoped>
/* Custom Header Styles (similar to ClinicasComponent) */
.custom-header {
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    padding: 10px 0;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
}

.header-logo {
    display: flex;
    align-items: center;
}

.header-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0d6efd;
    margin-left: 5px;
}

.header-user {
    display: flex;
    align-items: center;
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
    border: 2px solid #f0f7ff;
    transition: border-color 0.3s ease;
}

.profile-image:hover {
    border-color: #0d6efd;
}

.profile-initials {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    background-color: #0d6efd;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border: 2px solid #f0f7ff;
    transition: background-color 0.3s ease;
}

.profile-initials:hover {
    background-color: #0b5ed7;
    border-color: #0d6efd;
}

.dropdown-menu {
    border: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-top: 10px;
}

.dropdown-item {
    padding: 8px 20px;
    color: #495057;
    transition: background-color 0.3s ease;
}

.dropdown-item:hover {
    background-color: #f0f7ff;
    color: #0d6efd;
}

/* Main Container */
.main-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: calc(100vh - 80px);
}

/* Reviews Header */
.reviews-header {
    background: linear-gradient(135deg, #0d6efd, #36b9cc);
    border-radius: 16px;
    padding: 40px;
    margin-bottom: 30px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(13, 110, 253, 0.1);
}

.reviews-header::before {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
}

.reviews-header::after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: 30%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
}

.reviews-header-content {
    position: relative;
    z-index: 1;
}

.reviews-title {
    color: white;
    font-weight: 700;
    margin-bottom: 10px;
    font-size: 2.5rem;
}

.reviews-description {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    max-width: 600px;
}

/* Stats Cards */
.stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 30px;
}

.stats-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stats-icon {
    background: linear-gradient(135deg, #0d6efd, #36b9cc);
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
}

.stats-icon i {
    color: white;
    font-size: 1.5rem;
}

.stats-content {
    flex: 1;
}

.stats-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #1a2b48;
    margin-bottom: 5px;
}

.stats-label {
    color: #6c757d;
    font-size: 0.9rem;
    margin: 0;
}

/* Filters and Search */
.filters-container {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
}

.search-box {
    flex: 1;
    min-width: 250px;
    position: relative;
}

.search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
}

.search-input {
    width: 100%;
    padding: 12px 15px 12px 45px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.search-input:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.filter-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.filter-btn {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 10px 15px;
    color: #495057;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
}

.filter-btn:hover {
    background-color: #e9ecef;
}

.filter-btn.active {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
}

.filter-btn i {
    margin-right: 8px;
}

/* Reviews Container */
.reviews-container {
    margin-bottom: 30px;
}

/* Loading State */
.loading-state {
    padding: 50px;
    text-align: center;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.loading-state .spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 20px;
}

.loading-state p {
    color: #6c757d;
    font-size: 1.1rem;
}

/* Empty State */
.empty-state {
    padding: 50px;
    text-align: center;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.empty-icon {
    font-size: 3rem;
    color: #6c757d;
    margin-bottom: 20px;
}

.empty-title {
    font-size: 1.5rem;
    color: #1a2b48;
    margin-bottom: 10px;
}

.empty-message {
    color: #6c757d;
    max-width: 500px;
    margin: 0 auto;
}

/* Reviews List */
.reviews-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
}

/* Responsive Styles */
@media (max-width: 992px) {
    .stats-row {
        grid-template-columns: repeat(3, 1fr);
    }

    .reviews-title {
        font-size: 2rem;
    }
}

@media (max-width: 768px) {
    .stats-row {
        grid-template-columns: repeat(2, 1fr);
    }

    .reviews-header {
        padding: 30px;
    }

    .reviews-title {
        font-size: 1.8rem;
    }

    .reviews-list {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
}

@media (max-width: 576px) {
    .stats-row {
        grid-template-columns: 1fr;
    }

    .reviews-header {
        padding: 25px;
    }

    .reviews-title {
        font-size: 1.5rem;
    }

    .search-box {
        width: 100%;
    }

    .filter-buttons {
        width: 100%;
        justify-content: space-between;
    }

    .filter-btn {
        padding: 8px 12px;
        font-size: 0.9rem;
    }

    .reviews-list {
        grid-template-columns: 1fr;
    }
}
</style> 