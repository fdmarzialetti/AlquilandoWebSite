const { createApp } = Vue;

createApp({
    data() {
        return {
            models: []
        };
    },
    methods: {
        // Cargar modelos activos desde el backend
        loadModels() {
            axios.get('/api/model/listActiveModels')
                .then(response => {
                    this.models = response.data;
                    console.log("Modelos cargados:", this.models); // Para depuración
                })
                .catch(error => {
                    console.error("Error al cargar modelos de autos:", error);
                });
        },

        // Desactivar un modelo por ID
        deactivateModel(id) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción eliminará el modelo.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.put(`/api/model/${id}/deactivate`)
                        .then(() => {
                            // Remueve el modelo de la lista local
                            this.models = this.models.filter(model => model.id !== id);
                            Swal.fire('Eliminado', 'El modelo ha sido eliminado.', 'success');
                        })
                        .catch(error => {
                            console.error("Error al eliminar el modelo:", error);
                            let msg = "No se pudo eliminar el modelo, porque tiene vehiculos asociados";

                            if (error.response && error.response.status === 409) {
                                // Mensaje devuelto por el backend si hay vehículos asociados
                                msg = error.response.data;
                            }

                            Swal.fire('Error', msg, 'error');
                        });
                }
            });
        },

        // Cerrar sesión
        logout() {
            axios.post("/logout")
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Sesión cerrada",
                        text: "Has cerrado sesión correctamente. Hasta pronto!",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        window.location.href = "/index.html";
                    });
                })
                .catch(error => {
                    console.error("Error al cerrar sesión:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Hubo un problema al cerrar sesión. Inténtalo de nuevo.",
                    });
                });
        },

        // Convertir enum de política de cancelación a texto
        getCancelationText(policy) {
            switch (policy) {
                case 'ZERO': return '0%';
                case 'TWENTY': return '20%';
                case 'FULL': return '100%';
                default: return '-';
            }
        }
    },

    // Se ejecuta al cargar la página
    mounted() {
        this.loadModels();
    }
}).mount('#app');
