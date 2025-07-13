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
    logout() {
      Swal.fire({
        title: "¿Cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar"
      }).then(result => {
        if (result.isConfirmed) {
          localStorage.clear();
          window.location.href = "../index.html";
        }
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
