<template>
  <div class="settings-sidebar">
    <div class="user-info">
      <router-link to="/" class="avatar-link">
        <div class="avatar-container">
          <div class="avatar-placeholder">
            <img :src="profile_photo" alt="Avatar" class="avatar-img" v-if="profile_photo">
            <div class="avatar-initials" v-else>{{ userInitials }}</div>
            <div class="avatar-overlay">
              <i class="fas fa-camera"></i>
            </div>
          </div>
        </div>
      </router-link>
      <h5 class="user-name">{{ userFullName }}</h5>
      <p class="user-email">{{ user?.email || 'Cargando...' }}</p>
      <button class="btn btn-outline-primary btn-sm edit-profile-btn">
        <i class="fas fa-pencil-alt me-1"></i> Editar perfil
      </button>
      
      <!-- Botón de toggle para móvil -->
      <button class="mobile-nav-toggle" @click="toggleMobileNav">
        <i :class="[showMobileNav ? 'fas fa-chevron-up' : 'fas fa-chevron-down']"></i>
        {{ showMobileNav ? 'Ocultar opciones' : 'Mostrar opciones' }}
      </button>
    </div>

    <div class="separator">
      <span></span>
    </div>

    <nav class="nav flex-column nav-pills" :class="{'mobile-nav-visible': showMobileNav}">
      <router-link to="/paciente/configuracion/perfil" class="nav-link" active-class="active">
        <i class="fas fa-user-circle nav-icon"></i> Mi Perfil
      </router-link>
      <router-link to="/paciente/configuracion/suscripcion" class="nav-link" active-class="active">
        <i class="fas fa-credit-card nav-icon"></i> Mi Suscripción
      </router-link>
      <router-link to="/paciente/configuracion/seguridad" class="nav-link" active-class="active">
        <i class="fas fa-shield-alt nav-icon"></i> Seguridad
      </router-link>
      <router-link to="/paciente/configuracion/notificaciones" class="nav-link" active-class="active">
        <i class="fas fa-bell nav-icon"></i> Notificaciones
      </router-link>
      <router-link to="/paciente/configuracion/configuracion" class="nav-link" active-class="active">
        <i class="fas fa-cog nav-icon"></i> Configuración
      </router-link>
    </nav>

    <div class="logout-section">
      <button class="btn btn-link logout-btn" @click="logout">
        <i class="fas fa-sign-out-alt"></i> Cerrar sesión
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsSidebar',
  props: {
    user: {
      type: Object,
      default: null
    },
    profile_photo: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showMobileNav: false // Estado para controlar visibilidad en móvil
    };
  },
  computed: {
    userFullName() {
      if (!this.user) return 'Cargando...';
      const firstName = this.user?.first_name?.split(' ')[0] || '';
      const lastName = this.user?.last_name?.split(' ')[0] || '';
      return `${firstName} ${lastName}`;
    },
    userInitials() {
      if (!this.user) return '??';
      const firstName = this.user?.first_name?.charAt(0).toUpperCase() || '';
      const lastName = this.user?.last_name?.charAt(0).toUpperCase() || '';
      return `${firstName}${lastName}`;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push({ name: 'Home' });
    },
    toggleMobileNav() {
      this.showMobileNav = !this.showMobileNav;
    }
  }
}
</script>

<style scoped>
.settings-sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 20px;
  position: relative;
}

.settings-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 3px;
  height: 70%;
  background: linear-gradient(to bottom, rgba(13, 110, 253, 0.2), rgba(54, 185, 204, 0.05));
  border-radius: 3px;
}

.user-info {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px 0;
  position: relative;
}

.avatar-container {
  position: relative;
  margin-bottom: 15px;
  display: inline-block;
}

.avatar-placeholder {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #E0F2FE, #dceefb);
  box-shadow: 8px 8px 16px rgba(13, 110, 253, 0.07), -8px -8px 16px #ffffff;
  color: #0d6efd;
  font-size: 24px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 2px solid rgba(13, 110, 253, 0.1);
}

.avatar-placeholder:hover {
  transform: scale(1.03);
  box-shadow: 10px 10px 20px rgba(13, 110, 253, 0.1), -10px -10px 20px #ffffff;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-initials {
  font-size: 32px;
  font-weight: 600;
  color: #0d6efd;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background-color: rgba(13, 110, 253, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.avatar-placeholder:hover .avatar-overlay {
  opacity: 1;
}

.user-name {
  margin-bottom: 5px;
  font-weight: 600;
  color: #0a2d5e;
  position: relative;
  display: inline-block;
}

.user-name::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #0d6efd, #36b9cc);
  transition: width 0.3s ease;
}

.user-info:hover .user-name::after {
  width: 70%;
}

.user-email {
  font-size: 0.875rem;
  color: #6B7280;
  margin-bottom: 15px;
}

.edit-profile-btn {
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(13, 110, 253, 0.15);
  border-color: rgba(13, 110, 253, 0.3);
  background-color: rgba(13, 110, 253, 0.03);
  color: #0d6efd;
}

.edit-profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
  background-color: rgba(13, 110, 253, 0.05);
  border-color: #0d6efd;
}

