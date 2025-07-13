const { createApp } = Vue;

createApp({
  data() {
    return {
        vehicleId: null,
        car_id: "",
        year: "",
        maintence:"",
        selectedBranchId: "",
        selectedModelId: "",
        branches: [],
        models: []
      };
  }, created() { },
      mounted() {
        this.loadBranches();
        this.loadModels();

        const params = new URLSearchParams(window.location.search);
        this.vehicleId = params.get("id");

        // Primero cargar modelos y sucursales en paralelo
        Promise.all([this.loadModels(), this.loadBranches()])
          .then(() => {
            if (this.vehicleId) {
              this.loadVehicle(this.vehicleId);
            }
          });
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
          loadVehicle(id) {
            axios.get(`/api/vehicle/${id}`)
              .then(response => {
                const v = response.data;
                this.car_id = v.patent;
                this.year = v.yearV;
                this.maintence = v.maintence;
                this.selectedModelId = v.modelId;
                this.selectedBranchId = v.branchId;
              })
              .catch(error => {
                console.error("Error al cargar el vehículo:", error);
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "No se pudo cargar el vehículo para editar."
                });
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
              maintence: this.maintence,
              modelId: this.selectedModelId,
              branchId: this.selectedBranchId
            };

            if (this.vehicleId) {
              // Editar
              await axios.put(`/api/vehicle/${this.vehicleId}/updateVehicle`, vehicleData);

            } else {
              // Crear
              await axios.post('/api/vehicle/createVehicle', vehicleData);
            }
            Swal.fire({
              icon: "success",
              title: this.vehicleId ? "Vehículo actualizado" : "Vehículo creado",
              text: this.vehicleId
                ? "Los datos del vehículo fueron modificados correctamente"
                : "El vehículo fue dado de alta correctamente",
              timer: 1500,
              showConfirmButton: false
            }).then(() => {
              window.location.href = "./listVehicles.html";
            });


          } catch (error) {
            const msg = error.response?.data || "Ocurrió un error inesperado";
            Swal.fire({
              icon: "error",
              title: "Error al guardar",
              text: msg
            });
            console.error("Error:", error);
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