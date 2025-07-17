const { createApp } = Vue;

createApp({
    data() {
        return {
            cliente: {
                name: '',
                lastname: '',
                dni: '',
                email: '',
                password: '',
                rol: 'CLIENT',
                phone: '',
                registradoPorEmpleado: false
            },
            mensaje: '',
            isAuthenticated: false,
            isAdmin: false,
            isEmployee: false
        };
    },
    methods: {
        async registrarCliente() {
            //Si un empleado lleno el form 
            // Validación JS de contraseña
            if (this.isEmployee) {
                this.cliente.registradoPorEmpleado = true;
            }
            else if (this.cliente.password.length < 6) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña inválida',
                    text: 'La contraseña debe contener al menos 6 caracteres.'
                });
                return;
            }

            Swal.fire({
                title: 'Registrando cliente…',
                html: 'Por favor, espera.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const response = await fetch('http://localhost:8080/api/clients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.cliente)
                });

                if (response.ok) {
                    const mensaje = await response.text();
                    this.resetForm();

                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        text: mensaje, // podés mostrar el mensaje real del backend
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        window.location.href = 'http://localhost:8080/pages/formClient.html';
                    });
                } else {
                    const errorText = await response.text();
                    let mensajeError = 'Error en el registro.';

                    if (errorText.includes('email')) {
                        mensajeError = 'El email ya está registrado.';
                    } else if (errorText.includes('dni')) {
                        mensajeError = 'El DNI ya está registrado.';
                    } else {
                        mensajeError = errorText;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'No se pudo registrar',
                        text: mensajeError
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red',
                    text: 'No se pudo conectar al servidor. Intenta más tarde.'
                });
            }
        },
        resetForm() {
            this.cliente = {
                name: '',
                lastname: '',
                dni: '',
                email: '',
                password: '',
                rol: 'CLIENT',
                phone: ''
            };
        },
        checkAuth() {
            axios.get("/api/user/isAuthenticated")
                .then(response => {
                    this.isAuthenticated = response.data === true;
                })
                .catch(error => {
                    console.error("Error al verificar autenticación:", error);
                    this.isAuthenticated = false;
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
                .catch(error => {
                    console.error("Error al cerrar sesión:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un problema al cerrar sesión. Inténtalo de nuevo.",
                    });
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
        async verificarRolUsuario() {
            try {
                const adminRes = await axios.get('/api/user/isAdmin');
                this.isAdmin = adminRes.data === true;

                const employeeRes = await axios.get('/api/user/isEmployee');
                this.isEmployee = employeeRes.data === true;

                // Si no es ni admin ni empleado, lo consideramos cliente
                if (!this.isAdmin && !this.isEmployee) {
                    this.cliente.rol = 'CLIENT';
                } else if (this.isAdmin) {
                    this.cliente.rol = 'ADMIN';
                } else if (this.isEmployee) {
                    this.cliente.rol = 'EMPLOYEE';
                }

                this.isAuthenticated = true;

            } catch (error) {
                console.error('Error al verificar el rol:', error);
                this.isAuthenticated = false;
            }
        }
    },
    mounted() {
        this.checkAuth();
        this.verificarRolUsuario();
    }
}).mount('#app');
