const { createApp } = Vue;

createApp({
    data() {
        return {
            branches: [],
            selectedBranchId: "",
            fechaInicio: "",
            fechaFin: "",
            isAuthenticated: false,
            user: { name: "Cuenta" },
        };
    },
    mounted() {
        this.loadBranches();
        this.checkAuth();

        const today = new Date().toISOString().split("T")[0];
        document.getElementById("fechaInicio").setAttribute("min", today);
        document.getElementById("fechaFin").setAttribute("min", today);

        this.verificarCambioDeClave();

    },
    methods: {
        loadBranches() {
            axios.get("/api/branches")
                .then(response => {
                    this.branches = response.data;
                })
                .catch(error => {
                    console.error("ERROR AL CARGAR SUCURSALES:", error);
                });
        },
        checkAuth() {
            axios.get("/api/user/isAuthenticated")
                .then(response => {
                    this.isAuthenticated = response.data === true;
                })
                .then(res => axios.get("api/user/data")).then(
                    res => {
                        this.user = res.data;
                    }
                )
                .catch(error => {
                    console.error("Error al verificar autenticación:", error);
                    this.isAuthenticated = false;
                });
        },

        verificarCambioDeClave() {
            axios.get("/api/user/mustChangePassword")
              .then(res => {
                if (res.data === true) {
                  this.mostrarModalCambioClave();
                }
              })
              .catch(err => {
                console.error("Error al verificar mustChangePassword", err);
              });
          },

          mostrarModalCambioClave() {
            Swal.fire({
              icon: "warning",
              title: "Cambio de contraseña requerido",
              html: `
                <p>Debes cambiar tu contraseña temporal antes de continuar.</p>
                <input type="password" id="newPassword" class="swal2-input" placeholder="Nueva contraseña">
                <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar contraseña">
              `,
              showCancelButton: false,
              confirmButtonText: "Guardar",
              allowOutsideClick: false,
              allowEscapeKey: false,
              preConfirm: () => {
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (!newPassword || !confirmPassword) {
                  Swal.showValidationMessage("Todos los campos son obligatorios");
                  return false;
                }

                if (newPassword !== confirmPassword) {
                  Swal.showValidationMessage("Las contraseñas no coinciden");
                  return false;
                }

                if (newPassword.length < 6) {
                  Swal.showValidationMessage("La contraseña debe tener al menos 6 caracteres");
                  return false;
                }

                return { newPassword };
              }
            }).then(result => {
              if (result.isConfirmed) {
                this.actualizarClave(result.value.newPassword);
              }
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
          actualizarClave(nuevaPassword) {
            axios.post('/api/user/change-password', { nuevaPassword })
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Contraseña actualizada',
                  text: 'Tu nueva contraseña ha sido guardada correctamente.'
                }).then(() => {
                  window.location.href = '/index.html';
                });
              })
              .catch(err => {
                console.error("Error al cambiar contraseña", err);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo actualizar la contraseña. Intentalo de nuevo.'
                });
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
        },
       submitForm() {
    if (!this.fechaInicio || !this.fechaFin || !this.selectedBranchId) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor, complete todos los campos.",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (this.fechaFin <= this.fechaInicio) {
        Swal.fire({
            icon: "error",
            title: "Fechas inválidas",
            text: "La fecha de fin debe ser posterior a la fecha de inicio.",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    const url = `./pages/vehiculos.html?fechaInicio=${encodeURIComponent(this.fechaInicio)}&fechaFin=${encodeURIComponent(this.fechaFin)}&sucursal=${encodeURIComponent(this.selectedBranchId)}`;
    window.location.href = url;
}
    }
}).mount('#app');