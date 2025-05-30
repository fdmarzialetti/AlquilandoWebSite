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

                 const data = await response.text(); // capturamos texto plano (mensaje de éxito o error)

                 if (response.ok) {
                     this.successMessage = 'Sucursal creada con éxito (ID generado por el servidor)';
                     this.branch.city = '';
                     this.branch.address = '';
                 } else {
                     this.successMessage = '⚠️ Error: ' + data;
                 }
             } catch (error) {
                 this.successMessage = 'Error de red o servidor: ' + error;
             }
         }
     }
 }).mount('#app');
