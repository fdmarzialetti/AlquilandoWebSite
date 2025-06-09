
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
                           this.loadBranches(); // Recarga las sucursales filtradas
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
               }
           }

            ,

        logout() {
    axios.post("/logout")
        .then(() => {
            this.isAuthenticated = false;
            Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                text: "Has cerrado sesión correctamente. Hasta pronto!",
                confirmButtonText: "Aceptar"
            }).then(() => {
                window.location.href = "/index.html"; // o la página que corresponda
            });
        })
        .catch(error => {
            console.error("Error al cerrar sesión:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al cerrar sesión. Intentalo de nuevo.",
            });
        });
}
        },
        mounted() {
            this.loadBranches();
        }
    }).mount('#app');
