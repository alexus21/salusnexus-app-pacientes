<template>
    <div class="medipro-dashboard-container">
        <!-- Header de MediPro -->
        <header class="medipro-header">
            <div class="header-content">
                <div class="header-left">
                    <router-link to="/" class="logo-link">
                        <i class="fas fa-heartbeat heart-icon"></i>
                        <span class="logo-text">Salus Nexus</span>
                    </router-link>

                    <nav class="main-nav">
                        <router-link to="/" class="nav-link active">Inicio</router-link>
                        <router-link to="/pacientes" class="nav-link">Pacientes</router-link>
                        <router-link to="/agenda" class="nav-link">Agenda</router-link>
                        <router-link to="/consultas" class="nav-link">Consultas</router-link>
                    </nav>
                </div>

                <div class="header-right">
                    <div class="search-box">
                        <input type="text" placeholder="Buscar..."/>
                        <i class="fas fa-search search-icon"></i>
                    </div>

                    <div class="notifications">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge"></span>
                    </div>

                    <div class="user-profile dropdown">
                        <img
                            :src="profilePicImage"
                            alt="Photo"
                            class="profile-img dropdown-toggle"
                            id="profileDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        />
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                            <li>
                                <a class="dropdown-item" href="#" @click.prevent="goToProfile">
                                    <i class="fas fa-user-circle"></i> Ir al perfil
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#" @click.prevent="logout">
                                    <i class="fas fa-sign-out-alt"></i> Cerrar sesión
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>

        <!-- Contenido principal -->
        <div class="dashboard-content">
            <div class="dashboard-header">
                <h1 class="welcome-title">
                    ¡{{(user && user.gender === 'masculino') ? 'Bienvenido' : 'Bienvenida'}},
                    {{user && user.first_name && user.last_name ? (partialName + '!') : 'Cargando...'}}
                </h1>
                <p class="welcome-subtitle">
                    Aquí tienes pacientes potenciales cercanos a tu ubicación que coinciden con
                    tu especialidad en Cardiología
                </p>
            </div>

            <div class="stats-cards d-none">
                <div class="stat-card">
                    <div class="stat-content">
                        <h3>Pacientes Potenciales</h3>
                        <div class="stat-value">28</div>
                    </div>
                    <div class="stat-icon user-icon">
                        <i class="fas fa-user"></i>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-content">
                        <h3>En tu área (5km)</h3>
                        <div class="stat-value">12</div>
                    </div>
                    <div class="stat-icon location-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-content">
                        <h3>Visitas a tu Perfil</h3>
                        <div class="stat-value">45</div>
                    </div>
                    <div class="stat-icon view-icon">
                        <i class="far fa-eye"></i>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-content">
                        <h3>Coincidencia</h3>
                        <div class="stat-value">78%</div>
                    </div>
                    <div class="stat-icon match-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                </div>
            </div>

            <div class="potential-patients-section">
                <div class="section-header">
                    <h2>Doctores y clinicas disponibles en tu área</h2>
                    <div class="filter-buttons">
                        <button
                            class="filter-btn"
                            :class="{ active: activeFilter === 'nearby' }"
                            @click="setActiveFilter('nearby')"
                        >
                            Cercanos a ti
                        </button>
                        <button
                            class="filter-btn"
                            :class="{ active: activeFilter === 'all' }"
                            @click="setActiveFilter('all')"
                        >
                            Todos los coincidentes
                        </button>
                    </div>
                </div>

                <div v-if="showEmptyState" class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>Amplía tu radio de búsqueda</h3>
                    <p>Hay 16 pacientes potenciales adicionales fuera de tu radio de 5km</p>
                    <button class="view-all-btn" @click="loadAllPatients">Ver Todos los Pacientes</button>
                </div>

                <div v-else class="patients-grid">
                    <div v-for="clinic in clinics" :key="clinic.id" class="patient-card">
                        <div class="patient-avatar">
                            <img :src="API_IMAGES_URL + clinic.facade_photo" alt="Avatar"/>
                        </div>
                        <div class="patient-info">
                            <h3 class="patient-name">{{ clinic.clinic_name }}</h3>
