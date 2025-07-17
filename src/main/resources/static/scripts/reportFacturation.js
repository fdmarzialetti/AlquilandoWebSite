const { createApp } = Vue;

createApp({
  data() {
    return {
      reservations: [],
      selectedBranch: "",
      selectedCutoffDate: "",
      branches: [],
      pieChart: null,
      colors: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b", "#9b59b6", "#e67e22", "#2ecc71"]
    };
  },
  computed: {
    filteredReservations() {
      return this.reservations
        .filter(r => r.branchName && r.modelName)
        .filter(r => this.selectedBranch ? r.branchName === this.selectedBranch : true)
        .filter(r => {
          if (!this.selectedCutoffDate) return true;
          return r.endDate && r.endDate.slice(0, 10) <= this.selectedCutoffDate;
        });
    },
    totalFacturado() {
      return this.filteredReservations.reduce((acc, r) => acc + Number(r.payment || 0), 0);
    },
    facturacionPorSucursal() {
      const data = {};
      this.filteredReservations.forEach(r => {
        const pago = Number(r.payment) || 0;
        const sucursal = r.branchName;
        data[sucursal] = (data[sucursal] || 0) + pago;
      });
      return data;
    }
  },
  methods: {
    fetchReservations() {
      axios.get("/api/reservation/all")
        .then(response => {
          this.reservations = response.data
            .filter(r => !r.isCancelled)
            .filter(r => r.branchName && r.modelName);
          this.branches = [...new Set(this.reservations.map(r => r.branchName))];
          this.renderChart();
        })
        .catch(error => {
          console.error("Error al obtener reservas:", error);
        });
    },
    renderChart() {
      const ctx = document.getElementById("pieChart").getContext("2d");
      const labels = Object.keys(this.facturacionPorSucursal);
      const data = Object.values(this.facturacionPorSucursal);
      const backgroundColors = labels.map((_, i) => this.colors[i % this.colors.length]);

      if (this.pieChart) this.pieChart.destroy();

      this.pieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels,
          datasets: [{
            label: "Facturación por Sucursal",
            data,
            backgroundColor: backgroundColors,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    },
    mostrarModalCambioClaveVoluntario() {
                                        Swal.fire({
                                          icon: "info",
                                          title: "Cambiar contraseña",
                                          html: `
                                            <input type="password" id="currentPassword" class="swal2-input" placeholder="Contraseña actual">
                                            <input type="password" id="newPassword" class="swal2-input" placeholder="Nueva contraseña">
                                            <input type="password" id="confirmPassword" class="swal2-input" placeholder="Confirmar contraseña">
                                          `,
                                          showCancelButton: true,
                                          confirmButtonText: "Guardar",
                                          cancelButtonText: "Cancelar",
                                          preConfirm: () => {
                                            const currentPassword = document.getElementById('currentPassword').value;
                                            const newPassword = document.getElementById('newPassword').value;
                                            const confirmPassword = document.getElementById('confirmPassword').value;

                                            if (!currentPassword || !newPassword || !confirmPassword) {
                                              Swal.showValidationMessage("Todos los campos son obligatorios");
                                              return false;
                                            }

                                            if (newPassword !== confirmPassword) {
                                              Swal.showValidationMessage("Las contraseñas no coinciden");
                                              return false;
                                            }

                                            if (newPassword.length < 6) {
                                              Swal.showValidationMessage("La nueva contraseña debe tener al menos 6 caracteres");
                                              return false;
                                            }

                                            return { currentPassword, newPassword };
                                          }
                                        }).then(result => {
                                          if (result.isConfirmed) {
                                            this.actualizarClaveVoluntaria(result.value.currentPassword, result.value.newPassword);
                                          }
                                        });
                                      },
                                      actualizarClaveVoluntaria(actualPassword, nuevaPassword) {
                                                  axios.post('/api/user/change-password', {
                                                      actualPassword: actualPassword,
                                                      nuevaPassword: nuevaPassword
                                                    })
                                                    .then(() => {
                                                      Swal.fire({
                                                        icon: 'success',
                                                        title: 'Contraseña actualizada',
                                                        text: 'Tu nueva contraseña ha sido guardada correctamente.'
                                                      });
                                                    })
                                                    .catch(err => {
                                                      console.error("Error al cambiar contraseña voluntariamente", err);
                                                      Swal.fire({
                                                        icon: 'error',
                                                        title: 'Error',
                                                        text: err.response?.data?.message || 'No se pudo actualizar la contraseña. Verifica tu contraseña actual e inténtalo de nuevo.'
                                                      });
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
                text: "Hubo un problema al cerrar sesión. Intentalo de nuevo.",
              });
            });
        }

  },
  mounted() {
    this.fetchReservations();
  },
  watch: {
    selectedBranch: "renderChart",
    selectedCutoffDate: "renderChart"
  }
}).mount("#app");
