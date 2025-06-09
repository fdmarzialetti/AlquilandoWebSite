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
                phone: ''
            },
            mensaje: '',
            isAuthenticated: false
        };
    },
    methods: {
        async registrarCliente() {
            try {
                const response = await fetch('http://localhost:8080/api/clients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.cliente)
                });

                if (response.ok) {
                    const data = await response.json();
                    this.resetForm();

                    // SweetAlert de éxito y redirección
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro exitoso',
                        text: '¡Tu cuenta ha sido creada exitosamente!',
                        confirmButtonText: 'Ir al Login'
                    }).then(() => {
                        window.location.href = 'http://localhost:8080/login.html';
                    });

                } else {
                    // Leer texto de error del backend
                    const errorText = await response.text();

                    let mensajeError = 'Error en el registro.';

                    // Personalizar mensaje según el contenido
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
                        text: "Hubo un problema al cerrar sesión. Intentalo de nuevo.",
                    });
                });
        },
    }
}).mount('#app');
