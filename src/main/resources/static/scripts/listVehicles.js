const { createApp } = Vue;

createApp({
  data() {
    return {
      vehicles: []
    };
  },
  methods: {
    loadVehicles() {
      axios.get("/api/vehicle/listVehicles")
        .then(response => {
          this.vehicles = response.data;
        })
        .catch(error => {
          console.error("Error al cargar vehículos:", error);
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
        }
  },
  mounted() {
    this.loadVehicles();
  }
}).mount("#app");