const { createApp } = Vue;

createApp({
    data() {
        return {
            models: []
        };
    },
    methods: {
        loadModels() {
            axios.get('/api/model/listModels')
                .then(response => {
                    console.log(response)
                    this.models = response.data;
                })
                .catch(error => {
                    console.error("Error al cargar modelos de autos:", error);
                });
        }
        ,

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
        getCancelationText(policy) {
            switch (policy) {
                case 'ZERO': return '0%';
                case 'TWENTY': return '20%';
                case 'FULL': return '100%';
                default: return '-';
            }
        }

    },
    mounted() {
        this.loadModels();
    }
}).mount('#app');