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
            axios.post("/logout") // Cambiá este endpoint si usás otro.
                .then(() => {
                    this.isAuthenticated = false;
                    window.location.href = "/index.html"; // o donde quieras redirigir después del logout
                })
                .catch(error => {
                    console.error("Error al cerrar sesión:", error);
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
