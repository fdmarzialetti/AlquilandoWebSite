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
                phone:''
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
                    this.mensaje = `Cliente registrado correctamente (ID: ${data.id})`;
                    this.resetForm();
                } else {
                    const errorText = await response.text();  // ← leemos el mensaje de error del backend
                        this.mensaje = 'Error: ' + errorText;
                }
            } catch (error) {
                this.mensaje = 'Error de red: ' + error.message;
            }
        },
        resetForm() {
            this.cliente = {
                name: '',
                lastname: '',
                dni: '',
                email: '',
                password: '',
                rol: 'CLIENT'
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
    }
}).mount('#app');
