const { createApp } = Vue;

createApp({
  data() {
    return {
        car_id: "",
        year: "",
        selectedBranchId: "",
        selectedModelId: "",
        branches: [],
        models: []
      };
  }, created() { },
  mounted() {
          this.loadBranches();
          this.loadModels();
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
          loadModels() {
                      axios.get('/api/model/listModels')
                          .then(response => {
                              console.log(response)
                              this.models = response.data;
                          })
                          .catch(error => {
                              console.error("Error al cargar modelos de autos:", error);
                          });
          },
        validarEntero(event) {
          const valor = event.target.value;
          if (!/^\d*$/.test(valor)) {
            event.target.value = this.capacidad || '';
          } else {
            this.capacidad = parseInt(valor);
          }
        },
        async createVehicle() {
          try {
            const vehicleData = {
              patent: this.car_id,
              yearV: parseInt(this.year),
              modelId: this.selectedModelId,
              branchId: this.selectedBranchId
            };

            const response = await axios.post('/api/vehicle/createVehicle', vehicleData);

            Swal.fire({
              title: "Vehículo creado con éxito",
              icon: "success"
            }).then(() => {
              window.location.href = "./listVehicles.html";
            });

          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error al crear el vehículo",
              text: "Revisá los datos e intentá nuevamente"
            });
            console.error("Error al crear el vehículo:", error);
          }
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
  }
}).mount('#app');