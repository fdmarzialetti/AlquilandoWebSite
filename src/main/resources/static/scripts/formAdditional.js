const { createApp } = Vue;

createApp({
  data() {
    return {
      additional: {
        name: '',
        price: 0
      },
      successMessage: ''
    };
  },
  methods: {
    submitForm() {
      axios.post('http://localhost:8080/api/additionals', this.additional)
        .then(() => {
          Swal.fire('Éxito', 'El adicional fue creado correctamente', 'success')
            .then(() => {
              window.location.href = 'listAdditionals.html';
            });
        })
        .catch(error => {
          console.error(error);
          Swal.fire('Error', error.response?.data || 'No se pudo crear el adicional', 'error');
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
  }
}).mount('#formAdditional');