/* Botón de toggle para móvil - oculto por defecto */
.mobile-nav-toggle {
  display: none;
  width: 100%;
  margin-top: 15px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(13, 110, 253, 0.2);
  background-color: rgba(13, 110, 253, 0.05);
  color: #0d6efd;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  cursor: pointer;
  font-weight: 500;
  align-items: center;
  justify-content: center;
}

.mobile-nav-toggle i {
  margin-right: 6px;
  transition: transform 0.3s ease;
}

.mobile-nav-toggle:hover {
  background-color: rgba(13, 110, 253, 0.1);
}

.separator {
  position: relative;
  height: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.separator span {
  position: relative;
  display: inline-block;
  width: 80%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(13, 110, 253, 0.3), transparent);
}

.nav {
  flex-grow: 1;
  margin-bottom: 20px;
}

.nav-link {
  color: #0a2d5e;
  margin-bottom: 10px;
  padding: 12px 15px;
  border-radius: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 0 0 rgba(13, 110, 253, 0.15);
  background-color: transparent;
}

.nav-icon {
  margin-right: 12px;
  width: 20px;
  text-align: center;
  color: rgba(13, 110, 253, 0.7);
  transition: transform 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(13, 110, 253, 0.05);
  color: #0d6efd;
  box-shadow: inset 4px 0 0 0 #0d6efd;
}

.nav-link:hover .nav-icon {
  transform: scale(1.1);
  color: #0d6efd;
}

.nav-link.active {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.15), inset 4px 0 0 0 #0d6efd;
}

.nav-link.active .nav-icon {
  color: #0d6efd;
  transform: scale(1.1);
}

.logout-section {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(239, 68, 68, 0.1);
  text-align: center;
  position: relative;
}

.logout-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(239, 68, 68, 0.2), transparent);
}

.logout-btn {
  color: #EF4444;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  color: #DC2626;
  background-color: rgba(239, 68, 68, 0.08);
}

.logout-btn i {
  margin-right: 8px;
  transition: transform 0.3s ease;
}

.logout-btn:hover i {
  transform: translateX(-3px);
}

/* Responsive */
/* Tablets (768px to 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .avatar-placeholder {
    width: 80px;
    height: 80px;
  }
  
  .avatar-initials {
    font-size: 28px;
  }
  
  .nav-link {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  .nav-icon {
    margin-right: 10px;
  }
}

/* Mobile devices (up to 767px) */
@media (max-width: 767.98px) {
  .settings-sidebar {
    height: auto;
    padding: 10px 15px;
  }
  
  .settings-sidebar::before {
    display: none;
  }
  
  .user-info {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap; /* Permite que los elementos se envuelvan */
    align-items: center;
    text-align: left;
    padding: 10px 0;
    margin-bottom: 15px;
  }
  
  .avatar-container {
    margin-right: 15px;
    margin-bottom: 0;
  }
  
  .avatar-placeholder {
    width: 60px;
    height: 60px;
    font-size: 18px;
  }
  
  .avatar-initials {
    font-size: 22px;
  }
  
  .user-name, .user-email {
    margin-bottom: 3px;
  }
  
  .user-info .edit-profile-btn {
    margin-left: auto;
  }
  
  .separator {
    display: none;
  }
  
  /* Mostrar el botón de toggle para móvil */
  .mobile-nav-toggle {
    display: flex;
    order: 3;
    margin: 15px auto 0 auto;
  }
  
  /* Navegación en móvil - inicialmente oculta */
  .nav {
    flex-direction: column !important;
    padding-bottom: 10px;
    flex-grow: 0;
    margin-bottom: 15px;
    display: none;
    animation: slideDown 0.3s ease forwards;
  }
  
  /* Clase para mostrar la navegación cuando se hace click en el botón */
  .mobile-nav-visible {
    display: flex !important;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .nav-link {
    margin-bottom: 8px;
    margin-right: 0;
    white-space: normal;
    padding: 10px 15px;
  }
  
  .nav-link.active {
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.1), inset 4px 0 0 0 #0d6efd;
  }
  
  .nav-link:hover {
    box-shadow: inset 4px 0 0 0 #0d6efd;
  }
  
  .logout-section {
    border-top: none;
    padding-top: 10px;
    text-align: center;
    margin-top: 10px;
  }
  
  .logout-section::before {
    display: none;
  }
}

/* Small mobile devices (576px and down) */
@media (max-width: 575.98px) {
  .user-info {
    flex-wrap: wrap;
  }
  
  .user-name {
    font-size: 0.95rem;
  }
  
  .user-email {
    font-size: 0.8rem;
  }
  
  .edit-profile-btn {
    margin-top: 10px;
    width: 100%;
    margin-left: 0 !important;
  }
  
  .avatar-container {
    margin-right: 10px;
  }
  
  .avatar-placeholder {
    width: 50px;
    height: 50px;
  }
  
  .avatar-initials {
    font-size: 18px;
  }
  
  .nav-link {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
  
  .nav-icon {
    margin-right: 6px;
    font-size: 0.9rem;
  }
  
  .logout-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}

/* Extra small mobile devices (375px and down) */
@media (max-width: 375px) {
  .nav-link {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
  
  .nav-icon {
    margin-right: 5px;
  }
}
</style>