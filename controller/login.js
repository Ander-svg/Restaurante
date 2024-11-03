
function redireccion(){
    location.href = "index.html";
}

// Manejar el evento de envío del formulario
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtener los valores del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Realizar la solicitud a la API
    try {
        const response = await fetch('http://localhost:8020/api/usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }) // Enviar las credenciales como JSON
        });

        if (response.ok) {
            const data = await response.json();
            // Verificar si el usuario es válido
            if (data && data.username === 'admin' && data.password === '12345678') {
                // Redirigir a la página principal
                window.location.href = redireccion(); // Cambia esto a la URL de tu página principal
            } else {
                alert('Credenciales incorrectas. Inténtalo de nuevo.');
            }
        } else {
            alert('Error en la autenticación. Por favor, verifica el servidor.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo más tarde.');
    }
});
