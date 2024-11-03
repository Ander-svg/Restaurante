
const API_URL = 'http://localhost:8020/api/pedido';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pedidoForm');
    const table = document.getElementById('pedidoTable').getElementsByTagName('tbody')[0];
    const modal = document.getElementById('editPedido');
    const editForm = document.getElementById('editFormPe');
    const closeBtn = document.getElementsByClassName('close')[0];

    // Cargar pedido al iniciar
    loadPedidos();

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombrePedido = document.getElementById('nombrePedido').value;
        const cantidadPersonas = document.getElementById('cantidadPersonas').value;
        const menuSeleccionado = document.getElementById('menu').value;
        const estadoOrden = document.getElementById('estadoOrden').value;
        const fecha = document.getElementById('fecha').value;

        // Función para agregar el pedido (puedes adaptarla según tu lógica)
        addPedido({ nombrePedido, cantidadPersonas, menuSeleccionado, estadoOrden, fecha });


    });

    // Cargar pedido
    function loadPedidos() {
        fetch(API_URL)
            .then(response => response.json())
            .then(pedidos => {
                table.innerHTML = ''; // Limpiamos la tabla antes de agregar los nuevos datos
                pedidos.forEach(pedido => {
                    addPedidoToTable(pedido);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Agregar pedido
    function addPedido(pedido) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido),
        })
        .then(response => response.json())
        .then(newPedido => {
            addPedidoToTable(newPedido);
            form.reset();
        })
        .catch(error => console.error('Error:', error));
    }

    // Agregar pedido a la tabla
    function addPedidoToTable(pedido) {
        const row = table.insertRow();
        row.innerHTML = `

            <td>${pedido.pedidoId}</td>
            <td>${pedido.nombrePedido}</td>
            <td>${pedido.cantidadPersonas}</td>
            <td>${pedido.menuSeleccionado}</td>
            <td>${pedido.estadoOrden}</td>
            <td>${pedido.fecha}</td>
            <td>
                <button onclick="editPedido('${pedido.pedidoId}','${pedido.nombrePedido}', '${pedido.cantidadPersonas}', '${pedido.menuSeleccionado}', '${pedido.estadoOrden}', '${pedido.fecha}')">Editar</button>
                <button onclick="deletePedido('${pedido.pedidoId}', this)">Eliminar</button>
            </td>

        `;
    }

    // Editar pedido
    window.editPedido = function(pedidoId, nombrePedido, cantidadPersonas, menuSeleccionado, estadoOrden, fecha) {
        document.getElementById('editIdPe').value = pedidoId;
        document.getElementById('editNamePe').value = nombrePedido;
        document.getElementById('editcantidadPersonas').value = cantidadPersonas;
        document.getElementById('editMePe').value = menuSeleccionado;
        document.getElementById('editEstaPe').value = estadoOrden;
        document.getElementById('editDatePe').value = fecha;
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
        const pedidoId= document.getElementById('editIdPe').value;
        const nombrePedido = document.getElementById('editNamePe').value;
        const cantidadPersonas = document.getElementById('editcantidadPersonas').value;
        const menuSeleccionado = document.getElementById('editMePe').value;
        const estadoOrden = document.getElementById('editEstaPe').value;
        const fecha = document.getElementById('editDatePe').value;
        updatePedido(pedidoId, { nombrePedido, cantidadPersonas, menuSeleccionado, estadoOrden, fecha });
    });

    // Actualizar pedido
    function updatePedido(pedidoId, pedido) {
        fetch(`${API_URL}/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido),
        })
        .then(response => response.json())
        .then(updatedPedido => {
            const rows = table.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {

                if (rows[i].cells[0].textContent == pedidoId) {  // Cambia `pedidoId` por el criterio que uses para identificar la fila
                    rows[i].cells[1].textContent = updatedPedido.nombrePedido;        // Columna 0
                    rows[i].cells[2].textContent = updatedPedido.cantidadPersonas;    // Columna 1
                    rows[i].cells[3].textContent = updatedPedido.menuSeleccionado;    // Columna 2
                    rows[i].cells[4].textContent = updatedPedido.estadoOrden;         // Columna 3
                    rows[i].cells[5].textContent = updatedPedido.fecha;               // Columna 4
                
                    rows[i].style.backgroundColor = '#FFFF99';  // Resaltar la fila actualizada
                    setTimeout(() => {
                        rows[i].style.backgroundColor = '';  // Volver al color normal después de 1 segundo
                    }, 1000);
                    break;
                }
                
                
            }
            modal.style.display = 'none';
            alert('Pedido actualizado con éxito');  // Mostrar un mensaje de éxito
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el pedido');  // Mostrar un mensaje de error
        });
    } 

    // Eliminar pedido
    window.deletePedido = function(pedidoId, button) {
        fetch(`${API_URL}/${pedidoId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                button.closest('tr').remove();
            } else {
                throw new Error('No se pudo eliminar el pedido');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});