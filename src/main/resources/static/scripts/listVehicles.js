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

    deleteVehicle(id) {
                Swal.fire({
                    title: '¿Está seguro que desea eliminar el vehículo?',
                    text: 'Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.put(`/api/vehicle/${id}/deleteVehicle`)
                            .then(() => {
                                // Remueve el vehiculo de la lista local
                                this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== id);
                                Swal.fire('Eliminado', 'El vehiculo ha sido eliminado correctamente.', 'success');
                            })
                            .catch(error => {
                                console.error("Error al eliminar el vehiculo:", error);
                                Swal.fire('Error', 'No se pudo eliminar el vehiculo.', 'error');
                            });
                    }
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