const { createApp } = Vue;
createApp({
    data() {
        return {
            user: "",
            password: "",
            isAuthenticated: false
        };
    },
    mounted(){
        this.checkAuth();
    },
    methods:{
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
}
    }
}).mount('#app');