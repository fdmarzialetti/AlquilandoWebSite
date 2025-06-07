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

        async logout() {
            console.log("Logout ejecutado");
            axios.get('/logout')
                .then(() => {
                    window.location.href = "/index.html";
                })
                .catch(error => {
                    console.error("Error al cerrar sesión:", error);
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