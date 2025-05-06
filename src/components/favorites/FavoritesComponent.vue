<template>
    <div class="favorites-page">
        <!-- Elementos decorativos de fondo -->
        <div class="decorative-element decorative-element-1"></div>
        <div class="decorative-element decorative-element-2"></div>
        <div class="decorative-element decorative-element-3"></div>
        <div class="decorative-element decorative-element-4"></div>

        <!-- Use shared header component -->
        <header-component :isUserVerified="true"></header-component>

        <!-- Hero section -->
        <div class="hero-section">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-7">
                        <div class="hero-content" data-aos="fade-right">
                            <h1 class="hero-title">Mis Clínicas Favoritas</h1>
                            <p class="hero-description">
                                Aquí encontrarás todas las clínicas que has marcado como favoritas para un acceso rápido
                                y conveniente.
                            </p>
                            <div class="hero-actions">
                                <button class="btn btn-primary action-btn" @click="goBack">
                                    <i class="fas fa-arrow-left me-2"></i> Volver a clínicas
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-5 d-none d-lg-block">
                        <div class="hero-illustration" data-aos="fade-left" data-aos-delay="200">
                            <img src="/favorites-illustration.svg" alt="Favoritos" class="floating-img"
                                 onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/4403/4403583.png';">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main content -->
        <div class="main-content">
            <div class="container">
                <!-- Loader -->
                <div v-if="loading" class="loading-container" data-aos="fade-up">
                    <div class="loader"></div>
                    <p class="loading-text">Cargando tus clínicas favoritas...</p>
                </div>

                <!-- Error state -->
                <div v-else-if="error" class="error-container" data-aos="fade-up">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h3 class="error-title">¡Ups! Algo salió mal</h3>
                    <p class="error-message">{{ error }}</p>
                    <button class="btn btn-primary retry-btn" @click="fetchFavorites">
                        <i class="fas fa-sync-alt me-2"></i> Reintentar
                    </button>
                </div>

                <!-- Empty state -->
                <div v-else-if="favorites.length === 0" class="empty-container" data-aos="fade-up">
                    <div class="empty-icon">
                        <i class="far fa-heart"></i>
                    </div>
                    <h3 class="empty-title">No tienes clínicas favoritas</h3>
                    <p class="empty-message">
                        Para agregar una clínica a favoritos, haz clic en el corazón en la lista de clínicas.
                    </p>
                    <router-link to="/login-home" class="btn btn-primary">
                        <i class="fas fa-search me-2"></i> Explorar clínicas
                    </router-link>
                </div>

                <!-- Favorites list -->
                <div v-else>
                    <div class="favorites-count" data-aos="fade-up">
                        <i class="fas fa-heart me-2"></i>
                        <span>{{ favorites.length }} clínicas guardadas</span>
                    </div>

                    <div class="row">
                        <div v-for="(favorite, index) in favorites" :key="favorite.id" class="col-lg-4 col-md-6 mb-4">
                            <div class="favorite-card" data-aos="fade-up" :data-aos-delay="index * 100">
                                <div class="favorite-header">
                                    <span class="favorite-badge">Favorito</span>
                                    <button class="remove-btn" @click="removeFavorite(favorite)"
                                            aria-label="Quitar de favoritos">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>

                                <div class="favorite-image-container">
                                    <img
                                        :src="`${apiUrlImage}/${favorite.facade_photo}`"
                                        alt="Clínica"
                                        class="favorite-image"
                                        onerror="this.onerror=null; this.src='https://via.placeholder.com/350x150?text=Imagen+No+Disponible';"
                                    >
                                </div>

                                <div class="favorite-body">
                                    <h3 class="favorite-title">{{ favorite.name }}</h3>
                                    <p class="favorite-location">
                                        <i class="fas fa-map-marker-alt me-2"></i>
                                        {{ favorite.clinic_address_reference }}
                                    </p>

                                    <div class="favorite-actions">
                                        <router-link :to="`/clinica/${favorite.clinic_id}`"
                                                     class="btn btn-primary view-btn">
                                            <i class="fas fa-eye me-2"></i> Ver clínica
                                        </router-link>
                                        <button @click="removeFavorite(favorite)"
                                                class="btn btn-outline-danger remove-btn-sm">
                                            <i class="fas fa-heart-broken"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="favorite-gallery">
                                    <div class="gallery-item" @click="openGallery(favorite, 'waiting_room')">
                                        <img
                                            :src="`${apiUrlImage}/${favorite.waiting_room_photo}`"
                                            alt="Sala de espera"
                                            onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100?text=No+Disponible';"
                                        >
                                        <div class="gallery-overlay">
                                            <span>Sala de espera</span>
                                        </div>
                                    </div>
                                    <div class="gallery-item" @click="openGallery(favorite, 'office')">
                                        <img
                                            :src="`${apiUrlImage}/${favorite.office_photo}`"
                                            alt="Consultorio"
                                            onerror="this.onerror=null; this.src='https://via.placeholder.com/100x100?text=No+Disponible';"
                                        >
                                        <div class="gallery-overlay">
                                            <span>Consultorio</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';
