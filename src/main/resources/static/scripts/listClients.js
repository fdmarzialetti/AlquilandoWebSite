const { createApp } = Vue;

createApp({
    data() {
        return {
            clientes: []
        };
    },
    async mounted() {
        try {
            const response = await fetch('http://localhost:8080/api/clients');
            if (response.ok) {
                this.clientes = await response.json();
                console.log(clientes);
            } else {
                console.error('Error al cargar los clientes');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    }
}).mount('#app');
