const { createApp } = Vue;

createApp({
    data() {
        return {
            reservas: [],
            isAuthenticated: false,
            user: { name: "Cuenta" },
            reservaId: null,
            nuevaValoracion: {
                score: 0,
                comment: ''
            }
        };
    },
    methods: {
        abrirModalValoracion(reservaId) {
            this.nuevaValoracion.reservaId = reservaId;
            this.nuevaValoracion.score = 0;
            this.nuevaValoracion.comment = '';

            // Mostrar modal manualmente
            const modalElement = document.getElementById('valorarModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        },

        enviarValoracion() {
            console.log(this.nuevaValoracion);
            axios.post('/api/reservation/addValoration/' + this.nuevaValoracion.reservaId, {"score":this.nuevaValoracion.score,"comment":this.nuevaValoracion.comment})
                .then(response => {
                    Swal.close(); // Cerrar loader

                    Swal.fire({
                        icon: 'success',
                        title: '¡Gracias!',
                        text: response.data || 'Tu valoración fue registrada correctamente.',
                        confirmButtonText: 'Aceptar'
                    });

                    // Cerrar el modal manualmente
                    const modal = bootstrap.Modal.getInstance(document.getElementById('valorarModal'));
                    modal.hide();

                    // Opcional: refrescar reservas
                    this.getReservations();
                })
                .catch(error => {
                    Swal.close(); // Cerrar loader si hay error

                    let mensaje = "Ocurrió un error al enviar la valoración.";
                    if (error.response && error.response.data) {
                        mensaje = error.response.data;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: mensaje,
                        confirmButtonText: 'Cerrar'
                    });
                });
        },

        parseFechaLocal(fechaStr) {
            const [year, month, day] = fechaStr.split("-");
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        },

        esReservaEnCurso(startDate, endDate) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const inicio = this.parseFechaLocal(startDate);
            inicio.setHours(0, 0, 0, 0);

            const fin = this.parseFechaLocal(endDate);
            fin.setHours(0, 0, 0, 0);

            return hoy >= inicio && hoy <= fin;
        },

        reservaFinalizada(endDate) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const fin = this.parseFechaLocal(endDate);
            fin.setHours(0, 0, 0, 0);

            return fin < hoy;
        },
        soloFecha(dateStr) {
            const d = new Date(dateStr);
            d.setHours(0, 0, 0, 0);
            return d;
        },

        esHoy(fechaStr) {
            if (!fechaStr) return false;
            const fecha = new Date(fechaStr);
            const hoy = new Date();

            return fecha.getUTCFullYear() === hoy.getUTCFullYear()
                && fecha.getUTCMonth() === hoy.getUTCMonth()
                && fecha.getUTCDate() === hoy.getUTCDate();
        },
        puedeCancelar(startDate) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const fechaInicio = this.parseFechaLocal(startDate);
            fechaInicio.setHours(0, 0, 0, 0);

            console.log("puede cancelar: " + (hoy < fechaInicio));
            return hoy < fechaInicio;
        },

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
                console.log(this.reservas);
            } catch (error) {
                console.error("Error de red:", error);
            }
        },

        deleteReservation(reservationCode) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción cancelará la reserva.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Atrás'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Mostrar loading mientras se cancela la reserva y se envía el mail
                    Swal.fire({
                        title: 'Procesando...',
                        text: 'Cancelando la reserva...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    axios.delete("/api/reservation/" + reservationCode)
                        .then(response => {
                            Swal.close(); // Cierra el loading
                            Swal.fire({
                                title: 'Reserva cancelada',
                                html: `
                            <p>${response.data}</p>
                        `,
                                icon: 'success'
                            });
                            this.getReservations();
                        })
                        .catch(error => {
                            Swal.close(); // Cierra el loading si hay error
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
                .then(() => axios.get("/api/user/data"))
                .then(res => {
                    this.user = res.data;
                })
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
                        window.location.href = "/index.html";
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
        this.getReservations();
    },
}).mount('#app');