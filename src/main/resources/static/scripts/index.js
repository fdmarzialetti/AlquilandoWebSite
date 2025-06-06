const { createApp } = Vue;

createApp({
    data() {
        return {
            branches: [],
            selectedBranchId: "",
            fechaInicio: "",
            fechaFin: "",
            isAuthenticated: false,
            user:{name:"Cuenta"},
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
                .then(res=> axios.get("api/user/data")).then(
                    res=>{
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