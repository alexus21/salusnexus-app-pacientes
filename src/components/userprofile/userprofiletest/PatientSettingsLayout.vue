<template>
  <div class="patient-settings-layout">
    <!-- Elementos decorativos de fondo -->
    <div class="decorative-blob blob-1"></div>
    <div class="decorative-blob blob-2"></div>
    <div class="decorative-blob blob-3"></div>
    
    <div class="container-fluid">
      <div class="row g-0">
        <div class="col-md-3 col-lg-2 sidebar-container">
          <SettingsSidebar />
        </div>
        <div class="col-md-9 col-lg-10 content-container">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsSidebar from './SettingsSidebar.vue';

export default {
  name: 'PatientSettingsLayout',
  components: {
    SettingsSidebar
  }
}
</script>

<style scoped>
.patient-settings-layout {
  padding-top: 20px;
  background-color: #F0F8FF;
  min-height: calc(100vh - 60px);
  position: relative;
  overflow: hidden; /* Para controlar los blobs decorativos */
}

/* Elementos decorativos */
.decorative-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  z-index: 0;
  opacity: 0.05;
}

.blob-1 {
  background: linear-gradient(135deg, #0d6efd, #36b9cc);
  width: 600px;
  height: 600px;
  top: -300px;
  left: -200px;
  animation: float 15s ease-in-out infinite alternate;
}

.blob-2 {
  background: linear-gradient(135deg, #6f42c1, #0d6efd);
  width: 500px;
  height: 500px;
  bottom: -250px;
  right: -100px;
  animation: float 20s ease-in-out infinite alternate-reverse;
}

.blob-3 {
  background: linear-gradient(135deg, #2ecc71, #36b9cc);
  width: 300px;
  height: 300px;
  top: 40%;
  right: 15%;
  animation: float 18s ease-in-out infinite alternate;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

.container-fluid {
  position: relative;
  z-index: 1;
}

.sidebar-container {
  background-color: #FFFFFF;
  padding: 25px 0;
  border-right: 1px solid rgba(13, 110, 253, 0.1);
  min-height: calc(100vh - 80px);
  box-shadow: 0 4px 25px rgba(13, 110, 253, 0.07);
  position: relative;
  z-index: 10;
}

.content-container {
  padding: 30px 40px;
  background-color: #F8FBFF;
  position: relative;
  z-index: 5;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230d6efd' fill-opacity='0.015' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive adjustments */
/* Large desktop (1200px and up) */
@media (min-width: 1200px) {
  .content-container {
    padding: 35px 45px;
  }
}

/* Medium desktop (992px to 1199px) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  .content-container {
    padding: 30px 35px;
  }
}

/* Tablets (768px to 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .sidebar-container {
    flex: 0 0 auto;
    width: 25%; /* 3 columns on tablets */
    padding: 20px 0;
  }
  
  .content-container {
    flex: 0 0 auto;
    width: 75%; /* 9 columns on tablets */
    padding: 25px 30px;
  }
  
  .decorative-blob {
    opacity: 0.04;
  }
}

/* Mobile devices (up to 767px) */
@media (max-width: 767.98px) {
  .patient-settings-layout {
    padding-top: 0;
  }
  
  .sidebar-container {
    border-right: none;
    border-bottom: 1px solid rgba(13, 110, 253, 0.1);
    min-height: auto;
    margin-bottom: 10px;
    box-shadow: 0 4px 10px rgba(13, 110, 253, 0.07);
    padding: 15px 0 5px 0;
  }
  
  .content-container {
    padding: 20px;
  }
  
  .decorative-blob {
    opacity: 0.03; /* Reducir opacidad en móvil */
  }
}

/* Small mobile devices (576px and down) */
@media (max-width: 575.98px) {
  .content-container {
    padding: 15px 12px;
  }
  
  .decorative-blob {
    opacity: 0.02;
  }
  
  .blob-1, .blob-2, .blob-3 {
    transform: scale(0.7);
  }
}

/* Extra small mobile devices (375px and down) */
@media (max-width: 375px) {
  .content-container {
    padding: 12px 10px;
  }
}
</style>
  