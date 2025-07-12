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

            /* -----------------  NUEVOS  ----------------- */
            codigoRetiro: "",
            codigoDevolucion: "",
            comentarioDevolucion: ""
        };
    },

    mounted() {
        this.obtenerReservas();
    },

    methods: {
        /* ---------- UTILIDADES ---------- */
        formatDate(iso) {
            if (!iso) return "—";
            const [y, m, d] = iso.split("-");
            return `${d}/${m}/${y}`;
        },

        /* ---------- ESTADOS ---------- */
        estadoTexto(r) {
            const hoy = todayISO_AR();
            if (r.isCancelled) return "Cancelada";
            if (r.startDate > hoy) return "Posterior";          // ← NUEVO
            if (r.vehicleId === 0) return "Pendiente";
            return "Retirada";
        },
        estadoClase(r) {
            const hoy = todayISO_AR();
            if (r.isCancelled) return "text-bg-danger";
            if (r.startDate > hoy) return "text-bg-secondary";  // ← NUEVO
            if (r.vehicleId === 0) return "text-bg-warning";
            return "text-bg-info";
        },
        /* ---------- ESTADO DEVOLUCIÓN ---------- */
        estadoDevolucion(r) {
            const hoy = todayISO_AR();
            if (r.endDate > hoy) return "Posterior";   // ← NUEVO
            return r.employeeCommentId === 0 ? "Pendiente" : "Registrada";
        },
        claseEstadoDevolucion(r) {
            const hoy = todayISO_AR();
            if (r.endDate > hoy) return "text-bg-secondary"; // ← NUEVO
            return r.employeeCommentId === 0 ? "text-bg-warning" : "text-bg-info";
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
                            parseISOLocal(r.startDate) <= end
                        )
                        .sort((a, b) =>
                            parseISOLocal(a.startDate) - parseISOLocal(b.startDate)
                        );

                    this.returns = this.reservations
                        .filter(r =>
                            parseISOLocal(r.endDate) >= start &&
                            parseISOLocal(r.endDate) <= end
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
            const codigo = this.codigoRetiro.trim();
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
                        window.location.href = `${data}?code=${codigo}`;
                    }
                })
                .catch(err =>
                    Swal.fire("Error", err.response?.data || "Verificación fallida", "error")
                );
        },

        /* ---------- REGISTRAR DEVOLUCIÓN ---------- */
        registrarDevolucion() {
            const codigo = this.codigoDevolucion.trim();
            if (codigo.length !== 6) {
                Swal.fire("Código inválido", "El código debe tener 6 caracteres.", "warning");
                return;
            }

            axios.post(
                `/api/reservation/registrar-devolucion/${codigo}`,
                null,
                { params: { comentarioDevolucion: this.comentarioDevolucion } }
            )
                .then((data) => {
                    console.log(data)
                    Swal.fire("Éxito", "Devolución registrada", "success");
                    this.obtenerReservas();
                    this.codigoDevolucion = "";
                    this.comentarioDevolucion = "";
                    bootstrap.Modal.getInstance(
                        document.getElementById("modalDevolucion")
                    ).hide();
                })
                .catch(err => {
                    const mensaje = typeof err.response?.data === "string"
                        ? err.response.data
                        : "No se pudo registrar la devolución.";
                    Swal.fire("Error", mensaje, "error");
                });
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
                r.endDate === hoy && r.employeeCommentId === 0
            );
        },
        retirosPendientesHoy() {
            const hoy = todayISO_AR();
            return this.pickups.filter(r =>
                r.startDate === hoy && r.vehicleId === 0
            );
        }
    }
}).mount("#app");