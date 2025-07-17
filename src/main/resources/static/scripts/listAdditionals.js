const { createApp } = Vue;

createApp({
  data() {
    return {
      allAdditionals: [],
      activeAdditionals: [],
      inactiveAdditionals: []
    };
  },
  methods: {
    fetchAdditionals() {
      axios.get('http://localhost:8080/api/additionals/all')
        .then(res => {
          this.allAdditionals = res.data;
          this.activeAdditionals = this.allAdditionals.filter(a => a.state);
          this.inactiveAdditionals = this.allAdditionals.filter(a => !a.state);
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error al cargar los adicionales', '', 'error');
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
    editItem(item) {
      Swal.fire({
        title: 'Editar adicional',
        html: `
          <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${item.name}">
          <input id="swal-price" class="swal2-input" type="number" step="0.01" placeholder="Precio" value="${item.price}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
          const name = document.getElementById('swal-name').value.trim();
          const price = parseFloat(document.getElementById('swal-price').value);

          if (!name || isNaN(price) || price < 0) {
            Swal.showValidationMessage('Nombre y precio válidos requeridos');
            return false;
          }

          const nameLower = name.toLowerCase();
          const exists = this.allAdditionals.some(a =>
            a.id !== item.id && a.name.trim().toLowerCase() === nameLower
          );

          if (exists) {
            Swal.showValidationMessage('Ya existe un adicional con ese nombre');
            return false;
          }

          return { name, price };
        }
      }).then(result => {
        if (result.isConfirmed) {
          axios.put(`http://localhost:8080/api/additionals/${item.id}`, result.value)
            .then(() => {
              Swal.fire('Actualizado correctamente', '', 'success');
              this.fetchAdditionals();
            })
            .catch(err => {
              console.error(err);
              Swal.fire('Error al actualizar', err.response?.data || 'Error desconocido', 'error');
            });
        }
      });
    },

    deactivateItem(item) {
      Swal.fire({
        title: `¿Dar de baja "${item.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar'
      }).then(result => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:8080/api/additionals/${item.id}`)
            .then(() => {
              Swal.fire('Adicional desactivado', '', 'success');
              this.fetchAdditionals();
            })
            .catch(err => {
              console.error(err);
              Swal.fire('Error al desactivar', err.response?.data || 'Error desconocido', 'error');
            });
        }
      });
    },

    activateItem(item) {
      Swal.fire({
        title: `¿Reactivar "${item.name}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, reactivar'
      }).then(result => {
        if (result.isConfirmed) {
          axios.post(`http://localhost:8080/api/additionals/${item.id}/activate`)
            .then(() => {
              Swal.fire('Adicional reactivado', '', 'success');
              this.fetchAdditionals();
            })
            .catch(err => {
              console.error(err);
              Swal.fire('Error al reactivar', err.response?.data || 'Error desconocido', 'error');
            });
        }
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
                window.location.href = "/index.html";
              });
            })
            .catch(err => {
              console.error("Error al cargar el vehículo:", err);
              Swal.fire("Error", "No se pudo cargar el vehículo", "error");
            });
        }


  },
  mounted() {
    this.fetchAdditionals();
  }
}).mount('#appList');
