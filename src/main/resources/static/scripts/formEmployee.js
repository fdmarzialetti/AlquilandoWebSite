const { createApp } = Vue;

createApp({
  data() {
    return {
      employee: {
        name: '',
        lastname: '',
        email: '',
        dni: '',
        phone: '',
        branchId: null,
        password: ''
      },
      branches: [],
      isEdit: false,
      employeeId: null,
      showPassword: false
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    loadBranches() {
      axios.get('http://localhost:8080/api/branches')
        .then(res => {
          this.branches = res.data;
        })
        .catch(() => Swal.fire('Error al cargar sucursales', '', 'error'));
    },
    loadEmployee() {
      axios.get(`http://localhost:8080/api/user/employees/${this.employeeId}`)
        .then(res => {
          this.employee = {
            name: res.data.name || '',
            lastname: res.data.lastname || '',
            email: res.data.email || '',
            dni: res.data.dni || '',
            phone: res.data.phone || '',
            branchId: res.data.branchId || null,
            password: ''
          };
        })
        .catch(() => Swal.fire('Error al cargar empleado', '', 'error'));
    },
    validateForm() {
      const form = this.$refs.employeeForm;
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        Swal.fire('Error', 'Por favor complete correctamente todos los campos.', 'error');
        return false;
      }
      return true;
    },
    saveEmployee() {
      if (!this.validateForm()) return;

      const url = this.isEdit
        ? `http://localhost:8080/api/user/employees/${this.employeeId}`
        : 'http://localhost:8080/api/user/employees';

      const method = this.isEdit ? axios.put : axios.post;

      const payload = {
        name: this.employee.name,
        lastname: this.employee.lastname,
        email: this.employee.email,
        dni: this.employee.dni,
        phone: this.employee.phone,
        branch: this.employee.branchId !== null ? { id: this.employee.branchId } : null,
      };

      if (!this.isEdit) {
        payload.password = this.employee.password;
      }

      method(url, payload)
        .then(() => {
          Swal.fire('Empleado guardado con éxito', '', 'success')
            .then(() => window.location.href = 'listEmployees.html');
        })
        .catch(err => {
          const msg = err.response?.data || 'Error al guardar empleado';
          Swal.fire(msg, '', 'error');
        });
    },
    submitForm() {
      this.saveEmployee();
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
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
      this.isEdit = true;
      this.employeeId = params.get('id');
      this.loadEmployee();
    }
    this.loadBranches();
  }
}).mount('#appForm');
