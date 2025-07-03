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

    axios.post("/login", params, { maxRedirects: 0 })
        .then(async (res) => {
            if (!res.request.responseURL.includes("/login.html?error")) {

                try {
                    // 👉 Mostrar loader con SweetAlert
                    Swal.fire({
                        title: "Verificando acceso...",
                        html: `<div class="spinner"></div>`,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    const isAdminResponse = await axios.get("/api/user/isAdmin");
                    const isAdmin = isAdminResponse.data === true;

                    const isEmployeeResponse = await axios.get("/api/user/isEmployee");
                    const isEmployee = isEmployeeResponse.data === true;

                    // 👉 Ocultar loader
                    Swal.close();

                    if (isAdmin) {
                        await axios.post("/logout");
                        window.location.href = `../pages/login2FA.html?username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`;
                        return;
                    }

                    if (isEmployee) {
                            window.location.href = "/pages/employee.html";
                            return;
                    }

                    Swal.fire({
                        icon: "success",
                        title: "Sesión iniciada correctamente.",
                        text: "Le damos la bienvenida!",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        window.location.href = "/index.html";
                    });

                } catch (err) {
                    Swal.close();
                    console.error("Error verificando rol del usuario", err);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un error al verificar el rol del usuario."
                    });
                }

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Usuario o contraseña incorrectos."
                });
            }
        })
        .catch((err) => {
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