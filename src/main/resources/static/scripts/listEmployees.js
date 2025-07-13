const { createApp } = Vue;

createApp({
  data() {
    return {
      activeEmployees: [],
      inactiveEmployees: []
    };
  },
  computed: {
    activeEmployeesSorted() {
      return this.activeEmployees.slice().sort((a, b) => (a.branchAddress ?? '').localeCompare(b.branchAddress ?? ''));
    },
    inactiveEmployeesSorted() {
      return this.inactiveEmployees.slice().sort((a, b) => (a.branchAddress ?? '').localeCompare(b.branchAddress ?? ''));
    }
  },
  methods: {
    fetchAll() {
      axios.get('/api/user/employees/active')
        .then(res => this.activeEmployees = res.data)
        .catch(() => Swal.fire('Error al cargar empleados activos', '', 'error'));

      axios.get('/api/user/employees/inactive')
        .then(res => this.inactiveEmployees = res.data)
        .catch(() => Swal.fire('Error al cargar empleados inactivos', '', 'error'));
    },
    editEmployee(e) {
      window.location.href = `formEmployee.html?id=${e.id}`;
    },
    deactivateEmployee(e) {
      Swal.fire({
        title: `Dar de baja a ${e.name}?`,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar'
      }).then(res => {
        if (res.isConfirmed) {
          axios.delete(`/api/user/employees/${e.id}`)
            .then(() => this.fetchAll())
            .catch(() => Swal.fire('Error al desactivar', '', 'error'));
        }
      });
    },
    activateEmployee(e) {
      axios.post(`/api/user/employees/${e.id}/activate`)
        .then(() => this.fetchAll())
        .catch(() => Swal.fire('Error al reactivar', '', 'error'));
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
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al cerrar sesión. Intentalo de nuevo.",
          });
        });
    }
  },
  mounted() {
    this.fetchAll();
  }
}).mount('#appList');
