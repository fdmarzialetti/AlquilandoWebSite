 const { createApp } = Vue;

    createApp({
        data() {
            return {
                branch: {
                    city: '',
                    address: ''
                },
                successMessage: ''
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

                    if (response.ok) {
                        const data = await response.json();
                        this.successMessage = 'Sucursal creada con éxito (ID: ' + data.id + ')';
                        this.branch.city = '';
                        this.branch.address = '';
                    } else {
                        this.successMessage = 'Error al crear sucursal';
                    }
                } catch (error) {
                    this.successMessage = 'Error de red o servidor: ' + error;
                }
            }
            ,

    async logout(){
            try {
                const response = await axios.get('/logout').then(window.location.href="/index.html");
                
            } catch (error) {
                console.log(error);
            }
        }
        }
    }).mount('#app');