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
      // Acción de logout básica
      alert("Sesión cerrada (funcionalidad a implementar)");
    }
  },
  mounted() {
    this.loadVehicles();
  }
}).mount("#app");