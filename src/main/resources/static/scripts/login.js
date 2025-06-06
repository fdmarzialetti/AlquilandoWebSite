const { createApp } = Vue;
createApp({
    data() {
        return {
            username: "",
            password: "",
            isAuthenticated: false,
        };
    },
    mounted() {
        this.checkAuth();
    },
    methods: {
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
        }, login() {
            const params = new URLSearchParams();
            params.append("username", this.username);
            params.append("password", this.password);

            axios.post("/login", params, { maxRedirects: 0 }) // Evita seguir redirecciones
                .then((res) => {
                    console.log(res)
                    if (res.request.responseURL != "http://localhost:8080/login.html?error=true") {
                        // En caso de que el backend responda con 200 (login exitoso real)
                        Swal.fire({
                            icon: "success",
                            title: "Sesión iniciada correctamente.",
                            text: "Le damos la bienvenida!",
                            confirmButtonText: "Aceptar"
                        }).then(() => {
                            window.location.href = "/index.html";
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Usuario o contraseña incorrectos."
                        });
                    }

                })
                .catch((err) => {
                    // Si Spring responde con 302 hacia /login?error, esto se capta como error
                    console.error("Error de login:", err);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Usuario o contraseña incorrectos."
                    });
                });
        }
    }
}).mount('#app');