const { createApp } = Vue;

createApp({
    data() {
        return {
            additional: {
                name: '',
                price: 0
            },
            successMessage: ''
        };
    },
    methods: {
        submitForm() {
            axios.post('http://localhost:8080/api/additionals', this.additional)
                .then(response => {
                    // Mostrar mensaje éxito
                    Swal.fire('Éxito', 'El adicional fue creado correctamente', 'success')
                        .then(() => {
                            // Redirigir después de cerrar el alert
                            window.location.href = 'listAdditionals.html';
                        });

                    // Limpiar formulario (opcional, aunque vas a redirigir)
                    this.additional.name = '';
                    this.additional.price = 0;
                })
                .catch(error => {
                    console.error(error);
                    Swal.fire('Error', error.response?.data || 'No se pudo crear el adicional', 'error');
                });
        },
        logout() {
            Swal.fire('Sesión cerrada');
        }
    }
}).mount('#formAdditional');
