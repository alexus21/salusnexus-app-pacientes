<template>
    <div class="review-card" :class="{ 'has-rating': hasRating }">
        <!-- Card Header with Clinic Image -->
        <div class="review-card-header">
            <div class="image-container">
                <img :src="clinicImageUrl" :alt="appointment.clinic_name" class="clinic-image"/>
                <div class="image-overlay">
                    <span>{{ formatDate(appointment.appointment_date) }}</span>
                </div>
            </div>
        </div>

        <!-- Card Body -->
        <div class="review-card-body">
            <h3 class="clinic-name">{{ appointment.clinic_name }}</h3>
            <p class="doctor-name">Dr. {{ appointment.first_name }} {{ appointment.last_name }}</p>

            <!-- Rating Section -->
            <div class="rating-section">
                <div class="rating-label">Tu valoración:</div>
                <div class="star-rating">
                    <div class="stars-container">
                        <i
                            v-for="star in 5"
                            :key="star"
                            :class="[
                                'star-icon',
                                currentRating >= star ? 'fas fa-star' : 'far fa-star',
                                { 'fas fa-star-half-alt': isHalfStar(star) },
                                { 'disabled': !isEditing && hasRating }
                            ]"
                            @click="isEditing || !hasRating ? setRating(star) : null"
                            @mouseover="(isEditing || !hasRating) ? hoverRating = star : null"
                            @mouseleave="(isEditing || !hasRating) ? hoverRating = 0 : null"
                        ></i>
                    </div>
                    <div class="rating-text" v-if="hasRating">{{ ratingText }}</div>
                </div>
            </div>

            <!-- Comments Section -->
            <div class="comments-section" v-if="hasRating || isEditing">
                <div class="comments-label">Tu comentario:</div>
                <div v-if="!isEditing && appointment.comment && appointment.comment.trim() !== ''" class="comments-text">
                    {{ appointment.comment }}
                </div>
                <div v-else-if="!isEditing" class="comments-empty">
                    No has dejado ningún comentario
                </div>
                <textarea 
                    v-if="isEditing"
                    v-model="currentComment"
                    class="comments-textarea"
                    placeholder="Escribe un comentario sobre tu experiencia..."
                    rows="3"
                ></textarea>
            </div>

            <!-- Additional Info -->
            <div class="appointment-info">
                <div class="info-item">
                    <i class="fas fa-calendar-check"></i>
                    <span>{{ formatDate(appointment.appointment_date) }}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-hospital"></i>
                    <span>Cita #{{ appointment.appointment_id }}</span>
                </div>
            </div>
        </div>

        <!-- Card Footer -->
        <div class="review-card-footer">
            <button class="view-details-btn" @click="viewClinicDetails">
                <i class="fas fa-clinic-medical"></i> Ver Clínica
            </button>
            <button v-if="!hasRating" class="add-rating-btn" @click="focusOnRating">
                <i class="fas fa-star"></i> Valorar
            </button>
            <button v-else-if="!isEditing" class="edit-rating-btn" @click="startEditing">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button v-else class="save-rating-btn" @click="saveRating">
                <i class="fas fa-save"></i> Guardar
            </button>
        </div>

        <!-- Photo Gallery Modal -->
        <div class="photo-gallery" v-if="showGallery">
            <!-- I'd implement a proper gallery here in a real app -->
        </div>
    </div>
</template>

<script>
const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;

