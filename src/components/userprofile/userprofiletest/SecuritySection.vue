<template>
  <div class="security-section">
    <div class="section-header">
      <div class="title-container">
        <span class="section-badge">Protección de cuenta</span>
        <h3 class="section-title">Seguridad</h3>
        <p class="section-subtitle">Configura opciones de seguridad</p>
      </div>
    </div>

    <!-- Configuración de Seguridad -->
    <div class="card settings-card">
      <div class="glow-effect"></div>
      <div class="card-header">
        <i class="fas fa-shield-alt header-icon"></i>
        <h4>Administra la seguridad de tu cuenta y protege tu información personal</h4>
      </div>
      <div class="card-body">

        <!-- Cambiar Contraseña -->
        <div class="setting-item">
          <div class="setting-icon-wrapper bg-light-blue">
            <i class="fas fa-lock text-blue"></i>
          </div>
          <div class="setting-content">
            <h5 class="setting-title">Cambiar contraseña</h5>
            <p class="setting-description">Actualiza tu contraseña periódicamente para mayor seguridad</p>
            <form @submit.prevent="updatePassword" class="settings-form mt-3">
              <div class="input-group-wrapper mb-3">
                <label for="currentPassword" class="form-label">Contraseña actual</label>
                <div class="password-input-group">
                  <input :type="showPassword.current ? 'text' : 'password'" class="form-control" id="currentPassword" v-model="passwords.current">
                  <button type="button" class="password-toggle" @click="togglePassword('current')">
                    <i :class="showPassword.current ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
              </div>
              <div class="input-group-wrapper mb-3">
                <label for="newPassword" class="form-label">Nueva contraseña</label>
                <div class="password-input-group">
                  <input :type="showPassword.new ? 'text' : 'password'" class="form-control" id="newPassword" v-model="passwords.new">
                  <button type="button" class="password-toggle" @click="togglePassword('new')">
                    <i :class="showPassword.new ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div class="password-strength mt-2" v-if="passwords.new">
                  <div class="strength-indicator" :class="passwordStrength"></div>
                  <span class="strength-text">{{ passwordStrengthText }}</span>
                </div>
              </div>
              <div class="input-group-wrapper mb-3">
                <label for="confirmPassword" class="form-label">Confirmar nueva contraseña</label>
                <div class="password-input-group">
                  <input :type="showPassword.confirm ? 'text' : 'password'" class="form-control" id="confirmPassword" v-model="passwords.confirm">
                  <button type="button" class="password-toggle" @click="togglePassword('confirm')">
                    <i :class="showPassword.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div class="passwords-match mt-1" v-if="passwords.new && passwords.confirm">
                  <template v-if="passwords.new === passwords.confirm">
                    <i class="fas fa-check-circle text-success me-1"></i>
                    <span class="text-success">Las contraseñas coinciden</span>
                  </template>
                  <template v-else>
                    <i class="fas fa-times-circle text-danger me-1"></i>
                    <span class="text-danger">Las contraseñas no coinciden</span>
                  </template>
                </div>
              </div>
              <button type="submit" class="btn btn-primary action-btn">
                <i class="fas fa-key me-2"></i>Actualizar contraseña
              </button>
            </form>
          </div>
        </div>

        <hr class="setting-divider">

        <!-- Autenticación de dos factores -->
        <div class="setting-item">
          <div class="setting-icon-wrapper bg-light-purple">
            <i class="fas fa-mobile-alt text-purple"></i>
          </div>
          <div class="setting-content">
            <div class="setting-header">
              <div>
                <h5 class="setting-title">Autenticación de dos factores</h5>
                <p class="setting-description">Añade una capa adicional de seguridad a tu cuenta</p>
              </div>
              <div class="form-check form-switch large-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="twoFactorSwitch" v-model="twoFactorEnabled">
              </div>
            </div>
            <div class="setting-details">
              <div class="setting-detail-item" :class="{'setting-detail-disabled': !twoFactorEnabled}">
                <i class="fas fa-sms me-2"></i>
                <span>Recibe un código de verificación en tu teléfono cada vez que inicies sesión</span>
              </div>
              <div class="setting-detail-item" :class="{'setting-detail-disabled': !twoFactorEnabled}">
                <i class="fas fa-lock me-2"></i>
                <span>Protege tu cuenta incluso si tu contraseña es comprometida</span>
              </div>
            </div>
          </div>
        </div>

        <hr class="setting-divider">

        <!-- Notificaciones de seguridad -->
        <div class="setting-item">
          <div class="setting-icon-wrapper bg-light-green">
            <i class="fas fa-bell text-green"></i>
          </div>
          <div class="setting-content">
            <div class="setting-header">
              <div>
                <h5 class="setting-title">Notificaciones de seguridad</h5>
                <p class="setting-description">Recibe alertas sobre actividades sospechosas</p>
              </div>
              <div class="form-check form-switch large-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="loginAlertsSwitch" v-model="loginAlertsEnabled">
              </div>
            </div>
            <div class="setting-details">
              <div class="setting-detail-item" :class="{'setting-detail-disabled': !loginAlertsEnabled}">
                <i class="fas fa-user-secret me-2"></i>
                <span>Recibe notificaciones cuando se detecte un inicio de sesión desde un dispositivo desconocido</span>
              </div>
              <div class="setting-detail-item" :class="{'setting-detail-disabled': !loginAlertsEnabled}">
                <i class="fas fa-globe-americas me-2"></i>
                <span>Alertas de ubicaciones inusuales para inicios de sesión</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zona de Peligro -->
    <div class="card settings-card danger-zone mt-4">
      <div class="danger-glow"></div>
      <div class="card-header">
        <i class="fas fa-exclamation-triangle header-icon text-danger"></i>
        <h4 class="text-danger">Zona de peligro</h4>
      </div>
      <div class="card-body">
        <div class="danger-content">
          <div>
            <h5 class="setting-title text-danger">Acciones irreversibles para tu cuenta</h5>
            <p class="setting-description">Las siguientes acciones son permanentes y no se pueden deshacer. Por favor, procede con precaución.</p>
          </div>
          <button class="btn btn-danger delete-btn" @click="confirmDeleteAccount">
            <i class="fas fa-trash-alt me-2"></i>
            Eliminar mi cuenta
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar cuenta -->
    <div class="delete-modal" v-if="showDeleteModal">
      <div class="delete-modal-content">
        <div class="delete-modal-header">
          <h5 class="modal-title"><i class="fas fa-exclamation-circle me-2"></i>Eliminar cuenta</h5>
          <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
        </div>
        <div class="delete-modal-body">
          <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible y perderás todos tus datos.</p>
          <div class="delete-confirm-input">
            <label for="confirmDelete">Escribe "ELIMINAR" para confirmar:</label>
            <input type="text" id="confirmDelete" v-model="deleteConfirmText" class="form-control" placeholder="ELIMINAR">
          </div>
        </div>
        <div class="delete-modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="showDeleteModal = false">Cancelar</button>
          <button type="button" class="btn btn-danger" @click="deleteAccount" :disabled="deleteConfirmText !== 'ELIMINAR'">
            Eliminar permanentemente
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SecuritySection',
  data() {
    return {
      passwords: {
        current: '',
        new: '',
        confirm: ''
      },
      showPassword: {
        current: false,
        new: false,
        confirm: false
      },
      twoFactorEnabled: false,
      loginAlertsEnabled: true, // Default based on image
      showDeleteModal: false,
      deleteConfirmText: ''
    }
  },
  computed: {
    passwordStrength() {
      if (!this.passwords.new) return '';
      
      const password = this.passwords.new;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      
      const count = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length;
      
      if (password.length < 6) return 'weak';
      if (password.length >= 8 && count >= 3) return 'strong';
      if (password.length >= 6 && count >= 2) return 'medium';
      return 'weak';
    },
    passwordStrengthText() {
      switch(this.passwordStrength) {
        case 'weak': return 'Débil';
        case 'medium': return 'Media';
        case 'strong': return 'Fuerte';
        default: return '';
      }
    }
  },
  methods: {
    togglePassword(field) {
      this.showPassword[field] = !this.showPassword[field];
    },
    updatePassword() {
      // Lógica para actualizar contraseña
      console.log('Actualizando contraseña...', this.passwords);
      
      // Validación básica
      if (!this.passwords.current) {
        alert('Por favor, ingresa tu contraseña actual');
        return;
      }
      
      if (this.passwords.new !== this.passwords.confirm) {
        alert('Las contraseñas no coinciden');
        return;
      }
      
      if (this.passwordStrength === 'weak') {
        alert('Por favor, elige una contraseña más segura');
        return;
      }
      
      // Aquí iría la llamada a la API
      alert('Contraseña actualizada con éxito (simulado)');
      
      // Reset fields
      this.passwords = {
        current: '',
        new: '',
        confirm: ''
      };
    },
    confirmDeleteAccount() {
      this.showDeleteModal = true;
      this.deleteConfirmText = '';
    },
    deleteAccount() {
      if (this.deleteConfirmText === 'ELIMINAR') {
        // Lógica para eliminar cuenta (llamada a API)
        console.warn('Eliminando cuenta...');
        alert('Cuenta eliminada con éxito (simulado)');
        this.showDeleteModal = false;
      }
    }
  }
}
</script>

