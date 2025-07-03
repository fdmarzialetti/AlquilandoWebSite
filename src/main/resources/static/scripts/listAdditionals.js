const { createApp } = Vue;

createApp({
  data() {
    return {
      allAdditionals: [],
      activeAdditionals: [],
      inactiveAdditionals: []
    };
  },
  methods: {
    fetchAdditionals() {
      axios.get('http://localhost:8080/api/additionals/all') // <--- Nuevo endpoint que trae todos (activos e inactivos)
        .then(res => {
          this.allAdditionals = res.data;
          this.activeAdditionals = this.allAdditionals.filter(a => a.state);
          this.inactiveAdditionals = this.allAdditionals.filter(a => !a.state);
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error al cargar los adicionales', '', 'error');
        });
    },
    goToForm() {
      window.location.href = 'formAdditional.html';
    },
    editItem(item) {
      Swal.fire({
        title: 'Editar adicional',
        html:
          `<input id="swal-name" class="swal2-input" placeholder="Nombre" value="${item.name}">` +
          `<input id="swal-price" class="swal2-input" type="number" step="0.01" placeholder="Precio" value="${item.price}">`,
        focusConfirm: false,
        preConfirm: () => {
          return {
            name: document.getElementById('swal-name').value,
            price: parseFloat(document.getElementById('swal-price').value)
          };
        }
      }).then(result => {
        if (result.isConfirmed) {
          axios.put(`http://localhost:8080/api/additionals/${item.id}`, result.value)
            .then(() => {
              Swal.fire('Actualizado correctamente', '', 'success');
              this.fetchAdditionals();
            })
            .catch(err => {
              Swal.fire('Error al actualizar', err.response?.data || 'Error desconocido', 'error');
            });
        }
      });
    },
    deactivateItem(item) {
      Swal.fire({
        title: `¿Dar de baja "${item.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar'
      }).then(result => {
        if (result.isConfirmed) {
          axios.delete(`http://localhost:8080/api/additionals/${item.id}`)
            .then(() => {
              Swal.fire('Adicional desactivado', '', 'success');
              this.fetchAdditionals();
            })
            .catch(err => {
              Swal.fire('Error al desactivar', err.response?.data || 'Error desconocido', 'error');
            });
        }
      });
    }
  },
  mounted() {
    this.fetchAdditionals();
  }
}).mount('#appList');
