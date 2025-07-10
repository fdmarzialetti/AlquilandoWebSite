const { createApp } = Vue;

createApp({
    data() {
        return {
            models: [],
            modeloSeleccionado: null
        };
    },
    mounted() {
        this.getModelsComments();
    },
    methods: {
        getModelsComments() {
            axios.get("/api/model/allModelsComments")
                .then(response => {
                    console.log(response)
                    this.models = response.data.map(modelo => {
                        const valorations = modelo.valorations || [];
                        const total = valorations.reduce((acc, val) => acc + val.score, 0);
                        const promedio = valorations.length > 0 ? total / valorations.length : 0;
                        console.log(this.models);
                        return {
                            ...modelo,
                            averageScore: promedio.toFixed(2), // lo guardamos directamente
                            imagen: this.convertirABase64(modelo.image) // decodificar imagen byte[] si viene en base64
                        };
                    });
                })
                .catch(error => {
                    console.error("Error al obtener los modelos:", error);
                });
        },
        seleccionarModelo(modelo) {
            this.modeloSeleccionado = modelo;
        },
        convertirABase64(bytes) {
            // Si ya viene como base64 en el back, podés devolver directamente
            return bytes;
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
    
}).mount("#app");
