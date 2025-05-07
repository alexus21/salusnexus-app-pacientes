<template>
  <div class="clinic-history-container">
    <header-component :isUserVerified="true" />
    
    <!-- Main content -->
    <div class="container mt-4">
      <div class="header-section">
        <div class="header-section-content">
          <h1 class="history-title">Mi Historial Clínico</h1>
          <p class="history-subtitle">Visualiza todas las clínicas que has visitado</p>
        </div>
        <div class="header-section-illustration">
          <img src="https://cdn-icons-png.flaticon.com/512/4815/4815720.png" 
               class="d-none d-md-block" alt="Historial Clínico" />
        </div>
      </div>

      <!-- Debug info (solo visible en modo desarrollo) -->
      <div v-if="isDevMode" class="debug-info mt-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h4>Información de depuración</h4>
          </div>
          <div class="card-body">
            <p><strong>Estado de carga:</strong> {{ loading ? 'Cargando...' : 'Completado' }}</p>
            <p><strong>Error:</strong> {{ error ? 'Sí' : 'No' }}</p>
            <p><strong>Mensaje de error:</strong> {{ errorMessage }}</p>
            <p><strong>Cantidad de clínicas:</strong> {{ clinics.length }}</p>
            <div v-if="clinics.length > 0">
              <hr>
              <h5>Primera clínica (ejemplo):</h5>
              <pre class="bg-light p-3 rounded">{{ JSON.stringify(clinics[0], null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="loading-text">Cargando tu historial clínico...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h3 class="error-title">¡Ups! Algo salió mal</h3>
        <p class="error-message">{{ errorMessage }}</p>
        <button class="btn btn-primary retry-btn" @click="fetchClinicHistory">
          <i class="fas fa-sync-alt me-2"></i> Intentar nuevamente
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="clinics.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <h3 class="empty-title">No has visitado ninguna clínica aún</h3>
        <p class="empty-message">Tu historial de clínicas visitadas aparecerá aquí.</p>
        <router-link to="/login-home" class="btn btn-primary empty-btn">
          <i class="fas fa-search me-2"></i> Buscar clínicas
        </router-link>
      </div>

      <!-- Content -->
      <div v-else class="row clinic-cards-container">
        <div v-for="clinic in clinics" :key="clinic.clinic_id" class="col-12 col-md-6 col-lg-4 mb-4">
          <div class="clinic-card">
            <div class="clinic-card-header">
              <div class="clinic-photo">
                <img :src="`${apiUrlImage}/${clinic.facade_photo}`" alt="Fachada de la clínica" @error="handleImageError">
              </div>
              <div class="clinic-badge">
                <span>{{ clinic.total_appointments }} visitas</span>
              </div>
            </div>
            <div class="clinic-card-body">
              <h3 class="clinic-name">{{ clinic.clinic_name }}</h3>
              <p class="clinic-address">
                <i class="fas fa-map-marker-alt me-2"></i>
                {{ clinic.address }}
              </p>
              <div class="clinic-doctor">
                <div class="doctor-photo">
                  <img :src="`${apiUrlImage}/${clinic.professional_photo}`" alt="Foto del profesional" @error="handleImageError">
                </div>
                <div class="doctor-info">
                  <h4 class="doctor-name">{{ clinic.professional_first_name }} {{ clinic.professional_last_name }}</h4>
                  <p class="doctor-contact">
                    <span class="doctor-phone">{{ clinic.professional_phone }}</span>
                  </p>
                </div>
              </div>
              <p class="clinic-description">{{ clinic.description }}</p>
            </div>
            <div class="clinic-card-footer">
              <router-link :to="`/clinica/${clinic.clinic_id}`" class="btn btn-details">
                Ver detalles 
                <i class="fas fa-arrow-right ms-2"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/shared/HeaderComponent.vue';

export default {
  name: 'ClinicHistoryComponent',
  components: {
    HeaderComponent
  },
  data() {
    return {
      loading: true,
      error: false,
      errorMessage: '',
      clinics: [],
      apiUrl: process.env.VUE_APP_API_URL,
      apiUrlImage: process.env.VUE_APP_API_URL_IMAGE,
      isDevMode: process.env.NODE_ENV === 'development',
    };
  },
  mounted() {
    this.fetchClinicHistory();
  },
  methods: {
    async fetchClinicHistory() {
      this.loading = true;
      this.error = false;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push({ name: 'Login' });
          return;
        }
        
        const response = await fetch(`${this.apiUrl}/appointments/patient-clinics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        console.log('Respuesta de la API:', data);
        
        if (response.ok) {
          // Verificar que status sea true y data exista
          if (data && data.status === true && data.data) {
            // Asegurarse de que data.data es un array
            if (Array.isArray(data.data)) {
              this.clinics = data.data;
              console.log('Clínicas cargadas:', this.clinics.length);
              
              // Apply enter animations after data is loaded
              if (this.clinics.length > 0) {
                this.$nextTick(() => {
                  this.animateCards();
                });
              }
            } else {
              console.error('La propiedad data.data no es un array:', data.data);
              this.clinics = [];
              this.error = true;
              this.errorMessage = 'Formato de datos incorrecto';
            }
          } else {
            this.clinics = [];
            this.errorMessage = (data && data.message) ? data.message : 'No se encontraron clínicas visitadas.';
          }
        } else {
          this.error = true;
          this.errorMessage = (data && data.message) ? data.message : 'Error al cargar el historial clínico.';
        }
      } catch (error) {
        console.error('Error fetching clinic history:', error);
        this.error = true;
        this.errorMessage = 'Error de conexión. Por favor, inténtalo más tarde.';
      } finally {
        this.loading = false;
      }
    },
    
    handleImageError(event) {
      // Replace broken images with a placeholder
      event.target.src = 'https://via.placeholder.com/150?text=Imagen+no+disponible';
    },
    
    animateCards() {
      const cards = document.querySelectorAll('.clinic-card');
      cards.forEach((card, index) => {
        // Add a staggered delay for each card
        setTimeout(() => {
          card.classList.add('animate-in');
        }, 100 * index);
      });
    }
  }
};
</script>

<style scoped>
.clinic-history-container {
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  width: 90%;  /* Ocupa el 90% del ancho disponible */
  max-width: 1400px; /* Limita el ancho máximo para pantallas muy grandes */
  margin: 0 auto;
  padding-bottom: 2rem;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 1rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #0d6efd, #6610f2);
  border-radius: 16px;
  color: white;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  height: min(25vh, 250px); /* Limita la altura al 25% de la altura de la ventana o 250px como máximo */
}

.header-section::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(30deg);
  pointer-events: none;
}

.header-section-content {
  z-index: 10;
  flex: 1;
}

.header-section-illustration {
  z-index: 10;
  max-width: 150px;
}

.header-section-illustration img {
  width: 100%;
  height: auto;
  animation: float 3s ease-in-out infinite;
}

.history-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  animation: fadeInUp 0.5s ease-out;
}

.history-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 500px;
  animation: fadeInUp 0.7s ease-out;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  min-height: 50vh; /* Asegura una altura mínima para centrar el spinner */
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: #6c757d;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
  min-height: 50vh; /* Asegura una altura mínima */
}

.error-icon {
  font-size: 3rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #343a40;
}

.error-message {
  color: #6c757d;
  margin-bottom: 1.5rem;
  max-width: 500px;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.25);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 2rem 0;
  min-height: 50vh; /* Asegura una altura mínima */
}

.empty-icon {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #343a40;
}

.empty-message {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.empty-btn {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.25);
}

/* Clinic Cards */
.clinic-cards-container {
  perspective: 1000px;
  min-height: 60vh; /* Altura mínima para asegurar que ocupe suficiente espacio */
}

.clinic-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  transform: translateY(30px);
  opacity: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.clinic-card.animate-in {
  transform: translateY(0);
  opacity: 1;
}

.clinic-card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.clinic-card-header {
  position: relative;
}

.clinic-photo {
  height: 180px;
  overflow: hidden;
}

.clinic-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.clinic-card:hover .clinic-photo img {
  transform: scale(1.05);
}

.clinic-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(13, 110, 253, 0.9);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 2;
  backdrop-filter: blur(4px);
}

.clinic-card-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.clinic-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #212529;
}

.clinic-address {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.clinic-doctor {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.doctor-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  border: 2px solid #e9ecef;
}

.doctor-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.doctor-info {
  flex: 1;
}

.doctor-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #212529;
}

.doctor-contact {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
  display: flex;
  align-items: center;
}

.clinic-description {
  font-size: 0.9rem;
  color: #495057;
  margin: 0.5rem 0 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.clinic-card-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
}

.btn-details {
  color: #0d6efd;
  background-color: transparent;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-details:hover {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.btn-details i {
  transition: transform 0.3s ease;
}

.btn-details:hover i {
  transform: translateX(4px);
}

/* Animations */
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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

/* Debug Info */
.debug-info {
  width: 100%;
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
  .container {
    width: 95%; /* En móviles usa más espacio horizontal */
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .header-section {
    flex-direction: column;
    padding: 1.5rem 1rem;
    text-align: center;
    height: auto;
  }
  
  .header-section-content {
    margin-bottom: 1rem;
  }
  
  .history-title {
    font-size: 2rem;
  }
  
  .history-subtitle {
    font-size: 1rem;
  }
  
  .clinic-photo {
    height: 150px;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .container {
    width: 85%; /* En tablets usa un poco más de espacio */
  }
  
  .history-title {
    font-size: 2.2rem;
  }
}

@media (min-width: 1600px) {
  .container {
    width: 80%; /* En pantallas muy grandes reduce un poco el ancho para no extender demasiado */
  }
}
</style> 