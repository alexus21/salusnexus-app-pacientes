<template>
    <div class="register-form" v-if="!isVerified">
        <div class="form-container">
            <h2 class="form-title text-decoration-underline">Verifica tu cuenta</h2>
            <form @submit.prevent="register">
                <div class="row">
                    <div class="col-md-6">
                        <div class="text-center mb-4">
                            <div class="profile-photo-container">
                                <div class="profile-photo">
                                    <span v-if="!patient_form.profile_photo_path"
                                          class="material-icons photo-placeholder">
                                        add_a_photo
                                    </span>
                                    <img class="w-50" v-else :src="patient_form.profile_photo_path"
                                         alt="Foto de perfil">
                                </div>
                                <input type="file" id="photo" @change="handlePhotoUpload" accept="image/*"
                                       class="d-none">
                                <label for="photo" class="btn btn-sm btn-primary mt-2">Agrega tu fotografía</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3 d-flex align-items-center">
                            <span class="material-icons">home</span>
                            <div class="input-group">
                                <input type="text"
                                       id="home_address"
                                       name="home_address"
                                       v-model="patient_form.home_address"
                                       class="form-control ms-3"
                                       placeholder="Dirección de residencia"
                                       required
                                       readonly>
                                <button type="button"
                                        class="btn btn-primary"
                                        @click="openLocationPicker('home_address')">
                                    <span class="material-icons">location_on</span>
                                </button>
                            </div>
                        </div>
                        <small class="text-muted"
                               v-if="patient_form.home_latitude && patient_form.home_longitude">
                            Lat: {{ patient_form.home_latitude }}, Lng: {{ patient_form.home_longitude }}
                        </small>
                        <div class="mb-3 d-flex align-items-center">
                            <span class="material-icons">location_city</span>
                            <input type="text"
                                   id="home_address_reference"
                                   v-model="patient_form.home_address_reference"
                                   class="form-control ms-3"
                                   placeholder="Dirección de referencia"
                                   required>
                        </div>
                        <LocationPickerComponent
                                v-if="showLocationPicker"
                                @location-selected="handleLocationSelected"
                                @close="showLocationPicker = false"/>

                        <div class="mb-3 d-flex align-items-center">
                            <span class="material-icons">fingerprint</span>
                            <input type="text" id="dui"
                                   v-model="patient_form.dui"
                                   class="form-control ms-3"
                                   maxlength="10"
                                   placeholder="Documento de identidad (DUI)"
                                   @input="formatDUI"
                                   required>
                        </div>

                        <div class="mb-3 d-flex align-items-center">
                            <span class="material-icons">contact_emergency</span>
                            <input type="text"
                                   id="emergency_contact_name"
                                   v-model="patient_form.emergency_contact_name"
                                   class="form-control ms-3"
                                   placeholder="Contacto de emergencia"
                                   maxlength="50"
                                   @input="formatName"
                                   required>
                        </div>

                        <div class="mb-3 d-flex align-items-center">
                            <span class="material-icons">emergency</span>
                            <input type="text"
                                   id="emergency_contact_phone"
                                   v-model="patient_form.emergency_contact_phone"
                                   class="form-control ms-3"
                                   maxlength="8"
                                   placeholder="Teléfono de contacto de emergencia"
                                   @input="formatPhone"
                                   required>
                        </div>
                    </div>
                </div>

                <!--Botones-->
                <div class="navigation-footer">
                    <div class="navigation-buttons">
                        <button title="Cancelar" type="button" class="btn btn-secondary" @click="handleClose">
                            <span class="material-icons">close</span>
                        </button>
                        <button title="Registrar" type="submit" class="btn btn-success ms-3"
                                :disabled="!canSubmit"
                                @click="verifyAccount">
                            <span class="material-icons">verified</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import LocationPickerComponent from "@/components/locationpicker/LocationPickerComponent.vue";
import imageCompression from 'browser-image-compression';
import swal from "sweetalert2";

