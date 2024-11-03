
const API_URL = 'http://localhost:8020/api/reserva';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservaForm');
    const table = document.getElementById('reservaTable').getElementsByTagName('tbody')[0];
    const modal = document.getElementById('editReserva');
    const editForm = document.getElementById('editFormRe');
    const closeBtn = document.getElementsByClassName('close')[0];

    // Cargar reservas al iniciar
    loadReservas();

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombreCliente = document.getElementById('nombreCliente').value;
        const cantidadPersonas = document.getElementById('cantidadPersonas').value;
        const preOrden = document.getElementById('preOrden').value; 
        const fecha = document.getElementById('fecha').value;
        const estadoReserva = document.getElementById('estadoReserva').value;

        // Función para agregar la reserva (puedes adaptarla según tu lógica)
        addReserva({ nombreCliente, cantidadPersonas, preOrden, estadoReserva, fecha });

        
    });

    // Cargar reservas
    function loadReservas() {
        fetch(API_URL)
            .then(response => response.json())
            .then(reservas => {
                table.innerHTML = ''; // Limpiamos la tabla antes de agregar los nuevos datos
                reservas.forEach(reserva => {
                    addReservaToTable(reserva);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Agregar reserva
    function addReserva(reserva) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reserva),
        })
        .then(response => response.json())
        .then(newReserva => {
            addReservaToTable(newReserva);
            form.reset();
        })
        .catch(error => console.error('Error:', error));
    }

    // Agregar reserva a la tabla
    function addReservaToTable(reserva) {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${reserva.idReserva}</td>
            <td>${reserva.nombreReserva}</td>
            <td>${reserva.emailReserva}</td>
            <td>${reserva.fechaReserva}</td>
            <td>${reserva.horaReserva}</td>
            <td>
                <button onclick="editReserva(${reserva.idReserva}, '${reserva.nombreReserva}', '${reserva.emailReserva}','${reserva.fechaReserva}','${reserva.horaReserva}')">Editar</button>
                <button onclick="deleteReserva(${reserva.idReserva}, this)">Eliminar</button>
            </td>
        `;
    }

    // Editar reserva
    window.editReserva = function(idReserva, nombreReserva, emailReserva, fechaReserva, horaReserva) {
        document.getElementById('editIdRe').value = idReserva;
        document.getElementById('editNameRe').value = nombreReserva;
        document.getElementById('editEmailRe').value = emailReserva;
        document.getElementById('editDateRe').value = fechaReserva;
        document.getElementById('editTimeRe').value = horaReserva;
        modal.style.display = 'block';
    }

    // Cerrar modal
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    // Cerrar modal al hacer clic fuera de él
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Manejar envío del formulario de edición
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const idReserva = document.getElementById('editIdRe').value;
        const nombreReserva = document.getElementById('editNameRe').value;
        const emailReserva = document.getElementById('editEmailRe').value;
        const fechaReserva = document.getElementById('editDateRe').value;
        const horaReserva = document.getElementById('editTimeRe').value;

        updateReserva(idReserva, { nombreReserva, emailReserva, fechaReserva, horaReserva });
    });

    // Actualizar reserva
    function updateReserva(idReserva, reserva) {
        fetch(`${API_URL}/${idReserva}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(student),
        })
        .then(response => response.json())
        .then(updatedReserva => {
            const rows = table.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].cells[0].textContent == idReserva) {
                    rows[i].cells[1].textContent = updatedReserva.nombreReserva;
                    rows[i].cells[2].textContent = updatedReserva.emailReserva;
                    rows[i].cells[3].textContent = updatedReserva.fechaReserva;
                    rows[i].cells[4].textContent = updatedReserva.horaReserva;
                    rows[i].style.backgroundColor = '#FFFF99';  // Resaltar la fila actualizada
                    setTimeout(() => {
                        rows[i].style.backgroundColor = '';  // Volver al color normal después de 1 segundo
                    }, 1000);
                    break;
                }
            }
            modal.style.display = 'none';
            alert('Reserva actualizado con éxito');  // Mostrar un mensaje de éxito
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar la reserva');  // Mostrar un mensaje de error
        });
    }

    // Eliminar reserva
    window.deleteReserva = function(idReserva, button) {
        fetch(`${API_URL}/${idReserva}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                button.closest('tr').remove();
            } else {
                throw new Error('No se pudo eliminar la reserva');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});