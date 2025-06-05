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
            pago: {
                nombre: "",
                numero: "",
                codigo: "",
                vencimiento: ""
            }
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
                .catch(error => {
                    console.error("Error al verificar autenticación:", error);
                    this.isAuthenticated = false;
                });
        },
        logout() {
            axios.post("/logout") // Cambiá este endpoint si usás otro.
                .then(() => {
                    this.isAuthenticated = false;
                    window.location.href = "/index.html"; // o donde quieras redirigir después del logout
                })
                .catch(error => {
                    console.error("Error al cerrar sesión:", error);
                });
        },
        async procesarPago() {
            try {
                const reserva = {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    branch: this.branchId,
                    model: this.modelId,
                    payment: this.finalPrice
                };

                const response = await axios.post('/api/reservation/createReservation', reserva);
                alert(response.data);
                window.location.href = "../pages/client.html"; // Mensaje de éxito desde el backend
            } catch (error) {
                console.error("Error al crear reserva:", error);
                alert("Hubo un error al crear la reserva.");
            }
        }
    }
}).mount('#app');