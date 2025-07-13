const { createApp } = Vue;

createApp({
  data() {
    return {
      branch: {
        city: '',
        address: ''
      },
      isEdit: false,
      branchId: null
    };
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      this.isEdit = true;
      this.branchId = id;
      this.fetchBranch(id);
    }
  },
  methods: {
    async fetchBranch(id) {
      try {
        const res = await fetch(`http://localhost:8080/api/branches/${id}`);
        if (res.ok) {
          const data = await res.json();
          this.branch = data;
        } else {
          Swal.fire("Error", "No se pudo cargar la sucursal", "error");
        }
      } catch (error) {
        Swal.fire("Error de red", error.message, "error");
      }
    },

    async submitForm() {
      const url = this.isEdit
        ? `http://localhost:8080/api/branches/${this.branchId}`
        : 'http://localhost:8080/api/branches';

      const method = this.isEdit ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.branch)
        });

        const data = await response.text();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: this.isEdit ? "Sucursal actualizada" : "Sucursal creada",
            text: "Redirigiendo al listado...",
            showConfirmButton: false,
            timer: 2000
          });

          setTimeout(() => {
            window.location.href = "listBranches.html";
          }, 2000);
        } else {
          Swal.fire("Error", data || "Ocurrió un problema", "error");
        }
      } catch (error) {
        Swal.fire("Error de red", error.message, "error");
      }
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
  }
}).mount('#app');
