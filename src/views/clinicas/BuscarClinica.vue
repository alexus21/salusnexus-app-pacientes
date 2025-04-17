<template>
  <div class="buscar-clinica-container">
    <!-- Header de búsqueda -->
    <div class="search-header">
      <!-- Formulario de búsqueda -->
      <div class="search-form-wrapper">
        <div class="search-form">
          <div class="input-container">
            <i class="search-icon fas fa-search"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="search-input" 
              placeholder="Buscar por nombre, especialidad o ubicación"
            >
            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <button @click="toggleFiltersSidebar" class="filter-btn">
            <i class="fas fa-sliders-h me-2"></i> Filtros
          </button>
        </div>
      </div>
      
      <!-- Filtros rápidos -->
      <div class="quick-filters">
        <div class="filter-badges">
          <div 
            v-for="filter in quickFilters" 
            :key="filter.id"
            @click="toggleQuickFilter(filter.id)"
            :class="['filter-badge', { 'active': activeQuickFilters.includes(filter.id) }]"
          >
            <i :class="filter.icon"></i>
            {{ filter.name }}
          </div>
        </div>
      </div>
      
      <!-- Tabs de navegación -->
      <div class="tabs-container">
        <ul class="nav-tabs">
          <li 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="setActiveTab(tab.id)"
            :class="['nav-tab', { 'active': activeTab === tab.id }]"
          >
            <i :class="tab.icon"></i>
            {{ tab.name }}
            <span class="count-badge">{{ tab.count }}</span>
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Contenido de búsqueda -->
    <div class="search-content">
      <div class="results-header">
        <div class="results-count">
          {{ filteredClinics.length }} clínicas encontradas
        </div>
        <div class="sorting-options">
          <button @click="showSortOptions = !showSortOptions" class="sort-btn">
            <i class="fas fa-sort"></i>
            {{ sortOptions.find(opt => opt.id === activeSortOption).name }}
            <i class="fas fa-chevron-down ms-1"></i>
          </button>
          <div v-if="showSortOptions" class="sort-dropdown">
            <div 
              v-for="option in sortOptions" 
              :key="option.id"
              @click="setSortOption(option.id)"
              :class="['sort-option', { 'active': activeSortOption === option.id }]"
            >
              {{ option.name }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Rejilla de clínicas -->
      <div v-if="filteredClinics.length > 0" class="clinics-grid">
        <div v-for="clinic in filteredClinics" :key="clinic.id" class="clinic-card-wrapper fade-in">
          <div class="clinic-card">
            <!-- Aquí iría el componente de tarjeta de clínica -->
            <div class="favorite-btn" @click="toggleClinicFavorite(clinic)">
              <i :class="['fas', clinic.isFavorite ? 'fa-heart' : 'fa-heart-o']"></i>
            </div>
            <!-- Estrellas basadas en rating -->
            <div class="clinic-rating">
              <span v-for="n in 5" :key="n" class="star">
                <i :class="['fas', getRatingStarClass(clinic.rating, n)]"></i>
              </span>
              <span class="rating-value">{{ clinic.rating }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mensaje sin resultados -->
      <div v-else class="empty-results fade-in">
        <div class="empty-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>No se encontraron resultados</h3>
        <p>Intenta con otros términos de búsqueda o elimina algunos filtros</p>
      </div>
    </div>
    
    <!-- Sidebar de filtros -->
    <div v-if="filtersSidebarOpen" class="sidebar-overlay" @click="toggleFiltersSidebar"></div>
    <div :class="['filters-sidebar', { 'open': filtersSidebarOpen }]">
      <div class="filters-sidebar-header">
        <h3>Filtros</h3>
        <button @click="toggleFiltersSidebar" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="filters-sidebar-content">
        <!-- Contenido de filtros -->
      </div>
      <div class="filters-sidebar-footer">
        <button @click="clearAllFilters" class="btn-clear-filters">Limpiar</button>
        <button @click="applyFilters" class="btn-apply-filters">Aplicar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuscarClinica',
  data() {
    return {
      searchQuery: '',
      activeTab: 'all',
      activeSortOption: 'rating',
      showSortOptions: false,
      activeQuickFilters: [],
      filtersSidebarOpen: false,
      quickFilters: [
        { id: 'certificated', name: 'Certificadas', icon: 'fas fa-certificate' },
        { id: 'awarded', name: 'Premiadas', icon: 'fas fa-award' },
        { id: 'parking', name: 'Estacionamiento', icon: 'fas fa-parking' },
        { id: 'appointment', name: 'Cita inmediata', icon: 'fas fa-calendar-check' },
        { id: 'insurances', name: 'Acepta seguros', icon: 'fas fa-shield-alt' }
      ],
      tabs: [
        { id: 'all', name: 'Todas', icon: 'fas fa-list', count: 120 },
        { id: 'nearby', name: 'Cercanas', icon: 'fas fa-map-marker-alt', count: 25 },
        { id: 'favorites', name: 'Favoritas', icon: 'fas fa-heart', count: 5 },
        { id: 'rated', name: 'Mejor calificadas', icon: 'fas fa-star', count: 45 },
        { id: 'visited', name: 'Visitadas recientemente', icon: 'fas fa-history', count: 3 }
      ],
      sortOptions: [
        { id: 'rating', name: 'Mejor calificación' },
        { id: 'distance', name: 'Más cercanas' },
        { id: 'name', name: 'Nombre A-Z' },
        { id: 'availability', name: 'Disponibilidad' }
      ],
      clinics: [
        // Datos de ejemplo
        { id: 1, name: 'Clínica 1', rating: 4.5, isFavorite: false },
        { id: 2, name: 'Clínica 2', rating: 3.2, isFavorite: true },
        // Más clínicas...
      ]
    };
  },
  computed: {
    filteredClinics() {
      let filtered = [...this.clinics];
      
      // Filtrar por término de búsqueda
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim();
        filtered = filtered.filter(clinic => 
          clinic.name.toLowerCase().includes(query)
          // Agregar más campos si es necesario
        );
      }
      
      // Filtrar por filtros rápidos
      if (this.activeQuickFilters.length) {
        // Implementar lógica de filtrado para cada filtro rápido
      }
      
      // Filtrar por tab activo
      if (this.activeTab !== 'all') {
        // Implementar lógica de filtrado para cada tab
      }
      
      // Ordenar
      filtered.sort((a, b) => {
        switch (this.activeSortOption) {
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          // Implementar otros casos de ordenamiento
          default:
            return 0;
        }
      });
      
      return filtered;
    }
  },
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId;
    },
    toggleQuickFilter(filterId) {
      if (this.activeQuickFilters.includes(filterId)) {
        this.activeQuickFilters = this.activeQuickFilters.filter(id => id !== filterId);
      } else {
        this.activeQuickFilters.push(filterId);
      }
    },
    setSortOption(optionId) {
      this.activeSortOption = optionId;
      this.showSortOptions = false;
    },
    toggleFiltersSidebar() {
      this.filtersSidebarOpen = !this.filtersSidebarOpen;
      if (this.filtersSidebarOpen) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    },
    clearAllFilters() {
      this.activeQuickFilters = [];
      this.searchQuery = '';
      // Restablecer otros filtros si existen
    },
    applyFilters() {
      this.toggleFiltersSidebar();
      // Lógica para aplicar filtros
    },
    toggleClinicFavorite(clinic) {
      clinic.isFavorite = !clinic.isFavorite;
      // Aquí se implementaría la lógica para guardar en base de datos
    },
    getRatingStarClass(rating, position) {
      if (rating >= position) {
        return 'fa-star'; // Estrella completa
      } else if (rating >= position - 0.5) {
        return 'fa-star-half-alt'; // Media estrella
      } else {
        return 'fa-star text-muted'; // Estrella vacía
      }
    }
  }
};
</script>

