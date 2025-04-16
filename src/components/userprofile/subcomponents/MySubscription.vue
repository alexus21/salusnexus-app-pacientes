<template>
    <div class="row">
        <div class="row main-top-bar">
            <p class="fw-bold mt-3 d-flex justify-content-start text-white">Mi Suscripción</p>
            <p class="fw-light d-flex justify-content-start text-white">Administra tu plan y beneficios</p>
        </div>
    </div>
</template>

<script>

export default {
    name: 'MySubscriptionComponent',
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

.list-group-item {
    border: 1px #efefef solid;
    border-radius: 10px;
    padding: 10px;
    margin: 5px;
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