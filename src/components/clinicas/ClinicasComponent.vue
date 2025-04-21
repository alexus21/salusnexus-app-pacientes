<template>
    <div class="main-container">
        <!-- Cabecera con título y descripción -->
        <div class="text-center mb-4 position-relative hero-section">
            <div class="decorative-element decorative-element-1"></div>
            <div class="decorative-element decorative-element-2"></div>
            <h1 class="clinic-title display-5">Encuentra tu clínica ideal</h1>
            <p class="clinic-description">
                Descubre las mejores clínicas en El Salvador para tu atención médica personalizada
            </p>

            <!-- Filtros rápidos -->
            <div class="quick-filters d-flex justify-content-center flex-wrap mt-4">
                <div class="filter-tag">
                    <i class="fas fa-certificate me-2"></i> Certificadas
                </div>
                <div class="filter-tag">
                    <i class="fas fa-award me-2"></i> Premiadas
                </div>
                <div class="filter-tag">
                    <i class="fas fa-bolt me-2"></i> Rápidas
                </div>
                <div class="filter-tag">
                    <i class="fas fa-calendar-check me-2"></i> Disponibilidad
                </div>
            </div>
        </div>

        <!-- Buscador -->
        <div class="search-container mb-4">
            <div class="search-box-wrapper">
                <div class="search-row">
                    <div class="search-input-container">
                    <span class="search-icon">
                      <i class="fas fa-search"></i>
                    </span>
                        <input v-model="searchQuery"
                               class="search-input"
                               placeholder="Buscar clínica, especialidad o médico..."
                               type="text">
                    </div>
                    <div class="search-actions">
                        <button class="filter-button" @click="showFilterDialog = true">
                            <i class="fas fa-filter me-2"></i> Filtros
                        </button>
                        <button class="search-button" @click="searchClinics">Buscar</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filtrar por especialidad -->
        <!-- <div class="specialty-filter mb-4">
          <h3 class="filter-title">Filtrar por especialidad</h3>
          <div class="specialty-chips">
            <div class="specialty-chip" :class="{ active: activeSpecialty === 'Medicina General' }" @click="filterBySpecialty('Medicina General')">
              Medicina General
            </div>
            <div class="specialty-chip" :class="{ active: activeSpecialty === 'Cardiología' }" @click="filterBySpecialty('Cardiología')">
              Cardiología
            </div>
            <div class="specialty-chip" :class="{ active: activeSpecialty === 'Medicina Interna' }" @click="filterBySpecialty('Medicina Interna')">
              Medicina Interna
            </div>
            <div class="specialty-chip" :class="{ active: activeSpecialty === 'Pediatría' }" @click="filterBySpecialty('Pediatría')">
              Pediatría
            </div>
            <div class="specialty-chip" :class="{ active: activeSpecialty === 'Neurología' }" @click="filterBySpecialty('Neurología')">
              Neurología
            </div>
            <div class="specialty-chip" :class="{ active: activeSpecialty === 'Ginecología' }" @click="filterBySpecialty('Ginecología')">
              Ginecología
            </div>
          </div>
        </div> -->

        <!-- Pestañas de filtrado -->
        <div class="filter-tabs mb-4">
            <div class="tab-container">
                <div :class="{ active: activeTab === 'todas' }" class="nav-tab" @click="setActiveTab('todas')">
                    Todas
                </div>
                <div :class="{ active: activeTab === 'cercanas' }" class="nav-tab" @click="setActiveTab('cercanas')">
                    Cercanas
                </div>
                <div :class="{ active: activeTab === 'populares' }" class="nav-tab" @click="setActiveTab('populares')">
                    Populares
                </div>
                <div :class="{ active: activeTab === 'nuevas' }" class="nav-tab" @click="setActiveTab('nuevas')">
                    Nuevas
                </div>
            </div>
        </div>

        <!-- Listado de clínicas -->
        <div class="clinics-section mb-5">
            <h2 class="section-title text-center mb-4">Clínicas Destacadas</h2>
            <div class="row">
                <div v-for="(clinic, index) in filteredClinicsList"
                     :key="index"
                     :data-aos-delay="index * 100"
                     class="col-lg-4 col-md-6 mb-4"
                     data-aos="fade-up">
                    <clinic-card
                        :clinic="clinic"
                        @toggle-favorite="toggleFavorite(index, clinic)"
                    />
                </div>
            </div>

            <!-- Estado vacío -->
            <div v-if="clinicsList.length === 0" class="empty-state text-center py-5" data-aos="fade-up">
                <i class="far fa-frown-open empty-icon"></i>
                <h3 class="empty-title">No se encontraron clínicas</h3>
                <p class="empty-description">
                    Intenta ajustar tus filtros de búsqueda o prueba con otros términos
                </p>
                <button class="btn btn-outline-primary" @click="resetFilters">
                    <i class="fas fa-sync-alt me-2"></i> Reiniciar filtros
                </button>
            </div>
        </div>

        <!-- Paginación -->
        <div class="pagination-container d-flex justify-content-center mb-4">
            <nav aria-label="Paginación de clínicas">
                <ul class="pagination">
                    <li class="page-item">
                        <a aria-label="Anterior" class="page-link" href="#">
                            <span>Anterior</span>
                        </a>
                    </li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item">
                        <a aria-label="Siguiente" class="page-link" href="#">
                            <span>Siguiente</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Diálogo de filtros -->
        <filter-dialog
            :show="showFilterDialog"
            @close="showFilterDialog = false"
            @apply-filters="handleApplyFilters"
        />
    </div>
