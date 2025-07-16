/* =========================  employee‑reservations.js  ========================= */
/*  Versión: maneja zona "America/Argentina/Buenos_Aires" + nuevo estado “Posterior” */

const { createApp } = Vue;

/* ────────────  Utilidades de fecha para ARG  ──────────── */
// Hoy en formato ISO local (YYYY‑MM‑DD)
const todayISO_AR = () =>
    new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Argentina/Buenos_Aires"
    });

// Convierte "YYYY-MM-DD" → Date local (00:00 del día)
const parseISOLocal = iso => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d); // month 0‑based
};

createApp({
    data() {
        const today = todayISO_AR();
        return {
            /* -----------------  EXISTENTES  ----------------- */
            reservations: [],
            pickups: [],
            returns: [],
            startDate: today,
            endDate: today,
            employeeName: "Martin",
            estadoSeleccionado: "",

            /* -----------------  NUEVOS  ----------------- */
            codigoRetiro: "",
            codigoDevolucion: "",
            comentarioDevolucion: "",
            cambiarClave: "",
        };
    },

    mounted() {

        axios.get("/api/user/mustChangePassword")
            .then(res => {
                console.log(res);
                if (res.data === true) {
                    Swal.fire({
                        icon: "warning",
                        title: "Cambio de contraseña requerido",
                        text: "Debes cambiar tu contraseña temporal antes de continuar.",
                        confirmButtonText: "Cambiar contraseña",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false
                    }).then(() => {
                        window.location.href = "/change-password.html";
                    });
                }
            })
            .catch(err => {
                console.error("Error al verificar mustChangePassword", err);
            });

        this.obtenerReservas();
        axios.get("/api/vehicle/listVehicles").then(data => console.log(data)).catch(err => console.log(err))
    },

    methods: {
        seleccionarEstado(estado) {
            this.estadoSeleccionado = estado;

            // Cerrar el dropdown
            const dropdownEl = this.$refs.dropdownBtn;
            const dropdown = bootstrap.Dropdown.getInstance(dropdownEl);
            if (dropdown) dropdown.hide();
        },
        claseBadgeEstado(estado) {
            switch (estado) {
                case "Reserva Cancelada":
                    return "btn-danger";
                case "Retiro Pendiente":
                case "Devolución Pendiente":
                    return "btn-warning";
                case "Retiro Próximo":
                case "Devolución Próxima":
                    return "btn-secondary";
                case "Reserva Finalizada":
                    return "btn-success";
                default:
                    return "btn-outline-dark";
            }
        },
        /* ---------- UTILIDADES ---------- */
        formatDate(iso) {
            if (!iso) return "—";
            const [y, m, d] = iso.split("-");
            return `${d}/${m}/${y}`;
        },

        /* ---------- RETIRO ESTADOS ---------- */
        estadoTexto(r) {
            const hoy = todayISO_AR();
            if (r.isCancelled) return "Reserva Cancelada";
            if (r.startDate > hoy) return "Retiro Proximo";          // ← NUEVO
            if (r.vehicleId === 0) return "Retiro Pendiente";
            return "Reserva Finalizada";
        },
        estadoClase(r) {
            const hoy = todayISO_AR();
            if (r.isCancelled) return "text-bg-danger";
            if (r.startDate > hoy) return "text-bg-secondary";  // ← NUEVO
            if (r.vehicleId === 0) return "text-bg-warning";
            return "text-bg-success";
        },
        /* ---------- ESTADO DEVOLUCIÓN ---------- */
        estadoDevolucion(r) {
            const hoy = todayISO_AR();
            if (r.endDate > hoy && r.employeeCommentId === 0) return "Devolucion Proxima";   // ← NUEVO
            return r.employeeCommentId === 0 ? "Devolucion Pendiente" : "Reserva Finalizada";
        },
        claseEstadoDevolucion(r) {
            const hoy = todayISO_AR();
            if (r.endDate > hoy && r.employeeCommentId === 0) return "text-bg-secondary"; // ← NUEVO
            return r.employeeCommentId === 0 ? "text-bg-warning" : "text-bg-success";
        },
        estadoGeneralReserva(r) {
            const hoy = todayISO_AR();

            if (r.isCancelled) return "Reserva Cancelada";

            // Primero: ver estado de retiro
            if (r.startDate > hoy) return "Retiro Próximo";
            if (r.vehicleId === 0) return "Retiro Pendiente";

            // Luego: si ya se retiró, evaluamos la devolución
            if (r.endDate > hoy && r.employeeCommentId === 0) return "Devolución Próxima";
            if (r.employeeCommentId === 0) return "Devolución Pendiente";

            return "Reserva Finalizada";
        },
        estadoGeneralClase(r) {
            const hoy = todayISO_AR();

            if (r.isCancelled) return "text-bg-danger";

            if (r.startDate > hoy) return "text-bg-secondary";
            if (r.vehicleId === 0) return "text-bg-warning";

            if (r.endDate > hoy && r.employeeCommentId === 0) return "text-bg-secondary";
            if (r.employeeCommentId === 0) return "text-bg-warning";

            return "text-bg-success";
        },

        /* ---------- CARGA DE RESERVAS ---------- */
        obtenerReservas() {
            axios
                .get("/api/reservation/employeeReservations", {
                    params: { startDate: this.startDate, endDate: this.endDate }
                })
                .then(res => {
                    this.reservations = res.data;

                    const start = parseISOLocal(this.startDate);
                    const end = parseISOLocal(this.endDate);

                    this.pickups = this.reservations
                        .filter(r =>
                            parseISOLocal(r.startDate) >= start &&
                            parseISOLocal(r.startDate) <= end &&
                            this.estadoTexto(r) != "Reserva Finalizada" &&
                            !r.isCancelled
                        )
                        .sort((a, b) =>
                            parseISOLocal(a.startDate) - parseISOLocal(b.startDate)
                        );

                    this.returns = this.reservations
                        .filter(r =>
                            parseISOLocal(r.endDate) >= start &&
                            parseISOLocal(r.endDate) <= end &&
                            this.estadoDevolucion(r) != "Reserva Finalizada" &&
                            !r.isCancelled
                        )
                        .filter(r => r.vehicleId != 0)
                        .sort((a, b) =>
                            parseISOLocal(a.endDate) - parseISOLocal(b.endDate)
                        );
                })
                .catch(() =>
                    Swal.fire("Error", "No se pudieron cargar las reservas", "error")
                );
        },

        /* ---------- VERIFICAR RETIRO ---------- */
        verificarRetiro() {
            const codigo = this.codigoRetiro.trim().toUpperCase();
            if (codigo.length !== 6) {
                Swal.fire("Código inválido", "El código debe tener 6 caracteres.", "warning");
                return;
            }

            const hoy = todayISO_AR();

            axios
                .post("/api/reservation/validar-codigo", { code: codigo, startDate: hoy })
                .then(({ data }) => {
                    /* ---------- 1) REASIGNACIÓN ---------- */
                    if (data.redirect === "../pages/reassign.html") {
                        const params = new URLSearchParams({
                            startDate: hoy,
                            branchId: data.branchId,
                            fechaFin: data.fechaFin,
                            precioMinimo: data.precioMinimo,
                            codigoReserva: data.codigoReserva
                        });

                        Swal.fire({
                            icon: "warning",
                            title: "Vehículo no disponible",
                            text: "No se encontró un vehículo disponible para esta reserva. Será redirigido para reasignar uno nuevo.",
                            confirmButtonText: "Continuar"
                        }).then(() => {
                            window.location.href = `${data.redirect}?${params.toString()}`;
                        });

                        /* ---------- 2) ADICIONALES ---------- */
                    } else if (data === "../pages/additional.html") {
                        
                        axios.get(`/api/reservation/reservationModelId/${codigo}`).then(res=>{
                            console.log("res.data: ")
                            console.log(res.data)
                            const params = new URLSearchParams({
                                code:codigo,
                                vehiculoId:res.data.vehicleId,
                                modelo:res.data.model
                            });
                            window.location.href = `${data.trim()}?${params.toString()}`;          
                        });
                    }
                })
                .catch(err =>
                    Swal.fire("Error", err.response?.data || "Verificación fallida", "error")
                );
        },
        async registrarDevolucion() {
            const codigo = this.codigoDevolucion.trim().toUpperCase();
            if (codigo.length !== 6) {
                Swal.fire("Código inválido", "El código debe tener 6 caracteres.", "warning");
                return;
            }

            const hoy = new Date().toISOString().split("T")[0];   // "yyyy‑MM‑dd"

            try {
                /* ---------------------------------------------------------------
                 * 1) Traemos la reserva para validar vehículo y fecha de fin
                 * --------------------------------------------------------------- */
                const { data: reserva } = await axios.get(`/api/reservation/${codigo}`);

                /* ---------------------------------------------------------------
                 * 2) Validaciones previas
                 * --------------------------------------------------------------- */
                if (!reserva.vehicle || reserva.vehicle.id === 0) {
                    Swal.fire(
                        "Sin vehículo asignado",
                        "Esta reserva no tiene un vehículo asignado, por lo que no se puede registrar la devolución.",
                        "warning"
                    );
                    return;
                }

                /* ---------------------------------------------------------------
                 * 2.5) ¿Ya se registró la devolución?
                 * --------------------------------------------------------------- */
                const { data: yaRegistrada } = await axios.get(`/api/reservation/estaRegistrada/${codigo}`);
                if (yaRegistrada) {
                    Swal.fire(
                        "Devolución ya registrada",
                        "Esta reserva ya tiene una devolucion resitrada",
                        "warning"
                    );
                    return;
                }

                const endDate = reserva.endDate; // "yyyy‑MM‑dd"

                /* ---------------------------------------------------------------
                 * 3) Función que realmente registra la devolución
                 * --------------------------------------------------------------- */
                const registrar = () =>
                    axios
                        .post(
                            `/api/reservation/registrar-devolucion/${codigo}`,
                            null,
                            { params: { comentarioDevolucion: this.comentarioDevolucion } }
                        )
                        .then(res => {
                            Swal.fire("Operación exitosa", res.data, "success");
                            this.obtenerReservas();
                            this.codigoDevolucion = "";
                            this.comentarioDevolucion = "";
                            bootstrap.Modal.getInstance(
                                document.getElementById("modalDevolucion")
                            ).hide();
                        })
                        .catch(err => {
                            const mensaje =
                                typeof err.response?.data === "string"
                                    ? err.response.data
                                    : "No se pudo registrar la devolución.";
                            Swal.fire("Error", mensaje, "error");
                        });

                /* ---------------------------------------------------------------
                 * 4) Confirmación si la devolución es antes de la fecha prevista
                 * --------------------------------------------------------------- */
                if (endDate !== hoy) {
                    Swal.fire({
                        title: "¿Confirmar devolución?",
                        text: `Esta devolución se realizará antes de lo previsto. La fecha programada es ${this.formatDate(endDate)}. ¿Deseas continuar?`,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonText: "Sí, continuar",
                        cancelButtonText: "Cancelar"
                    }).then(result => {
                        if (result.isConfirmed) registrar();
                    });
                } else {
                    // La reserva finaliza hoy → sin confirmación extra
                    registrar();
                }
            } catch (e) {
                Swal.fire(
                    "Error",
                    "No se encontró la reserva o ocurrió un problema al obtener la información.",
                    "error"
                );
            }
        },
        /* ---------- LOGOUT ---------- */
        logout() {
            axios.post("/logout").then(() => {
                Swal.fire("Sesión cerrada", "Hasta pronto", "success").then(() =>
                    (window.location.href = "/index.html")
                );
            });
        }
    },

    computed: {
        devolucionesPendientesHoy() {
            const hoy = todayISO_AR();
            return this.returns.filter(r =>
                r.endDate === hoy &&
                !r.isCancelled &&
                this.estadoDevolucion(r) != "Reserva Finalizada"
            );
        },
        retirosPendientesHoy() {
            const hoy = todayISO_AR();
            return this.pickups.filter(r =>
                r.startDate === hoy &&
                r.vehicleId === 0 &&
                !r.isCancelled &&
                this.estadoTexto(r) != "Reserva Finalizada"
            );
        },
        reservasFiltradas() {
            if (!this.estadoSeleccionado) return this.reservations;
            return this.reservations.filter(r => this.estadoGeneralReserva(r) === this.estadoSeleccionado);
        }
    },
    watch: {
        startDate(nueva) {
            if (this.endDate && nueva > this.endDate) {
                this.endDate = nueva;        // ajusta fin al nuevo inicio
            }
        },
        endDate(nueva) {
            if (this.startDate && nueva < this.startDate) {
                this.startDate = nueva;      // ajusta inicio al nuevo fin
            }
        }
    },
}).mount("#app");