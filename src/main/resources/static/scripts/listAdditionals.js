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
      axios.get('http://localhost:8080/api/additionals/all')
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
        html: `
          <input id="swal-name" class="swal2-input" placeholder="Nombre" value="${item.name}">
          <input id="swal-price" class="swal2-input" type="number" step="0.01" placeholder="Precio" value="${item.price}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        preConfirm: () => {
          const name = document.getElementById('swal-name').value.trim();
          const price = parseFloat(document.getElementById('swal-price').value);

          if (!name || isNaN(price) || price < 0) {
            Swal.showValidationMessage('Nombre y precio válidos requeridos');
            return false;
          }

          const nameLower = name.toLowerCase();
          const exists = this.allAdditionals.some(a =>
            a.id !== item.id && a.name.trim().toLowerCase() === nameLower
          );

          if (exists) {
            Swal.showValidationMessage('Ya existe un adicional con ese nombre');
            return false;
          }

          return { name, price };
        }
      }).then(result => {
        if (result.isConfirmed) {
          axios.put(`http://localhost:8080/api/additionals/${item.id}`, result.value)
            .then(() => {
              Swal.fire('Actualizado correctamente', '', 'success');
              this.fetchAdditionals();
            })
            .catch(err => {
              console.error(err);
              Swal.fire(
                'Error al actualizar',
                err.response?.data || 'Error desconocido',
                'error'
              );
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
              console.error(err);
              Swal.fire(
                'Error al desactivar',
                err.response?.data || 'Error desconocido',
                'error'
              );
            });
        }
      });
    },

    activateItem(item) {
      Swal.fire({
        title: `¿Reactivar "${item.name}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, reactivar'
      }).then(result => {
        if (result.isConfirmed) {
          axios.post(`http://localhost:8080/api/additionals/${item.id}/activate`)
            .then(() => {
              Swal.fire('Adicional reactivado', '', 'success');
              this.fetchAdditionals();
            })
            .catch(err => {
              console.error(err);
              Swal.fire(
                'Error al reactivar',
                err.response?.data || 'Error desconocido',
                'error'
              );
            });
        }
      });
    },

    logout() {
      // Si necesitás implementar cierre de sesión, colocá la lógica acá
      window.location.href = '../index.html';
    }
  },
  mounted() {
    this.fetchAdditionals();
  }
}).mount('#appList');