</template>

<script>
import ClinicCard from './ClinicCard.vue';
import FilterDialog from './FilterDialog.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import swal from "sweetalert2";

const API_URL = process.env.VUE_APP_API_URL;
// const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;

export default {
    name: 'ClinicasComponent',
    components: {
        ClinicCard,
        FilterDialog
    },
    data() {
        return {
            MIN_KILOMETRES: 100,

            searchQuery: '',
            showFilterDialog: false,
            activeFilters: {},
            activeTab: 'todas',
            activeSpecialty: '',
            clinicsList: [],
            originalClinicsList: [],
            filteredClinicsList: [],
            favorites: [],
        };
    },
    created() {
        this.originalClinicsList = JSON.parse(JSON.stringify(this.clinicsList));
    },
    async mounted() {
        await this.fetchClinics().then(async () => {
            this.calculateDistances();
            await this.fetchMyFavorites();
            this.handleFavorites();
        });
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    },
    methods: {
        async fetchClinics() {
            const response = await fetch(API_URL + '/medical-clinics/view', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                console.error('Error al obtener clínicas:', response.statusText);
                return;
            }

            const data = await response.json();

            if (!data.status) {
                console.error('Error al obtener datos');
                return;
            }

            this.clinicsList = data.data;
            // Agregar isFavorite a this.clinicsList
            if (this.clinicsList.length > 0) {
                this.clinicsList = this.clinicsList.map(clinic => {
                    return {
                        ...clinic,
                        isFavorite: false
                    };
                });
            }
            this.originalClinicsList = JSON.parse(JSON.stringify(this.clinicsList));
            this.filteredClinicsList = this.clinicsList;
            localStorage.setItem('clinics', JSON.stringify(this.clinicsList));
        },
        async fetchMyFavorites(){
            try {
                const response = await fetch(API_URL + '/favorites/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    console.error('Error al obtener favoritos:', response.statusText);
                    return;
                }

                const data = await response.json();

                if (!data.status) {
                    console.error('Error en la respuesta del servidor:', data.message);
                    return;
                }

                this.favorites = data.data;
                console.log(this.favorites);
            } catch (error) {
                console.error('Error al obtener favoritos:', error);
            }
        },
        handleFavorites() {
            const clinics = JSON.parse(localStorage.getItem('clinics'));

            if(this.filteredClinicsList.length > 0) {
                const clinicsMap = new Map(this.filteredClinicsList.map(clinic => [clinic.id, clinic]));

                clinics.forEach(clinic => {
                    this.favorites.forEach(fav => {
                        if (fav.clinic_id === clinic.id) {
                            clinicsMap.get(clinic.id).isFavorite = true;
                        }
                    });
                });
            }
        },
        calculateDistances() {
            const clinics = JSON.parse(localStorage.getItem('clinics'));
            const user = JSON.parse(localStorage.getItem('user'));

            const userLocation = {
                lat: user.latitude,
                lng: user.longitude
            };

            if (this.clinicsList.length > 0) {
                this.clinicsList = clinics.map(clinic => {
                    const clinicLocation = {
                        lat: parseFloat(clinic.clinic_latitude),
                        lng: parseFloat(clinic.clinic_longitude)
                    };

                    const distance = this.calculateDistance(clinicLocation, userLocation);
                    /*console.log("Distancia: " + distance);
                    console.log("Distancia es menor a 10 km: " + (distance < 10));*/

                    return {
                        ...clinic,
                        distance: distance
                    };
                });
            }

            // console.log(this.clinicsList);
            this.filteredClinicsList = this.clinicsList.filter(clinic => clinic.distance < this.MIN_KILOMETRES);
        },
        calculateDistance(clinicLocation, userLocation) {
            let R = 6371; // Radio de la Tierra en km
            let rLat1 = clinicLocation.lat * (Math.PI / 180);
            let rLat2 = userLocation.lat * (Math.PI / 180);

            let deltaLat = (userLocation.lat - clinicLocation.lat) * (Math.PI / 180);
            let deltaLng = (userLocation.lng - clinicLocation.lng) * (Math.PI / 180);

            let a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(rLat1) * Math.cos(rLat2) *
                Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            let distance = R * c; // Distancia en km
            return parseFloat(distance.toFixed(2));
        },
        searchClinics() {
            console.log('Buscando:', this.searchQuery);
            // Aquí iría la lógica de búsqueda
            if (this.searchQuery.trim() === '') {
                this.clinicsList = JSON.parse(JSON.stringify(this.originalClinicsList));
            } else {
                const query = this.searchQuery.toLowerCase();
                this.clinicsList = this.originalClinicsList.filter(clinic =>
                    clinic.name.toLowerCase().includes(query) ||
                    clinic.specialty.toLowerCase().includes(query) ||
                    clinic.location.toLowerCase().includes(query)
                );
            }
        },
        async toggleFavorite(index, clinic) {
            if (this.clinicsList[index].isFavorite) {
                await this.deleteFavorite(index, clinic);
            } else {
                await this.addNewFavorite(index, clinic);
            }
        },
        async addNewFavorite(index, clinic) {
            try {
                const patient_id = JSON.parse(localStorage.getItem('user')).patient_profile_id;
                const is_verified = JSON.parse(localStorage.getItem('user')).verified;

                if (!is_verified) {
                    swal.fire({
                        title: 'Verifica tu cuenta',
                        text: 'Para agregar clínicas a favoritos, verifica tu cuenta primero.',
                        icon: 'warning',
                        confirmButtonText: 'Verificar ahora',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.$router.push({ name: 'VerifyPatientAccount' });
                        }
                    });
                    return;
                }

                const response = await fetch(API_URL + '/favorites/add', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        patient_id: patient_id,
                        clinic_id: clinic.id,
                    })
                });

                if (!response.ok) {
                    console.error('Error al agregar favorito:', response.statusText);
                    return;
                }

                const data = await response.json();

                if (!data.status) {
                    console.error('Error en la respuesta del servidor:', data.message);
                    return;
                }

                this.filteredClinicsList[index].isFavorite = true;
            } catch (error) {
                console.error('Error al agregar favorito:', error);
            } finally {
                await this.fetchMyFavorites();
            }
        },
        async deleteFavorite(index, clinic) {
            try {
                const patient_id = JSON.parse(localStorage.getItem('user')).patient_profile_id;

                const response = await fetch(API_URL + '/favorites/delete', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        patient_id: patient_id,
                        clinic_id: clinic.id,
                    })
                });

                if (!response.ok) {
                    console.error('Error al eliminar favorito:', response.statusText);
                    return;
                }

                const data = await response.json();

                if (!data.status) {
                    console.error('Error en la respuesta del servidor:', data.message);
                    return;
                }

                this.filteredClinicsList[index].isFavorite = false;
            } catch (error) {
                console.error('Error al eliminar favorito:', error);
            } finally {
                await this.fetchMyFavorites();
            }
        },
        setActiveTab(tab) {
            this.activeTab = tab;

            // Aplicar filtro según la pestaña seleccionada
            let filteredList = JSON.parse(JSON.stringify(this.originalClinicsList));

            if (tab === 'cercanas') {
                // En un caso real, se filtrarían por distancia
                filteredList = filteredList.filter(clinic =>
                    clinic.location.includes('San Salvador')
                );
            } else if (tab === 'populares') {
                // Filtrar por clínicas con badge Popular o por rating alto
                filteredList = filteredList.filter(clinic =>
                    clinic.badges.includes('Popular') || clinic.rating >= 4.5
                );
            } else if (tab === 'nuevas') {
                // Filtrar por clínicas con badge Nueva
                filteredList = filteredList.filter(clinic =>
                    clinic.badges.includes('Nueva')
                );
            }

            // Mantener filtro de especialidad si existe
            if (this.activeSpecialty) {
                filteredList = filteredList.filter(clinic =>
                    clinic.specialty === this.activeSpecialty
                );
            }

            this.clinicsList = filteredList;
        },
        filterBySpecialty(specialty) {
            if (this.activeSpecialty === specialty) {
                this.activeSpecialty = '';
                this.setActiveTab(this.activeTab); // Recargar con el filtro activo
            } else {
                this.activeSpecialty = specialty;

                // Aplicar filtro de especialidad
                let filteredList = JSON.parse(JSON.stringify(this.originalClinicsList));
                filteredList = filteredList.filter(clinic =>
                    clinic.specialty === specialty
                );

                // Mantener el filtro de la pestaña activa
                if (this.activeTab === 'cercanas') {
                    filteredList = filteredList.filter(clinic =>
                        clinic.location.includes('San Salvador')
                    );
                } else if (this.activeTab === 'populares') {
                    filteredList = filteredList.filter(clinic =>
                        clinic.badges.includes('Popular') || clinic.rating >= 4.5
                    );
                } else if (this.activeTab === 'nuevas') {
                    filteredList = filteredList.filter(clinic =>
                        clinic.badges.includes('Nueva')
                    );
                }

                this.clinicsList = filteredList;
            }
        },
        handleApplyFilters(filters) {
            console.log('Filtros aplicados:', filters);
            this.activeFilters = filters;

            // Aplicar filtros a la lista
            let filteredList = JSON.parse(JSON.stringify(this.originalClinicsList));

            // Filtro de especialidades
            if (filters.specialties && filters.specialties.length > 0) {
                filteredList = filteredList.filter(clinic =>
                    filters.specialties.includes(clinic.specialty)
                );
            }

            // Filtro de calificación
            if (filters.rating > 0) {
                filteredList = filteredList.filter(clinic =>
                    clinic.rating >= filters.rating
                );
            }

            // Filtro de disponibilidad
            if (filters.availability && filters.availability.length > 0) {
                filteredList = filteredList.filter(clinic => {
                    if (filters.availability.includes('today') && clinic.availability === 'Hoy') {
                        return true;
                    }
                    if (filters.availability.includes('tomorrow') && clinic.availability === 'Mañana') {
                        return true;
                    }
                    if (filters.availability.includes('week') &&
                        ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].includes(clinic.availability)) {
                        return true;
                    }
                    return false;
                });
            }

            // Filtro de ubicación
            if (filters.location) {
                const locationMap = {
                    'san-salvador': 'San Salvador',
                    'santa-tecla': 'Santa Tecla',
                    'santa-ana': 'Santa Ana',
                    'soyapango': 'Soyapango'
                };
                filteredList = filteredList.filter(clinic =>
                    clinic.location.includes(locationMap[filters.location] || '')
                );
            }

            this.clinicsList = filteredList;
        },
        resetFilters() {
            this.searchQuery = '';
            this.activeFilters = {};
            this.activeTab = 'todas';
            this.activeSpecialty = '';
            this.clinicsList = JSON.parse(JSON.stringify(this.originalClinicsList));

            // Resetear los chips de especialidad
            document.querySelectorAll('.specialty-chip').forEach(chip => {
                chip.classList.remove('active');
            });
        }
    }
};
</script>

