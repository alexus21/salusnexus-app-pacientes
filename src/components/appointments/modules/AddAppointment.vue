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
                        <h5>Días hábiles</h5>
                        <p v-for="schedule in schedules" :key="schedule.id">
                            <span class="badge bg-primary">{{ schedule.day_of_the_week }}</span>
                            Desde {{ schedule.start_time }} hasta {{ schedule.end_time }}
                        </p>
<!--                        <select v-model="selected_day" aria-label="Default select example" class="form-select">
                            <option disabled value="">Seleccione el dia que desea la cita</option>
                            <option v-for="schedule in schedules"
                                    :key="schedule.id"
                                    :value="schedule.id">
                                {{ schedule.day_of_the_week }} - Desde {{ schedule.start_time }} hasta
                                {{ schedule.end_time }}
                            </option>
                        </select>-->
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                                <span class="input-icon">
                                    <i class="fa-solid fa-calendar-days"></i>
                                </span>
                            <span class="input-group-text">Fecha de la cita</span>
                            <input
                                id="date_of_birth"
                                v-model="appointment_form.date"
                                class="form-control"
                                placeholder="Fecha de la cita"
                                readonly
                                type="date"
                                @click="showDatePicker"
                            />
                        </div>
                        <DatePicker
                            id="datePicker"
                            v-model="appointment_form.date"
                            :disabled-dates="disableDates"
                            :min-date="minDate"
                            :value="new Date()"
                            class="form-control d-none"
                            locale="es-SV"
                            mode="date"
                            timezone="UTC"
                            title-position="right"
                            @dayclick="handleDayClick"
                        />
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
import {DatePicker} from 'v-calendar';
import 'v-calendar/style.css';

export default {
    name: 'AddAppointment',
    components: {
        DatePicker
    },
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
            disabledDates: [],

            // Días de la semana (formato para V-Calendar)
            diasSemana: {
                Domingo: 1,
                Lunes: 2,
                Martes: 3,
                Miércoles: 4,
                Jueves: 5,
                Viernes: 6,
                Sábado: 7
            },

            // Datos a enviar:
            selected_day: "",
            visit_reason: "",
            reminder_sent: false,
            remind_me_at: 30,
            date: new Date(),
            minDate: new Date(),
            noWorkDays: [{
                repeat: {
                    weekdays: [3, 5, 6, 7]
                }
            }
            ],
            appointment_form: {
                date: "",
            }
        };
    },
    computed: {
        disableDates() {
            return this.setDisabledDaysFromAPI();
        }
    },
    async mounted() {
        //
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
        handleDayClick(day) {
            // Format date as YYYY-MM-DD
            const selectedDate = day.date.toLocaleDateString('en-CA'); // this format gives YYYY-MM-DD
            const today = new Date().toLocaleDateString('en-CA');

            if (selectedDate >= today) { // Changed to >= since you want future dates
                this.appointment_form.date = selectedDate;
            } else {
                console.log('Selected date is in the past and not allowed.');
            }

            this.hideDatePicker();
        },
        showDatePicker() {
            const datePicker = document.getElementById('datePicker');
            datePicker.classList.remove('d-none');
        },
        hideDatePicker() {
            const datePicker = document.getElementById('datePicker');
            datePicker.classList.add('d-none');
        },
        setDisabledDaysFromAPI() {
            const diasSemana = {
                Domingo: 1,
                Lunes: 2,
                Martes: 3,
                Miércoles: 4,
                Jueves: 5,
                Viernes: 6,
                Sábado: 7
            };

            // Extraer días habilitados
            const availableDays = this.schedules.map(item => diasSemana[item.day_of_the_week]);

            const allDays = [1, 2, 3, 4, 5, 6, 7];
            const disabledDays = allDays.filter(day => !availableDays.includes(day));

            return disabledDays.map(day => {
                return {
                    repeat: {
                        weekdays: [day]
                    }
                };
            });
        }

    },

}

</script>

<style scoped>

</style>