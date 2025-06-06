const { createApp } = Vue;
createApp({
    data() {
        return {
            username: "",
            password: "",
            verificationCode: "",
        };
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        this.username = urlParams.get("username")
        this.password = urlParams.get("password")
    },
    methods: {
        async verificarCodigo2FA() {

            if (!this.verificationCode || this.verificationCode.length !== 6 || isNaN(this.verificationCode)) {
                Swal.fire({
                    icon: "warning",
                    text: "Por favor ingresá un código numérico válido de 6 dígitos.",
                    confirmButtonText: "Aceptar",
                });
                return;
            }
            console.log("mostrarloader")
            try {

                // Mostrar loader
                Swal.fire({
                    title: "Verificando código...",
                    html: `<div class="spinner"></div>`,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                console.log("verificar boolean")
                // Verificar resultado del backend (boolean)
                const verificationResponse = await axios.get("/api/user/codeVerification", {
                    params: {
                        "verificationCode": parseInt(this.verificationCode),
                        "username": this.username
                    }
                });

                const verificado = verificationResponse.data === true;
                console.log("usuario verificado: " + verificado)
                Swal.close();
                console.log("if verificado...")
                if (verificado) {
                    // Código válido → login
                    Swal.fire({
                        icon: "success",
                        text: "¡Código verificado correctamente!",
                        confirmButtonText: "Continuar",
                    }).then(async () => {


                        try {
                            const params = new URLSearchParams();
                            params.append("username", this.username);
                            params.append("password", this.password);
                            await axios.post("/login", params, {
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                },
                                validateStatus: () => true // Para ver respuestas incluso si son 4xx o 5xx
                            }).then(r => {
                                axios.post("/api/user/resetVerificationCode").then(r=>{
                                window.location.href = "../pages/admin.html";
                                })
                                
                            });
                        } catch (e) {
                            Swal.fire({
                                icon: "error",
                                title: "Error al iniciar sesión",
                                text: "No se pudo completar el login. Intente nuevamente.",
                            });
                        }
                    });

                } else {
                    // Código inválido (aunque pasó el post)
                    Swal.fire({
                        icon: "error",
                        title: "Código incorrecto",
                        text: "El código ingresado no es válido.",
                        confirmButtonText: "Reintentar",
                    });
                }

            } catch (error) {
                Swal.close();
                Swal.fire({
                    icon: "error",
                    text: error.response?.data || "Código incorrecto o expirado.",
                    confirmButtonText: "Reintentar",
                });
            }
        }
    }
}).mount('#app');