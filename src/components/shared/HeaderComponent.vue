<template>
  <div class="custom-header">
    <div class="container-fluid">
      <div class="header-content">
        <!-- Logo section -->
        <router-link to="/" class="header-logo" title="Ir a la página principal">
          <i class="fas fa-heartbeat text-primary me-2 logo-icon"></i>
          <span class="header-title">Salus Nexus</span>
        </router-link>
        
        <!-- User profile section -->
        <div class="header-user">
          <div v-if="isUserVerified" class="reviews-icon me-3" title="Calificar mis citas médicas" @click="navigateToReviews">
            <i class="fas fa-star"></i>
            <span class="reviews-text">Reseñas</span>
          </div>
          
          <!-- Profile dropdown -->
          <div class="dropdown">
            <!-- Show profile image if available -->
            <img 
              v-if="hasProfileImage"
              :src="userProfileImage" 
              class="profile-image dropdown-toggle" 
              id="profileDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              alt="Perfil"
            >
            <!-- Show initials if no profile image -->
            <div 
              v-else
              class="profile-initials dropdown-toggle"
              id="profileDropdown" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              {{ userInitials }}
            </div>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li v-if="isUserVerified">
                <router-link to="/perfil" class="dropdown-item">
                  <i class="fas fa-user me-2"></i> Ir al perfil
                </router-link>
              </li>
              <li v-if="isUserVerified">
                <router-link to="/mis-favoritos" class="dropdown-item">
                  <i class="fas fa-heart me-2"></i> Favoritos
                </router-link>
              </li>
              <li v-if="isUserVerified">
                <router-link to="/paciente/resenas" class="dropdown-item">
                  <i class="fas fa-star me-2"></i> Reseñas
                </router-link>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">
                  <i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL_IMAGE = process.env.VUE_APP_API_URL_IMAGE;
const API_URL = process.env.VUE_APP_API_URL;

export default {
  name: 'HeaderComponent',
  props: {
    isUserVerified: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasProfileImage: false,
      userProfileImage: '',
      userData: null,
    };
  },
  computed: {
    userInitials() {
      if (!this.userData) return '??';
      
      const firstName = this.userData.first_name || '';
      const lastName = this.userData.last_name || '';
      
      const firstInitial = firstName.charAt(0).toUpperCase();
      const lastInitial = lastName.charAt(0).toUpperCase();
      
      return firstInitial + lastInitial;
    }
  },
  async mounted() {
    await this.loadUserData();
    await this.loadUserProfileImage();
  },
  methods: {
    async loadUserData() {
      try {
        this.userData = JSON.parse(localStorage.getItem('user'));
        if (!this.userData) {
          const response = await fetch(`${API_URL}/userprofile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!response.ok) {
            return;
          }

          const data = await response.json();
          if (!data.status) {
            return;
          }

          this.userData = data.data;
          localStorage.setItem('user', JSON.stringify(this.userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },
    
    async loadUserProfileImage() {
      try {
        if (!this.userData) {
          this.userData = JSON.parse(localStorage.getItem('user'));
        }
        
        if (this.userData && this.userData.profile_photo_path) {
          this.userProfileImage = `${API_URL_IMAGE}/${this.userData.profile_photo_path}`;
          this.hasProfileImage = true;
        } else {
          this.hasProfileImage = false;
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
        this.hasProfileImage = false;
      }
    },
    
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push({ name: 'Login' });
    },
    
    navigateToReviews() {
      this.$router.push({ name: 'PatientReviews' });
    }
  }
}
</script>

<style scoped>
.custom-header {
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 10px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-bottom: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.header-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo-icon {
  transition: all 0.3s ease;
}

.header-logo:hover {
  background-color: #f0f7ff;
  transform: translateY(-2px);
}

.header-logo:hover .header-title {
  color: #0b5ed7;
}

.header-logo:hover .logo-icon {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0d6efd;
  margin-left: 5px;
}

.header-user {
  display: flex;
  align-items: center;
}

.reviews-icon {
  font-size: 1rem;
  cursor: pointer;
  color: #495057;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  background-color: #f0f7ff;
  padding: 6px 12px;
  border-radius: 20px;
}

.reviews-icon i {
  color: #ffc107;
  margin-right: 6px;
}

.reviews-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.reviews-icon:hover {
  color: #0d6efd;
  background-color: #e0eeff;
  transform: translateY(-2px);
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  border: 2px solid #f0f7ff;
  transition: border-color 0.3s ease;
}

.profile-image:hover {
  border-color: #0d6efd;
}

.profile-initials {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  background-color: #0d6efd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid #f0f7ff;
  transition: background-color 0.3s ease;
}

.profile-initials:hover {
  background-color: #0b5ed7;
  border-color: #0d6efd;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 10px;
}

.dropdown-item {
  padding: 8px 20px;
  color: #495057;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f0f7ff;
  color: #0d6efd;
}

/* Media Queries */
@media (max-width: 768px) {
  .reviews-text {
    display: none;
  }
  
  .reviews-icon {
    padding: 6px;
  }
  
  .reviews-icon i {
    margin-right: 0;
  }
}
</style> 