const { createApp } = Vue;

createApp({
  data() {
    return {
      branch: {
        city: '',
        address: ''
      },
      successMessage: ''
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('http://localhost:8080/api/branches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.branch)
        });

        const data = await response.text();

        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Sucursal creada con éxito",
            text: "Redirigiendo al listado...",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });

          setTimeout(() => {
            window.location.href = "http://localhost:8080/pages/listBranches.html";
          }, 2000); // 2 segundos para que el usuario vea el mensaje
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al crear sucursal",
            text: data || "Ocurrió un error al guardar la sucursal.",
            confirmButtonText: "Aceptar"
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error de red o servidor",
          text: error.message || "No se pudo conectar al servidor.",
          confirmButtonText: "Aceptar"
        });
      }
    },

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
