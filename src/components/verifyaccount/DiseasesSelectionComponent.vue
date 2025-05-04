<template>
    <div class="diseases-selection-page">
        <!-- Elementos decorativos de fondo -->
        <div class="decorative-element decorative-element-1"></div>
        <div class="decorative-element decorative-element-2"></div>
        <div class="decorative-element decorative-element-3"></div>
        <div class="decorative-element decorative-element-4"></div>
        <div class="decorative-element decorative-element-5"></div>
        
        <div class="container">
            <div class="selection-card">
                <div class="animated-header">
                    <div class="header-icon">
                        <i class="fas fa-heartbeat pulse"></i>
                    </div>
                    <h1 class="page-title">Información Médica Importante</h1>
                    <p class="subtitle">Selecciona de 1 a 3 condiciones médicas que consideres relevantes para tu atención</p>
                </div>

                <div class="progress-container">
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
                            <div class="disease-icon" :class="getIconClass(disease.name)">
                                <i :class="getIconForDisease(disease.name)"></i>
                            </div>
                            <div class="disease-details">
                                <h3 class="disease-name">{{ disease.name }}</h3>
                                <p class="disease-category" v-if="disease.category">{{ disease.category }}</p>
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
                </div>

                <!-- Botón de volver que permanece en la parte principal -->
                <div class="back-button-container">
                    <button 
                        @click="goBack" 
                        class="btn btn-secondary btn-lg action-btn back-btn"
                    >
                        <i class="fas fa-arrow-left"></i>
                        <span>Volver</span>
                    </button>
                </div>
            </div>
            
            <!-- Medical illustrations -->
            <div class="medical-illustration">
                <img src="/medical-icons.svg" alt="Íconos médicos" class="floating-img">
            </div>
        </div>

        <!-- Nueva barra fija inferior para selecciones y botón guardar -->
        <div class="fixed-selection-bar" :class="{'has-selections': selectedDiseases.length > 0}">
            <div class="container selection-bar-container">
                <div class="selection-bar-content">
                    <div class="selection-counter">
                        <div class="counter-icon">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <span>{{ selectedDiseases.length }} de 3 seleccionadas</span>
                    </div>
                    
                    <div class="selected-pills-container" v-if="selectedDiseases.length > 0">
                        <div class="selected-pills">
                            <div v-for="disease in selectedDiseases" :key="disease.id" class="selected-pill">
                                <span>{{ disease.name }}</span>
                                <button @click.stop="removeDisease(disease)" class="remove-btn">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        @click="saveSelections" 
                        class="btn btn-primary btn-lg action-btn save-btn"
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
import swal from 'sweetalert2';

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
            diseaseIcons: {
                'Diabetes Tipo 1': { icon: 'fas fa-syringe', class: 'category-green' },
                'Diabetes Tipo 2': { icon: 'fas fa-weight', class: 'category-green' },
                'Hipertensión Arterial': { icon: 'fas fa-heart', class: 'category-red' },
                'Asma': { icon: 'fas fa-lungs', class: 'category-blue' },
                'Artritis Reumatoide': { icon: 'fas fa-bone', class: 'category-yellow' },
                'Migraña': { icon: 'fas fa-brain', class: 'category-purple' },
                'Enfermedad de Crohn': { icon: 'fas fa-stomach', class: 'category-orange' },
                'Hipotiroidismo': { icon: 'fas fa-weight', class: 'category-green' },
                'Psoriasis': { icon: 'fas fa-allergies', class: 'category-pink' },
                'Glaucoma': { icon: 'fas fa-eye', class: 'category-teal' },
                'Fibromialgia': { icon: 'fas fa-brain', class: 'category-purple' },
                'Apnea del Sueño': { icon: 'fas fa-bed', class: 'category-blue' },
                'Anemia': { icon: 'fas fa-tint', class: 'category-red' },
                'default': { icon: 'fas fa-notes-medical', class: 'category-gray' }
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
                
                // Verificar la estructura de la respuesta
                if (!data.status) {
                    throw new Error(data.message || 'Error al obtener las enfermedades');
                }
                
                // Usar los datos de diseases del API
                if (data.diseases && data.diseases.length > 0) {
                    this.diseases = data.diseases;
                } else {
                    // Si no hay datos, usar mock data
                    this.diseases = this.getMockDiseases();
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
                { id: 1, name: 'Hipertensión Arterial', description: 'Presión arterial elevada que puede dañar los vasos sanguíneos y órganos.' },
                { id: 2, name: 'Diabetes Tipo 2', description: 'Afección crónica que afecta la forma en que el cuerpo procesa la glucosa en sangre.' },
                { id: 3, name: 'Asma', description: 'Enfermedad crónica que afecta las vías respiratorias de los pulmones.' },
                { id: 4, name: 'Artritis Reumatoide', description: 'Enfermedad autoinmune que causa inflamación de las articulaciones.' },
                { id: 5, name: 'Migraña', description: 'Dolor de cabeza intenso que puede venir acompañado de náuseas y sensibilidad a la luz.' },
                { id: 6, name: 'Enfermedad de Crohn', description: 'Enfermedad inflamatoria que afecta el revestimiento del tracto digestivo.' },
                { id: 7, name: 'Hipotiroidismo', description: 'Producción insuficiente de la hormona tiroidea.' },
                { id: 8, name: 'Psoriasis', description: 'Enfermedad autoinmune que acelera el ciclo de vida de las células de la piel.' },
                { id: 9, name: 'Glaucoma', description: 'Daño al nervio óptico que empeora con el tiempo, relacionado con la presión dentro del ojo.' },
                { id: 10, name: 'Fibromialgia', description: 'Trastorno caracterizado por dolor musculoesquelético generalizado.' },
                { id: 11, name: 'Apnea del Sueño', description: 'Trastorno del sueño en el que la respiración se interrumpe repetidamente.' },
                { id: 12, name: 'Anemia', description: 'Afección en la que no tienes suficientes glóbulos rojos sanos.' }
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
                (disease.category && disease.category.toLowerCase().includes(term)) ||
                (disease.description && disease.description.toLowerCase().includes(term))
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
                    swal.fire({
                        icon: 'warning',
                        title: 'Límite alcanzado',
                        text: 'Solo puedes seleccionar hasta 3 condiciones médicas.',
                        confirmButtonText: 'Entendido',
                        confirmButtonColor: '#0d6efd'
                    });
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
        
        getIconClass(diseaseName) {
            return this.diseaseIcons[diseaseName]?.class || this.diseaseIcons.default.class;
        },
        
        getIconForDisease(diseaseName) {
            return this.diseaseIcons[diseaseName]?.icon || this.diseaseIcons.default.icon;
        },
        
        goBack() {
            this.$router.go(-1);
        },
        
        saveSelections() {
            if (this.selectedDiseases.length === 0) {
                swal.fire({
                    icon: 'error',
                    title: 'Selección requerida',
                    text: 'Por favor selecciona al menos una condición médica.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#0d6efd'
                });
                return;
            }
            
            // Aquí iría el código para guardar las selecciones
            // Por ahora, solo mostramos un mensaje
            swal.fire({
                icon: 'success',
                title: '¡Excelente!',
                text: 'Tus condiciones médicas han sido guardadas exitosamente.',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#0d6efd'
            }).then(() => {
                // Redirigir a la siguiente página o al dashboard
                this.$router.push({ name: 'PatientProfile' });
            });
        }
    }
};
</script>

