<template>
    <div class="diseases-selection-page">
        <div class="container">
            <div class="selection-card">
                <div class="animated-header">
                    <div class="header-icon">
                        <i class="fas fa-heartbeat pulse"></i>
                    </div>
                    <h1 class="page-title">Información Médica Importante</h1>
                    <p class="subtitle">Selecciona de 1 a 3 condiciones médicas que consideres relevantes para tu atención</p>
                </div>

                <div class="progress-container mb-4">
                    <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
                    <div class="progress-text">{{ selectedDiseases.length }} de 3 seleccionadas</div>
                </div>

                <div v-if="loading" class="loader-container">
                    <div class="loader"></div>
                    <p>Cargando condiciones médicas...</p>
                </div>

                <div v-else-if="error" class="error-container">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <p class="error-message">{{ error }}</p>
                    <button @click="fetchDiseases" class="btn btn-primary retry-button">
                        <i class="fas fa-sync-alt"></i> Reintentar
                    </button>
                </div>

                <div v-else class="diseases-container">
                    <div class="search-container">
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                            <input 
                                v-model="searchTerm" 
                                type="text" 
                                class="form-control search-input" 
                                placeholder="Buscar condición médica..."
                                @input="filterDiseases"
                            >
                            <button 
                                v-if="searchTerm" 
                                @click="clearSearch" 
                                class="input-group-text clear-btn"
                            >
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div class="diseases-grid">
                        <div 
                            v-for="disease in filteredDiseases" 
                            :key="disease.id"
                            :class="['disease-card', {'selected': isSelected(disease)}]"
                            @click="toggleDisease(disease)"
                            :title="disease.description"
                        >
                            <div class="selection-indicator">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="disease-icon" :class="getCategoryClass(disease.category)">
                                <i :class="getCategoryIcon(disease.category)"></i>
                            </div>
                            <div class="disease-details">
                                <h3 class="disease-name">{{ disease.name }}</h3>
                                <p class="disease-category">{{ disease.category }}</p>
                            </div>
                        </div>

                        <div v-if="filteredDiseases.length === 0" class="no-results">
                            <i class="fas fa-search-minus"></i>
                            <p>No se encontraron resultados para "{{ searchTerm }}"</p>
                            <button @click="clearSearch" class="btn btn-outline-primary btn-sm">
                                Mostrar todas
                            </button>
                        </div>
                    </div>

                    <div class="selected-summary" v-if="selectedDiseases.length > 0">
                        <h3>Condiciones seleccionadas:</h3>
                        <div class="selected-pills">
                            <div v-for="disease in selectedDiseases" :key="disease.id" class="selected-pill">
                                <span>{{ disease.name }}</span>
                                <button @click.stop="removeDisease(disease)" class="remove-btn">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="actions-container">
                    <button 
                        @click="goBack" 
                        class="btn btn-secondary btn-lg action-btn back-btn"
                    >
                        <i class="fas fa-arrow-left"></i>
                        <span>Volver</span>
                    </button>
                    <button 
                        @click="saveSelections" 
                        class="btn btn-primary btn-lg action-btn"
                        :disabled="selectedDiseases.length === 0"
                    >
                        <i class="fas fa-save"></i>
                        <span>Guardar Selección</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DiseasesSelectionComponent',
    data() {
        return {
            diseases: [],
            filteredDiseases: [],
            selectedDiseases: [],
            searchTerm: '',
            loading: true,
            error: null,
            categoryIcons: {
                'Cardiovascular': 'fas fa-heart',
                'Respiratorio': 'fas fa-lungs',
                'Digestivo': 'fas fa-stomach',
                'Neurológico': 'fas fa-brain',
                'Endocrino': 'fas fa-weight',
                'Inmunológico': 'fas fa-shield-virus',
                'Dermatológico': 'fas fa-allergies',
                'Oftalmológico': 'fas fa-eye',
                'Otros': 'fas fa-notes-medical'
            }
        };
    },
    computed: {
        progressWidth() {
            return (this.selectedDiseases.length / 3) * 100;
        }
    },
    mounted() {
        this.fetchDiseases();
    },
    methods: {
        async fetchDiseases() {
            this.loading = true;
            this.error = null;
            
            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/diseases`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Error al cargar las condiciones médicas: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Simulando datos para desarrollo
                if (!data || !data.length) {
                    this.diseases = this.getMockDiseases();
                } else {
                    this.diseases = data;
                }
                
                this.filteredDiseases = [...this.diseases];
                this.loading = false;
            } catch (error) {
                console.error('Error fetching diseases:', error);
                this.error = 'No pudimos cargar las condiciones médicas. Por favor intenta nuevamente.';
                this.loading = false;
                
                // Usar datos de prueba en caso de error para desarrollo
                this.diseases = this.getMockDiseases();
                this.filteredDiseases = [...this.diseases];
            }
        },
        
        getMockDiseases() {
            // Datos de prueba para desarrollo
            return [
                { id: 1, name: 'Hipertensión Arterial', category: 'Cardiovascular', description: 'Presión arterial elevada que puede dañar los vasos sanguíneos y órganos.' },
                { id: 2, name: 'Diabetes Tipo 2', category: 'Endocrino', description: 'Afección crónica que afecta la forma en que el cuerpo procesa la glucosa en sangre.' },
                { id: 3, name: 'Asma', category: 'Respiratorio', description: 'Enfermedad crónica que afecta las vías respiratorias de los pulmones.' },
                { id: 4, name: 'Artritis Reumatoide', category: 'Inmunológico', description: 'Enfermedad autoinmune que causa inflamación de las articulaciones.' },
                { id: 5, name: 'Migraña', category: 'Neurológico', description: 'Dolor de cabeza intenso que puede venir acompañado de náuseas y sensibilidad a la luz.' },
                { id: 6, name: 'Enfermedad de Crohn', category: 'Digestivo', description: 'Enfermedad inflamatoria que afecta el revestimiento del tracto digestivo.' },
                { id: 7, name: 'Hipotiroidismo', category: 'Endocrino', description: 'Producción insuficiente de la hormona tiroidea.' },
                { id: 8, name: 'Psoriasis', category: 'Dermatológico', description: 'Enfermedad autoinmune que acelera el ciclo de vida de las células de la piel.' },
                { id: 9, name: 'Glaucoma', category: 'Oftalmológico', description: 'Daño al nervio óptico que empeora con el tiempo, relacionado con la presión dentro del ojo.' },
                { id: 10, name: 'Fibromialgia', category: 'Neurológico', description: 'Trastorno caracterizado por dolor musculoesquelético generalizado.' },
                { id: 11, name: 'Apnea del Sueño', category: 'Respiratorio', description: 'Trastorno del sueño en el que la respiración se interrumpe repetidamente.' },
                { id: 12, name: 'Anemia', category: 'Otros', description: 'Afección en la que no tienes suficientes glóbulos rojos sanos.' }
            ];
        },
        
        filterDiseases() {
            if (!this.searchTerm.trim()) {
                this.filteredDiseases = [...this.diseases];
                return;
            }
            
            const term = this.searchTerm.toLowerCase().trim();
            this.filteredDiseases = this.diseases.filter(disease => 
                disease.name.toLowerCase().includes(term) || 
                disease.category.toLowerCase().includes(term)
            );
        },
        
        clearSearch() {
            this.searchTerm = '';
            this.filteredDiseases = [...this.diseases];
        },
        
        toggleDisease(disease) {
            const index = this.selectedDiseases.findIndex(d => d.id === disease.id);
            
            if (index !== -1) {
                // Si ya está seleccionada, eliminarla
                this.selectedDiseases.splice(index, 1);
            } else {
                // Si no está seleccionada, verificar si ya tenemos 3
                if (this.selectedDiseases.length >= 3) {
                    // Si ya hay 3 seleccionadas, mostrar mensaje o notificación
                    alert('Solo puedes seleccionar hasta 3 condiciones médicas.');
                    return;
                }
                
                // Agregar a seleccionadas
                this.selectedDiseases.push(disease);
            }
        },
        
        isSelected(disease) {
            return this.selectedDiseases.some(d => d.id === disease.id);
        },
        
        removeDisease(disease) {
            const index = this.selectedDiseases.findIndex(d => d.id === disease.id);
            if (index !== -1) {
                this.selectedDiseases.splice(index, 1);
            }
        },
        
        getCategoryClass(category) {
            const classes = {
                'Cardiovascular': 'category-red',
                'Respiratorio': 'category-blue',
                'Digestivo': 'category-orange',
                'Neurológico': 'category-purple',
                'Endocrino': 'category-green',
                'Inmunológico': 'category-yellow',
                'Dermatológico': 'category-pink',
                'Oftalmológico': 'category-teal',
                'Otros': 'category-gray'
            };
            
            return classes[category] || 'category-gray';
        },
        
        getCategoryIcon(category) {
            return this.categoryIcons[category] || 'fas fa-notes-medical';
        },
        
        goBack() {
            this.$router.go(-1);
        },
        
        saveSelections() {
            if (this.selectedDiseases.length === 0) {
                alert('Por favor selecciona al menos una condición médica.');
                return;
            }
            
            // Aquí iría el código para guardar las selecciones
            // Por ahora, solo mostramos un mensaje
            alert('Selecciones guardadas con éxito (simulado)');
            
            // Redirigir a la siguiente página o al dashboard
            this.$router.push({ name: 'PatientProfile' });
        }
    }
};
</script>

<style scoped>
.diseases-selection-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%);
    padding: 40px 0;
    font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
}

.selection-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    position: relative;
    overflow: hidden;
}

.animated-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
    padding-bottom: 30px;
}

.animated-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #0d6efd, #6610f2);
    border-radius: 3px;
}

.header-icon {
    font-size: 36px;
    color: #0d6efd;
    margin-bottom: 20px;
    display: inline-block;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: #212529;
    margin-bottom: 10px;
}

.subtitle {
    font-size: 18px;
    color: #6c757d;
    max-width: 700px;
    margin: 0 auto;
}

.progress-container {
    background-color: #e9ecef;
    border-radius: 50px;
    height: 20px;
    position: relative;
    overflow: hidden;
    margin-top: 30px;
}

.progress-bar {
    background: linear-gradient(90deg, #0d6efd, #6610f2);
    height: 100%;
    border-radius: 50px;
    transition: width 0.5s ease;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #495057;
    font-size: 12px;
    font-weight: 600;
}

.loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
}

.loader {
    border: 5px solid #f3f3f3;
    border-radius: 50%;
    border-top: 5px solid #0d6efd;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-container {
    text-align: center;
    padding: 40px;
}

.error-icon {
    font-size: 48px;
    color: #dc3545;
    margin-bottom: 20px;
}

.error-message {
    font-size: 18px;
    color: #6c757d;
    margin-bottom: 20px;
}

.retry-button {
    padding: 10px 20px;
    border-radius: 50px;
}

.diseases-container {
    margin-bottom: 30px;
}

.search-container {
    margin-bottom: 30px;
}

.search-input {
    border-radius: 50px;
    padding: 15px 20px;
    font-size: 16px;
    border: 1px solid #ced4da;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.input-group-text {
    background-color: white;
    border: 1px solid #ced4da;
}

.input-group-text:first-child {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
}

.clear-btn {
    border-top-right-radius: 50px !important;
    border-bottom-right-radius: 50px !important;
    cursor: pointer;
    color: #6c757d;
}

.clear-btn:hover {
    color: #dc3545;
}

.diseases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.disease-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    border: 1px solid #e9ecef;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.disease-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.disease-card.selected {
    border: 2px solid #0d6efd;
    background-color: rgba(13, 110, 253, 0.05);
}

.disease-card.selected .selection-indicator {
    opacity: 1;
}

.selection-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #0d6efd;
    font-size: 20px;
    opacity: 0;
    transition: all 0.3s ease;
}

.disease-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    flex-shrink: 0;
}

.disease-details {
    flex-grow: 1;
}

.disease-name {
    font-size: 16px;
    font-weight: 600;
    color: #212529;
    margin-bottom: 5px;
}

.disease-category {
    font-size: 14px;
    color: #6c757d;
    margin: 0;
}

.category-red {
    background: linear-gradient(135deg, #ff416c, #ff4b2b);
}

.category-blue {
    background: linear-gradient(135deg, #2193b0, #6dd5ed);
}

.category-green {
    background: linear-gradient(135deg, #11998e, #38ef7d);
}

.category-purple {
    background: linear-gradient(135deg, #8e2de2, #4a00e0);
}

.category-orange {
    background: linear-gradient(135deg, #f2994a, #f7b733);
}

.category-yellow {
    background: linear-gradient(135deg, #f7971e, #ffd200);
}

.category-pink {
    background: linear-gradient(135deg, #fc5c7d, #6a82fb);
}

.category-teal {
    background: linear-gradient(135deg, #00b09b, #96c93d);
}

.category-gray {
    background: linear-gradient(135deg, #636363, #a2ab58);
}

.no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 10px;
    color: #6c757d;
}

.no-results i {
    font-size: 36px;
    margin-bottom: 10px;
    display: block;
}

.selected-summary {
    background: #f8f9fa;
    border-radius: 15px;
    padding: 20px;
    margin-top: 30px;
}

.selected-summary h3 {
    font-size: 18px;
    color: #212529;
    margin-bottom: 15px;
}

.selected-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.selected-pill {
    background: #0d6efd;
    color: white;
    padding: 8px 15px;
    border-radius: 50px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.remove-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-btn:hover {
    color: white;
}

.actions-container {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 30px;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.back-btn {
    background-color: white;
    color: #6c757d;
    border: 1px solid #ced4da;
}

.back-btn:hover {
    background-color: #f8f9fa;
    transform: translateX(-5px);
}

.btn-primary {
    background-color: #0d6efd;
    border: none;
}

.btn-primary:hover:not(:disabled) {
    background-color: #0b5ed7;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(13, 110, 253, 0.3);
}

.btn-primary:disabled {
    background-color: #74a7fc;
    cursor: not-allowed;
}

/* Animaciones */
.pulse {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* Responsive */
@media (max-width: 992px) {
    .selection-card {
        padding: 30px;
    }
    
    .page-title {
        font-size: 28px;
    }
    
    .subtitle {
        font-size: 16px;
    }
    
    .diseases-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}

@media (max-width: 768px) {
    .diseases-selection-page {
        padding: 20px 0;
    }
    
    .selection-card {
        padding: 20px;
    }
    
    .page-title {
        font-size: 24px;
    }
    
    .diseases-grid {
        grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    }
    
    .action-btn {
        padding: 12px 20px;
    }
}

@media (max-width: 576px) {
    .actions-container {
        flex-direction: column-reverse;
        gap: 15px;
    }
    
    .action-btn {
        width: 100%;
        justify-content: center;
    }
    
    .animated-header {
        margin-bottom: 30px;
    }
    
    .header-icon {
        font-size: 30px;
    }
}
</style> 