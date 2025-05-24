const { createApp } = Vue;

createApp({
    data() {
        return {
            marca: "",
            modelo: "",
            models:[]
        }
    },
    created() {
        
    },
    mounted() {
        this.getModels();

    },
    methods: {
        async createCar() {
            try {
                const res = await axios.post('/api/car/create', {
                    brand: this.marca,
                    model: this.modelo,
                    status: "MAINTENANCE"
                });
                console.log("Auto creado:", res.data);
            } catch (error) {
                console.log(error);
                document.getElementById("errorMsg").innerHTML = error.response?.data || "Error desconocido";
            }
        },
        async getModels(){
            try {
                const response = await axios.get('/api/model/listModels');
                console.log(response)
                this.models = response.data;
            } catch (error) {
                console.log(error);
                document.getElementById("errorMsg").innerHTML = error.response?.data || "Error desconocido";
            }
        }

    }
}).mount('#app');