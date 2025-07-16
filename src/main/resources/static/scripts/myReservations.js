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
        estadoReserva(reserva) {
            if (reserva.isCancelled) return 'Cancelada';

            if (this.esHoy(reserva.startDate) && reserva.vehicleId === 0 && reserva.employeeCommentId === 0)
                return 'A retirar';

            if (reserva.vehicleId !== 0 && reserva.employeeCommentId === 0)
                return 'En curso';

            if (reserva.vehicleId !== 0 && reserva.employeeCommentId !== 0)
                return 'Finalizada';

            return 'Próxima';
        },

        abrirModalValoracion(reservaId) {
            this.nuevaValoracion.reservaId = reservaId;
            this.nuevaValoracion.score = 0;
            this.nuevaValoracion.comment = '';

            const modalElement = document.getElementById('valorarModal');
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        },

        enviarValoracion() {
            axios.post('/api/reservation/addValoration/' + this.nuevaValoracion.reservaId, {
                score: this.nuevaValoracion.score,
                comment: this.nuevaValoracion.comment
            })
                .then(response => {
                    Swal.close();
                    Swal.fire({
                        icon: 'success',
                        title: '¡Gracias!',
                        text: response.data || 'Tu valoración fue registrada correctamente.',
                        confirmButtonText: 'Aceptar'
                    });

                    const modal = bootstrap.Modal.getInstance(document.getElementById('valorarModal'));
                    modal.hide();
                    this.getReservations();
                })
                .catch(error => {
                    Swal.close();
                    let mensaje = "Ocurrió un error al enviar la valoración.";
                    if (error.response?.data) mensaje = error.response.data;

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: mensaje,
                        confirmButtonText: 'Cerrar'
                    });
                });
        },

        esHoy(fechaStr) {
            if (!fechaStr) return false;
            const [anio, mes, dia] = fechaStr.split("-").map(Number);
            const hoy = new Date();
            return hoy.getFullYear() === anio &&
                (hoy.getMonth() + 1) === mes &&
                hoy.getDate() === dia;
        },

        reservaFinalizada(endDate) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fin = this.parseFechaLocal(endDate);
            fin.setHours(0, 0, 0, 0);
            return fin < hoy;
        },

        esReservaEnCurso(startDate, endDate) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const inicio = this.parseFechaLocal(startDate);
            const fin = this.parseFechaLocal(endDate);

            return hoy >= inicio && hoy <= fin;
        },

        parseFechaLocal(fechaStr) {
            const [year, month, day] = fechaStr.split("-");
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        },

        esFechaAnteriorAHoy(fechaStr) {
            const [anio, mes, dia] = fechaStr.split("-").map(Number);
            const hoy = new Date();
            const fecha = new Date(anio, mes - 1, dia);
            return fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        },

        puedeCancelar(startDate) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const fechaInicio = this.parseFechaLocal(startDate);
            return hoy < fechaInicio;
        },

        async getReservations() {
            try {
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

        async deleteReservation(reservationCode) {
            try {
                const reserva = this.reservas.find(r => r.code === reservationCode);
                if (!reserva) {
                    Swal.fire('Error', 'Reserva no encontrada.', 'error');
                    return;
                }

                const model = await axios.get(`/api/model/${reserva.modelId}`);
                let refund = 0;
                switch (model.data.cancelationPolicy) {
                    case 'FULL': refund = reserva.payment; break;
                    case 'TWENTY': refund = reserva.payment * 0.20; break;
                }

                const { isConfirmed } = await Swal.fire({
                    title: '¿Está seguro de cancelar la reserva?',
                    html: `Se reembolsará <strong>$${refund.toFixed(2)}</strong>.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Continuar',
                    cancelButtonText: 'Atrás'
                });
                if (!isConfirmed) return;

                Swal.fire({
                    title: 'Procesando...',
                    text: 'Cancelando la reserva...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });

                await axios.delete(`/api/reservation/${reservationCode}`);

                Swal.close();
                await Swal.fire({
                    title: 'Reserva cancelada',
                    html: `<p>La reserva fue cancelada correctamente.</p><p>Se enviará la información del reembolso a su e‑mail.</p>`,
                    icon: 'success'
                });

                this.getReservations();
            } catch (error) {
                Swal.close();
                const message = error.response?.data || 'Ocurrió un error al intentar cancelar la reserva.';
                Swal.fire('Error', message, 'error');
            }
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
        },
    },

    mounted() {
        this.getReservations();
    }
}).mount('#app');