<style scoped>
/* Estilos principales */
.main-container {
    width: 100%;
    position: relative;
    overflow: hidden;
    padding: 20px;
    margin-left: auto;
    margin-right: auto;
    background-color: #f8f9fa;
    min-height: 100vh;
}

/* Elementos decorativos */
.decorative-element {
    position: absolute;
    border-radius: 50%;
    opacity: 0.2;
    background: linear-gradient(45deg, #0d6efd, #36b9cc);
    z-index: -1;
}

.decorative-element-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    left: -150px;
}

.decorative-element-2 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    right: 10%;
}

/* Sección hero */
.hero-section {
    padding: 40px 0;
    background: linear-gradient(135deg, #f0f8ff, #f8fbff);
    border-radius: 16px;
    margin-bottom: 30px;
    animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Título y descripción */
.clinic-title {
    font-weight: 700;
    color: #1a2b48;
    background: linear-gradient(45deg, #0d6efd, #36b9cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    display: inline-block;
    margin-bottom: 15px;
    animation: titlePop 0.8s ease-out;
}

@keyframes titlePop {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.clinic-description {
    color: #444;
    max-width: 600px;
    margin: 0 auto;
    animation: fadeInUp 1s ease-out 0.2s both;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Filtros rápidos */
.quick-filters {
    gap: 12px;
    margin-top: 2rem;
    animation: fadeInUp 1s ease-out 0.4s both;
}

.filter-tag {
    background-color: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
    border-radius: 50px;
    padding: 6px 14px;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    cursor: pointer;
}

.filter-tag:hover {
    background-color: rgba(13, 110, 253, 0.2);
    transform: translateY(-2px);
}

.filter-tag i {
    font-size: 0.8rem;
}

/* Buscador */
.search-container {
    margin-bottom: 30px;
    animation: fadeInUp 1s ease-out 0.6s both;
}

.search-box-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 15px;
}

.search-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.search-input-container {
    flex: 1;
    position: relative;
}

.search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    font-size: 1.1rem;
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

.search-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filter-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: #0d6efd;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 12px 20px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.filter-button:hover {
    background-color: #f8f9fa;
}

.search-button {
    background-color: #0d6efd;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 25px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.search-button:hover {
    background-color: #0b5ed7;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.25);
}

/* Filtro por especialidad */
.specialty-filter {
    margin-bottom: 30px;
    animation: fadeInUp 1s ease-out 0.8s both;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
}

.filter-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a2b48;
    margin-bottom: 15px;
}

.specialty-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.specialty-chip {
    background-color: #f8f9fa;
    color: #495057;
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #dee2e6;
}

.specialty-chip:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
}

.specialty-chip.active {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
}

/* Pestañas de filtrado */
.filter-tabs {
    margin-bottom: 30px;
    border-bottom: 1px solid #dee2e6;
    animation: fadeInUp 1s ease-out 1s both;
}

.tab-container {
    display: flex;
    overflow-x: visible;
}

.nav-tab {
    padding: 12px 20px;
    color: #6c757d;
    cursor: pointer;
    position: relative;
    font-weight: 500;
    transition: all 0.3s ease;
}

.nav-tab:hover {
    color: #0d6efd;
}

.nav-tab.active {
    color: #0d6efd;
    font-weight: 600;
}

.nav-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #0d6efd;
    border-radius: 3px 3px 0 0;
    animation: tabIndicator 0.3s ease-out;
}

