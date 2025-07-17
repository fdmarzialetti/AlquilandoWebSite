const { createApp } = Vue;

createApp({
  data() {
    return {
      models: [],
      modeloSeleccionado: null
    };
  },
  mounted() {
    this.getModelsComments();
  },
  methods: {
    getModelsComments() {
      axios.get("/api/model/allModelsComments")
        .then(response => {
          this.models = response.data.map(modelo => {
            const valorations = modelo.valorations || [];
            const total = valorations.reduce((acc, val) => acc + val.score, 0);
            const promedio = valorations.length > 0 ? total / valorations.length : 0;
            return {
              ...modelo,
              averageScore: promedio.toFixed(2),
              imagen: this.convertirABase64(modelo.image)
            };
          });
        })
        .catch(error => {
          console.error("Error al obtener los modelos:", error);
        });
    },
    seleccionarModelo(modelo) {
      this.modeloSeleccionado = modelo;
    },
    convertirABase64(bytes) {
      return bytes;
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
            text: "Hubo un problema al cerrar sesión. Inténtalo de nuevo.",
          });
        });
    }
  }
}).mount("#app");
