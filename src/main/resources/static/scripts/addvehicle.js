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

        if (this.vehicleId) {
          this.loadVehicle(this.vehicleId);
        }
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
          mostrarModalCambioClaveVoluntario() {
                                              Swal.fire({
                                                icon: "info",
                                                title: "Cambiar contraseña",
                                                html: `
                                                  <input type="password" id="currentPassword" class="swal2-input" placeholder="Contraseña actual">
                                                  <input type="password" id="newPassword" class="swal2-input" placeholder="Nueva contraseña">
                                                  <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar contraseña">
                                                `,
                                                showCancelButton: true,
                                                confirmButtonText: "Guardar",
                                                cancelButtonText: "Cancelar",
                                                preConfirm: () => {
                                                  const currentPassword = document.getElementById('currentPassword').value;
                                                  const newPassword = document.getElementById('newPassword').value;
                                                  const confirmPassword = document.getElementById('confirmPassword').value;

                                                  if (!currentPassword || !newPassword || !confirmPassword) {
                                                    Swal.showValidationMessage("Todos los campos son obligatorios");
                                                    return false;
                                                  }

                                                  if (newPassword !== confirmPassword) {
                                                    Swal.showValidationMessage("Las contraseñas no coinciden");
                                                    return false;
                                                  }

                                                  if (newPassword.length < 6) {
                                                    Swal.showValidationMessage("La nueva contraseña debe tener al menos 6 caracteres");
                                                    return false;
                                                  }

                                                  return { currentPassword, newPassword };
                                                }
                                              }).then(result => {
                                                if (result.isConfirmed) {
                                                  this.actualizarClaveVoluntaria(result.value.currentPassword, result.value.newPassword);
                                                }
                                              });
                                            },
                                            actualizarClaveVoluntaria(actualPassword, nuevaPassword) {
                                                        axios.post('/api/user/change-password', {
                                                            actualPassword: actualPassword,
                                                            nuevaPassword: nuevaPassword
                                                          })
                                                          .then(() => {
                                                            Swal.fire({
                                                              icon: 'success',
                                                              title: 'Contraseña actualizada',
                                                              text: 'Tu nueva contraseña ha sido guardada correctamente.'
                                                            });
                                                          })
                                                          .catch(err => {
                                                            console.error("Error al cambiar contraseña voluntariamente", err);
                                                            Swal.fire({
                                                              icon: 'error',
                                                              title: 'Error',
                                                              text: err.response?.data?.message || 'No se pudo actualizar la contraseña. Verifica tu contraseña actual e inténtalo de nuevo.'
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
        .catch(err => {
          console.error("Error al cargar el vehículo:", err);
          Swal.fire("Error", "No se pudo cargar el vehículo", "error");
        });
    },
    createOrUpdateVehicle() {
      const payload = {
        patent: this.car_id,
        yearV: parseInt(this.year),
        modelId: this.selectedModelId,
        branchId: this.selectedBranchId
      };

      const url = this.vehicleId
        ? `/api/vehicle/${this.vehicleId}/updateVehicle`
        : `/api/vehicle/createVehicle`;

      const request = this.vehicleId
        ? axios.put(url, payload)
        : axios.post(url, payload);

      request.then(() => {
        Swal.fire({
          icon: "success",
          title: this.vehicleId ? "Vehículo actualizado" : "Vehículo creado",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.href = "./listVehicles.html";
        });
      }).catch(error => {
        const msg = error.response?.data || "Ocurrió un error inesperado";
        Swal.fire("Error", msg, "error");
      });
    }
  }
}).mount("#app");
