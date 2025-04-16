<template>
    <div class="col">
        <div class="row main-top-bar">
            <p class="fw-bold mt-3 d-flex justify-content-start text-white">Mi Perfil</p>
            <p class="fw-light d-flex justify-content-start text-white">Gestionar tu información personal</p>
        </div>
    </div>
    <div class="row">
        <div class="row d-flex justify-content-center mt-3 text-start">
            <h3>Información personal</h3>
        </div>
        <div class="col-md-6">
            <div class="row d-flex justify-content-center mt-3 text-start">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex align-items-center">
                        <div class="icon-container" id="name-container"><i class="fa-solid fa-user"></i></div>
                        <div>
                            <p class="text-secondary">Nombre completo</p>
                            <input type="text"
                                   class="form-control"
                                   :value="user ? user.first_name.split(' ')[0] + ' ' + user.last_name.split(' ')[0] : 'Cargando...'"
                                   :readonly="readonly">
                        </div>
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <div class="icon-container" id="phone-container"><i class="fa-solid fa-phone"></i></div>
                        <div>
                            <p class="text-secondary">Teléfono</p>
                            <input type="text"
                                   class="form-control"
                                   :value="user ? user.phone : 'Cargando...'"
                                   :readonly="readonly">
                        </div>
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <div class="icon-container" id="birthdate-container"><i class="fa-solid fa-cake-candles"></i></div>
                        <div>
                            <p class="text-secondary">Fecha de nacimiento</p>
                            <input type="date"
                                   class="form-control"
                                   :value="user ? user.date_of_birth : 'Cargando...'"
                                   :readonly="readonly">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-md-6">
            <div class="row d-flex justify-content-center mt-3 text-start">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex align-items-center">
                        <div class="icon-container" id="email-container"><i class="fa-solid fa-envelope"></i></div>
                        <div>
                            <p class="text-secondary">Correo electrónico</p>
                            <input type="text"
                                   class="form-control"
                                   :value="user ? user.email : 'Cargando...'"
                                   readonly>
                        </div>
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <div class="icon-container" id="dui-container"><i class="fa-solid fa-hashtag"></i></div>
                        <div>
                            <p class="text-secondary">(DUI) Documento de identidad</p>
                            <input type="text"
                                   class="form-control"
                                   :value="user ? user.dui : 'Cargando...'"
                                   :readonly="readonly">
                        </div>
                    </li>
                    <li class="list-group-item d-flex align-items-center">
                        <div class="icon-container" id="address-container"><i class="fa-solid fa-hashtag"></i></div>
                        <div>
                            <p class="text-secondary">Dirección</p>
                            <input type="text"
                                   class="form-control"
                                   :value="user ? user.home_address : 'Cargando...'"
                                   :readonly="readonly">
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="col-6">
        <div class="row d-flex justify-content-center mt-3 text-start">
            <h3>Contacto de emergencia</h3>
            <hr class="mt-3" />
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex align-items-center">
                    <div class="icon-container" id="emergency-contact-container"><i class="fa-solid fa-heart"></i></div>
                    <div>
                        <p class="text-secondary">Contacto de emergencia</p>
                        <input type="text"
                               class="form-control"
                               :value="user ? user.emergency_contact_name + ' - ' + user.emergency_contact_phone : 'Cargando...'"
                               readonly>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    name: 'MyProfileComponent',
    props: {
        user: {
            type: Object,
            required: true
        },
        readonly: {
            type: Boolean,
            default: true
        }
    }
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

.icon-container{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    padding: 5%;
    margin-right: 3%;
}

#dui-container{
    background-color: #dcfce7;
    color: #2ca059;
}

#name-container{
    background-color: #e0effe;
    color: #2869a2;
}

#phone-container{
    background-color: #ffedd4;
    color: #c3692f;
}

#birthdate-container{
    background-color: #e1e9fe;
    color: #5753b3;
}

#email-container{
    background-color: #f7e5ff;
    color: #834db6;
}

#address-container{
    background-color: #c6fef1;
    color: #2a8c7b;
}

#emergency-contact-container{
    background-color: #fde1e0;
    color: #ae4045;
}

</style>