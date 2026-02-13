
const loginSection = document.getElementById("login-section");
const registerSection = document.getElementById("register-section");
const toRegister = document.getElementById("to-register");
const toLogin = document.getElementById("to-login");

// Botones Acción
const btnLogin = document.getElementById("btnLogin");
const btnRegister = document.getElementById("btnRegister");

// Intercambio de formularios (Animación)
toRegister.addEventListener("click", () => {
    loginSection.classList.add("hidden");
    setTimeout(() => {
        registerSection.classList.remove("hidden");
    }, 400);
});

toLogin.addEventListener("click", () => {
    registerSection.classList.add("hidden");
    setTimeout(() => {
        loginSection.classList.remove("hidden");
    }, 400);
});

// Lógica de Login
btnLogin.addEventListener("click", () => {
    let nombre = document.getElementById("usuario").value;
    let correo = document.getElementById("correo").value;

    if (nombre === "" || !correo.includes("@")) {
        alert("⚠️ Completa los datos correctamente");
        return;
    }

    // Identificador de Roles
    let role = "cliente";
    if (correo === "admin@tienda.com") {
        role = "admin";
    } else if (correo === "staff@tienda.com") {
        role = "empleado";
    }

    localStorage.setItem("user", JSON.stringify({
        nombre,
        correo,
        role: role
    }));

    alert(`✅ Sesión iniciada como ${role}`);

    // Redirección por Rol
    if (role === "admin" || role === "empleado") {
        window.location.href = "dashboard.html";
    } else {
        window.location.href = "index.html";
    }
});

// Lógica de Registro
btnRegister.addEventListener("click", () => {
    const nombre = document.getElementById("reg-nombre").value;
    const correo = document.getElementById("reg-correo").value;
    const tel = document.getElementById("reg-telefono").value;

    if (nombre === "" || !correo.includes("@") || tel === "") {
        alert("⚠️ Por favor, llena todos los campos");
        return;
    }

    // Simulación de guardado
    localStorage.setItem("user", JSON.stringify({
        nombre,
        correo,
        telefono: tel,
        role: "cliente"
    }));

    alert("✨ ¡Cuenta creada con éxito!");
    window.location.href = "index.html";
});

// Identificadores de fin de script