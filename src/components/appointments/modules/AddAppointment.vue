<template>
    <div id="addNewAppointmentModal" aria-hidden="true" aria-labelledby="staticBackdropLabel" class="modal fade"
         data-bs-backdrop="static"
         data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content text-start">
                <div class="modal-header">
                    <h1 id="staticBackdropLabel" class="modal-title fs-5">Agendar una cita en
                        {{ clinic.clinic_name }}</h1>
                    <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <select v-model="selected_day" aria-label="Default select example" class="form-select">
                            <option disabled value="">Seleccione el dia que desea la cita</option>
                            <option v-for="schedule in schedules"
                                    :key="schedule.id"
                                    :value="schedule.id">
                                {{ schedule.day_of_the_week }} - Desde {{ schedule.start_time }} hasta
                                {{ schedule.end_time }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="exampleFormControlTextarea1">Razón de su visita:</label>
                        <textarea id="exampleFormControlTextarea1" v-model="visit_reason" class="form-control"
                                  rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input id="checkDefault"
                                   v-model="reminder_sent"
                                   class="form-check-input"
                                   type="checkbox">
                            <label class="form-check-label" for="checkDefault">
                                Enviarme un recordatorio
                            </label>
                        </div>
                    </div>
                    <div v-if="reminder_sent" class="mb-3">
                        <label class="form-check-label" for="checkDefault">
                            Recordarme en:
                        </label>
                        <input id="checkDefault"
                               v-model="remind_me_at"
                               class="form-control"
                               max="60" min="15"
                               type="number"
                               value="30">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="button">Confirmar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as bootstrap from 'bootstrap';

export default {
    name: 'AddAppointment',
    props: {
        clinic: {
            type: Object,
            required: true
        },
        schedules: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            // Define your component's data properties here
            visible: false,

            // Datos a enviar:
            selected_day: "",
            visit_reason: "",
            reminder_sent: false,
            remind_me_at: 30,
        };
    },
    computed: {
        // Define any computed properties here
    },
    async mounted() {
        // Code to run when the component is mounted
    },
    methods: {
        // Define your component's methods here
        open() {
            const modal = new bootstrap.Modal(document.getElementById('addNewAppointmentModal'));
            modal.show();
        },
        close() {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addNewAppointmentModal'));
            modal.hide();
        },
    },

}

</script>

<style scoped>

</style>