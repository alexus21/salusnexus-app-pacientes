<template>
    <div class="payment-page">
        <!-- Elementos decorativos de fondo -->
        <div class="decorative-element decorative-element-1"></div>
        <div class="decorative-element decorative-element-2"></div>
        <div class="decorative-element decorative-element-3"></div>

        <div v-if="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p class="loading-text">Verificando tu suscripción...</p>
        </div>

        <div v-if="!isLoading && showPaymentForm" class="payment-container">
            <!-- Panel izquierdo - Configuración de pago -->
            <div class="left-panel">
                <h2 class="panel-title">Configuración</h2>
                <h5 class="panel-subtitle">Método de pago</h5>

                <div class="payment-method-selector">
                    <div class="payment-card-icon">
                        <img :src="getPaymentMethodIcon" :alt="selectedPaymentMethod"/>
                    </div>
                    <div class="select-wrapper">
                        <select v-model="selectedPaymentMethod" class="payment-select">
                            <option value="visa">VISA</option>
                            <option value="mastercard">MasterCard</option>
                            <option value="maestro">Maestro</option>
                            <option value="paypal">Paypal</option>
                            <option value="diners">Diners Club</option>
                            <option value="amex">American Express</option>
                        </select>
                    </div>
                </div>

                <h5 class="data-title">Agregar datos:</h5>

                <form @submit.prevent="addPaymentMethod">
                    <!-- Nombre del propietario -->
                    <div class="form-group">
                        <input
                                type="text"
                                id="cardholder_name"
                                class="form-control"
                                v-model="card_form.cardholder_name"
                                placeholder="Ingresa tu nombre"
                                @input="formatName"
                                required
                        />
                        <label class="form-label">Nombre del propietario de la tarjeta</label>
                    </div>

                    <!-- Número de tarjeta -->
                    <div class="card-details">
                        <div class="form-group card-number">
                            <input
                                    type="text"
                                    id="card_number"
                                    class="form-control"
                                    maxlength="19"
                                    placeholder="**** **** **** ****"
                                    v-model="card_form.card_number"
                                    @input="formatCardNumber"
                                    required
                            />
                            <label class="form-label">Número de la tarjeta (espacios se agregan automáticamente)</label>
                        </div>

                        <div class="card-extra-details">
                            <div class="form-group expiration">
                                <input
                                        type="text"
                                        id="expiration_date"
                                        class="form-control"
                                        placeholder="MM/YY"
                                        v-model="card_form.expiration_date"
                                        @input="formatExpirationDate"
                                        required
                                />
                                <label class="form-label">Expiración (la pleca (/) se agrega automáticamente)</label>
                            </div>

                            <div class="form-group cvv">
                                <input
                                        type="text"
                                        id="cvv"
                                        class="form-control"
                                        placeholder="Cvv"
                                        v-model="card_form.cvv"
                                        maxlength="3"
                                        @input="formatCVV"
                                        required
                                />
                                <label class="form-label">Cvv</label>
                            </div>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button type="submit" class="confirm-btn">Confirmar</button>
                        <button type="button" class="cancel-btn" @click="goToHome">Cancelar</button>
                    </div>
                </form>
            </div>

            <!-- Panel derecho - Beneficios -->
            <div class="right-panel">
                <h2 class="benefits-title">Beneficios adquiridos</h2>

                <ul class="benefits-list">
                    <li class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <span class="benefit-text">Todas las ventajas del plan básico</span>
                    </li>

                    <li class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <span class="benefit-text">Acceso a reseñas públicas de otros pacientes</span>
                    </li>

                    <li class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <span class="benefit-text">Historial de citas</span>
                    </li>

                    <li class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <span class="benefit-text">Soporte prioritario para la gestión de citas</span>
                    </li>

                    <li class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <span class="benefit-text">Consejos de salud personalizados según perfil</span>
                    </li>

                    <li class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-pills"></i>
                        </div>
                        <span class="benefit-text">Detalles de medicamentos recetados</span>
                    </li>

                    <li class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-bell"></i>
                        </div>
                        <span class="benefit-text">Notificaciones de citas futuras</span>
                    </li>

                    <li class="benefit-item">
                        <div class="benefit-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <span class="benefit-text">Recordatorios personalizados para ti</span>
                    </li>

                    <li class="benefit-item">
                        <div class="benefit-icon premium-icon">
                            <i class="fas fa-crown"></i>
                        </div>
                        <span class="benefit-text premium-text">Plan Premium activado</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import swal from "sweetalert2";

