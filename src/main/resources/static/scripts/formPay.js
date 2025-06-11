const { createApp } = Vue;

createApp({
    data() {
        return {
            isAuthenticated: false,
            brand: "",
            name: "",
            startDate: "",
            endDate: "",
            finalPrice: "",
            branchId: "",
            modelId: "",
            card: {
                name: "",
                number: "",
                code: "",
                date: ""
            },
            user: { name: "Cuenta" }
        };
    },
    mounted() {
        console.log('App cargada');
        const params = new URLSearchParams(window.location.search);
        const brand = params.get("brand");
        const name = params.get("name");
        this.modelId = params.get("modelId")
        this.startDate = params.get("startDate");
        this.endDate = params.get("endDate");
        this.finalPrice = params.get("price");
        this.branchId = params.get("branchId");
        this.checkAuth();
    },
    methods: {
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
        },
        async procesarPago() {
            const vencimientoRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

            if (!vencimientoRegex.test(this.card.date)) {
                alert("Fecha de vencimiento inválida. Debe estar en formato MM/AA.");
                return;
            }

            const [mes, anio] = this.card.date.split("/").map(Number);
            const fechaActual = new Date();
            const anioActual = fechaActual.getFullYear() % 100;
            const mesActual = fechaActual.getMonth() + 1;

            if (anio < anioActual || (anio === anioActual && mes < mesActual)) {

                Swal.fire({
                    icon: "error",
                    text: "La tarjeta ingresada está vencida. Por favor, utilice una tarjeta válida con fecha vigente.",
                    confirmButtonText: "Aceptar"
                })
                return;
            }

            try {

                Swal.fire({
                    title: 'Procesando pago...',
                    html: '<div class="spinner"></div>',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const reserva = {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    branch: this.branchId,
                    model: this.modelId,
                    payment: this.finalPrice,
                    titular: this.card.name,
                    cardNumber: this.card.number,
                    cardCode: this.card.code,
                };

                const response = await axios.post('/api/reservation/createReservation', reserva);

                await Swal.fire({
                    icon: "success",
                    text: response.data,
                    confirmButtonText: "OK"
                });
                window.location.href = "../pages/client.html";

            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    text: error.response.data,
                    confirmButtonText: "Aceptar"
                });
            }
        }
    }
}).mount('#app');