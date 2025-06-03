const { createApp } = Vue;

createApp({
    data() {
        return {
            cliente: {
                name: '',
                lastname: '',
                dni: '',
                email: '',
                password: '',
                rol: 'CLIENT',
                phone:''
            },
            mensaje: ''
        };
    },
    methods: {
        async registrarCliente() {
            try {
                const response = await fetch('http://localhost:8080/api/clients', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.cliente)
                });

                if (response.ok) {
                    const data = await response.json();
                    this.mensaje = `Cliente registrado correctamente (ID: ${data.id})`;
                    this.resetForm();
                } else {
                    const errorText = await response.text();  // ← leemos el mensaje de error del backend
                        this.mensaje = 'Error: ' + errorText;
                }
            } catch (error) {
                this.mensaje = 'Error de red: ' + error.message;
            }
        },
        resetForm() {
            this.cliente = {
                name: '',
                lastname: '',
                dni: '',
                email: '',
                password: '',
                rol: 'CLIENT'
            };
        }
    }
}).mount('#app');
