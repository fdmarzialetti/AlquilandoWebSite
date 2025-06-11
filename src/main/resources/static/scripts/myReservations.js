const { createApp } = Vue;

createApp({
    data() {
        return {
            reservas: [],
            isAuthenticated: false,
            user: { name: "Cuenta" }

        };
    },
    methods: {
        async getReservations() {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch('http://localhost:8080/api/user/reservations');

                if (!response.ok) {
                    console.error("Error al obtener reservas:", await response.text());
                    return;
                }

                this.reservas = await response.json();
                this.checkAuth();
            } catch (error) {
                console.error("Error de red:", error);
            }
        },
        deleteReservation(reservationCode) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción eliminará la reserva.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete("/api/reservation/" + reservationCode)
                        .then(response => {
                            Swal.fire(
                                'Eliminada',
                                response.data,
                                'success'
                            );
                            this.getReservations();
                        })
                        .catch(error => {
                            const message = error.response ? error.response.data : "Ocurrió un error al intentar eliminar la reserva.";
                            Swal.fire(
                                'Error',
                                message,
                                'error'
                            );
                        });
                }
            });
        },
        formatFecha(fechaStr) {
            const [year, month, day] = fechaStr.split('-');
            return `${parseInt(day)}/${parseInt(month)}/${year}`;
        },
        checkAuth() {
            axios.get("/api/user/isAuthenticated")
                .then(response => {
                    this.isAuthenticated = response.data === true;
                })
                .then(res => axios.get("/api/user/data")).then(
                    res => {
                        this.user = res.data;
                    }
                )
                .catch(error => {
                    console.error("Error al verificar autenticación:", error);
                    this.isAuthenticated = false;
                });
        },
        logout() {
            axios.post("/logout")
                .then(() => {
                    this.isAuthenticated = false;
                    Swal.fire({
                        icon: "success",
                        title: "Sesión cerrada",
                        text: "Has cerrado sesión correctamente. Hasta pronto!",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        window.location.href = "/index.html"; // o la página que corresponda
                    });
                })
                .catch(error => {
                    console.error("Error al cerrar sesión:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un problema al cerrar sesión. Intentalo de nuevo.",
                    });
                });
        }
    },
    async mounted() {
        this.getReservations()
    },
}).mount('#app');
