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
        async logout() {
          try {
            const response = await axios.get('/logout').then(window.location.href = "/index.html");

          } catch (error) {
            console.log(error);
          }
        }
  }
}).mount('#app');