const { createApp } = Vue;

createApp({
  data() {
    return {
      activeBranches: [],
      inactiveBranches: []
    };
  },
  methods: {
    fetchBranches() {
      axios.get("/api/branches")
        .then(res => this.activeBranches = res.data)
        .catch(() => Swal.fire("Error al cargar sucursales activas", "", "error"));

      axios.get("/api/branches/inactive")
        .then(res => this.inactiveBranches = res.data)
        .catch(() => Swal.fire("Error al cargar sucursales inactivas", "", "error"));
    },
    editBranch(branch) {
      window.location.href = `formBranch.html?id=${branch.id}`;
    },
    deactivateBranch(branch) {
      Swal.fire({
        title: `¿Dar de baja la sucursal ${branch.city}?`,
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, dar de baja",
        cancelButtonText: "Cancelar"
      }).then(result => {
        if (result.isConfirmed) {
          axios.delete(`/api/branches/${branch.id}`)
            .then(() => this.fetchBranches())
            .catch(error => {
              const msg = error.response?.data || "Error al desactivar";
              Swal.fire("No se pudo desactivar", msg, "error");
            });
        }
      });
    },
    activateBranch(branch) {
      axios.post(`/api/branches/${branch.id}/activate`)
        .then(() => this.fetchBranches())
        .catch(() => Swal.fire("Error al reactivar la sucursal", "", "error"));
    },
    logout() {
      axios.post("/logout")
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Sesión cerrada",
            text: "Has cerrado sesión correctamente.",
          }).then(() => window.location.href = "/index.html");
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al cerrar sesión.",
          });
        });
    }
  },
  mounted() {
    this.fetchBranches();
  }
}).mount("#appBranches");
