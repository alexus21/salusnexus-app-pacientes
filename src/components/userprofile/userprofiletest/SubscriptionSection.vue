<template>
  <div class="subscription-section">
    <div class="section-header">
      <div class="title-container">
        <span class="section-badge">Plan de suscripción</span>
        <h3 class="section-title">Mi Suscripción</h3>
        <p class="section-subtitle">Gestiona tu plan y método de pago</p>
      </div>
      <button 
        v-if="!isPremium" 
        class="btn btn-primary action-btn"
        @click="navigateToSubscriptionPlans"
      >
        <i class="fas fa-crown me-2"></i>Mejorar a Premium
      </button>
    </div>

    <!-- Plan de Suscripción -->
    <div v-if="user" class="card info-card">
      <div class="card-glow"></div>
      <div class="card-header">
        <i class="fas fa-star header-icon"></i>
        <h4>{{ subscriptionType }}</h4>
      </div>
      <div class="card-body">
        <div class="subscription-card">
          <div class="subscription-header">
            <div class="subscription-plan-info">
              <span 
                class="plan-badge" 
                :class="{'premium': isPremium, 'free': !isPremium}"
              >
                <i :class="isPremium ? 'fas fa-crown' : 'fas fa-star'"></i>{{ subscriptionType }}
              </span>
              <span class="plan-status">
                <i class="fas fa-circle"></i>
                {{ subscriptionStatus }}
              </span>
            </div>
            <div v-if="isPremium" class="next-billing">
              <i class="far fa-calendar-alt"></i>
              Próximo pago: {{ nextBillingDate }}
            </div>
          </div>
          
          <div class="subscription-details">
            <h5 class="included-title">Tu plan incluye:</h5>
            <ul class="features-list" style="margin-bottom: 24px;">
              <li v-for="(feature, index) in isPremium ? premiumFeatures : freeFeatures" :key="index">
                <i class="fas fa-check"></i>
                {{ feature }}
              </li>
            </ul>
            <div v-if="isPremium" class="payment-method-section">
              <h5 class="payment-title" style="margin-top: 24px;">Método de pago</h5>
              <div v-if="paymentMethod" class="payment-card">
                <div class="card-icon">
                  <i :class="paymentMethod.type === 'visa' ? 'fab fa-cc-visa' : 
                         paymentMethod.type === 'mastercard' ? 'fab fa-cc-mastercard' : 
                         'fas fa-credit-card'"></i>
                </div>
                <div class="card-details">
                  <span class="card-name">{{ paymentMethod.name }}</span>
                  <span class="card-number">Terminada en {{ paymentMethod.last_four }}</span>
                  <span class="card-expiry">Expira: {{ paymentMethod.expiry_date }}</span>
                </div>
                <button class="btn btn-sm btn-outline-primary">
                  <i class="fas fa-pencil-alt"></i>
                </button>
              </div>
              <div class="cancel-section">
                <button 
                  class="btn btn-outline-danger cancel-button"
                  @click="cancelSubscription"
                  :disabled="isLoading"
                >
                  <i class="fas fa-times-circle me-2"></i>
                  Cancelar suscripción
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-indicator">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando información de suscripción...</p>
    </div>

    <!-- Información de Facturación -->
    <div class="billing-info-section card mt-4">
      <div class="card-glow"></div>
      <div class="card-header">
        <i class="fas fa-credit-card header-icon"></i>
        <h4>Información de facturación</h4>
      </div>
      <div class="card-body">
        <p class="subsection-subtitle mb-4">Detalles de tu método de pago actual</p>
        <div class="info-item">
          <div class="card-preview">
            <div class="card-design">
              <div class="card-chip"></div>
              <div class="card-brand">VISA</div>
              <div class="card-number">**** **** **** 4567</div>
            </div>
          </div>
          <div class="info-text">
            <span class="info-label">Visa terminada en 4567</span>
            <span class="info-value">Próximo cobro: 15/05/2023</span>
          </div>
          <button class="btn btn-outline-primary btn-sm ms-auto update-payment-btn">
            <i class="fas fa-pencil-alt me-1"></i>Actualizar método de pago
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// Asume que SubscriptionFeatureItem está disponible globalmente o impórtalo
// import SubscriptionFeatureItem from '@/components/subscriptionplan/SubscriptionFeatureItem.vue';

