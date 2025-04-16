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
            <div class="col-md-4" style="background-color: gray; width: 200px;">
                <div>Ciclo de facturación actual</div>
                <div>Mensual</div>
            </div>
        </div>
    </div>
    <div class="row">
        <SubscriptionPlansComponent :show-this="false" />
    </div>
    <div class="row light-blue-background mb-5">
        <div class="row">
            <p class="text-black fw-bold mt-3 d-flex justify-content-start">Información de facturación</p>
            <p class="text-secondary d-flex justify-content-start">Detalles de tu método de pago actual</p>
            <div class="col d-flex justify-content-start mt-3 text-start">
                <i class="fa solid fa-credit-card"></i>
                <p class="text-secondary">Método de pago</p>
            </div>
            <button class="btn btn-primary w-25">
                <i class="fa-solid fa-pen-to-square"></i>
                Editar método de pago
            </button>
        </div>
    </div>
</template>

<script>

import SubscriptionPlansComponent from "@/components/subscriptionplan/SubscriptionPlansComponent.vue";

export default {
    name: 'MySubscriptionComponent',
    components: {SubscriptionPlansComponent},
    /*props: {
        user: {
            type: Object,
            required: true
        },
        readonly: {
            type: Boolean,
            default: true
        }
    }*/
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
</style>