const API_URL = process.env.VUE_APP_API_URL;

export default {
    name: 'AddPaymentMethodComponent',
    data() {
        return {
            isLoading: true,
            showPaymentForm: true,
            selectedPaymentMethod: 'visa',
            card_form: {
                card_number: '',
                cardholder_name: '',
                expiration_date: '',
                cvv: '',
                payment_provider: null,
                subscription_period: null
            },
            paymentIcons: {
                'visa': '/visa.png',
                'mastercard': '/mastercard.png',
                'amex': '/amex.png',
                'diners': '/diners.png',
                'maestro': '/maestro.png',
                'paypal': '/paypal.png'
            },
            errors: {},
        }
    },
    async mounted() {
        await this.fetchMySubscription();
    },
    computed: {
        getPaymentMethodIcon() {
            return this.paymentIcons[this.selectedPaymentMethod] || this.paymentIcons['visa'];
        }
    },
    methods: {
        async fetchMySubscription() {
            this.isLoading = true;
            try {
                const response = await fetch(API_URL + '/subscriptions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await response.json();
                console.log(data);
                this.isLoading = false;

                /*if (!data.status) {
                    // No hay suscripción activa, mostrar alerta para confirmar
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                        showCancelButton: true,
                        showConfirmButton: true,
                        confirmButtonText: 'Sí, suscribirme',
                        cancelButtonText: 'Cancelar',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Usuario confirma querer suscribirse, mostrar formulario
                            this.showPaymentForm = true;
                        } else {
                            // Usuario cancela, redirigir a Home
                            this.goToHome();
                        }
                    });
                    return;
                }*/

                // Ya está suscrito, mostrar alerta y redirigir a Home
                if(data.success){
                    swal.fire({
                        icon: 'success',
                        title: 'Ya estás suscrito',
                        text: data.message,
                    }).then(() => {
                        this.showPaymentForm = false;
                        this.goToHome();
                    });
                }

            } catch (error) {
                this.isLoading = false;
                console.error('Error fetching subscription:', error);
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al verificar tu suscripción. Por favor, intenta nuevamente.',
                }).then(() => {
                    this.goToHome();
                });
            }
        },
        goToHome() {
            this.$router.push({name: 'Home'});
        },
        formatName() {
            // Eliminar cualquier carácter que no sea letra o espacio
            this.card_form.cardholder_name =
                this.card_form.cardholder_name.replace(/[^a-zÁáÉéÍíÓóÚúÑñÜüÇçA-Z\s\-']/g, '');

            // Limitar a 50 caracteres
            if (this.card_form.cardholder_name.length > 50) {
                this.card_form.cardholder_name = this.card_form.cardholder_name.slice(0, 50);
            }

            // Primero convertir todo a minúsculas
            let nameInLowerCase = this.card_form.cardholder_name.toLowerCase();

            // Luego capitalizar la primera letra de cada palabra
            this.card_form.cardholder_name = nameInLowerCase.replace(/(^|\s|-)([a-záéíóúüñç])/g, function (match, separator, char) {
                return separator + char.toUpperCase();
            });
        },
        formatCardNumber() {
            // Remove all non-digit characters
            let digits = this.card_form.card_number.replace(/\D/g, '');

            // Limit to a maximum of 16 digits
            if (digits.length > 16) {
                digits = digits.slice(0, 16);
            }

            // Format into groups of 4 digits separated by spaces
            this.card_form.card_number = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
        },
        formatExpirationDate() {
            // Remove all non-digit characters
            let digits = this.card_form.expiration_date.replace(/\D/g, '');

            if (digits.length > 0 && digits[0] > '1') {
                digits = '0' + digits;
            }

            // Limit to a maximum of 4 digits
            if (digits.length > 4) {
                digits = digits.slice(0, 4);
            }

            // Format into MM/YY
            if (digits.length > 2) {
                this.card_form.expiration_date = digits.slice(0, 2) + '/' + digits.slice(2);
            } else {
                this.card_form.expiration_date = digits;
            }
        },
        formatCVV() {
            // Remove all non-digit characters
            let digits = this.card_form.cvv.replace(/\D/g, '');

            // Limit to a maximum of 3 digits
            if (digits.length > 3) {
                digits = digits.slice(0, 3);
            }

            this.card_form.cvv = digits;
        },
        validateInput() {
            const currentYear = new Date().getFullYear();
            const lastTwoDigitsOfTheYear = currentYear.toString().slice(-2);
            const lastTwoDigitsOfExpirationYear = this.card_form.expiration_date.slice(3);

            if (this.card_form.cardholder_name === '') {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El nombre del propietario de la tarjeta no puede estar vacío.',
                });
                return false;
            }

            if (lastTwoDigitsOfExpirationYear < lastTwoDigitsOfTheYear) {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La fecha de expiración no puede ser anterior a la fecha actual.',
                });
                return false;
            }

            if (lastTwoDigitsOfExpirationYear - lastTwoDigitsOfTheYear > 5) {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La fecha de expiración no puede ser mayor a 5 años.',
                });
                return false;
            }

            if (this.card_form.card_number.replace(/\s/g, '').length < 16) {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El número de la tarjeta no es válido.',
                });
                return false;
            }

            if (this.card_form.cvv.length < 3) {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El CVV no es válido.',
                });
                return false;
            }

            if (this.card_form.expiration_date.length < 5) {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'La fecha de expiración no es válida.',
                });
                return false;
            }

            if (this.card_form.cardholder_name.length < 3) {
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El nombre del propietario de la tarjeta no es válido.',
                });
                return false;
            }

            return true;
        },
        async addPaymentMethod() {
            if (!this.validateInput()) {
                return;
            }

            swal.fire({
                title: 'Confirmar',
                text: '¿Confirmar suscripción?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, confirmar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await this.confirmPayment();
                }
            });
        },
        async confirmPayment(){
            const formData = {
                ...this.card_form,
                payment_provider: this.selectedPaymentMethod,
                subscription_period: localStorage.getItem('periodo'),
            };

            console.log(formData);

            swal.fire({
                title: "Cargando...",
                text: "Por favor, espere mientras se verifica su cuenta.",
                timerProgressBar: true,
                didOpen: () => {
                    swal.showLoading();
                },
            });

            try {
                const response = await fetch(API_URL + '/add-payment-method', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                console.log(data);

                if (!data.status) {
                    const errorMessage = data.errors
                        ? Object.values(data.errors).join('\n')
                        : 'Ocurrió un error al agregar el método de pago';

                    swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: errorMessage,
                    });
                    return;
                }

                // If all validations pass, proceed with the payment
                swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Método de pago agregado correctamente.',
                }).then(() => {
                    this.goToHome();
                })
            } catch (error) {
                console.error('Error al agregar el método de pago:', error);
                swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'Ocurrió un error al agregar el método de pago.',
                });
            }
        }
    }
}
</script>