export default {
    name: 'ReviewCard',
    props: {
        appointment: {
            type: Object,
            required: true
        }
    },
    data() {
        // Asegurarse de que una cadena vacía se trate como null
        const normalizedComment = this.appointment.comment && this.appointment.comment.trim() !== '' 
            ? this.appointment.comment 
            : '';
        
        return {
            hoverRating: 0,
            currentRating: this.appointment.rating || 0,
            originalRating: this.appointment.rating || 0,
            currentComment: normalizedComment,
            originalComment: normalizedComment,
            showGallery: false,
            isEditing: false
        };
    },
    computed: {
        hasRating() {
            return this.currentRating > 0;
        },
        clinicImageUrl() {
            if (this.appointment.facade_photo) {
                return `${API_URL_IMAGE}/${this.appointment.facade_photo}`;
            }
            // Return a base64 encoded placeholder image instead of requiring a file
            return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlMWU4ZWQiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgU2Vnb2UgVUksIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgRmlyYSBTYW5zLCBEcm9pZCBTYW5zLCBIZWx2ZXRpY2EgTmV1ZSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZpbGw9IiM2YTczN2QiPkNsw61uaWNhPC90ZXh0Pgo8L3N2Zz4=';
        },
        ratingText() {
            const texts = [
                '',
                'Muy insatisfecho',
                'Insatisfecho',
                'Neutral',
                'Satisfecho',
                'Muy satisfecho'
            ];
            return texts[Math.round(this.currentRating)] || '';
        }
    },
    methods: {
        formatDate(dateString) {
            const options = {year: 'numeric', month: 'long', day: 'numeric'};
            return new Date(dateString).toLocaleDateString('es-ES', options);
        },

        setRating(rating) {
            if (this.isEditing || !this.hasRating) {
                this.currentRating = rating;
            }
        },

        startEditing() {
            this.isEditing = true;
            this.originalRating = this.currentRating;
            this.originalComment = this.currentComment;
            this.focusOnRating();
        },

        saveRating() {
            this.isEditing = false;
            this.$emit('update-rating', this.appointment.appointment_id, this.currentRating, this.currentComment);
        },

        cancelEditing() {
            this.isEditing = false;
            this.currentRating = this.originalRating;
            this.currentComment = this.originalComment;
        },

        /* eslint-disable */
        isHalfStar(position) {
            // For a future enhancement, we could support half stars
            return false;
        },

        viewClinicDetails() {
            this.$router.push({
                name: 'ClinicaDetalle',
                params: {id: this.appointment.clinic_id}
            });
        },

        focusOnRating() {
            // Scroll to or highlight the rating section
            const ratingSection = this.$el.querySelector('.rating-section');
            if (ratingSection) {
                ratingSection.scrollIntoView({behavior: 'smooth'});
                ratingSection.classList.add('highlight');
                setTimeout(() => {
                    ratingSection.classList.remove('highlight');
                }, 1500);
            }
        },

        toggleGallery() {
            this.showGallery = !this.showGallery;
        }
    }
};
</script>

<style scoped>
.review-card {
    background-color: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.review-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.review-card.has-rating {
    border-top: 4px solid #4CAF50;
}

/* Card Header */
.review-card-header {
    position: relative;
}

.image-container {
    position: relative;
    height: 180px;
    overflow: hidden;
}

.clinic-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.review-card:hover .clinic-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    padding: 15px;
    color: white;
    font-weight: 500;
}

/* Card Body */
.review-card-body {
    padding: 20px;
    flex: 1;
}

.clinic-name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a2b48;
    margin-bottom: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.doctor-name {
    color: #6c757d;
    font-size: 0.95rem;
    margin-bottom: 15px;
}

.rating-section {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.rating-section.highlight {
    background-color: #e0f7fa;
    box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.3);
}

.rating-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 10px;
}

.stars-container {
    display: flex;
    align-items: center;
    gap: 5px;
}

.star-icon {
    font-size: 1.5rem;
    cursor: pointer;
    color: #d4d4d4;
    transition: all 0.2s ease;
}

.star-icon.disabled {
    cursor: default;
    opacity: 0.8;
}

.star-icon.fa-star {
    color: #FFC107;
}

.star-icon.fa-star-half-alt {
    color: #FFC107;
}

.rating-text {
    margin-top: 8px;
    font-size: 0.9rem;
    color: #6c757d;
    font-style: italic;
}

/* Comments Section */
.comments-section {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.comments-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 10px;
}

.comments-text {
    color: #495057;
    font-size: 0.95rem;
    line-height: 1.5;
}

.comments-empty {
    color: #6c757d;
    font-size: 0.9rem;
    font-style: italic;
}

.comments-textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    resize: vertical;
    font-size: 0.95rem;
    color: #495057;
    transition: all 0.3s ease;
}

.comments-textarea:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.appointment-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #6c757d;
    font-size: 0.9rem;
}

.info-item i {
    color: #0d6efd;
    font-size: 1rem;
    width: 20px;
    text-align: center;
}

/* Card Footer */
.review-card-footer {
    padding: 15px 20px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fbfbfb;
}

.view-details-btn,
.add-rating-btn,
.edit-rating-btn,
.save-rating-btn {
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.view-details-btn {
    background-color: #f0f7ff;
    color: #0d6efd;
}

.view-details-btn:hover {
    background-color: #e0eeff;
}

.add-rating-btn {
    background-color: #FFC107;
    color: #212529;
}

.add-rating-btn:hover {
    background-color: #ffb300;
}

.edit-rating-btn {
    background-color: #e9ecef;
    color: #495057;
}

.edit-rating-btn:hover {
    background-color: #dee2e6;
}

.save-rating-btn {
    background-color: #28a745;
    color: white;
}

.save-rating-btn:hover {
    background-color: #218838;
}

/* Responsive styles */
@media (max-width: 768px) {
    .image-container {
        height: 160px;
    }

    .clinic-name {
        font-size: 1.2rem;
    }
}

@media (max-width: 576px) {
    .review-card-footer {
        flex-direction: column;
        gap: 10px;
    }

    .view-details-btn,
    .add-rating-btn,
    .edit-rating-btn,
    .save-rating-btn {
        width: 100%;
        justify-content: center;
    }
}
</style> 