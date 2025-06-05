const { createApp } = Vue;

createApp({
    data() {
        return {
            branches: [],
            selectedBranchId: "",
            fechaInicio: "",
            fechaFin: "",
            isAuthenticated: false
        };
    },
    mounted() {
        this.loadBranches();
        this.checkAuth();
    },
    methods: {
        loadBranches() {
            axios.get("/api/branches")
                .then(response => {
                    this.branches = response.data;
                })
                .catch(error => {
                    console.error("ERROR AL CARGAR SUCURSALES:", error);
                });
        },
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
        submitForm() {
            if (!this.fechaInicio || !this.fechaFin || !this.selectedBranchId) {
                alert("Por favor, complete todos los campos.");
                return;
            }
            const url = `./pages/vehiculos.html?fechaInicio=${encodeURIComponent(this.fechaInicio)}&fechaFin=${encodeURIComponent(this.fechaFin)}&sucursal=${encodeURIComponent(this.selectedBranchId)}`;
            window.location.href = url;
        }
    }
}).mount('#app');