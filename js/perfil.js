// 1. Cargamos el usuario que ya inició sesión
let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    alert("⚠️ No has iniciado sesión");
    window.location.href = "login.html";
} else {
    // 2. Referencias a los inputs del HTML
    const nombreInput = document.getElementById("perfilNombreInput");
    const correoInput = document.getElementById("perfilCorreoInput");
    const direccionInput = document.getElementById("perfilDireccionInput");
    const tarjetaInput = document.getElementById("perfilTarjetaInput");
    const btnGuardar = document.getElementById("btnGuardar");

    // 3. MOSTRAR DATOS QUE YA TENÍA (Nombre y Correo)
    nombreInput.value = user.nombre; 
    correoInput.value = user.correo;
    
    // 4. MOSTRAR DATOS NUEVOS (si es que ya los guardó antes, si no, salen vacíos)
    direccionInput.value = user.direccion || ""; 
    tarjetaInput.value = user.tarjeta || "";

    // 5. FUNCIÓN PARA GUARDAR TODO
    btnGuardar.onclick = () => {
        // Validar que no borre su nombre o correo
        if (nombreInput.value.trim() === "" || correoInput.value.trim() === "") {
            alert("❌ El nombre y correo son obligatorios");
            return;
        }

        // Actualizamos el objeto user con lo que haya en los cuadros
        user.nombre = nombreInput.value;
        user.correo = correoInput.value;
        user.direccion = direccionInput.value;
        user.tarjeta = tarjetaInput.value;

        // Guardamos la versión actualizada en la memoria del navegador
        localStorage.setItem("user", JSON.stringify(user));
        
        alert("✅ ¡Tus datos se han actualizado! 💖");
        
        // Recargamos para que el saludo del Header se actualice si cambió el nombre
        window.location.reload();
    };
}