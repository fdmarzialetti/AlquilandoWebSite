const { createApp } = Vue;

createApp({
  data() {
    return {
      activeVehicles: [],
      inactiveVehicles: []
    };
  },
  methods: {
    fetchAllVehicles() {
      axios.get("/api/vehicle/listVehicles/active")
        .then(res => this.activeVehicles = res.data)
        .catch(() => Swal.fire("Error", "Error al cargar vehículos activos", "error"));

      axios.get("/api/vehicle/listVehicles/inactive")
        .then(res => this.inactiveVehicles = res.data)
        .catch(() => Swal.fire("Error", "Error al cargar vehículos inactivos", "error"));
    },

    editVehicle(vehicle) {
      window.location.href = `../pages/addVehicle.html?id=${vehicle.id}`;
    },

    deactivateVehicle(vehicle) {
      Swal.fire({
        title: `¿Dar de baja a ${vehicle.patent}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
      }).then(result => {
        if (result.isConfirmed) {
          axios.put(`/api/vehicle/${vehicle.id}/deactivate`)
            .then(() => {
              this.fetchAllVehicles();
              Swal.fire("Vehículo desactivado", "", "success");
            })
            .catch(err => {
              const msg = err.response?.data || "No se pudo desactivar el vehículo.";
              Swal.fire("Error", msg, "error");
            });
        }
      });
    },

    activateVehicle(vehicle) {
      axios.put(`/api/vehicle/${vehicle.id}/activate`)
        .then(() => {
          this.fetchAllVehicles();
          Swal.fire("Vehículo reactivado", "", "success");
        })
        .catch(() => Swal.fire("Error", "No se pudo reactivar el vehículo.", "error"));
    },

    logout() {
      axios.post("/logout")
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Sesión cerrada",
            text: "Has cerrado sesión correctamente. Hasta pronto!",
            confirmButtonText: "Aceptar"
          }).then(() => {
            window.location.href = "/index.html";
          });
        })
        .catch(error => {
          console.error("Error al cerrar sesión:", error);
          Swal.fire("Error", "Hubo un problema al cerrar sesión. Inténtalo de nuevo.", "error");
        });
    }
  },
  mounted() {
    this.fetchAllVehicles();
  }
}).mount("#app");
