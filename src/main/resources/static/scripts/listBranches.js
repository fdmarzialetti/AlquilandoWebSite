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
        confirmDelete(id) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede deshacer.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.deleteBranch(id);
                }
            });
        },
        deleteBranch(id) {
            axios.delete(`http://localhost:8080/api/branches/${id}`)
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        title: "Sucursal eliminada",
                        text: "La sucursal fue eliminada exitosamente.",
                        confirmButtonText: "Aceptar"
                    }).then(() => {
                        this.loadBranches();
                        // También podrías redirigir con:
                        // window.location.href = '../pages/listBranches.html';
                    });
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        Swal.fire({
                            icon: "warning",
                            title: "No se puede eliminar",
                            text: error.response.data || "La sucursal no se puede eliminar porque tiene datos asociados."
                        });
                    } else {
                        console.error("Error al eliminar:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Ocurrió un error al intentar eliminar la sucursal.",
                        });
                    }
                });
        },
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
        }
    },
    mounted() {
        this.loadBranches();
    }
}).mount('#app');
