const { createApp } = Vue;

createApp({
  data() {
    return {
      employee: {
        name: '',
        lastname: '',
        email: '',
        dni: '',
        phone: '',
        branchId: null,
        password: ''
      },
      branches: [],
      isEdit: false,
      employeeId: null
    };
  },
  methods: {
    loadBranches() {
      axios.get('http://localhost:8080/api/branches')
        .then(res => {
          this.branches = res.data;
        })
        .catch(() => Swal.fire('Error al cargar sucursales', '', 'error'));
    },
    loadEmployee() {
      axios.get(`http://localhost:8080/api/user/employees/${this.employeeId}`)
        .then(res => {
          this.employee = {
            name: res.data.name || '',
            lastname: res.data.lastname || '',
            email: res.data.email || '',
            dni: res.data.dni || '',
            phone: res.data.phone || '',
            // Aseguramos que branchId tome el id de la sucursal del empleado
            branchId: res.data.branch ? res.data.branch.id : null,
            password: ''
          };
        })
        .catch(() => Swal.fire('Error al cargar empleado', '', 'error'));
    },
    saveEmployee() {
      const url = this.isEdit
        ? `http://localhost:8080/api/user/employees/${this.employeeId}`
        : 'http://localhost:8080/api/user/employees';

      const method = this.isEdit ? axios.put : axios.post;

      const payload = {
        ...this.employee,
        branch: this.employee.branchId !== null ? { id: this.employee.branchId } : null
      };

      method(url, payload)
        .then(() => {
          Swal.fire('Empleado guardado con éxito', '', 'success')
            .then(() => window.location.href = 'listEmployees.html');
        })
        .catch(err => {
          const msg = err.response && err.response.data ? err.response.data : 'Error al guardar empleado';
          Swal.fire(msg, '', 'error');
        });
    },
    goBack() {
      window.location.href = 'listEmployees.html';
    },
    submitForm() {
      this.saveEmployee();
    }
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
      this.isEdit = true;
      this.employeeId = params.get('id');
      this.loadEmployee();
    }
    this.loadBranches();
  }
}).mount('#appForm');