<style scoped>
.diseases-selection-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 50%, #f8fbff 100%);
    padding: 40px 0 100px; /* Añadido padding bottom para dejar espacio para la barra fija */
    font-family: 'Poppins', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    position: relative;
    overflow: hidden;
}

/* Elementos decorativos de fondo */
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
    top: 15%;
    right: 5%;
    animation: float 5s ease-in-out infinite;
    animation-delay: 2s;
}

.decorative-element-5 {
    width: 120px;
    height: 120px;
    top: 40%;
    left: 5%;
    animation: float 9s ease-in-out infinite;
    animation-delay: 1.5s;
}

@keyframes float {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-20px);
    }
    100% {
        transform: translateY(0);
    }
}

.container {
    max-width: 1400px;
    width: 95%;
    margin: 0 auto;
    position: relative;
    z-index: 1;
}

.selection-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
    padding: 40px;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.selection-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(13, 110, 253, 0.03), transparent 70%),
                radial-gradient(circle at bottom left, rgba(54, 185, 204, 0.03), transparent 70%);
    z-index: 0;
}

.animated-header {
    text-align: center;
    margin-bottom: 30px;
    position: relative;
    padding-bottom: 20px;
    z-index: 1;
}

.animated-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    border-radius: 3px;
}

.header-icon {
    font-size: 36px;
    color: #0d6efd;
    margin-bottom: 15px;
    display: inline-block;
    background: linear-gradient(135deg, #0d6efd, #36b9cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: #1a2b48;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #1a2b48, #0d6efd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    height: 16px;
    position: relative;
    overflow: hidden;
    margin: 30px 0;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 1;
}

.progress-bar {
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    height: 100%;
    border-radius: 50px;
    transition: width 0.5s ease;
    box-shadow: 0 2px 5px rgba(13, 110, 253, 0.2);
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #495057;
    font-size: 11px;
    font-weight: 600;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
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
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.1);
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-container {
    text-align: center;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.error-icon {
    font-size: 48px;
    color: #dc3545;
    margin-bottom: 20px;
    text-shadow: 0 2px 5px rgba(220, 53, 69, 0.2);
}

.error-message {
    font-size: 18px;
    color: #6c757d;
    margin-bottom: 20px;
}

.retry-button {
    padding: 10px 20px;
    border-radius: 50px;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.15);
    transition: all 0.3s ease;
}

.retry-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(13, 110, 253, 0.2);
}

.diseases-container {
    position: relative;
    z-index: 1;
}

.search-container {
    margin-bottom: 30px;
}

.search-input {
    border-radius: 50px;
    padding: 15px 20px;
    font-size: 16px;
    border: 1px solid #e0e6ed;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.search-input:focus {
    border-color: #0d6efd;
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.1);
}

