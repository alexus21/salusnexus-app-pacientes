<script>
import swal from "sweetalert2";

const API_URL = process.env.VUE_APP_API_URL;

export default {
    name: "LogoutComponent",
    data() {
        return {
            isLogged: false,
        };
    },
    mounted() {
        if (localStorage.getItem("token") !== null) {
            this.isLogged = true;
        }
    },
    methods: {
        logout() {
            swal.fire({
                title: "¿Estás seguro?",
                text: "¿Quieres cerrar sesión?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, cerrar sesión",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(API_URL + "/logout", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    })
                        .then((response) => response.json())
                        .then((responseData) => {
                            if (responseData.status) {
                                localStorage.removeItem("token");
                                this.isLogged = false;
                                swal.fire({
                                    icon: "success",
                                    title: "¡Éxito!",
                                    text: responseData.message,
                                }).then(() => {
                                    localStorage.clear();
                                    window.location.href = '/';
                                });
                            } else {
                                swal.fire({
                                    icon: "error",
                                    title: "¡Error!",
                                    text: responseData.message,
                                });
                            }
                        });
                }
            })
        },
    },
}
</script>