const API_URL = 'http://localhost:8020/api/usuario/login';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // Manejar el envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();  // Evitar el comportamiento predeterminado del formulario

        const nombreUsuario = document.getElementById('nombreUsuario').value;
        const contrasena = document.getElementById('contrasena').value;

        // Llamada a la función para validar el inicio de sesión
        validarInicioSesion({ nombreUsuario, contrasena });
    });

    // Validar inicio de sesión
    function validarInicioSesion(credenciales) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credenciales),
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Credenciales incorrectas');
            }
            return response.json();
        })
        .then(data => {
            if (data) {  // Si la API devuelve un usuario autenticado
                alert('Inicio de sesión exitoso');
                // Aquí puedes redirigir al usuario a otra página, por ejemplo:
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en el inicio de sesión: ' + error.message);
        });
    }
});