@keyframes tabIndicator {
    from {
        width: 0;
        left: 50%;
    }
    to {
        width: 100%;
        left: 0;
    }
}

/* Sección de clínicas */
.section-title {
    color: #1a2b48;
    font-weight: 600;
    position: relative;
    margin-bottom: 30px;
    animation: fadeInUp 1s ease-out 1.2s both;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    border-radius: 4px;
}

/* Estado vacío */
.empty-state {
    background-color: #f8f9fa;
    border-radius: 12px;
    padding: 40px 20px;
}

.empty-icon {
    font-size: 3rem;
    color: #6c757d;
    margin-bottom: 15px;
}

.empty-title {
    font-size: 1.5rem;
    color: #1a2b48;
    margin-bottom: 10px;
}

.empty-description {
    color: #6c757d;
    margin-bottom: 20px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.btn-outline-primary {
    color: #0d6efd;
    border-color: #0d6efd;
    border-radius: 6px;
    padding: 8px 16px;
    transition: all 0.3s ease;
}

.btn-outline-primary:hover {
    background-color: #0d6efd;
    color: white;
    transform: translateY(-2px);
}

/* Paginación */
.pagination-container {
    animation: fadeInUp 1s ease-out 1.4s both;
}

.pagination .page-link {
    color: #444;
    border: none;
    padding: 10px 16px;
    margin: 0 5px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.pagination .page-link:hover {
    background-color: #f0f7ff;
    color: #0d6efd;
}

.pagination .page-item.active .page-link {
    background-color: #0d6efd;
    color: white;
    box-shadow: 0 2px 5px rgba(13, 110, 253, .25);
}

/* Responsividad */
@media (max-width: 768px) {
    .search-row {
        flex-direction: column;
        padding: 10px 15px;
        border-radius: 12px;
    }

    .search-input-container {
        width: 100%;
        margin-bottom: 10px;
    }

    .search-actions {
        width: 100%;
        justify-content: space-between;
    }

    .filter-button, .search-button {
        flex: 1;
        text-align: center;
    }

    .specialty-chips {
        overflow-x: auto;
        padding-bottom: 10px;
        flex-wrap: nowrap;
    }

    .specialty-chip {
        white-space: nowrap;
    }

    .tab-container {
        justify-content: space-between;
    }

    .nav-tab {
        flex: 1;
        text-align: center;
        padding: 10px;
    }
}

@media (max-width: 576px) {
    .filter-tag {
        font-size: 0.8rem;
        padding: 5px 10px;
    }

    .search-button, .filter-button {
        padding: 8px 12px;
        font-size: 0.9rem;
    }

    .section-title {
        font-size: 1.5rem;
    }
}
</style> 