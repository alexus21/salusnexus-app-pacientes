<template>
    <div class="container py-md-5 py-3">
        <!-- Elementos decorativos de fondo -->
        <div class="decorative-element decorative-element-1"></div>
        <div class="decorative-element decorative-element-2"></div>
        <div class="decorative-element decorative-element-3"></div>
        
        <div class="row align-items-center">
            <div class="col-md-6 text-md-start text-center">
                <div class="mb-md-4 mb-3">
                    <div class="badge-container mb-2">
                        <span class="badge bg-primary-soft">Plataforma Médica</span>
                    </div>
                    <h1 class="home-title display-4">
                        Gestión 
                        <span class="d-none d-md-inline"><br></span>
                        <span class="d-md-none d-inline"> </span>
                        de Salud 
                        <span class="d-none d-md-inline"><br></span>
                        <span class="d-md-none d-inline"> </span>
                        <span class="fw-bold">Simplificada</span>
                    </h1>
                </div>
                <div class="mb-md-5 mb-4">
                    <p class="home-description lead">
                        <i class="feature-icon fas fa-check-circle"></i> Una plataforma diseñada para que los profesionales
                        en el área de la salud gestionen sus citas, pacientes y
                        métricas de manera eficiente.
                    </p>
                    <div class="feature-list">
                        <div class="feature-item">
                            <i class="feature-icon fas fa-calendar-check"></i>
                            <span>Gestión de citas</span>
                        </div>
                        <div class="feature-item">
                            <i class="feature-icon fas fa-user-md"></i>
                            <span>Perfiles de pacientes</span>
                        </div>
                        <div class="feature-item">
                            <i class="feature-icon fas fa-chart-line"></i>
                            <span>Métricas y análisis</span>
                        </div>
                    </div>
                </div>
                <div class="d-grid gap-3 d-md-flex justify-content-md-start justify-content-center">
                    <button type="button"
                            class="btn btn-primary-custom btn-lg px-4 me-md-2 mb-2 mb-md-0"
                            @click="handleStartNowClick">
                        <i class="fas fa-play-circle me-2"></i>Comienza Ahora
                    </button>
                    <button type="button"
                            class="btn btn-secondary-custom btn-lg px-4"
                            @click="handleMoreInfoClick">
                        <i class="fas fa-info-circle me-2"></i>Más Información
                    </button>
                </div>
                <div class="trusted-by mt-4">
                    <p class="text-muted-darker small mb-2">Utilizado por profesionales de:</p>
                    <div class="trusted-logos">
                        <div class="trusted-logo">Hospital A</div>
                        <div class="trusted-logo">Clínica B</div>
                        <div class="trusted-logo">Centro C</div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mt-md-0 d-none d-md-block">
                <div class="text-center home-image-container">
                    <div class="image-frame">
                        <img src="/home-picture.svg"
                             alt="Ilustración SalusNexus"
                             class="img-fluid home-image"/>
                    </div>
                    <div class="floating-bubble bubble-1">
                        <i class="fas fa-calendar"></i>
                    </div>
                    <div class="floating-bubble bubble-2">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="floating-bubble bubble-3">
                        <i class="fas fa-stethoscope"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Versión móvil de la imagen como fondo (solo visible en móvil) -->
        <div class="mobile-background-image d-md-none"></div>
        
        <!-- Indicador de scroll mejorado -->
        <div class="scroll-indicator-wrapper">
            <div class="scroll-text">Descubre más</div>
            <div class="scroll-indicator">
                <a href="#benefits" class="scroll-down">
                    <i class="fas fa-chevron-down"></i>
                </a>
            </div>
        </div>
        
        <!-- Nueva sección de beneficios para llenar el espacio vacío -->
        <div id="benefits" class="benefits-section mt-5 pt-md-5">
            <div class="section-header text-center mb-5">
                <h2 class="section-title">Beneficios que nos distinguen</h2>
                <p class="section-subtitle">Descubre por qué los profesionales de salud confían en nuestra plataforma</p>
            </div>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="benefit-card">
                        <div class="benefit-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h3 class="benefit-title">Ahorra tiempo</h3>
                        <p class="benefit-description">
                            Gestiona tus citas y pacientes en un solo lugar, reduciendo tareas administrativas hasta en un 40%.
                        </p>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="benefit-card">
                        <div class="benefit-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <h3 class="benefit-title">Acceso móvil</h3>
                        <p class="benefit-description">
                            Mantente conectado con tus pacientes desde cualquier lugar y dispositivo con nuestra app responsiva.
                        </p>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="benefit-card">
                        <div class="benefit-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3 class="benefit-title">Seguridad garantizada</h3>
                        <p class="benefit-description">
                            Protección de datos de pacientes con encriptación avanzada y cumplimiento de normativas de salud.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "HomeComponent",
    methods: {
        handleMoreInfoClick() {
            console.log('More Info button clicked');
        },
        handleStartNowClick() {
            this.$router.push({name: 'PatientsSubscriptionPlans'});
        }
    }
}
</script>