<style scoped>
.buscar-clinica-container {
  max-width: 100%;
  padding: 0;
}

/* Header de búsqueda */
.search-header {
  background-color: white;
  padding: 24px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #f0f0f0;
}

.search-form-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.search-form {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.input-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 2px solid transparent;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.input-container:focus-within {
  background-color: white;
  border-color: #0d6efd;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.15);
  transform: translateY(-2px);
}

.search-icon {
  color: #6c757d;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.input-container:focus-within .search-icon {
  color: #0d6efd;
}

.search-input {
  width: 100%;
  padding: 14px 12px;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #212529;
}

.search-input:focus {
  outline: none;
}

.clear-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background-color: rgba(108, 117, 125, 0.1);
  transform: rotate(90deg);
}

.filter-btn {
  background-color: #f8f9fa;
  border: none;
  padding: 0 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #495057;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.filter-btn:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Filtros rápidos */
.quick-filters {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  margin-bottom: 20px;
}

.filter-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.filter-badge {
  padding: 8px 16px;
  border-radius: 30px;
  background-color: rgba(248, 249, 250, 0.8);
  color: #495057;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  user-select: none;
  border: 1px solid #e9ecef;
  white-space: nowrap;
  margin-bottom: 8px;
}

.filter-badge i {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.filter-badge:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.filter-badge:hover i {
  transform: rotate(15deg);
}

.filter-badge.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.25);
}

