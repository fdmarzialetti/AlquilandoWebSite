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
            axios.post('/api/reservation/addValoration/' + this.nuevaValoracion.reservaId, { "score": this.nuevaValoracion.score, "comment": this.nuevaValoracion.comment })
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

            const [anio, mes, dia] = fechaStr.split("-").map(Number); // mes es 1-based

            const hoy = new Date();
            return hoy.getFullYear() === anio &&
                (hoy.getMonth() + 1) === mes &&
                hoy.getDate() === dia;
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


                if (this.esReservaEnCurso(this.reservas[1].startDate, this.reservas[1].endDate) && this.reservas[1].vehicleId !== 0) {
                    console.log("CONDICIÓN VERDADERA: Se cumple el else-if.");
                }
            } catch (error) {
                console.error("Error de red:", error);
            }
        },

        async deleteReservation(reservationCode) {
            try {
                /* ------------------------------------------------------------------
                 * 1) Buscar la reserva en memoria
                 * ------------------------------------------------------------------ */
                const reserva = this.reservas.find(r => r.code === reservationCode);
                if (!reserva) {
                    Swal.fire('Error', 'Reserva no encontrada.', 'error');
                    return;
                }

                /* ------------------------------------------------------------------
                 * 2) Pedir el modelo (para conocer su política de cancelación)
                 * ------------------------------------------------------------------ */
                // Si la política ya viene adentro de la reserva, salta esta llamada
                const modelId = reserva.modelId;               // ajusta si tu campo se llama distinto
                const model = await axios.get(`/api/model/${modelId}`);

                /* ------------------------------------------------------------------
                 * 3) Calcular el reembolso (FULL, TWENTY, ZERO)
                 * ------------------------------------------------------------------ */
                let refund = 0;
                switch (model.data.cancelationPolicy) {             // ajusta el nombre si hace falta
                    case 'FULL':
                        refund = reserva.payment;                  // ajusta el nombre
                        break;
                    case 'TWENTY':
                        refund = reserva.payment * 0.20;
                        break;
                    case 'ZERO':
                    default:
                        refund = 0;
                        break;
                }

                /* ------------------------------------------------------------------
                 * 4) Confirmar con el usuario mostrando el monto
                 * ------------------------------------------------------------------ */
                const { isConfirmed } = await Swal.fire({
                    title: '¿Está seguro de cancelar la reserva?',
                    html: `AL realizar esta operacion se le reembolsará un total de <strong>$${refund.toFixed(2)}</strong>.`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Continuar',
                    cancelButtonText: 'Atrás'
                });
                if (!isConfirmed) return;

                /* ------------------------------------------------------------------
                 * 5) Mostrar loader SIN await y cancelar en el servidor
                 * ------------------------------------------------------------------ */
                Swal.fire({
                    title: 'Procesando...',
                    text: 'Cancelando la reserva...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });

                await axios.delete(`/api/reservation/${reservationCode}`);

                /* ------------------------------------------------------------------
                 * 6) Cerrar loader y mostrar éxito
                 * ------------------------------------------------------------------ */
                Swal.close();
                await Swal.fire({
                    title: 'Reserva cancelada',
                    html: `
    <p>La reserva fue cancelada correctamente.</p>
    <p>Se enviará la información correspondiente al reembolso a su e‑mail.</p>
    `,
                    icon: 'success'
                });

                /* ------------------------------------------------------------------
                 * 7) Refrescar la lista de reservas
                 * ------------------------------------------------------------------ */
                this.getReservations();

            } catch (error) {
                Swal.close();
                const message = error.response?.data ||
                    'Ocurrió un error al intentar cancelar la reserva.';
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
        esFechaAnteriorAHoy(fechaStr) {
            const [anio, mes, dia] = fechaStr.split("-").map(Number); // mes = 1 a 12
            const hoy = new Date();
            const fecha = new Date(anio, mes - 1, dia); // mes en 0 a 11
            return fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        }
    },
    async mounted() {
        this.getReservations();

    },
}).mount('#app');