<style scoped>
body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* Contenedor principal con gradiente mejorado */
.container {
    background: linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 50%, #F8FBFF 100%);
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
    padding-bottom: 3rem !important;
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
}

.decorative-element-2 {
    width: 100px;
    height: 100px;
    bottom: 50px;
    left: 15%;
}

.decorative-element-3 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    right: 10%;
}

/* Badge en la parte superior */
.badge-container {
    animation: fadeInDown 0.8s;
}

.bg-primary-soft {
    background-color: rgba(13, 110, 253, 0.1);
    color: #0d6efd;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
}

/* Título con animación */
.home-title {
    font-family: "Georgia", Times, serif;
    color: #1a2b48;
    line-height: 1.2;
    letter-spacing: -0.5px;
    animation: fadeInUp 0.8s;
}

/* Descripción con más espaciado y elementos de feature */
.home-description {
    color: #444;
    line-height: 1.6;
    margin-bottom: 1.2rem;
    animation: fadeInUp 1s;
}

.feature-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1.5rem;
    animation: fadeInUp 1.2s;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(255, 255, 255, 0.6);
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
}

.feature-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    background-color: rgba(255, 255, 255, 0.9);
}

.feature-icon {
    color: #0d6efd;
    margin-right: 0.5rem;
}

/* Sección de confianza */
.trusted-by {
    animation: fadeInUp 1.4s;
}

.trusted-logos {
    display: flex;
    gap: 1.5rem;
    opacity: 0.7;
}

.trusted-logo {
    font-size: 0.9rem;
    font-weight: 600;
    color: #444;
}

/* Blobs mejorados detrás de la ilustración */
.col-md-6:last-child {
    position: relative;
}

.col-md-6:last-child::before,
.col-md-6:last-child::after {
    content: '';
    position: absolute;
    z-index: -1;
    border-radius: 50%;
    transition: all 5s ease-in-out;
    animation: pulseBlob 8s infinite alternate;
}

.col-md-6:last-child::before {
    width: 550px;
    height: 550px;
    background: rgba(178, 235, 242, 0.65);
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 70% 60% 65% 55%;
}

.col-md-6:last-child::after {
    width: 450px;
    height: 450px;
    background: rgba(230, 247, 255, 0.8);
    top: 55%;
    left: 45%;
    transform: translate(-50%, -50%);
    border-radius: 55% 65% 70% 45%;
    animation-delay: 2s;
}

/* Contenedor de imagen con tercer blob */
.home-image-container {
    position: relative;
    animation: fadeIn 1.2s;
}

.home-image-container::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: rgba(173, 216, 230, 0.5);
    top: 60%;
    left: 55%;
    transform: translate(-50%, -50%);
    border-radius: 60% 40% 65% 35%;
    z-index: -1;
    animation: pulseBlob 6s infinite alternate;
    animation-delay: 1s;
}

/* Burbujas flotantes */
.floating-bubble {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: white;
    color: #0d6efd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    animation: float 6s infinite ease-in-out;
}

.bubble-1 {
    top: 20%;
    right: 15%;
    animation-delay: 0s;
}

.bubble-2 {
    top: 50%;
    right: 8%;
    animation-delay: 2s;
}

.bubble-3 {
    bottom: 25%;
    right: 20%;
    animation-delay: 3s;
}

/* Imagen principal con sombra más sutil */
.home-image {
    max-width: 90%;
    height: auto;
    filter: drop-shadow(0 10px 15px rgba(208, 208, 208, 0.12));
    position: relative;
    z-index: 1;
    transition: transform 0.5s ease;
}

.home-image:hover {
    transform: translateY(-2px);
}

/* Indicador de scroll mejorado */
.scroll-indicator-wrapper {
    position: relative;
    text-align: center;
    margin-top: 2rem;
    margin-bottom: -2rem;
    padding-top: 1.5rem;
    z-index: 10;
}

.scroll-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: #0d6efd;
    margin-bottom: 0.5rem;
    opacity: 0.9;
}