import swal from 'sweetalert2';
import HeaderComponent from '@/components/shared/HeaderComponent.vue';

const API_URL = process.env.VUE_APP_API_URL;
const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;

export default {
    name: 'FavoritesComponent',
    components: {
        HeaderComponent
    },
    data() {
        return {
            loading: true,
            error: null,
            favorites: [],
            hasProfileImage: false,
            userProfileImage: '',
            userData: null,
            apiUrlImage: API_URL_IMAGE
        };
    },
    computed: {
        // Remove userInitials computed property
    },
    async mounted() {
        // Initialize AOS animation library
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        await this.fetchFavorites();
    },
    methods: {
        async fetchFavorites() {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push('/login');
                    return;
                }

                const response = await fetch(`${API_URL}/favorites/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('sdfgsdfds');
                }

                const data = await response.json();


                if (!data.status) {
                    throw new Error(data.message || 'Error al obtener favoritos');
                }

                this.favorites = data.data;
            } catch (error) {
                console.error('Error fetching favorites:', error);
                this.error = error.message || 'No pudimos cargar tus clínicas favoritas. Por favor intenta nuevamente.';
            } finally {
                this.loading = false;
            }
        },

        async removeFavorite(favorite) {
            try {
                const patient_id = JSON.parse(localStorage.getItem('user')).patient_profile_id;

                const result = await swal.fire({
                    title: '¿Eliminar de favoritos?',
                    text: `¿Estás seguro de que deseas eliminar ${favorite.name} de tus favoritos?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                });

                if (!result.isConfirmed) {
                    return;
                }

                const response = await fetch(`${API_URL}/favorites/delete`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        patient_id: patient_id,
                        clinic_id: favorite.clinic_id,
                    })
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar favorito');
                }

                const data = await response.json();

                if (!data.status) {
                    throw new Error(data.message || 'Error al eliminar favorito');
                }

                // Remove the favorite from the list with animation
                const index = this.favorites.findIndex(f => f.clinic_id === favorite.clinic_id);
                if (index !== -1) {
                    // Create a new array without the removed favorite
                    this.favorites = this.favorites.filter(f => f.clinic_id !== favorite.clinic_id);

                    // Show success toast
                    const Toast = swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });

                    Toast.fire({
                        icon: 'success',
                        title: 'Eliminado de favoritos'
                    });
                }
            } catch (error) {
                console.error('Error removing favorite:', error);
                swal.fire({
                    title: 'Error',
                    text: error.message || 'No pudimos eliminar esta clínica de tus favoritos. Por favor intenta nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        },

        goBack() {
            this.$router.push('/login-home');
        },

        openGallery(favorite, type) {
            let imgSrc = '';
            let title = '';

            if (type === 'waiting_room') {
                imgSrc = `${API_URL_IMAGE}/${favorite.waiting_room_photo}`;
                title = 'Sala de espera';
            } else if (type === 'office') {
                imgSrc = `${API_URL_IMAGE}/${favorite.office_photo}`;
                title = 'Consultorio';
            }

            swal.fire({
                title: `${favorite.name} - ${title}`,
                imageUrl: imgSrc,
                imageWidth: 600,
                imageHeight: 400,
                imageAlt: title,
                showCloseButton: true,
                showConfirmButton: false,
                background: '#fff',
                customClass: {
                    container: 'gallery-modal-container',
                    popup: 'gallery-modal-popup',
                    image: 'gallery-modal-image'
                }
            });
        }
    }
};
</script>

<style scoped>
/* General styles */
.favorites-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f4f9ff 0%, #ffffff 50%, #f0f7ff 100%);
    position: relative;
    overflow: hidden;
}

/* Decorative elements */
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
    animation: float 6s ease-in-out infinite;
}

.decorative-element-2 {
    width: 150px;
    height: 150px;
    bottom: 10%;
    left: 10%;
    animation: float 8s ease-in-out infinite;
    animation-delay: 1s;
}

.decorative-element-3 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    right: 10%;
    animation: float 7s ease-in-out infinite;
    animation-delay: 0.5s;
}

.decorative-element-4 {
    width: 80px;
    height: 80px;
    top: 25%;
    right: 5%;
    animation: float 5s ease-in-out infinite;
    animation-delay: 2s;
}

@keyframes float {
    0% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(5deg);
    }
    100% {
        transform: translateY(0) rotate(0deg);
    }
}

/* Hero Section */
.hero-section {
    padding: 80px 0 40px;
    position: relative;
    background: linear-gradient(135deg, #e9f3ff 0%, #f8fbff 100%);
    margin-bottom: 60px;
    z-index: 1;
}

.hero-section:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: linear-gradient(to bottom, transparent, #f9fbff);
    z-index: -1;
}

.hero-content {
    animation: fadeInUp 1s ease-out;
}

.hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #1a2b48;
    background: linear-gradient(45deg, #0d6efd, #36b9cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
}

.hero-description {
    font-size: 1.1rem;
    color: #546170;
    margin-bottom: 30px;
    line-height: 1.6;
}

.hero-actions {
    margin-top: 30px;
}

.action-btn {
    padding: 12px 24px;
    font-weight: 600;
    border-radius: 50px;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.25);
    transition: all 0.3s ease;
}