<!--                            <p class="patient-age">{{ clinic.age }} años</p>-->
                            <div class="patient-symptoms">
                                <i class="fas fa-file-medical"></i> Dr. {{ clinic.first_name + ' ' + clinic.last_name }}
                            </div>
                            <div class="patient-specialty">
                                <i class="fas fa-heartbeat"></i> {{ clinic.speciality_name }}
                            </div>
                            <div class="patient-location">
                                <i class="fas fa-map-marker-alt"></i> {{ clinic.clinic_address_reference }}, {{clinic.city_name}}
                            </div>
                        </div>
                        <div class="patient-actions">
                            <button class="view-profile-btn">Ver Perfil</button>
                            <button class="contact-btn">Contactar</button>
                        </div>
                        <div v-if="clinic.status" class="patient-status" :class="clinic.statusClass">
                            {{ clinic.status }}
                        </div>
                    </div>
                </div>
            </div>

<!--            <div class="analytics-section">
                <div class="analytics-section-header">
                    <h2>Análisis de Pacientes Potenciales</h2>
                    <div class="view-all-link">
                        <a href="#">Ver Completo <i class="fas fa-chevron-right"></i></a>
                    </div>
                </div>

                <div class="analytics-cards-container">
                    <div class="analytics-cards">
                        <div class="analytics-card">
                            <h3>Distribución por Problema</h3>
                            <div class="analytics-content">
                                <div class="analytics-value">42%</div>
                                <div class="analytics-label">Arritmias</div>
                            </div>
                            <p class="analytics-description">El problema más común entre pacientes potenciales</p>
                        </div>

                        <div class="analytics-card">
                            <h3>Rango de Edad</h3>
                            <div class="analytics-content">
                                <div class="analytics-value">45-65</div>
                                <div class="analytics-label">años</div>
                            </div>
                            <p class="analytics-description">Grupo de edad predominante en tu área</p>
                        </div>

                        <div class="analytics-card">
                            <h3>Tasa de Respuesta</h3>
                            <div class="analytics-content">
                                <div class="analytics-value">78%</div>
                                <div class="analytics-trend">+12%</div>
                            </div>
                            <p class="analytics-description">Pacientes que responden a tu primer contacto</p>
                        </div>
                    </div>
                </div>
            </div>-->
        </div>
    </div>
</template>

<script>

const API_IMAGES_URL = process.env.VUE_APP_API_URL_IMAGE;
const API_URL = process.env.VUE_APP_API_URL;

