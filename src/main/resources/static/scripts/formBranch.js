const { createApp } = Vue;

createApp({
    data() {
        return {
            branch: {
                city: '',
                address: ''
            }
        };
    },
    methods: {
        async submitForm() {
            try {
                const response = await fetch('http://localhost:8080/api/branches', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.branch)
                });

                const data = await response.text();

                if (response.ok) {
                    // Mostrar SweetAlert2
                    Swal.fire({
                        icon: 'success',
                        title: '¡Sucursal creada!',
                        text: 'Redirigiendo a la lista de sucursales...',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = 'http://localhost:8080/pages/listBranches.html';
                    });

                    // Limpiar formulario
                    this.branch.city = '';
                    this.branch.address = '';

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red o servidor',
                    text: error.toString()
                });
            }
        }
    }
}).mount('#app');
