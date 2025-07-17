const { createApp } = Vue;

createApp({
  data() {
    return {
      vehicles: [],
      rol: "",
      activeVehicles: [],
      inactiveVehicles: [],
      cargado: false,
      isAdmin: false,
      isEmployee: false
    };
  },
  methods: {
    async verificarRolUsuario() {
      try {
        const [adminRes, employeeRes] = await Promise.all([
          axios.get('/api/user/isAdmin'),
          axios.get('/api/user/isEmployee')
        ]);

        this.isAdmin = adminRes.data === true;
        this.isEmployee = employeeRes.data === true;

        if (this.isAdmin) {
          this.rol = 'ADMIN';
        } else if (this.isEmployee) {
          this.rol = 'EMPLOYEE';
        } else {
          this.rol = 'CLIENT';
        }

      } catch (error) {
        console.error('Error al verificar el rol:', error);
      }
    },
    async fetchAllVehicles() {
      try {
        const [activeRes, inactiveRes] = await Promise.all([
          axios.get("/api/vehicle/listVehicles/active"),
          axios.get("/api/vehicle/listVehicles/inactive")
        ]);

        this.activeVehicles = activeRes.data;
        this.inactiveVehicles = inactiveRes.data;
        this.cargado = true;

      } catch (error) {
        Swal.fire("Error", "Error al cargar vehículos", "error");
        console.error(error);
      }
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
              this.activeVehicles = this.activeVehicles.filter(v => v.id !== id);
              Swal.fire('Eliminado', 'El vehículo ha sido eliminado correctamente.', 'success');
            })
            .catch(error => {
              console.error("Error al eliminar el vehículo:", error);
              Swal.fire('Error', error.response.data, 'error');
            });
        }
      });
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
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al cerrar sesión. Intentalo de nuevo.",
          });
        });
    }
  },
  async mounted() {
    await this.verificarRolUsuario();
    await this.fetchAllVehicles();
  }
}).mount("#app");