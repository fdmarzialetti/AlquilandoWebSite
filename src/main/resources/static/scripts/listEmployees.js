const { createApp } = Vue;

createApp({
  data() {
    return {
      activeEmployees: [],
      inactiveEmployees: []
    };
  },
  computed: {
    activeEmployeesSorted() {
      return this.activeEmployees.slice().sort((a, b) =>
        (a.branchAddress ?? '').localeCompare(b.branchAddress ?? '')
      );
    },
    inactiveEmployeesSorted() {
      return this.inactiveEmployees.slice().sort((a, b) =>
        (a.branchAddress ?? '').localeCompare(b.branchAddress ?? '')
      );
    }
  },
  methods: {
    fetchAll() {
      axios.get('/api/user/employees/active')
        .then(res => this.activeEmployees = res.data)
        .catch(() => Swal.fire('Error al cargar empleados activos', '', 'error'));

      axios.get('/api/user/employees/inactive')
        .then(res => this.inactiveEmployees = res.data)
        .catch(() => Swal.fire('Error al cargar empleados inactivos', '', 'error'));
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
    formatBranch(e) {
      if (!e.branchCity && !e.branchAddress) return 'N/A';
      if (e.branchCity && e.branchAddress) return `${e.branchCity} - ${e.branchAddress}`;
      return e.branchAddress || e.branchCity || 'N/A';
    },
    editEmployee(e) {
      window.location.href = `formEmployee.html?id=${e.id}`;
    },
    deactivateEmployee(e) {
      Swal.fire({
        title: `Dar de baja a ${e.name}?`,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      }).then(res => {
        if (res.isConfirmed) {
          axios.delete(`/api/user/employees/${e.id}`)
            .then(() => this.fetchAll())
            .catch(() => Swal.fire('Error al desactivar', '', 'error'));
        }
      });
    },
    activateEmployee(e) {
      axios.post(`/api/user/employees/${e.id}/activate`)
        .then(() => this.fetchAll())
        .catch(() => Swal.fire('Error al reactivar', '', 'error'));
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
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al cerrar sesión. Inténtalo de nuevo.",
          });
        });
    }
  },
  mounted() {
    this.fetchAll();
  }
}).mount('#appList');
