const { createApp } = Vue;

createApp({
    data() {
        return {
            marca: "",
            modelo: ""
        }
    },
    created() {

    },
    mounted() {

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
        }
    }
}).mount('#app');