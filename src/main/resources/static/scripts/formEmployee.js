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
          const msg = err.response?.data || 'Error al guardar empleado';
          Swal.fire(msg, '', 'error');
        });
    },
    submitForm() {
      this.saveEmployee();
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
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
      this.isEdit = true;
      this.employeeId = params.get('id');
      this.loadEmployee();
    }
    this.loadBranches();
  }
}).mount('#appForm');
