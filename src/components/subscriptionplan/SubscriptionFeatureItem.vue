<template>
    <li class="feature-item">
        <div class="feature-icon">
            <i :class="iconClass"></i>
        </div>
        <span class="feature-text">{{ featureText }}</span>
    </li>
</template>

<script>
export default {
    name: 'SubscriptionFeatureItem',
    props: {
        featureText: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: 'check-circle'
        },
        isPremium: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        iconClass() {
            // Mapa de nombres de características a íconos de FontAwesome
            const iconMap = {
                'perfil': 'user-circle',      // Added for profile creation
                'soporte': 'headset',         // Existing mappings for advanced plan (can overlap or be specific)
                'directorio': 'address-book',  // Added for directory access
                'agendar': 'calendar',    // Added for scheduling appointments
                'reseñas': 'star',            // Changed for reviews/ratings
                'calificar': 'star',         // Added alternative keyword for ratings
                'citas': 'calendar-plus',      // Added alternative keyword for appointments
                'domicilio': 'home',          // Added for home services
                'básico': 'check-circle', // Keep check for 'Todas las ventajas del plan básico'
                'historial': 'calendar-alt',
                'salud': 'heartbeat',
                'medicamentos': 'pills',
                'notificaciones': 'bell',
                'recordatorios': 'clock',
                'premium': 'crown'
                // Removed 'users' as it's less specific than 'star' for reviews
            };

            // Detectar automáticamente el ícono basado en el texto
            let iconName = 'check-circle'; // Default to check-circle if no keyword matches

            // Buscar palabras clave en el texto para asignar ícono
            const lowerFeatureText = this.featureText.toLowerCase();

            if (this.isPremium || lowerFeatureText.includes('premium')) {
                iconName = 'crown';
            } else {
                // Check specific keywords first
                let foundIcon = false;
                for (const [keyword, icon] of Object.entries(iconMap)) {
                    if (keyword !== 'básico' && lowerFeatureText.includes(keyword)) {
                         // Prioritize specific keywords over the general 'básico'
                         if (keyword === 'reseñas' && lowerFeatureText.includes('acceso a reseñas')) {
                             // Special case for 'Acceso a reseñas...' use 'users'
                             iconName = 'users';
                         } else {
                            iconName = icon;
                         }
                        foundIcon = true;
                        break;
                    }
                }
                 // If no specific keyword found, and it includes 'básico', use check-circle
                if (!foundIcon && lowerFeatureText.includes('básico')) {
                    iconName = 'check-circle';
                }
            }

            return `fas fa-${iconName}`;
        }
    }
};
</script>

<style scoped>
.feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 0;
    border-radius: 0;
    transition: none;
    background-color: transparent;
}

.feature-item:hover {
    background-color: transparent;
    transform: none;
}

.feature-icon {
    width: 24px;
    height: 24px;
    background-color: transparent;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    color: #0d6efd;
    font-size: 18px;
}

.feature-text {
    color: #4B5563;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5;
}
</style> 