   const { createApp } = Vue;

    createApp({
        data() {
            return {
                brand: "",
                model: "",
                status: "",
                image: null,
                searchId: "",
                fetchedCar: null
            };
        },
        methods: {
            handleImage(event) {
                this.image = event.target.files[0];
            },
            async createCar() {
                try {
                    const formData = new FormData();
                    formData.append("brand", this.brand);
                    formData.append("model", this.model);
                    formData.append("status", this.status);
                    formData.append("image", this.image);

                    const res = await axios.post('/api/car/create', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    console.log("Auto creado:", res.data);
                    alert("Auto registrado con éxito");
                } catch (error) {
                    console.error(error);
                    alert(error.response?.data || "Error al registrar el auto");
                }
            },
            async getCarById() {
                if (!this.searchId) {
                    alert("Por favor, ingresá un ID.");
                    return;
                }

                try {
                    const res = await axios.get(`/api/car/${this.searchId}`);
                    this.fetchedCar = res.data;
                    console.log("Auto encontrado:", res.data);
                } catch (error) {
                    console.error(error);
                    alert("Auto no encontrado");
                    this.fetchedCar = null;
                }
            }
        }
    }).mount('#app');