export default {
    name: 'LoginHome',
    data() {
        return {
            activeFilter: 'nearby',
            showEmptyState: false,
            patients: [
                {
                    id: 1,
                    name: 'Carlos Rodríguez',
                    age: 45,
                    symptoms: 'Dolor en el pecho y dificultad para respirar',
                    specialty: 'Cardiología - Arritmias',
                    location: 'Colonia Guatemala, San Miguel',
                    distance: 2.3,
                    status: 'Nuevo en la plataforma',
                    statusClass: 'status-new',
                    avatar: 'https://salusnexus-app.s3.us-east-2.amazonaws.com/images/2868b57e-c141-4948-97eb-84475e246755.png'
                },
                {
                    id: 2,
                    name: 'Ana Martínez',
                    age: 62,
                    symptoms: 'Hipertensión arterial y mareos frecuentes',
                    specialty: 'Cardiología - Hipertensión',
                    location: 'Colonia Guatemala, San Miguel',
                    distance: 4.1,
                    status: 'Ha visitado tu perfil',
                    statusClass: 'status-visited',
                    avatar: 'https://salusnexus-app.s3.us-east-2.amazonaws.com/images/2868b57e-c141-4948-97eb-84475e246755.png'
                },
                {
                    id: 3,
                    name: 'Luis Sánchez',
                    age: 53,
                    symptoms: 'Palpitaciones y fatiga',
                    specialty: 'Cardiología - Arritmias',
                    location: 'Colonia Guatemala, San Miguel',
                    distance: 1.8,
                    status: 'Nuevo en la plataforma',
                    statusClass: 'status-new',
                    avatar: 'https://salusnexus-app.s3.us-east-2.amazonaws.com/images/2868b57e-c141-4948-97eb-84475e246755.png'
                },
                {
                    id: 4,
                    name: 'Elena Gómez',
                    age: 58,
                    symptoms: 'Antecedentes de infarto, control preventivo',
                    specialty: 'Cardiología - Prevención',
                    location: 'Colonia Guatemala, San Miguel',
                    distance: 3.5,
                    status: 'Ha interactuado con publicaciones',
                    statusClass: 'status-interacted',
                    avatar: 'https://salusnexus-app.s3.us-east-2.amazonaws.com/images/2868b57e-c141-4948-97eb-84475e246755.png'
                }
            ],
            user: null,
            fullName: null,
            partialName: null,
            profilePicImage: null,
            welcomeMessage: '',
            clinics: null,
            API_IMAGES_URL: API_IMAGES_URL + '/',
        }
    },
    mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        if (!this.user) {
            this.$router.push({name: 'Login'});
        }
        this.fullName = this.getFullName();
        this.partialName = this.getPartialNme();
        this.setProfilePic();
        this.fetchClinics();
    },
    methods: {
        async fetchClinics(){
            try {
                const response = await fetch(API_URL + '/medical-clinics/view', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    if (error.message === 'Token has expired') {
                        this.logout();
                    }
                    return;
                }

                const data = await response.json();
                if (!data.status) {
                    return;
                }

                this.clinics = data.data;
                localStorage.setItem('clinics', JSON.stringify(this.clinics));
                console.log(this.clinics);
            } catch (error) {
                console.log(error);
            }
        },
        getFullName() {
            if (this.user && this.user.first_name && this.user.last_name) {
                return `${this.user.first_name} ${this.user.last_name}`;
            }
            return 'Cargando...';
        },
        setProfilePic(){
            if (this.user && this.user.profile_photo_path) {
                this.profilePicImage = API_IMAGES_URL + '/' + this.user.profile_photo_path;
            } else {
                this.profilePicImage = 'https://salusnexus-app.s3.us-east-2.amazonaws.com/images/2868b57e-c141-4948-97eb-84475e246755.png';
            }
        },
        getPartialNme(){
            //Obtener solo primer nombre y primer apellido
            if (this.user && this.user.first_name && this.user.last_name) {
                const firstName = this.user.first_name.split(' ')[0];
                const lastName = this.user.last_name.split(' ')[0];
                return `${firstName} ${lastName}`;
            }
        },
        setActiveFilter(filter) {
            this.activeFilter = filter;
            this.showEmptyState = (filter === 'all');
        },
        loadAllPatients() {
            this.showEmptyState = false;
            // Logic to load all patients would go here
        },
        goToProfile() {
            this.$router.push({name: 'UserProfile'});
        },
        logout() {
            localStorage.clear();
            window.location.reload();
        }
    }
}
</script>

<style scoped>
/* Estilos generales */
.medipro-dashboard-container {
    width: 100%;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f8fafc;
    font-size: 16px;
}

/* Estilos del header */
.medipro-header {
    width: 100%;
    height: 65px;
    background-color: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.header-content {
    max-width: 100%;
    height: 100%;
    margin: 0 auto;
    padding: 0 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
}

.logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    margin-right: 40px;
}

.heart-icon {
    color: #3b82f6;
    font-size: 24px;
    margin-right: 10px;
}

.logo-text {
    color: #3b82f6;
    font-weight: bold;
    font-size: 20px;
}

.main-nav {
    display: flex;
    gap: 25px;
}

.nav-link {
    color: #64748b;
    text-decoration: none;
    padding: 8px 12px;
    font-size: 15px;
    border-radius: 4px;
    transition: all 0.2s;
}

.nav-link:hover {
    color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
}

.nav-link.active {
    color: #3b82f6;
    font-weight: 500;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.search-box {
    position: relative;
}

.search-box input {
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: 8px 18px 8px 40px;
    font-size: 15px;
    width: 250px;
    background-color: #f9fafb;
    transition: all 0.2s;
}

.search-box input:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    font-size: 16px;
}

.notifications {
    position: relative;
    cursor: pointer;
}