.scroll-indicator {
    position: relative;
    display: inline-block;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: rgba(13, 110, 253, 0.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    animation: pulseIndicator 2s infinite;
}

.scroll-down {
    color: #0d6efd;
    opacity: 1;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.scroll-down:hover {
    background-color: rgba(13, 110, 253, 0.2);
}

.scroll-down i {
    animation: bounce 2s infinite;
}

@keyframes pulseIndicator {
    0% {
        box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(13, 110, 253, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(13, 110, 253, 0);
    }
}

/* Estilos de botones mejorados */
.btn {
    border-radius: 0.5rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-weight: 500;
    transition: all 0.3s ease;
    overflow: hidden;
    position: relative;
    z-index: 1;
}

.btn::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: -1;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.btn:hover::after {
    transform: translateX(0);
}

.btn-primary-custom {
    background-color: #0d6efd;
    border-color: #0d6efd;
    color: white;
}

.btn-primary-custom:hover {
    background-color: #0b5ed7;
    border-color: #0a58ca;
    color: white;
}

.btn-secondary-custom {
    background-color: white;
    border: 1px solid #ccc;
    color: #333;
}

.btn-secondary-custom:hover {
    background-color: #f8f9fa;
    border-color: #bbb;
    color: #000;
}

/* Animaciones */
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

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes pulseBlob {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        transform: translate(-50%, -50%) scale(1.05);
    }
}

@keyframes float {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-15px);
    }
    100% {
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-8px);
    }
    60% {
        transform: translateY(-4px);
    }
}

/* Media queries para ajustes responsivos */
@media (max-width: 767px) {
    .container {
        padding-top: 1.5rem;
        padding-bottom: 3rem;
        max-width: 100%;
        position: relative;
    }
    
    .feature-list {
        justify-content: center;
        margin-top: 1.2rem;
        gap: 0.8rem;
    }
    
    .feature-item {
        padding: 0.6rem 1.2rem;
    }
    
    .trusted-logos {
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .home-title {
        font-size: 2.2rem;
        line-height: 1.1;
        margin-bottom: 0.8rem;
    }
    
    .lead {
        font-size: 1rem;
        line-height: 1.5;
        margin-bottom: 1.2rem;
    }
    
    .d-grid {
        width: 100%;
        max-width: 300px;
        margin-left: auto;
        margin-right: auto;
        gap: 1rem !important;
    }
    
    .d-grid .btn {
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        width: 100%;
        margin-bottom: 0.5rem;
    }
    
    .btn-lg {
        padding: 0.6rem 1.2rem !important;
        font-size: 1rem !important;
    }
    
    .scroll-indicator-wrapper {
        margin-top: 2rem;
        margin-bottom: -1rem;
    }
    
    .benefit-card {
        padding: 1.8rem;
        margin-bottom: 1.5rem;
    }
    
    .benefit-icon {
        width: 65px;
        height: 65px;
        margin-bottom: 1.2rem;
    }
    
    .benefit-icon i {
        font-size: 1.6rem;
    }
    
    .section-title {
        font-size: 1.8rem;
        margin-bottom: 1rem;
    }
    
    .section-subtitle {
        font-size: 1.05rem;
        padding: 0 1rem;
    }
}

:deep(.modal), :deep(.modal-backdrop) {
    z-index: 1050 !important;
}

/* Sección de beneficios */
.benefits-section {
    position: relative;
    z-index: 2;
    animation: fadeIn 1.2s;
}

.section-header {
    margin-bottom: 3rem;
}

.section-title {
    color: #1a2b48;
    font-size: 2rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
}

.section-subtitle {
    color: #444;
    font-size: 1.1rem;
    max-width: 700px;
    margin: 0 auto;
    font-weight: 400;
}

.benefit-card {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 1rem;
    padding: 2rem;
    height: 100%;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
}

.benefit-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #0d6efd, #36b9cc);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
}

.benefit-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.benefit-card:hover::before {
    transform: scaleX(1);
}

.benefit-icon {
    width: 70px;
    height: 70px;
    background: rgba(13, 110, 253, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
}

.benefit-icon i {
    font-size: 1.75rem;
    color: #0d6efd;
}

.benefit-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a2b48;
    margin-bottom: 1rem;
}

.benefit-description {
    color: #444;
    font-size: 0.95rem;
    line-height: 1.6;
}

/* Mejora del marco de imagen - simplificado sin efectos fuertes */
.image-frame {
    position: relative;
    padding: 5px;
    border-radius: 12px;
    background: transparent;
    z-index: 1;
    display: inline-block;
    transition: all 0.3s ease;
}

.image-frame:hover {
    transform: translateY(0);
    box-shadow: none;
}

/* Textos mejorados de contraste */
.text-muted-darker {
    color: #666 !important;
}

/* Imagen de fondo para móviles */
.mobile-background-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Comentado para resolver el error de ruta - se necesita ajustar la ruta correcta */
    /* background-image: url('/home-picture.svg'); */
    background-color: rgba(208, 235, 255, 0.1); /* Fondo alternativo sutil */
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    opacity: 0.05;
    z-index: -1;
    pointer-events: none;
}
</style>