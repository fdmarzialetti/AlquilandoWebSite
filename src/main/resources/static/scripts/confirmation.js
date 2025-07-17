const { createApp } = Vue;

function getParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

createApp({
  data() {
    return {
      codigoReserva: getParam("codigoReserva"),
      reserva: null,
      adicionales: [],
      error: null,
    };
  },
  mounted() {
    this.cargarReserva();
    this.cargarAdicionales();
  },
  methods: {
    async cargarReserva() {
      try {
        const res = await axios.get(`/api/reservation/${this.codigoReserva}`);
        this.reserva = res.data;
      } catch (error) {
        this.error = "Error al cargar la reserva.";
        console.error(error);
      }
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
                                                            },
    async cargarAdicionales() {
      try {
        const res = await axios.get(`/api/reservation/${this.codigoReserva}/additionals`);
        this.adicionales = res.data;
      } catch (error) {
        console.error("Error al cargar adicionales", error);
      }
    },
    formatPriceArg(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
    },
    irAlPanelEmpleado() {
      window.location.href = 'employee.html';
    },
    normalizarFecha(fechaStr) {
      if (!fechaStr) return "";
      const [anio, mes, dia] = fechaStr.split("-").map(Number);
      return new Date(anio, mes - 1, dia);
    }
  },
  computed: {
    fechaInicioFormateada() {
      const date = this.normalizarFecha(this.reserva?.startDate);
      return date ? date.toLocaleDateString("es-AR") : "";
    },
    fechaFinFormateada() {
      const date = this.normalizarFecha(this.reserva?.endDate);
      return date ? date.toLocaleDateString("es-AR") : "";
    },
    resumenVehiculo() {
      return this.reserva?.vehicle?.model || "No asignado";
    },
    totalAdicionales() {
      return this.adicionales.reduce((acc, val) => acc + val.price, 0);
    },
    totalFinal() {
      return (this.reserva?.payment || 0) + this.totalAdicionales;
    }
  }
}).mount("#app");