.notifications i {
    color: #64748b;
    font-size: 20px;
}

.notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 8px;
    height: 8px;
    background-color: #3b82f6;
    border-radius: 50%;
    border: 2px solid #ffffff;
}

.user-profile {
    display: flex;
    align-items: center;
    cursor: default;
    position: relative;
}

.profile-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
}

/* Estilos del contenido */
.dashboard-content {
    max-width: 100%;
    padding: 40px 50px;
    margin: 0 auto;
}

.dashboard-header {
    margin-bottom: 40px;
}

.welcome-title {
    font-size: 28px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 10px;
}

.welcome-subtitle {
    color: #64748b;
    font-size: 18px;
}

.stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    border: 1px solid #f1f5f9;
}

.stat-content h3 {
    font-size: 15px;
    color: #64748b;
    margin-bottom: 12px;
}

.stat-value {
    font-size: 32px;
    font-weight: bold;
    color: #1f2937;
}

.stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    color: white;
    font-size: 22px;
}

.user-icon {
    background-color: #e6f0ff;
    color: #3b82f6;
}

.location-icon {
    background-color: #e6f5ff;
    color: #0ea5e9;
}

.view-icon {
    background-color: #f0f0ff;
    color: #6366f1;
}

.match-icon {
    background-color: #e6ffef;
    color: #10b981;
}

.dashboard-actions {
    margin-bottom: 40px;
}

.dashboard-btn {
    padding: 12px 24px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    transition: all 0.2s;
}

.dashboard-btn:hover {
    background-color: #2563eb;
    transform: translateY(-2px);
}

.dashboard-btn i {
    font-size: 18px;
}

