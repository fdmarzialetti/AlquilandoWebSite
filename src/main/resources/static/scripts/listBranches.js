const { createApp } = Vue;

createApp({
  data() {
    return {
      activeBranches: [],
      inactiveBranches: []
    };
  },
  methods: {
    fetchBranches() {
      axios.get("/api/branches")
        .then(res => this.activeBranches = res.data)
        .catch(() => Swal.fire("Error al cargar sucursales activas", "", "error"));

      axios.get("/api/branches/inactive")
        .then(res => this.inactiveBranches = res.data)
        .catch(() => Swal.fire("Error al cargar sucursales inactivas", "", "error"));
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
    editBranch(branch) {
      window.location.href = `formBranch.html?id=${branch.id}`;
    },
    deactivateBranch(branch) {
      Swal.fire({
        title: `¿Dar de baja la sucursal ${branch.city}?`,
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, dar de baja",
        cancelButtonText: "Cancelar"
      }).then(result => {
        if (result.isConfirmed) {
          axios.delete(`/api/branches/${branch.id}`)
            .then(() => this.fetchBranches())
            .catch(error => {
              const msg = error.response?.data || "Error al desactivar";
              Swal.fire("No se pudo desactivar", msg, "error");
            });
        }
      });
    },
    activateBranch(branch) {
      axios.post(`/api/branches/${branch.id}/activate`)
        .then(() => this.fetchBranches())
        .catch(() => Swal.fire("Error al reactivar la sucursal", "", "error"));
    },
    logout() {
      axios.post("/logout")
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Sesión cerrada",
            text: "Has cerrado sesión correctamente.",
          }).then(() => window.location.href = "/index.html");
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al cerrar sesión.",
          });
        });
    }
  },
  mounted() {
    this.fetchBranches();
  }
}).mount("#appBranches");