.action-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(13, 110, 253, 0.35);
}

.hero-illustration {
    display: flex;
    justify-content: center;
    animation: fadeInRight 1s ease-out;
}

.floating-img {
    width: 100%;
    max-width: 400px;
    height: auto;
    animation: float 6s ease-in-out infinite;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Main Content */
.main-content {
    padding: 0 0 80px;
    position: relative;
    z-index: 1;
}

/* Loading Container */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    text-align: center;
}

.loader {
    border: 5px solid #f3f3f3;
    border-radius: 50%;
    border-top: 5px solid #0d6efd;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 1.1rem;
    color: #546170;
}

/* Error Container */
.error-container {
    text-align: center;
    padding: 80px 0;
}

.error-icon {
    font-size: 3rem;
    color: #dc3545;
    margin-bottom: 20px;
}

.error-title {
    font-size: 1.8rem;
    color: #1a2b48;
    margin-bottom: 15px;
}

.error-message {
    font-size: 1.1rem;
    color: #546170;
    margin-bottom: 30px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

.retry-btn {
    padding: 12px 24px;
    font-weight: 600;
    border-radius: 50px;
}

/* Empty Container */
.empty-container {
    text-align: center;
    padding: 80px 0;
}

.empty-icon {
    font-size: 3rem;
    color: #0d6efd;
    margin-bottom: 20px;
}

.empty-title {
    font-size: 1.8rem;
    color: #1a2b48;
    margin-bottom: 15px;
}

.empty-message {
    font-size: 1.1rem;
    color: #546170;
    margin-bottom: 30px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

/* Favorites Count */
.favorites-count {
    display: inline-flex;
    align-items: center;
    background-color: rgba(13, 110, 253, 0.1);
    padding: 8px 16px;
    border-radius: 50px;
    color: #0d6efd;
    font-weight: 600;
    margin-bottom: 30px;
}

.favorites-count i {
    margin-right: 10px;
}

/* Favorite Card */
.favorite-card {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
    margin-bottom: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.favorite-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.favorite-header {
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    display: flex;
    justify-content: space-between;
    z-index: 1;
}

.favorite-badge {
    background-color: rgba(255, 193, 7, 0.9);
    color: #212529;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    backdrop-filter: blur(4px);
}

.remove-btn {
    background-color: rgba(255, 255, 255, 0.9);
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #dc3545;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);
}

.remove-btn:hover {
    background-color: #dc3545;
    color: white;
    transform: rotate(90deg);
}

.favorite-image-container {
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.favorite-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.favorite-card:hover .favorite-image {
    transform: scale(1.05);
}

.favorite-body {
    padding: 20px;
    flex: 1;
}

.favorite-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a2b48;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.favorite-location {
    font-size: 0.9rem;
    color: #546170;
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.favorite-location i {
    color: #0d6efd;
}

.favorite-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
}

.view-btn {
    flex: 1;
    border-radius: 8px;
    font-weight: 600;
    padding: 10px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.view-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(13, 110, 253, 0.2);
}

.remove-btn-sm {
    border-radius: 8px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #dc3545;
    background-color: white;
    transition: all 0.3s ease;
}

.remove-btn-sm:hover {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
}

.favorite-gallery {
    display: flex;
    gap: 1px;
    background-color: #f9fafb;
}

.gallery-item {
    flex: 1;
    height: 80px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
}

.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    color: white;
    padding: 8px;
    font-size: 0.8rem;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.gallery-item:hover img {
    transform: scale(1.1);
}

.gallery-item:hover .gallery-overlay {
    opacity: 1;
}

/* Gallery Modal */
:global(.gallery-modal-container) {
    backdrop-filter: blur(5px);
}

:global(.gallery-modal-popup) {
    border-radius: 16px;
    overflow: hidden;
}

:global(.gallery-modal-image) {
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Media Queries */
@media (max-width: 991.98px) {
    .hero-section {
        padding: 60px 0 30px;
    }

    .hero-title {
        font-size: 2.2rem;
    }

    .favorite-card {
        margin-bottom: 20px;
    }
}

@media (max-width: 767.98px) {
    .hero-section {
        padding: 40px 0 30px;
    }

    .hero-title {
        font-size: 1.8rem;
    }

    .hero-description {
        font-size: 1rem;
    }

    .favorite-image-container {
        height: 160px;
    }

    .gallery-item {
        height: 70px;
    }
}

@media (max-width: 575.98px) {
    .hero-section {
        padding: 30px 0 20px;
    }

    .hero-title {
        font-size: 1.6rem;
    }

    .hero-description {
        font-size: 0.95rem;
    }

    .favorite-card {
        margin-bottom: 15px;
    }

    .favorite-title {
        font-size: 1.2rem;
    }

    .favorite-body {
        padding: 15px;
    }

    .gallery-item {
        height: 60px;
    }

    .favorites-count {
        font-size: 0.9rem;
        padding: 6px 12px;
    }
}
</style> 