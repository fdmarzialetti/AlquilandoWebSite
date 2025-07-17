const { createApp } = Vue;

createApp({
  data() {
    return {
      adicionales: [],
      idSeleccionado: null,
      codigoReserva: null
    };
  },
  methods: {
    obtenerAdicionales() {
      axios.get('http://localhost:8080/api/additionals/all')
        .then(res => {
          this.adicionales = res.data.filter(a => a.state); // Solo activos
        })
        .catch(err => {
          console.error(err);
          Swal.fire("Error", "No se pudieron obtener los adicionales", "error");
        });
    },
    cargarAdicional() {
        console.log(this.codigoReserva)
      if (!this.idSeleccionado) {
        Swal.fire("Seleccione un adicional", "", "info");
        return;
      }

      axios.post("http://localhost:8080/api/reservation/add-additional", {
        reservationCode: this.codigoReserva,
        additionalId: this.idSeleccionado
      })
      .then(() => {
        Swal.fire({
          title: "Éxito",
          text: "Adicional agregado correctamente",
          icon: "success",
          showConfirmButton: true
        });

        setTimeout(() => {
          window.location.href = `additional.html?code=${this.codigoReserva}`;
        }, 1600);
      })
      .catch(err => {
        const msg = err.response?.data || "No se pudo agregar el adicional";
        Swal.fire("Error", msg, "error");
      });
    },
    obtenerCodigoDesdeURL() {
      const params = new URLSearchParams(window.location.search);
      this.codigoReserva = params.get("code");
    },
    formatPriceArg(value) {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
      }).format(value);
    },
    volver() {
      window.location.href = `additional.html?code=${this.codigoReserva}`; // Ruta relativa desde /pages/
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
  },
  mounted() {
    this.obtenerCodigoDesdeURL();
    this.obtenerAdicionales();
  }
}).mount("#app");
