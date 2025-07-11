
const { createApp } = Vue;

createApp({
    data() {
        const today = new Date().toISOString().slice(0, 10);
        return {
            // -----------------  EXISTENTES  -----------------
            reservations: [],
            pickups: [],
            returns: [],
            startDate: today,
            endDate: today,
            employeeName: "Martin",

            // -----------------  NUEVOS  -----------------
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
        formatDate(dateStr) {
            if (!dateStr) return "—";
            const [y, m, d] = dateStr.slice(0, 10).split("-");
            return `${d}/${m}/${y}`;
        },

        estadoTexto(r) {
            if (r.isCancelled) return "Cancelada";
            if (r.vehicleId === 0) return "Pendiente";
            return "Retirada";
        },
        estadoClase(r) {
            if (r.isCancelled) return "text-bg-danger";
            if (r.vehicleId === 0) return "text-bg-warning";
            return "text-bg-info";
        },
        estadoDevolucion(r) {
            return r.employeeCommentId === 0 ? "Pendiente" : "Registrada";
        },
        claseEstadoDevolucion(r) {
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
                    const start = new Date(this.startDate);
                    const end = new Date(this.endDate);

                    this.pickups = this.reservations
                        .filter(r => new Date(r.startDate) >= start && new Date(r.startDate) <= end)
                        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

                    this.returns = this.reservations
                        .filter(r => new Date(r.endDate) >= start && new Date(r.endDate) <= end)
                        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
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

            const hoy = new Date().toISOString().split("T")[0];

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

            axios
                .post("/api/reservation/registrar-devolucion", {
                    code: codigo,
                    comment: this.comentarioDevolucion
                })
                .then(() => {
                    Swal.fire("Éxito", "Devolución registrada", "success");
                    this.obtenerReservas();
                    // limpiar campos
                    this.codigoDevolucion = "";
                    this.comentarioDevolucion = "";
                    bootstrap.Modal.getInstance(document.getElementById("modalDevolucion")).hide();
                })
                .catch(err =>
                    Swal.fire("Error", err.response?.data || "No se pudo registrar", "error")
                );
        },

        /* ---------- LOGOUT ---------- */
        logout() {
            axios.post("/logout").then(() => {
                Swal.fire("Sesión cerrada", "Hasta pronto", "success").then(() =>
                    (window.location.href = "/index.html")
                );
            });
        }
    }
}).mount("#app");