export default {
  name: 'SubscriptionSection',
  components: {
      // SubscriptionFeatureItem // Descomenta si es importado localmente
  },
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      yearly: false, // Empieza mostrando mensual
      currentPlan: 'professional', // 'free' or 'professional' - Simula el plan actual del usuario
      basicPlanFeatures: [
        'Creación de perfil básico',
        'Acceso completo al directorio de profesionales',
        'Publicar reseñas y calificar establecimientos',
        'Agendar citas',
        'Solicitar servicios a domicilio'
      ],
      advancedPlanFeatures: [
        'Todas las ventajas del plan básico',
        'Acceso a reseñas públicas de otros pacientes',
        'Historial de citas',
        'Soporte prioritario para la gestión de citas',
        'Consejos de salud personalizados según perfil'
      ],
      isLoading: false
    };
  },
  computed: {
    subscriptionType() {
      if (!this.user || !this.user.subscription_type) {
        return 'Cargando...';
      }
      const type = this.user.subscription_type;
      if (type === 'paciente_gratis') return 'Plan Gratuito';
      if (type === 'paciente_avanzado') return 'Plan Premium';
      if (type === 'profesional_gratis') return 'Plan Profesional Gratuito';
      if (type === 'profesional_avanzado') return 'Plan Profesional Premium';
      return type;
    },
    subscriptionStatus() {
      if (!this.user) return 'Desconocido';
      
      return this.user.subscription_status || 'Activo';
    },
    nextBillingDate() {
      if (!this.user || !this.user.next_billing_date) {
        return 'No disponible';
      }
      
      return new Date(this.user.next_billing_date).toLocaleDateString();
    },
    isPremium() {
      return (
        this.user?.subscription_type === 'paciente_avanzado' ||
        this.user?.subscription_type === 'profesional_avanzado'
      );
    },
    paymentMethod() {
      if (!this.user || !this.user.payment_method) {
        return null;
      }
      
      return this.user.payment_method;
    }
  },
  methods: {
    showMonthly() {
      this.yearly = false;
    },
    showYearly() {
      this.yearly = true;
    },
    changePlan(plan) {
      // Lógica para cambiar de plan
      console.log(`Cambiar a plan: ${plan}, periodo: ${this.yearly ? 'anual' : 'mensual'}`);
      // Aquí podrías redirigir a una página de confirmación o checkout
    },
    navigateToSubscriptionPlans() {
      this.$router.push({name: 'SubscriptionPlans'});
    },
    async cancelSubscription() {
      if (!confirm('¿Estás seguro de que deseas cancelar tu suscripción Premium?')) {
        return;
      }

      this.isLoading = true;
      
      try {
        const API_URL = process.env.VUE_APP_API_URL;
        const response = await fetch(`${API_URL}/cancel-subscription`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (response.ok && data.status) {
          alert('Tu suscripción ha sido cancelada correctamente');
          
          // Recargar los datos del usuario para reflejar los cambios
          this.$parent.loadUserData();
        } else {
          alert(data.message || 'Error al cancelar la suscripción');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión. Inténtalo de nuevo.');
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.subscription-section {
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  color: #0a2d5e;
  margin: 0 0 6px 0;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #6B7280;
  margin: 0;
}

.billing-cycle {
  margin-top: 5px;
}

.billing-cycle span {
  display: block;
  font-size: 0.85rem;
  color: #6B7280;
  margin-bottom: 8px;
}

.billing-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 15px;
  background-color: #EFF6FF;
  color: #0d6efd;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.15);
}

.current-plan-section {
  margin-top: 30px;
  position: relative;
}

.subsection-header {
  margin-bottom: 25px;
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0a2d5e;
  margin-bottom: 5px;
}

.subsection-subtitle {
  font-size: 0.9rem;
  color: #6B7280;
  margin-bottom: 0;
}

/* Estilos para el toggle inline */
.period-toggle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.period-toggle-inline {
  display: inline-flex;
  background-color: rgba(13, 110, 253, 0.05);
  border-radius: 20px;
  padding: 4px;
  box-shadow: inset 0 2px 4px rgba(13, 110, 253, 0.05), 0 1px 2px rgba(255,255,255,0.8);
}

.toggle-option {
  padding: 8px 20px;
  border: none;
  background-color: transparent;
  color: #6B7280;
  font-weight: 500;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.toggle-option.active {
  background: linear-gradient(145deg, #0d6efd, #0b5ed7);
  color: white;
  box-shadow: 0 2px 5px rgba(13, 110, 253, 0.3);
}

.saving-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(16, 185, 129, 0.2);
  color: #10B981;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
}

/* Estilos para las cards de planes */
.plans-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.subscription-card {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(13, 110, 253, 0.08);
  border: 1px solid rgba(13, 110, 253, 0.1);
  min-height: 520px;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1;
}

.subscription-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(13, 110, 253, 0.15);
  border-color: rgba(13, 110, 253, 0.3);
}

.card-glow {
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

.basic-glow {
  background: linear-gradient(90deg, #9CA3AF, #D1D5DB);
  box-shadow: 0 2px 15px rgba(156, 163, 175, 0.3);
}

.premium-glow {
  background: linear-gradient(90deg, #0d6efd, #60a5fa);
  box-shadow: 0 2px 15px rgba(13, 110, 253, 0.3);
}

.glowing-recommended {
  position: absolute;
  width: 150px;
  height: 150px;
  top: -75px;
  right: -75px;
  background: radial-gradient(circle, rgba(13, 110, 253, 0.15) 0%, rgba(13, 110, 253, 0.05) 70%, rgba(255, 255, 255, 0) 100%);
  border-radius: 50%;
  z-index: -1;
  animation: pulse 3s ease-in-out infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.2);
    opacity: 0.2;
  }
}

.plan-basic {
  background-color: #FFFFFF;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239CA3AF' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

.plan-advanced {
  background-color: #FFFFFF;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230d6efd' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.plan-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #F3F4F6;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 15px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.plan-advanced .plan-badge {
  background-color: #DBEAFE;
  color: #0d6efd;
}

.plan-status-badge {
  display: inline-flex;
  align-items: center;
  background-color: rgba(16, 185, 129, 0.2);
  color: #10B981;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
}

.plan-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0a2d5e;
  margin-bottom: 10px;
}

.plan-pricing {
  margin-bottom: 20px;
  display: flex;
  align-items: baseline;
}

.plan-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0a2d5e;
  margin-right: 5px;
  line-height: 1;
}

.plan-period {
  font-size: 0.9rem;
  color: #6B7280;
  font-weight: 500;
}

.plan-divider {
  border: none;
  height: 1px;
  background: linear-gradient(to right, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.05), rgba(255, 255, 255, 0));
  margin: 15px 0;
}

.features-list {
  padding-left: 0;
  list-style: none;
  margin-bottom: 20px;
  flex-grow: 1;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #4B5563;
}

.feature-icon {
  flex-shrink: 0;
  color: #0d6efd;
  margin-right: 10px;
  font-size: 1rem;
  margin-top: 2px;
}

.plan-basic .feature-icon {
  color: #9CA3AF;
}

.plan-action-btn {
  width: 100%;
  padding: 12px 15px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.plan-action-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(13, 110, 253, 0.2);
}

.plan-action-btn.btn-primary {
  background: linear-gradient(145deg, #0d6efd, #0b5ed7);
  border: none;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.25);
}

.plan-action-btn.btn-primary:hover {
  box-shadow: 0 6px 15px rgba(13, 110, 253, 0.35);
}

.current-plan-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.plan-footer-text {
  font-size: 0.8rem;
  color: #6B7280;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 0;
}

.change-billing-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  margin-top: 10px;
  transition: all 0.3s ease;
  padding: 5px 0;
}

.change-billing-link:hover {
  color: #0a58ca;
}

.change-billing-link i {
  transition: transform 0.3s ease;
}

.change-billing-link:hover i {
  transform: translateX(3px);
}

/* Billing Info Section */
.billing-info-section.card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(13, 110, 253, 0.08);
  background-color: #FFFFFF;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.billing-info-section.card:hover {
  box-shadow: 0 15px 35px rgba(13, 110, 253, 0.12);
  transform: translateY(-3px);
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
  font-size: 1.1rem;
  font-weight: 600;
  color: #0a2d5e;
  display: flex;
  align-items: center;
}

.card-body {
  padding: 25px;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230d6efd' fill-opacity='0.02' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

/* Reutilizando estilos de info-item mejorados */
.info-item {
  display: flex;
  align-items: center;
  background-color: #F8FBFF;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(13, 110, 253, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.info-item:hover {
  border-color: rgba(13, 110, 253, 0.3);
  box-shadow: 0 8px 16px rgba(13, 110, 253, 0.1);
  transform: translateY(-2px);
}

.card-preview {
  flex-shrink: 0;
  width: 70px;
  height: 45px;
  margin-right: 15px;
  perspective: 1000px;
}

.card-design {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #1a1a1a, #4a4a4a);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.info-item:hover .card-design {
  transform: rotateY(15deg);
}

.card-chip {
  width: 12px;
  height: 10px;
  background: linear-gradient(45deg, #e6b800, #ffd700);
  border-radius: 2px;
  margin-bottom: 3px;
}

.card-brand {
  font-size: 8px;
  color: white;
  font-weight: bold;
  position: absolute;
  bottom: 5px;
  right: 5px;
}

.card-number {
  font-size: 6px;
  color: rgba(255, 255, 255, 0.8);
  position: absolute;
  bottom: 5px;
  left: 5px;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #6B7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.95rem;
  color: #0a2d5e;
  font-weight: 500;
}

.update-payment-btn {
  padding: 6px 14px;
  font-size: 0.85rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.15);
  border-color: rgba(13, 110, 253, 0.3);
  background-color: rgba(13, 110, 253, 0.03);
  color: #0d6efd;
}

.update-payment-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
  background-color: rgba(13, 110, 253, 0.05);
  border-color: #0d6efd;
}

.payment-method-section {
  margin-top: 32px;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
}

.cancel-section {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
}

.no-payment-method {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.payment-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0a2d5e;
  margin-bottom: 8px;
}

.payment-card {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  background: #f8fbff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  margin-top: 8px;
}

.card-icon {
  width: 32px;
  height: 22px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-right: 14px;
}

.card-details {
  font-size: 0.98rem;
  color: #374151;
}

@media (max-width: 767.98px) {
  .payment-method-section {
    margin-top: 24px;
    padding-top: 12px;
  }
  .cancel-section {
    margin-top: 16px;
  }
}

/* Responsive */
/* Tablets (768px to 991px) */
@media (min-width: 768px) and (max-width: 991.98px) {
  .section-title {
    font-size: 1.6rem;
  }
  
  .plans-display {
    gap: 20px;
  }
  
  .subscription-card {
    padding: 25px;
    min-height: 480px;
  }
  
  .plan-price {
    font-size: 2.2rem;
  }
  
  .feature-item {
    font-size: 0.85rem;
  }
}

/* Mobile devices (up to 767px) */
@media (max-width: 767.98px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .billing-cycle {
    margin-top: 15px;
    width: 100%;
  }
  
  .plans-display {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .subscription-card {
    min-height: auto;
    padding: 20px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .card-preview {
    margin-bottom: 15px;
    margin-right: 0;
  }
  
  .info-text {
    margin-bottom: 15px;
    width: 100%;
  }
  
  .update-payment-btn {
    width: 100%;
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
  
  .billing-badge {
    font-size: 0.75rem;
  }
  
  .card-header h4 {
    font-size: 1rem;
  }
  
  .header-icon {
    font-size: 1.1rem;
    margin-right: 10px;
  }
  
  .subscription-card {
    padding: 15px;
  }
  
  .plan-header {
    margin-bottom: 10px;
  }
  
  .plan-name {
    font-size: 1.1rem;
  }
  
  .plan-price {
    font-size: 2rem;
  }
  
  .feature-item {
    margin-bottom: 8px;
  }
  
  .toggle-option {
    padding: 6px 15px;
    font-size: 0.8rem;
  }
  
  .period-toggle-inline {
    width: 100%;
    justify-content: space-between;
  }
  
  .period-toggle-container {
    margin-bottom: 20px;
  }
  
  .plan-action-btn {
    padding: 10px;
    font-size: 0.9rem;
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
  
  .plan-badge, .plan-status-badge {
    font-size: 0.7rem;
    padding: 3px 8px;
  }
  
  .plan-price {
    font-size: 1.8rem;
  }
  
  .feature-icon {
    font-size: 0.9rem;
  }
  
  .feature-item {
    font-size: 0.8rem;
  }
  
  .toggle-option {
    padding: 5px 12px;
    font-size: 0.75rem;
  }
  
  .saving-badge {
    font-size: 9px;
    padding: 2px 4px;
  }
}
</style>