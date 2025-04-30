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
                            Desde {{ formatTime(schedule.start_time) }} hasta {{ formatTime(schedule.end_time) }}
                        </p>
                    </div>
                    <div class="mb-3">
                        <div class="input-group">
                                <span class="input-icon">
                                    <i class="fa-solid fa-calendar-days"></i>
                                </span>
                            <span class="input-group-text">Fecha de la cita</span>
                            <input
                                id="appointment_date"
                                v-model="appointment_form.appointment_date"
                                class="form-control"
                                placeholder="Fecha de la cita"
                                readonly
                                type="date"
                                @click="showDatePicker"
                            />
                        </div>
                        <DatePicker
                            id="datePicker"
                            v-model="appointment_form.appointment_date"
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
                        <h5>Tipo de servicio</h5>
                        <select v-model="appointment_form.service_type" aria-label="Default select example" class="form-select">
                            <option disabled selected value="">Seleccione el tipo de servicio deseado</option>
                            <option value="consultorio">Consultorio</option>
                            <option value="domicilio">Domicilio</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <h5>Razón de su visita: </h5>
                        <textarea id="exampleFormControlTextarea1" v-model="appointment_form.visit_reason" class="form-control"
                                  rows="3" maxlength="500"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
                    <button class="btn btn-primary" type="button" @click="askForAddNewAppointment">Solicitar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as bootstrap from 'bootstrap';
import {DatePicker} from 'v-calendar';
import 'v-calendar/style.css';
import swal from "sweetalert2";

const API_URL = process.env.VUE_APP_API_URL;

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
            appointment_form: {
                appointment_date: "",
                service_type: "",
                visit_reason: "",
                clinic_id: null,
                patient_id: null,
            }
        };
    },
    computed: {
        disableDates() {
            return this.setDisabledDaysFromAPI();
        }
    },
    async mounted() {
        // Set the clinic_id from the prop
        this.appointment_form.clinic_id = this.clinic.id;
        
        // Get patient_id from localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData.patient_profile_id) {
            this.appointment_form.patient_id = userData.patient_profile_id;
        }
    },
    methods: {
        // Define your component's methods here
        formatTime(time) {
            const [hours, minutes] = time.split(':');
            const period = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM/PM
            return `${formattedHours}:${minutes} ${period}`;
        },
        open() {
            // Reset form data
            this.appointment_form.appointment_date = "";
            this.appointment_form.service_type = "";
            this.appointment_form.visit_reason = "";
            
            // Make sure clinic_id is properly set
            this.appointment_form.clinic_id = this.clinic.id;
            
            // Get patient_id from localStorage
            const userData = JSON.parse(localStorage.getItem("user"));
            if (userData && userData.patient_profile_id) {
                this.appointment_form.patient_id = userData.patient_profile_id;
            }
            
            console.log('Opening appointment modal with clinic_id:', this.appointment_form.clinic_id);
            
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
                this.appointment_form.appointment_date = selectedDate;
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
        },
        askForAddNewAppointment() {
            swal.fire({
                title: 'Confirmación',
                text: "¿Está seguro de que desea solicitar esta cita?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, solicitar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.fetchAddNewAppointment();
                }
            });
        },
        // Fetch data from API
        async fetchAddNewAppointment(){
            try{
                // Validate required fields
                if (!this.appointment_form.appointment_date) {
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Por favor seleccione una fecha para la cita',
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }
                
                if (!this.appointment_form.service_type) {
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Por favor seleccione el tipo de servicio',
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }
                
                if (!this.appointment_form.clinic_id) {
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error con el ID de la clínica, por favor intente de nuevo',
                        confirmButtonText: 'Aceptar'
                    });
                    console.error('Missing clinic_id:', this.appointment_form);
                    return;
                }
                
                if (!this.appointment_form.patient_id) {
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error con el ID del paciente, por favor intente de nuevo',
                        confirmButtonText: 'Aceptar'
                    });
                    console.error('Missing patient_id:', this.appointment_form);
                    return;
                }
                
                console.log('Sending appointment request:', this.appointment_form);
                
                const response = await fetch(API_URL + "/appointments/add", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify(this.appointment_form)
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.status);
                }

                const data = await response.json();

                if(!data.status){
                    swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message,
                        confirmButtonText: 'Aceptar'
                    });
                    return;
                }

                // Mostrar mensaje de éxito
                swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: data.message,
                    confirmButtonText: 'Aceptar'
                });

                // Cerrar el modal
                this.close();
            } catch (error) {
                console.error('Error:', error);
                swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al procesar la solicitud.',
                    confirmButtonText: 'Aceptar'
                });
            }
        },

    },

}

</script>

<style scoped>

</style>