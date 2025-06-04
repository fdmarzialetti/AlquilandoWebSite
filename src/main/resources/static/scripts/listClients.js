const { createApp } = Vue;

createApp({
    data() {
        return {
            clientes: []
        };
    },
    methods: {
        async eliminarCliente(id) {
            if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

            try {
                const response = await fetch(`http://localhost:8080/api/clients/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    this.clientes = this.clientes.filter(cliente => cliente.id !== id);
                    alert("Cliente eliminado exitosamente.");
                } else {
                    alert("Error al eliminar el cliente.");
                }
            } catch (error) {
                console.error("Error de red:", error);
            }
        }
    },
    async mounted() {
        try {
            const response = await fetch('http://localhost:8080/api/clients');
            if (response.ok) {
                this.clientes = await response.json();
            } else {
                console.error('Error al cargar los clientes');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    }
}).mount('#app');
