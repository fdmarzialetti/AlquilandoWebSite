const { createApp } = Vue;

createApp({
    data() {
        return {
            reservas: []
        };
    },
    methods: {
        formatFecha(fechaStr) {
            // Convierte a formato legible (ej: 2025-06-01 → 1/6/2025)
            const date = new Date(fechaStr);
            return date.toLocaleDateString('es-ES');
        }
    },
    async mounted() {
        try {
            const token = localStorage.getItem('token'); // Asegurate que se guarda después del login

            const response = await fetch('http://localhost:8080/api/user/reservations', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                console.error("Error al obtener reservas:", await response.text());
                return;
            }

            this.reservas = await response.json();
        } catch (error) {
            console.error("Error de red:", error);
        }
    }
}).mount('#app');
