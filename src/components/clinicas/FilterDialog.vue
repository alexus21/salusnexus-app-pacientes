<template>
    <div class="filter-dialog" v-if="show">
        <div class="filter-dialog-backdrop" @click="closeDialog"></div>
        <div class="filter-dialog-content">
            <div class="filter-dialog-header">
                <h3 class="filter-dialog-title">Filtros</h3>
                <button class="btn-close" @click="closeDialog">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="filter-dialog-body">
                <div class="filter-section">
                    <h4 class="filter-section-title">Filtrar por especialidad</h4>
                    <div class="filter-section-content">
                        <div class="filter-chips">
                            <div
                                v-for="(specialty, index) in specialties"
                                :key="index"
                                :class="['filter-chip', { active: selectedSpecialties.includes(specialty) }]"
                                @click="toggleSpecialty(specialty)">
                                {{ specialty }}
                            </div>

                            <div class="filter-chip filter-chip-clear" @click="clearSpecialties">
                                <i class="fas fa-times-circle me-1"></i> Limpiar filtros
                            </div>
                        </div>
                    </div>
                </div>

                <div class="filter-section">
                    <h4 class="filter-section-title">Calificación mínima</h4>
                    <div class="filter-section-content">
                        <div class="rating-filter">
                            <div class="rating-stars">
                                <i
                                    v-for="star in 5"
                                    :key="star"
                                    :class="['fas', star <= ratingFilter ? 'fa-star' : 'far fa-star']"
                                    @click="setRatingFilter(star)"></i>
                            </div>
                            <span class="rating-value">{{ ratingFilter }}+ estrellas</span>
                        </div>
                    </div>
                </div>

                <div class="filter-section">
                    <h4 class="filter-section-title">Disponibilidad</h4>
                    <div class="filter-section-content">
                        <div class="availability-filter">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="today" id="availabilityToday"
                                       v-model="availabilityFilter">
                                <label class="form-check-label" for="availabilityToday">
                                    <i class="fas fa-calendar-day text-success me-2"></i> Hoy
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="tomorrow"
                                       id="availabilityTomorrow" v-model="availabilityFilter">
                                <label class="form-check-label" for="availabilityTomorrow">
                                    <i class="fas fa-calendar-week text-warning me-2"></i> Mañana
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="week" id="availabilityWeek"
                                       v-model="availabilityFilter">
                                <label class="form-check-label" for="availabilityWeek">
                                    <i class="fas fa-calendar-alt text-primary me-2"></i> Esta semana
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="filter-section">
                    <h4 class="filter-section-title">Ubicación</h4>
                    <div class="filter-section-content">
                        <div class="location-filter">
                            <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-map-marker-alt"></i>
                </span>
                                <select class="form-select" v-model="locationFilter">
                                    <option value="">Todas las ubicaciones</option>
                                    <option value="san-salvador">San Salvador</option>
                                    <option value="santa-tecla">Santa Tecla</option>
                                    <option value="santa-ana">Santa Ana</option>
                                    <option value="soyapango">Soyapango</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="filter-dialog-footer">
                <button class="btn btn-clear" @click="clearAllFilters">
                    <i class="fas fa-times-circle me-1"></i> Limpiar todos
                </button>
                <button class="btn btn-apply" @click="applyFilters">
                    <i class="fas fa-check-circle me-1"></i> Aplicar filtros
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FilterDialog',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            specialties: [
                'Medicina General',
                'Cardiología',
                'Medicina Interna',
                'Pediatría',
                'Neurología',
                'Ginecología'
            ],
            selectedSpecialties: [],
            ratingFilter: 0,
            availabilityFilter: [],
            locationFilter: ''
        };
    },
    methods: {
        closeDialog() {
            this.$emit('close');
        },
        toggleSpecialty(specialty) {
            if (this.selectedSpecialties.includes(specialty)) {
                this.selectedSpecialties = this.selectedSpecialties.filter(s => s !== specialty);
            } else {
                this.selectedSpecialties.push(specialty);
            }
        },
        clearSpecialties() {
            this.selectedSpecialties = [];
        },
        setRatingFilter(rating) {
            this.ratingFilter = rating;
        },
        clearAllFilters() {
            this.selectedSpecialties = [];
            this.ratingFilter = 0;
            this.availabilityFilter = [];
            this.locationFilter = '';
        },
        applyFilters() {
            const filters = {
                specialties: this.selectedSpecialties,
                rating: this.ratingFilter,
                availability: this.availabilityFilter,
                location: this.locationFilter
            };

            this.$emit('apply-filters', filters);
            this.closeDialog();
        }
    }
};
</script>

<style scoped>
.filter-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s;
}

.filter-dialog-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
}

.filter-dialog-content {
    background-color: white;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s;
}

.filter-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}

.filter-dialog-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a2b48;
    margin: 0;
}

.btn-close {
    background: transparent;
    border: none;
    color: #6c757d;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-close:hover {
    background-color: #f1f1f1;
    color: #000;
}

.filter-dialog-body {
    padding: 20px;
}

.filter-section {
    margin-bottom: 25px;
}

.filter-section:last-child {
    margin-bottom: 0;
}

.filter-section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1a2b48;
    margin-bottom: 12px;
}

.filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.filter-chip {
    background-color: #f0f7ff;
    color: #0d6efd;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.filter-chip:hover {
    background-color: #e0f0ff;
}

.filter-chip.active {
    background-color: #0d6efd;
    color: white;
}

.filter-chip-clear {
    background-color: #f8f9fa;
    color: #6c757d;
}

.filter-chip-clear:hover {
    background-color: #e9ecef;
    color: #495057;
}

.rating-filter {
    display: flex;
    align-items: center;
}

.rating-stars {
    display: flex;
    margin-right: 15px;
}

.rating-stars i {
    color: #ffc107;
    font-size: 1.2rem;
    margin-right: 5px;
    cursor: pointer;
}

.rating-stars i.far {
    color: #dee2e6;
}

.rating-value {
    font-size: 0.9rem;
    color: #6c757d;
}

.availability-filter {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-check {
    display: flex;
    align-items: center;
}

.form-check-input {
    margin-right: 10px;
}

.form-check-label {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #495057;
}

.location-filter .input-group {
    max-width: 100%;
}

.form-select {
    padding: 10px;
    border-radius: 0 8px 8px 0;
    border-color: #dee2e6;
}

.input-group-text {
    background-color: white;
    border-color: #dee2e6;
    color: #0d6efd;
    border-radius: 8px 0 0 8px;
}

.filter-dialog-footer {
    padding: 15px 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
}

.btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    transition: all 0.3s;
}

.btn-clear {
    background-color: #f8f9fa;
    color: #6c757d;
    border: 1px solid #dee2e6;
}

.btn-clear:hover {
    background-color: #e9ecef;
    color: #495057;
}

.btn-apply {
    background-color: #0d6efd;
    color: white;
    border: none;
}

.btn-apply:hover {
    background-color: #0b5ed7;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.25);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Responsividad */
@media (max-width: 576px) {
    .filter-dialog-content {
        width: 95%;
        max-height: 85vh;
    }

    .filter-section-title {
        font-size: 0.95rem;
    }

    .filter-chip {
        font-size: 0.8rem;
        padding: 5px 10px;
    }

    .rating-stars i {
        font-size: 1.1rem;
    }
}
</style> 