<style scoped>
.security-section {
  position: relative;
}

.section-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E7EB;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #0d6efd, #36b9cc);
  border-radius: 3px;
}

.title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.section-badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #6B7280;
  margin: 0;
}

.card.settings-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  background-color: #FFFFFF;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.card.settings-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}

.glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #0d6efd, #36b9cc);
  transition: all 0.3s ease;
  opacity: 0.8;
  box-shadow: 0 2px 15px rgba(13, 110, 253, 0.3);
}

.danger-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #dc3545, #ff6b6b);
  transition: all 0.3s ease;
  opacity: 0.8;
  box-shadow: 0 2px 15px rgba(220, 53, 69, 0.3);
}

.card-header {
  background-color: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  padding: 18px 25px;
  display: flex;
  align-items: center;
}

.header-icon {
  font-size: 1.25rem;
  color: #0d6efd;
  margin-right: 15px;
}

.card-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
}

.card-body {
  padding: 25px;
}

.setting-item {
  display: flex;
  padding: 25px 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.setting-item:not(:last-child) {
  border-bottom: 1px solid #F3F4F6;
}

.setting-icon-wrapper {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.setting-item:hover .setting-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.setting-icon-wrapper i {
  font-size: 22px;
}

/* Colores específicos para iconos */
.bg-light-blue { 
  background: linear-gradient(145deg, #E0F2FE, #dceefb);
}
.text-blue { color: #0284C7; }

.bg-light-purple { 
  background: linear-gradient(145deg, #EDE9FE, #e5e1fa);
}
.text-purple { color: #7C3AED; }

.bg-light-green { 
  background: linear-gradient(145deg, #DCFCE7, #d2f5de);
}
.text-green { color: #22C55E; }

.setting-content {
  flex-grow: 1;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.setting-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 5px;
}

.setting-description {
  font-size: 0.9rem;
  color: #6B7280;
  margin-bottom: 0;
  line-height: 1.5;
}

.setting-divider {
  border: none;
  height: 1px;
  background-color: #F3F4F6;
  margin: 0;
}

/* Estilos para el formulario de contraseña */
.settings-form {
  max-width: 500px;
}

.input-group-wrapper {
  position: relative;
}

.form-label {
  font-weight: 500;
  font-size: 0.85rem;
  color: #374151;
  margin-bottom: 6px;
  display: block;
}

.password-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #D1D5DB;
  padding: 10px 12px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex-grow: 1;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.password-toggle {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #374151;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
}

.strength-indicator {
  height: 4px;
  flex-grow: 1;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-indicator.weak {
  background-color: #F87171;
  width: 30%;
}

.strength-indicator.medium {
  background-color: #FBBF24;
  width: 60%;
}

.strength-indicator.strong {
  background-color: #34D399;
  width: 100%;
}

.strength-text {
  font-size: 0.8rem;
}

.strength-text:after {
  content: '';
  background-color: currentColor;
}

.strength-indicator.weak + .strength-text {
  color: #F87171;
}

.strength-indicator.medium + .strength-text {
  color: #FBBF24;
}

.strength-indicator.strong + .strength-text {
  color: #34D399;
}

.passwords-match {
  font-size: 0.8rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Form Switch Estilos */
.large-switch {
  margin: 0;
}

.large-switch .form-check-input {
  width: 3em;
  height: 1.5em;
  cursor: pointer;
  background-color: #E5E7EB;
  border-color: #E5E7EB;
  box-shadow: none !important;
  transition: all 0.3s ease;
}

.large-switch .form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.setting-details {
  background-color: #F9FAFB;
  border-radius: 8px;
  padding: 12px 15px;
  margin-top: 15px;
}

.setting-detail-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #4B5563;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.setting-detail-item:last-child {
  margin-bottom: 0;
}

.setting-detail-item i {
  color: #0d6efd;
}

.setting-detail-disabled {
  opacity: 0.5;
}

/* Danger Zone */
.danger-zone {
  border-left: 4px solid #dc3545;
}

.danger-zone .card-header {
  background-color: #FEF2F2;
  border-bottom-color: #FECACA;
}

.danger-zone .card-header h4 {
  color: #B91C1C;
  font-weight: 600;
}

.danger-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.delete-btn {
  padding: 10px 20px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #dc3545, #c82333);
  border: none;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.25);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(220, 53, 69, 0.3);
}

/* Modal de confirmación */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.delete-modal-content {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s;
  overflow: hidden;
}

.delete-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #F3F4F6;
  background-color: #FEF2F2;
}

.modal-title {
  color: #B91C1C;
  font-weight: 600;
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

.delete-modal-body {
  padding: 20px;
}

.delete-confirm-input {
  margin-top: 15px;
}

.delete-confirm-input label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.delete-modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #F3F4F6;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Responsive */
/* Tablets (768px to 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .section-title {
    font-size: 1.6rem;
  }
  
  .card-header {
    padding: 15px 20px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .setting-item {
    padding: 20px;
  }
  
  .setting-icon-wrapper {
    width: 38px;
    height: 38px;
  }
}

/* Mobile devices (up to 767px) */
@media (max-width: 767.98px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .setting-item {
    flex-direction: column;
    padding: 20px 0;
  }
  
  .setting-icon-wrapper {
    margin-bottom: 15px;
    margin-right: 0;
  }
  
  .setting-header {
    flex-direction: row;
    align-items: center;
  }
  
  .danger-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .delete-btn {
    width: 100%;
  }
  
  .delete-modal-content {
    width: 95%;
  }
}

/* Small mobile devices (576px and down) */
@media (max-width: 575.98px) {
  .section-title {
    font-size: 1.35rem;
  }
  
  .section-subtitle {
    font-size: 0.85rem;
  }
  
  .card-header h4 {
    font-size: 1rem;
  }
  
  .header-icon {
    font-size: 1.1rem;
    margin-right: 10px;
  }
  
  .setting-title {
    font-size: 1rem;
  }
  
  .setting-description {
    font-size: 0.85rem;
  }
  
  .form-control {
    font-size: 0.85rem;
    padding: 8px 10px;
  }
  
  .password-toggle {
    right: 8px;
  }
  
  .settings-form {
    max-width: 100%;
  }
  
  .large-switch .form-check-input {
    width: 2.5em;
    height: 1.3em;
  }
  
  .setting-detail-item {
    font-size: 0.8rem;
  }
  
  .delete-modal-header {
    padding: 12px 15px;
  }
  
  .delete-modal-body, .delete-modal-footer {
    padding: 15px;
  }
  
  .modal-title {
    font-size: 1rem;
  }
}

/* Extra small mobile devices (375px and down) */
@media (max-width: 375px) {
  .section-badge {
    font-size: 0.65rem;
    padding: 2px 8px;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .card-body {
    padding: 12px 10px;
  }
  
  .card-header {
    padding: 12px 15px;
  }
  
  .action-btn {
    font-size: 0.85rem;
    padding: 6px 12px;
  }
  
  .setting-title {
    font-size: 0.95rem;
  }
  
  .setting-description {
    font-size: 0.8rem;
  }
  
  .form-label {
    font-size: 0.8rem;
  }
  
  .delete-confirm-input label {
    font-size: 0.85rem;
  }
}
</style> 