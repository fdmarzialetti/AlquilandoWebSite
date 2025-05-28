
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                branches: []
            };
        },
        methods: {
            loadBranches() {
                axios.get('http://localhost:8080/api/branches')
                    .then(response => {
                        this.branches = response.data;
                    })
                    .catch(error => {
                        console.error("Error al cargar sucursales:", error);
                    });
            },
            deleteBranch(id) {
                if (confirm("¿Estás seguro de eliminar esta sucursal?")) {
                    axios.delete(`http://localhost:8080/api/branches/${id}`)
                        .then(() => {
                            this.branches = this.branches.filter(b => b.id !== id);
                        })
                        .catch(error => {
                            console.error("Error al eliminar:", error);
                        });
                }
            }
        },
        mounted() {
            this.loadBranches();
        }
    }).mount('#app');
