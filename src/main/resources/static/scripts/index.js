const { createApp } = Vue;

createApp({
    data() {
        return {
            branches: [],
            selectedBranchId: "",
            fechaInicio: "",
            fechaFin: "",
            isAuthenticated: false,
            user: { name: "Cuenta" },
        };
    },
    mounted() {
        this.loadBranches();
        this.checkAuth();

        const today = new Date().toISOString().split("T")[0];
        document.getElementById("fechaInicio").setAttribute("min", today);
        document.getElementById("fechaFin").setAttribute("min", today);

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
                .then(res => axios.get("api/user/data")).then(
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
       submitForm() {
    if (!this.fechaInicio || !this.fechaFin || !this.selectedBranchId) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor, complete todos los campos.",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (this.fechaFin <= this.fechaInicio) {
        Swal.fire({
            icon: "error",
            title: "Fechas inválidas",
            text: "La fecha de fin debe ser posterior a la fecha de inicio.",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    const url = `./pages/vehiculos.html?fechaInicio=${encodeURIComponent(this.fechaInicio)}&fechaFin=${encodeURIComponent(this.fechaFin)}&sucursal=${encodeURIComponent(this.selectedBranchId)}`;
    window.location.href = url;
}
    }
}).mount('#app');