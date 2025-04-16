<template>
    <div class="row">
        <div class="row main-top-bar">
            <p class="fw-bold mt-3 d-flex justify-content-start text-white">Mi Suscripción</p>
            <p class="fw-light d-flex justify-content-start text-white">Administra tu plan y beneficios</p>
        </div>
    </div>
    <div class="row">
        <div class="row d-flex justify-content-between mt-3 text-start">
            <div class="col-md-8">
                <h5 class="fw-bold">Tu plan actual</h5>
                <p class="text-secondary mt-2">Administra tu suscripción y conoce los beneficios disponibles</p>
            </div>
            <div class="col-md-4 billing-cycle">
                <div class="text-secondary">Ciclo de facturación actual</div>
                <div class="d-flex align-items-center justify-content-start mt-2">
                    <i class="fa-solid fa-calendar-days me-2 light-blue-text"></i>
                    <div class="light-blue-text">{{user.subscription_period.charAt(0).toUpperCase() + String(user.subscription_period).slice(1)}}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <SubscriptionPlansComponent :show-this="false" :display_message="current_plan" />
    </div>
    <div class="row light-blue-background mb-5">
        <div class="row">
            <p class="text-black fw-bold mt-3 d-flex justify-content-start">Información de facturación</p>
            <p class="text-secondary d-flex justify-content-start">Detalles de tu método de pago actual</p>
            <div class="col d-flex justify-content-start mt-3 text-start">
                <div class="d-flex justify-content-center align-items-center"
                     style="width: 50px; height: 50px; background-color: #fff; border-radius: 50%">
                    <i class="fa solid fa-credit-card" style="color: #2271af"></i>
                </div>
                <div class="ms-3">
                    <p>Visa terminada en: {{user.card_number}}</p>
                    <p>Próximo cobro: {{user.end_date}}</p>
                </div>
            </div>
        </div>
        <div class="row">
            <button class="btn btn-primary w-25 m-3">
                <i class="fa-solid fa-pen-to-square"></i>
                Actualizar método de pago
            </button>
        </div>
    </div>
</template>

<script>

import SubscriptionPlansComponent from "@/components/subscriptionplan/SubscriptionPlansComponent.vue";

export default {
    name: 'MySubscriptionComponent',
    components: {SubscriptionPlansComponent},
    props: {
        user: {
            type: Object,
            required: true
        },
    },
    data (){
        return {
            billingCycle: this.user.subscription_period.charAt(0).toUpperCase() +
                String(this.user.subscription_period).slice(1),
            current_plan: this.user.subscription_type === 'paciente_gratis' ? 'Recomendad' : 'Plan actual',
        }
    },
}

</script>

<style scoped>
.main-top-bar{
    background-color: #0c8ce3;
    width: 100%;
    display: flex;
    justify-content: flex-start;
}

.light-blue-background {
    background-color: #f0f7ff;
}

.light-blue-text {
    color: #2271af;
}

.list-group-item div > p {
    margin-bottom: 0.1rem;
}

.list-group-item div > input {
    margin-top: 0.1rem;
    margin-left: -0.5rem;
}

input{
    border: none;
    font-weight: bold;
    width: 300px;
}

input:focus{
    outline: none;
    border-bottom: #434ed1 solid 2px;
}

.billing-cycle{
    padding: 1%;
    background-color: #f0f7ff;
    width: 16%;
    border: #1b68b0 solid 1px;
    border-radius: 15px;
}
</style>