export default {
    name: 'VerifyPatientAccountComponent',
    components: {
        LocationPickerComponent
    },
    data() {
        return {
            showLocationPicker: false,
            patient_form: {
                home_address: '',
                home_latitude: null,
                home_longitude: null,
                home_address_reference: '',
                dui: '',
                emergency_contact_name: '',
                emergency_contact_phone: '',
                profile_photo_path: null,
            },
            photoFile: null,
            errors: {},
            isVerified: false,
        }
    },
    computed: {
        canSubmit() {
            return this.patient_form.home_address_reference !== '' &&
                this.patient_form.home_address !== '' &&
                this.patient_form.dui !== '' &&
                this.patient_form.emergency_contact_name !== '' &&
                this.patient_form.emergency_contact_phone !== '';
        }
    },
    mounted() {
        this.checkIfIsVerified();
    },
    methods: {
        async checkIfIsVerified() {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.verified) {
                this.showAlertIsVerified();
            }
        },
        openLocationPicker(field) {
            this.activeAddressField = field;
            this.showLocationPicker = true;
        },
        handleLocationSelected(location) {
            const field = this.activeAddressField;
            this.patient_form[field] = location.address;
            this.patient_form.home_latitude = location.lat;
            this.patient_form.home_longitude = location.lng;
            this.showLocationPicker = false;
        },
        handleClose() {
            this.$router.push({name: 'Home'});
        },
        async handlePhotoUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validar tipo de archivo
            if (!file.type.match('image.*')) {
                console.error("Por favor selecciona solo imágenes");
                return;
            }

            try {
                // Mostrar indicador de carga
                this.isLoading = true;

                // Opciones para la compresión
                const options = {
                    maxSizeMB: 1,              // Tamaño máximo en MB
                    maxWidthOrHeight: 800,     // Dimensión máxima
                    useWebWorker: true         // Usar Web Worker para no bloquear UI
                };

                // Comprimir la imagen
                const compressedFile = await imageCompression(file, options);

                // Generar vista previa
                const reader = new FileReader();
                reader.onload = () => {
                    this.patient_form.profile_photo_path = reader.result;
                    this.isLoading = false;
                };
                reader.readAsDataURL(compressedFile);

                // Guarda el archivo comprimido para usarlo al enviar
                this.photoFile = compressedFile;
            } catch (error) {
                console.error("Error al procesar la imagen:", error);
                this.isLoading = false;
            }
        },
        async verifyAccount() {
            const formData = new FormData();

            // Agregar los datos del formulario
            formData.append('home_address', this.patient_form.home_address);
            formData.append('home_latitude', this.patient_form.home_latitude);
            formData.append('home_longitude', this.patient_form.home_longitude);
            formData.append('home_address_reference', this.patient_form.home_address_reference);
            formData.append('dui', this.patient_form.dui);
            formData.append('emergency_contact_name', this.patient_form.emergency_contact_name);
            formData.append('emergency_contact_phone', this.patient_form.emergency_contact_phone);

            // Agregar el archivo directamente si existe
            if (this.photoFile) {
                formData.append('profile_photo_path', this.photoFile);
            }

            swal.fire({
                title: "Cargando...",
                text: "Por favor, espere mientras se verifica su cuenta.",
                timerProgressBar: true,
                didOpen: () => {
                    swal.showLoading();
                },
            });

            try {
                const response = await fetch(`${process.env.VUE_APP_API_URL}/verification/patient`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: formData
                });

                const data = await response.json();

                if (!data.status) {
                    if (data.error) {
                        this.errors = data.error;
                        const errorMessage = Object.values(this.errors).flat().join('\n');
                        swal.fire({
                            icon: 'error',
                            title: '¡Error!',
                            text: errorMessage
                        });
                        return;
                    }
                }

                swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: data.message
                }).then(() => {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    this.$router.push({ name: 'UserProfile' });
                });
            } catch (error) {
                console.error("Error al verificar la cuenta: " + error.message);
                swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: "Ocurrió un error al verificar la cuenta. Por favor, inténtelo de nuevo."
                });
            }
        },
        formatDUI() {
            // Eliminar cualquier carácter que no sea dígito
            let value = this.patient_form.dui.replace(/\D/g, '');

            // Si hay más de 9 dígitos, truncar a 9
            if (value.length > 9) {
                value = value.slice(0, 9);
            }

            // Si hay más de 8 dígitos, agregar el guion antes del último dígito
            if (value.length > 8) {
                this.patient_form.dui = value.slice(0, 8) + '-' + value.slice(8);
            } else {
                this.patient_form.dui = value;
            }
        },
        formatPhone() {
            // Eliminar cualquier carácter que no sea dígito
            let value = this.patient_form.emergency_contact_phone.replace(/\D/g, '');

            // Verificar si el primer dígito es 2, 6 o 7
            if (value.length > 0 && !/^[267]/.test(value)) {
                // Si el primer dígito no es 2, 6 ni 7, borrar todo
                this.patient_form.emergency_contact_phone = '';
            } else {
                // Si hay más de 8 dígitos, truncar a 8
                if (value.length > 8) {
                    value = value.slice(0, 8);
                }
                // Formatear el número de teléfono
                this.patient_form.emergency_contact_phone = value;
            }
        },
        formatName(){
            // Eliminar cualquier carácter que no sea letra o espacio
            this.patient_form.emergency_contact_name =
                this.patient_form.emergency_contact_name.replace(/[^a-zÁáÉéÍíÓóÚúÑñÜüÇçA-Z\s\-']/g, '');

            // Limitar a 50 caracteres
            if (this.patient_form.emergency_contact_name.length > 50) {
                this.patient_form.emergency_contact_name = this.patient_form.emergency_contact_name.slice(0, 50);
            }

            // Primero convertir todo a minúsculas
            let nameInLowerCase = this.patient_form.emergency_contact_name.toLowerCase();

            // Luego capitalizar la primera letra de cada palabra
            this.patient_form.emergency_contact_name = nameInLowerCase.replace(/(^|\s|-)([a-záéíóúüñç])/g, function(match, separator, char) {
                return separator + char.toUpperCase();
            });
        },
        showAlertIsVerified() {
            swal.fire({
                icon: 'success',
                iconColor: '#4CAF50',
                title: 'Cuenta verificada',
                text: 'Esta cuenta ya ha sido verificada. Puedes continuar con el uso de la aplicación.',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.isVerified = true;
                    this.$router.push({ name: 'UserProfile' });
                }
            });
        }
    }
}
</script>

<style scoped>

.register-form {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}

.form-container {
    background: white;
    padding: 40px;
    border-radius: 15px;
    width: 95%;
    max-width: 1200px;
}

</style>