const { createApp } = Vue;

createApp({
    data() {
        return {
            branches: [],
            selectedBranchId: "",
            fechaInicio: "",
            fechaFin: ""
        };
    },
    mounted() {
        this.loadBranches();
    },
    methods: {
        loadBranches() {
            axios.get("/api/branches")
                .then(response => {
                    console.log("RESPONSE:", response);
                    this.branches = response.data;
                })
                .catch(error => {
                    console.error("ERROR AL CARGAR SUCURSALES:", error);
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