.input-group-text {
    background-color: white;
    border: 1px solid #e0e6ed;
    color: #6c757d;
    transition: all 0.3s ease;
}

.input-group-text:first-child {
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
    padding-left: 20px;
}

.clear-btn {
    border-top-right-radius: 50px !important;
    border-bottom-right-radius: 50px !important;
    cursor: pointer;
    color: #6c757d;
    padding-right: 20px;
}

.clear-btn:hover {
    color: #dc3545;
}

.diseases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
    z-index: 1;
}

.disease-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
    z-index: -1;
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
    filter: drop-shadow(0 2px 3px rgba(13, 110, 253, 0.2));
}

.disease-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: white;
    flex-shrink: 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
}

.disease-icon::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
    border-radius: 12px;
}

.disease-details {
    flex-grow: 1;
}

.disease-name {
    font-size: 16px;
    font-weight: 600;
    color: #1a2b48;
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
    border-radius: 15px;
    color: #6c757d;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.no-results i {
    font-size: 36px;
    margin-bottom: 10px;
    display: block;
    color: #6c757d;
}

.selected-summary {
    background: linear-gradient(135deg, #f8f9fa, #ffffff);
    border-radius: 15px;
    padding: 25px;
    margin-top: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #e9ecef;
    position: relative;
    overflow: hidden;
}

.selected-summary::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(13, 110, 253, 0.03), transparent 70%);
    z-index: 0;
}

.selected-summary h3 {
    font-size: 18px;
    color: #1a2b48;
    margin-bottom: 15px;
    position: relative;
    z-index: 1;
}

.selected-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    position: relative;
    z-index: 1;
}

.selected-pill {
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    color: white;
    padding: 8px 15px;
    border-radius: 50px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 3px 10px rgba(13, 110, 253, 0.2);
    transition: all 0.3s ease;
}

.selected-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
}

.remove-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 10px;
    cursor: pointer;
    padding: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.remove-btn:hover {
    background: rgba(255, 255, 255, 0.4);
    color: white;
}

.actions-container {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    position: relative;
    z-index: 1;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 30px;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.back-btn {
    background-color: white;
    color: #6c757d;
    border: 1px solid #ced4da;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
    background-color: #f8f9fa;
    transform: translateX(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.save-btn {
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.2);
}

.save-btn:hover:not(:disabled) {
    background: linear-gradient(90deg, #0b5ed7, #31a7b7);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(13, 110, 253, 0.3);
}

.save-btn:disabled {
    background: linear-gradient(90deg, #74a7fc, #8bccd5);
    cursor: not-allowed;
    opacity: 0.7;
}

/* Ilustración médica */
.medical-illustration {
    position: absolute;
    right: -50px;
    bottom: -50px;
    width: 200px;
    height: 200px;
    z-index: 0;
    opacity: 0.5;
    pointer-events: none;
}

.floating-img {
    width: 100%;
    height: auto;
    animation: float 6s ease-in-out infinite;
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
    
    .medical-illustration {
        display: none;
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
    
    .decorative-element-2,
    .decorative-element-3,
    .decorative-element-4,
    .decorative-element-5 {
        display: none;
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
        margin-bottom: 20px;
    }
    
    .header-icon {
        font-size: 30px;
    }
    
    .page-title {
        font-size: 22px;
    }
    
    .subtitle {
        font-size: 14px;
    }
}

/* Estilos para la barra fija inferior */
.fixed-selection-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1);
    z-index: 100;
    padding: 15px 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.fixed-selection-bar.has-selections {
    transform: translateY(0);
}

.selection-bar-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.selection-bar-content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 20px;
}

.selection-counter {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: #1a2b48;
    min-width: 150px;
}

.counter-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #0d6efd, #36b9cc);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 16px;
    box-shadow: 0 3px 10px rgba(13, 110, 253, 0.2);
}

.selected-pills-container {
    flex: 1;
    overflow-x: auto;
    padding: 5px 0;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    position: relative;
}

.selected-pills-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
}

.selected-pills {
    display: flex;
    gap: 10px;
    padding: 0 5px;
}

.selected-pill {
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    color: white;
    padding: 8px 15px;
    border-radius: 50px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 3px 10px rgba(13, 110, 253, 0.2);
    transition: all 0.3s ease;
    white-space: nowrap;
}

.selected-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3);
}

.remove-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 10px;
    cursor: pointer;
    padding: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.remove-btn:hover {
    background: rgba(255, 255, 255, 0.4);
    color: white;
}

.back-button-container {
    margin-top: 30px;
}

.save-btn {
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    border: none;
    color: white;
    box-shadow: 0 4px 15px rgba(13, 110, 253, 0.2);
    white-space: nowrap;
    min-width: 180px;
}

.save-btn:hover:not(:disabled) {
    background: linear-gradient(90deg, #0b5ed7, #31a7b7);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(13, 110, 253, 0.3);
}

.save-btn:disabled {
    background: linear-gradient(90deg, #74a7fc, #8bccd5);
    cursor: not-allowed;
    opacity: 0.7;
}
</style> 