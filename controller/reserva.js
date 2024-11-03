
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
        addReserva({ nombreCliente, cantidadPersonas, preOrden, fecha, estadoReserva  });

        
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
            <td>${reserva.nombreCliente}</td>
            <td>${reserva.cantidadPersonas}</td>
            <td>${reserva.preOrden}</td>
            <td>${reserva.fecha}</td>
            <td>${reserva.estadoReserva}</td>
            <td>
                <button onclick="editReserva(${reserva.idReserva}, '${reserva.nombreCliente}', '${reserva.cantidadPersonas}','${reserva.preOrden}','${reserva.fecha}','${reserva.estadoReserva}')">Editar</button>
                <button onclick="deleteReserva(${reserva.idReserva}, this)">Eliminar</button>
            </td>
        `;
    }

    // Editar reserva
    window.editReserva = function(idReserva, nombreCliente, cantidadPersonas, preOrden, fecha, estadoReserva) {
        document.getElementById('editIdRe').value = idReserva;
        document.getElementById('editNameRe').value = nombreCliente;
        document.getElementById('editqty').value = cantidadPersonas;
        document.getElementById('editPreOrden').value = preOrden;
        document.getElementById('editDateRe').value = fecha;
        document.getElementById('editEstaRe').value = estadoReserva;
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
        const nombreCliente = document.getElementById('editNameRe').value;
        const cantidadPersonas = document.getElementById('editqty').value;
        const preOrden = document.getElementById('editPreOrden').value; 
        const fecha = document.getElementById('editDateRe').value;
        const estadoReserva = document.getElementById('editEstaRe').value;

        updateReserva(idReserva, { nombreCliente, cantidadPersonas, preOrden, fecha, estadoReserva });
    });

    // Actualizar reserva
    function updateReserva(idReserva, reserva) {
        fetch(`${API_URL}/${idReserva}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reserva),
        })
        .then(response => response.json())
        .then(updatedReserva => {
            const rows = table.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {
                if (rows[i].cells[0].textContent == idReserva) {
                    rows[i].cells[1].textContent = updatedReserva.nombreCliente;
                    rows[i].cells[2].textContent = updatedReserva.cantidadPersonas;
                    rows[i].cells[3].textContent = updatedReserva.preOrden;
                    rows[i].cells[4].textContent = updatedReserva.fecha;
                    rows[i].cells[5].textContent = updatedReserva.estadoReserva;
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