/* Tabs de navegación */
.tabs-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  overflow-x: hidden;
}

.nav-tabs {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 24px;
  flex-wrap: wrap;
  padding-bottom: 4px;
}

.nav-tab {
  padding: 12px 0;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.nav-tab i {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.nav-tab:hover {
  color: #495057;
}

.nav-tab:hover i {
  transform: translateY(-2px);
}

.nav-tab.active {
  color: #0d6efd;
  font-weight: 600;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #0d6efd;
  border-radius: 3px 3px 0 0;
  animation: slideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes slideIn {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 1; }
}

.count-badge {
  font-size: 0.7rem;
  background-color: #f1f4f9;
  color: #4a5568;
  border-radius: 20px;
  padding: 2px 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.nav-tab.active .count-badge {
  background-color: #0d6efd;
  color: white;
}

/* Contenido de la búsqueda */
.search-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-count {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.sorting-options {
  position: relative;
}

.sort-btn {
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.sort-btn:hover {
  background-color: #f8f9fa;
}

.sort-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 180px;
  z-index: 10;
  animation: fadeInDown 0.3s ease;
}

.sort-option {
  padding: 10px 16px;
  font-size: 0.9rem;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-option:hover {
  background-color: #f8f9fa;
}

.sort-option.active {
  color: #0d6efd;
  font-weight: 500;
  background-color: rgba(13, 110, 253, 0.08);
}

/* Rejilla de clínicas */
.clinics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.clinic-card-wrapper {
  height: 100%;
}

/* Tarjeta de clínica */
.clinic-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
}

.clinic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.favorite-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 2;
}

.favorite-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.favorite-btn i {
  transition: all 0.3s ease;
}

.favorite-btn.active i {
  color: #ff3366;
  animation: heartBeat 0.3s ease-in-out;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1); }
  75% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.clinic-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star {
  color: #ffc107;
}

.star .text-muted {
  color: #e2e2e2;
}

.rating-value {
  font-weight: 600;
  margin-left: 4px;
}

/* Mensaje sin resultados */
.empty-results {
  text-align: center;
  padding: 60px 0;
  color: #6c757d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  color: #dee2e6;
}

.empty-results h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #495057;
}

.empty-results p {
  font-size: 1rem;
  color: #6c757d;
}

/* Sidebar de filtros */
.filters-sidebar {
  position: fixed;
  top: 0;
  right: -100%;
  width: 360px;
  height: 100vh;
  background-color: white;
  z-index: 1000;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.filters-sidebar.open {
  right: 0;
}

.filters-sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filters-sidebar-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #6c757d;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(108, 117, 125, 0.1);
}

.filters-sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.filters-sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
}

.btn-clear-filters {
  flex: 1;
  background: none;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  color: #495057;
  transition: all 0.3s ease;
}

.btn-clear-filters:hover {
  background-color: #f8f9fa;
}

.btn-apply-filters {
  flex: 1;
  background-color: #0d6efd;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
}

.btn-apply-filters:hover {
  background-color: #0b5ed7;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

/* Animaciones */
.fade-in {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 992px) {
  .clinics-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .filter-badges {
    gap: 8px;
  }
  
  .filter-badge {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-btn {
    height: 50px;
  }
  
  .clinics-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-sidebar {
    width: 85%;
  }
}

@media (max-width: 576px) {
  .search-form-wrapper, 
  .quick-filters, 
  .tabs-container, 
  .search-content {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .nav-tabs {
    gap: 16px;
  }
  
  .nav-tab {
    font-size: 0.9rem;
  }
}
</style>