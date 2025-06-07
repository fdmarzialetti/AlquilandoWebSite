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
}
  },
  mounted() {
    this.loadVehicles();
  }
}).mount("#app");