<style scoped>
/* Estilos generales - consistentes con las otras páginas */
.payment-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #F0F8FF 0%, #FFFFFF 50%, #F8FBFF 100%);
    position: relative;
    overflow: hidden;
    padding: 20px;
}

/* Loading container styles */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    z-index: 1;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 6px solid #f3f3f3;
    border-top: 6px solid #0d6efd;
    border-radius: 50%;
    animation: spin 1.5s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 18px;
    color: #4a5568;
    margin: 0;
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

.payment-container {
    display: flex;
    width: 1100px;
    min-height: 600px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    background-color: white;
}

/* Panel izquierdo - Configuración */
.left-panel {
    width: 55%;
    padding: 40px;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.panel-title {
    font-size: 28px;
    font-weight: 600;
    color: #0d6efd;
    margin-bottom: 10px;
    text-align: center;
}

.panel-subtitle {
    font-size: 18px;
    color: #4a5568;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 500;
}

.payment-method-selector {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    padding: 15px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background-color: #f8fafc;
}

.payment-card-icon {
    width: 60px;
    margin-right: 15px;
    text-align: center;
}

.payment-card-icon img {
    max-width: 100%;
    height: auto;
}

.select-wrapper {
    flex-grow: 1;
    position: relative;
}

.payment-select {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
    font-size: 16px;
    color: #4a5568;
}

.data-title {
    font-size: 18px;
    font-weight: 600;
    color: #0d6efd;
    margin-bottom: 25px;
}

.form-group {
    position: relative;
    margin-bottom: 25px;
}

.form-control {
    width: 100%;
    padding: 15px 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    color: #2d3748;
    transition: all 0.3s ease;
    background-color: #fff;
}

.form-control:focus {
    outline: none;
    border-color: #0d6efd;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.form-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    color: #718096;
    font-weight: 500;
}

.card-details {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 25px;
}

.card-extra-details {
    display: flex;
    gap: 15px;
}

.expiration {
    flex: 1;
    margin-bottom: 0;
}

.cvv {
    width: 120px;
    margin-bottom: 0;
}

.action-buttons {
    display: flex;
    gap: 15px;
    margin-top: 15px;
}

.confirm-btn {
    flex: 1;
    padding: 15px;
    background-color: #0d6efd;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(13, 110, 253, 0.1);
}

.confirm-btn:hover {
    background-color: #0b5ed7;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(13, 110, 253, 0.15);
}

.cancel-btn {
    flex: 1;
    padding: 15px;
    background-color: #f5f5f5;
    color: #4a5568;
    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cancel-btn:hover {
    background-color: #e5e7eb;
}

/* Panel derecho - Beneficios */
.right-panel {
    width: 45%;
    background: linear-gradient(135deg, #0d6efd 0%, #1a56db 100%);
    color: white;
    padding: 40px;
    display: flex;
    flex-direction: column;
}

.benefits-title {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 30px;
    text-align: center;
}

.benefits-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.benefit-item {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.08);
    transition: all 0.3s ease;
}

.benefit-item:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
}

.benefit-icon {
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    font-size: 18px;
}

.benefit-text {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.3;
}

.premium-icon {
    background-color: rgba(255, 215, 0, 0.25);
    color: #FFD700;
}

.premium-text {
    color: #FFD700;
    font-weight: 600;
}

/* Media queries para responsividad */
@media (max-width: 992px) {
    .payment-container {
        width: 95%;
        flex-direction: column;
    }

    .left-panel, .right-panel {
        width: 100%;
    }

    .right-panel {
        border-radius: 0 0 20px 20px;
    }
}

@media (max-width: 768px) {
    .payment-page {
        padding: 10px;
    }

    .left-panel, .right-panel {
        padding: 30px 20px;
    }

    .payment-method-selector {
        flex-direction: column;
        gap: 15px;
    }

    .payment-card-icon {
        margin-right: 0;
    }

    .card-extra-details {
        flex-direction: column;
        gap: 20px;
    }

    .cvv {
        width: 100%;
    }

    .action-buttons {
        flex-direction: column;
    }
}
</style>