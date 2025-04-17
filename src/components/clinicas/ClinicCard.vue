<template>
    <div class="clinic-card">
        <div class="card h-100 border-0 shadow-sm">
            <div class="clinic-badge" v-if="clinic.badges && clinic.badges.length">
        <span :class="getBadgeClass(clinic.badges[0])">
          <i :class="getBadgeIcon(clinic.badges[0])"></i>
          {{ clinic.badges[0] }}
        </span>
            </div>

            <div class="favorite-button" @click.prevent="toggleFavorite">
                <i :class="['far', clinic.isFavorite ? 'fas fa-heart text-danger' : 'far fa-heart']"></i>
            </div>

            <div class="clinic-image">
                <img :src="clinic.image" :alt="clinic.name" class="card-img-top">
                <div class="availability-badge" v-if="clinic.availability">
                    <i class="far fa-calendar-check me-1"></i>
                    {{ clinic.availability }}
                </div>
            </div>

            <div class="card-body">
                <div class="specialty-badge mb-2">
          <span :class="getSpecialtyClass(clinic.specialty)">
            {{ clinic.specialty }}
          </span>
                </div>

                <h5 class="clinic-name">{{ clinic.name }}</h5>

                <div class="clinic-location mb-2">
                    <i class="fas fa-map-marker-alt me-1 text-muted"></i>
                    {{ clinic.location }}
                </div>

                <div class="clinic-stats d-flex gap-3 mb-3">
                    <!-- <div class="stat-item">
                      <i class="fas fa-user-md text-primary me-1"></i>
                      {{ clinic.doctors }} médicos
                    </div> -->
                    <div class="stat-item">
                        <i class="fas fa-users text-success me-1"></i>
                        {{ clinic.patients }}+ pacientes
                    </div>
                </div>

                <div class="clinic-rating d-flex align-items-center justify-content-between">
                    <div class="stars d-flex">
                        <template v-for="star in 5" :key="star">
                            <i :class="['star-icon', getStarClass(star)]"></i>
                        </template>
                    </div>
                    <span class="rating-value">{{ clinic.rating }}</span>
                </div>
            </div>

            <div class="card-footer bg-white border-0 pt-0">
                <router-link :to="{ name: 'ClinicaDetalle', params: { id: clinic.id }}" class="btn btn-primary d-block">
                    Ver detalles
                    <i class="fas fa-chevron-right ms-1"></i>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ClinicCard',
    props: {
        clinic: {
            type: Object,
            required: true
        }
    },
    methods: {
        getSpecialtyClass(specialty) {
            const classes = {
                'Medicina General': 'specialty-blue',
                'Cardiología': 'specialty-red',
                'Medicina Interna': 'specialty-green',
                'Pediatría': 'specialty-orange',
                'Neurología': 'specialty-purple',
                'Ginecología': 'specialty-pink'
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
        getStarClass(position) {
            const rating = this.clinic.rating;

            // Estrella completa
            if (position <= Math.floor(rating)) {
                return 'fas fa-star';
            }

            // Media estrella
            if (position - 0.5 <= rating) {
                return 'fas fa-star-half-alt';
            }

            // Estrella vacía
            return 'far fa-star';
        },
        toggleFavorite() {
            this.$emit('toggle-favorite');
        }
    }
};
</script>

<style scoped>
.clinic-card {
    height: 100%;
    transition: all 0.3s ease;
}

.clinic-card:hover {
    transform: translateY(-8px);
}

.card {
    position: relative;
    height: 100%;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.clinic-card:hover .card {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.clinic-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 10;
}

.clinic-badge span {
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 30px;
    font-size: 0.7rem;
    font-weight: 500;
    gap: 5px;
}

.badge-certified {
    background-color: rgba(13, 109, 253, 0.733);
    color: #e4e8ee;
}

.badge-popular {
    background-color: rgba(255, 191, 0, 0.918);
    color: #f7f6f6;
}

.badge-recommended {
    background-color: rgba(7, 160, 89, 0.5);
    color: #e8ebe9;
}

.badge-new {
    background-color: rgba(243, 48, 67, 0.753);
    color: #fcfbfb;
}

.favorite-button {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    width: 36px;
    height: 36px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.favorite-button:hover {
    transform: scale(1.1);
}

.favorite-button i {
    font-size: 1.1rem;
    color: #6c757d;
    transition: all 0.3s ease;
}

.favorite-button:hover i.far {
    color: #dc3545;
}

.clinic-image {
    position: relative;
    height: 170px;
    overflow: hidden;
}

.clinic-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
}

.clinic-card:hover .clinic-image img {
    transform: scale(1.05);
}

.availability-badge {
    position: absolute;
    bottom: 15px;
    right: 15px;
    background-color: white;
    color: #444;
    padding: 5px 10px;
    border-radius: 30px;
    font-size: 0.75rem;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.specialty-badge span {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
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

.clinic-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1a2b48;
}

.clinic-location {
    font-size: 0.85rem;
    color: #6c757d;
}

.stat-item {
    font-size: 0.8rem;
    color: #555;
}

.clinic-rating {
    margin-top: 10px;
}

.stars {
    display: flex;
    align-items: center;
    gap: 2px;
}

.star-icon {
    color: #ffc107;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.rating-value {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1a2b48;
}

.card-footer {
    padding-bottom: 16px;
}

.btn-primary {
    background-color: #0d6efd;
    border-color: #0d6efd;
    border-radius: 8px;
    padding: 10px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: #0b5ed7;
    border-color: #0b5ed7;
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.25);
}

@keyframes favoriteAnimation {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.3);
    }
    100% {
        transform: scale(1);
    }
}

.favorite-button i.fas {
    animation: favoriteAnimation 0.5s ease;
}
</style> 