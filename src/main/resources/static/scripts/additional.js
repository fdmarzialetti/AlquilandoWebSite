const { createApp } = Vue;

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

createApp({
  data() {
    return {
      codigoReserva: getParam("code"),
      modelo: getParam("modelo"),
      vehicleId: getParam("vehiculoId"),
      adicionales: [],
      addicionalesVehiculo: [],
      cargado: false,
      detalleVehiculo: null,
      fechasReserva: null,
      precioFinal: 0, // <--- NUEVO
      idSeleccionado: "",
    };
  },
  computed: {
    mostrarLista() {
      return this.addicionalesVehiculo.length > 0;
    },
    mostrarMensajeVacio() {
      return this.addicionalesVehiculo.length === 0;
    },
    fechaInicioFormateada() {
      if (!this.fechasReserva) return "";
      return new Date(this.fechasReserva.startDate).toLocaleDateString("es-AR");
    },
    fechaFinFormateada() {
      if (!this.fechasReserva) return "";
      return new Date(this.fechasReserva.endDate).toLocaleDateString("es-AR");
    },
    totalAdicionales() {
      return this.addicionalesVehiculo.reduce((total, adicional) => total + adicional.price, 0);
    },
    precioTotal() {
      return this.precioFinal + this.totalAdicionales;
    },
  },
  methods: {
    obtenerAdicionales() {
      axios.get('/api/additionals/all')
        .then(response => {
          this.adicionales = response.data.filter(a=>a.state==true);
          console.log("Response:", response);
          console.log("Adicionales:", JSON.parse(JSON.stringify(this.adicionales))); // para ver sin proxy
        })
        .catch(error => {
          console.error("Error al obtener adicionales:", error);
          this.adicionales = [];
        });
    }
    ,
    cargarAdicional() {
      this.addicionalesVehiculo.push(this.adicionales.find(({id})=>id==this.idSeleccionado))
    },
    async obtenerDatosVehiculo() {
      try {
        const response = await axios.get(`/api/model/by-name`, {
          params: { name: this.modelo }
        });
        this.detalleVehiculo = {
          brand: response.data.brand,
          name: response.data.name,
          image: response.data.image,
          price: response.data.price // por si querés seguir mostrándolo
        };
      } catch (error) {
        console.error("Error al obtener modelo:", error);
      }
    },
    async obtenerFechasReserva() {
      try {
        const response = await axios.get(`/api/reservation/dates/${this.codigoReserva}`);
        this.fechasReserva = {
          startDate: response.data.startDate,
          endDate: response.data.endDate
        };
        this.precioFinal = response.data.price; // <--- NUEVO
      } catch (error) {
        console.error("Error al obtener fechas de reserva:", error);
      }
    },
    irAAgregarAdicional() {
      window.location.href = `addAdditional.html?code=${this.codigoReserva}`;
    },
    finalizar() {
  // Paso 1: enviar adicionales
  axios.post('/api/reservation/add-additional', {
    adicionales: this.addicionalesVehiculo,
    codigoReserva: this.codigoReserva
  })
  // Paso 2: luego asignar el vehículo
  .then(() => {
    return axios.post('/api/reservation/assign-vehicle', {
      codigoReserva: this.codigoReserva,
      vehicleId: this.vehicleId
    });
  })
  // Paso 3: mostrar éxito y redirigir
  .then(() => {
    Swal.fire({
      title: 'Operación completada',
      text: 'El vehículo fue asignado y los adicionales guardados correctamente.',
      icon: 'success',
      confirmButtonText: 'Ir a confirmación'
    }).then(() => {
      window.location.href = `../pages/confirmation.html?codigoReserva=${this.codigoReserva}`;
    });
  })
  // Paso 4: manejo de errores
  .catch(error => {
    const msg = error.response?.data || 'Ocurrió un error al finalizar la operación.';
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error',
      confirmButtonText: 'Entendido'
    });
    console.error(error);
  });
},
eliminarAdicional(index) {
    this.addicionalesVehiculo.splice(index, 1);
  },
    formatPriceArg(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
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
    if (!this.codigoReserva || !this.modelo) {
      Swal.fire("Error", "Faltan parámetros en la URL", "error");
      return;
    }

    this.obtenerAdicionales();
    this.obtenerDatosVehiculo();
    this.obtenerFechasReserva();
  },
}).mount("#app");


