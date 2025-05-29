const { createApp } = Vue;

createApp({
    data() {
        return {
            models: []
        };
    },
    methods: {
        loadModels() {
            axios.get('http://localhost:8080/api/model/listModels')
                .then(response => {
                    console.log(response)
                    this.models = response.data;
                })
                .catch(error => {
                    console.error("Error al cargar modelos de autos:", error);
                });
        }
        ,

    async logout(){
            try {
                const response = await axios.get('/logout').then(window.location.href="/index.html");
                
            } catch (error) {
                console.log(error);
            }
        }

    },
    mounted() {
        this.loadModels();
    }
}).mount('#app');