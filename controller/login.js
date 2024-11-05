document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita el envío por defecto del formulario

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Realiza la llamada a la API de autenticación en Spring Boot
    const response = await fetch(`/api/usuario?nombreUsuario=${username}&contrasena=${password}`);

    if (response.ok) {
        alert('Inicio de sesión exitoso');
        window.location.href = 'index.html'; // Redirige al usuario a la página principal
    } else {
        alert('Error: credenciales incorrectas o fallo de autenticación');
    }
});
