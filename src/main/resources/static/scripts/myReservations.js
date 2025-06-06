const { createApp } = Vue;

createApp({
    data() {
        return {
            reservas: [],
            isAuthenticated: false,
            user: { name: "Cuenta" }

        };
    },
    methods: {
        formatFecha(fechaStr) {
            const [year, month, day] = fechaStr.split('-');
            return `${parseInt(day)}/${parseInt(month)}/${year}`;
        },
        checkAuth() {
            axios.get("/api/user/isAuthenticated")
                .then(response => {
                    this.isAuthenticated = response.data === true;
                })
                .then(res => axios.get("/api/user/data")).then(
                    res => {
                        this.user = res.data;
                    }
                )
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
    },
    async mounted() {

        try {
            const token = localStorage.getItem('token'); // Asegurate que se guarda después del login

            const response = await fetch('http://localhost:8080/api/user/reservations', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                console.error("Error al obtener reservas:", await response.text());
                return;
            }

            this.reservas = await response.json();
            this.checkAuth()
        } catch (error) {
            console.error("Error de red:", error);
        }
    },
}).mount('#app');