.potential-patients-section {
    margin-bottom: 40px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.section-header h2 {
    font-size: 22px;
    font-weight: bold;
    color: #1f2937;
}

.filter-buttons {
    display: flex;
    gap: 12px;
}

.filter-btn {
    padding: 9px 18px;
    border: 1px solid #e5e7eb;
    border-radius: 22px;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 15px;
    color: #64748b;
}

.filter-btn:hover {
    border-color: #3b82f6;
    color: #3b82f6;
}

.filter-btn.active {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

.empty-state {
    background-color: white;
    border-radius: 10px;
    padding: 40px;
    text-align: center;
    border: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-icon {
    width: 65px;
    height: 65px;
    background-color: #e6f0ff;
    color: #3b82f6;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin: 0 auto 25px;
    font-size: 28px;
}

.empty-state h3 {
    font-size: 20px;
    margin-bottom: 12px;
    color: #1f2937;
}

.empty-state p {
    color: #64748b;
    margin-bottom: 25px;
    font-size: 16px;
}

.view-all-btn {
    padding: 12px 24px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 16px;
}

.view-all-btn:hover {
    background-color: #2563eb;
}

.patients-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

.patient-card {
    background-color: white;
    border-radius: 12px;
    border: 1px solid #f1f5f9;
    padding: 25px;
    display: grid;
    grid-template-columns: 70px 1fr;
    grid-template-areas:
    "avatar info"
    "actions actions";
    gap: 20px;
    position: relative;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.patient-avatar {
    grid-area: avatar;
}

.patient-avatar img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
}

.patient-info {
    grid-area: info;
}

.patient-name {
    font-size: 18px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 6px;
}

.patient-age {
    font-size: 15px;
    color: #64748b;
    margin-bottom: 10px;
}

.patient-symptoms,
.patient-specialty,
.patient-location {
    font-size: 15px;
    color: #4b5563;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.patient-symptoms i,
.patient-specialty i,
.patient-location i {
    font-size: 16px;
}

.distance {
    font-size: 13px;
    color: #64748b;
    margin-left: 12px;
}

.patient-actions {
    grid-area: actions;
    display: flex;
    gap: 12px;
    margin-top: 15px;
}

.view-profile-btn,
.contact-btn {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.2s;
}

.view-profile-btn {
    background-color: transparent;
    border: 1px solid #3b82f6;
    color: #3b82f6;
}

.view-profile-btn:hover {
    background-color: rgba(59, 130, 246, 0.05);
}

.contact-btn {
    background-color: #3b82f6;
    border: none;
    color: white;
}

.contact-btn:hover {
    background-color: #2563eb;
}

.patient-status {
    position: absolute;
    top: 25px;
    right: 25px;
    font-size: 13px;
    padding: 6px 12px;
    border-radius: 22px;
}

.status-new {
    background-color: #e6ffef;
    color: #10b981;
}

.status-visited {
    background-color: #fff6e6;
    color: #f59e0b;
}

.status-interacted {
    background-color: #e6f0ff;
    color: #3b82f6;
}

.analytics-section {
    position: relative;
    margin-top: 40px;
}

.analytics-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.analytics-section-header h2 {
    font-size: 22px;
    font-weight: bold;
    color: #1f2937;
}

.view-all-link {
    position: absolute;
    top: 0;
    right: 0;
}

.view-all-link a {
    color: #3b82f6;
    text-decoration: none;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
}

.view-all-link a:hover {
    color: #2563eb;
}

.analytics-cards-container {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
}

.analytics-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
}

.analytics-card {
    background-color: #f5f8ff;
    border-radius: 10px;
    padding: 25px;
}

.analytics-card h3 {
    font-size: 15px;
    color: #64748b;
    margin-bottom: 18px;
    font-weight: 500;
}

.analytics-content {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 10px;
}

.analytics-value {
    font-size: 30px;
    font-weight: bold;
    color: #1f2937;
    line-height: 1;
}

.analytics-label {
    font-size: 15px;
    color: #64748b;
    line-height: 1.5;
}

.analytics-trend {
    color: #10b981;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.5;
}

.analytics-description {
    font-size: 14px;
    color: #64748b;
    line-height: 1.4;
}

/* Media queries para responsividad */
@media (max-width: 1024px) {
    .dashboard-content {
        padding: 30px 25px;
    }

    .stats-cards {
        grid-template-columns: 1fr 1fr;
    }

    .analytics-cards {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .header-content {
        padding: 0 15px;
    }

    .main-nav {
        display: none;
    }

    .logo-text {
        font-size: 16px;
    }

    .search-box input {
        width: 150px;
    }

    .patients-grid {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .filter-buttons {
        width: 100%;
    }

    .filter-btn {
        flex: 1;
        text-align: center;
    }

    .analytics-cards {
        grid-template-columns: 1fr;
    }

    .analytics-cards-container {
        padding: 15px;
    }

    .analytics-section-header {
        margin-bottom: 15px;
    }

    .analytics-section-header h2 {
        font-size: 18px;
    }

    .view-all-link {
        position: static;
        margin-top: 5px;
    }
}

@media (max-width: 640px) {
    .stats-cards {
        grid-template-columns: 1fr;
    }

    .search-box {
        display: none;
    }

    .patient-card {
        grid-template-columns: 1fr;
        grid-template-areas:
      "avatar"
      "info"
      "actions";
    }

    .patient-avatar {
        display: flex;
        justify-content: center;
        margin-bottom: 15px;
    }

    .patient-avatar img {
        width: 70px;
        height: 70px;
    }

    .patient-status {
        position: static;
        margin-top: 10px;
        display: inline-block;
    }

    .view-all-link {
        text-align: left;
    }

    .welcome-title {
        font-size: 20px;
    }

    .welcome-subtitle {
        font-size: 14px;
    }
}

/* Soporte para dispositivos pequeños */
@media (max-width: 480px) {
    .header-content {
        padding: 0 10px;
    }

    .patient-actions {
        flex-direction: column;
    }

    .dashboard-btn {
        width: 100%;
        justify-content: center;
    }

    .view-all-btn {
        width: 100%;
    }
}

/* Personalización del dropdown de Bootstrap */
.dropdown-menu {
    padding: 8px 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    min-width: 180px;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    font-size: 14px;
    color: #374151;
}

.dropdown-item i {
    width: 16px;
    text-align: center;
    color: #6b7280;
}

.dropdown-item:hover {
    background-color: #f3f4f6;
    color: #1f2937;
}

.dropdown-item:hover i {
    color: #3b82f6;
}
</style> 