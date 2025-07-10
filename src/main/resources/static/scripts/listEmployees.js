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
      return this.activeEmployees.slice().sort((a, b) => {
        const aBranch = a.branch?.address ?? '';
        const bBranch = b.branch?.address ?? '';
        return aBranch.localeCompare(bBranch);
      });
    },
    inactiveEmployeesSorted() {
      return this.inactiveEmployees.slice().sort((a, b) => {
        const aBranch = a.branch?.address ?? '';
        const bBranch = b.branch?.address ?? '';
        return aBranch.localeCompare(bBranch);
      });
    }
  },
  methods: {
    fetchAll() {
      axios.get('http://localhost:8080/api/user/employees/active')
        .then(res => this.activeEmployees = res.data)
        .catch(() => Swal.fire('Error al cargar empleados activos', '', 'error'));

      axios.get('http://localhost:8080/api/user/employees/inactive')
        .then(res => this.inactiveEmployees = res.data)
        .catch(() => Swal.fire('Error al cargar empleados inactivos', '', 'error'));
    },
    goToForm() {
      window.location.href = 'formEmployee.html';
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
          axios.delete(`http://localhost:8080/api/user/employees/${e.id}`)
            .then(() => this.fetchAll())
            .catch(() => Swal.fire('Error al desactivar', '', 'error'));
        }
      });
    },
    activateEmployee(e) {
      axios.post(`http://localhost:8080/api/user/employees/${e.id}/activate`)
        .then(() => this.fetchAll())
        .catch(() => Swal.fire('Error al reactivar', '', 'error'));
    }
  },
  mounted() {
    this.fetchAll();
  }
}).mount('#appList');
