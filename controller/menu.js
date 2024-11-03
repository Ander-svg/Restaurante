
const API_URL = 'http://localhost:8020/api/menu';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('menuForm');
    const table = document.getElementById('menuTable').getElementsByTagName('tbody')[0];
    const modal = document.getElementById('editMenu');
    const editForm = document.getElementById('editFormMenu');
    const closeBtn = document.getElementsByClassName('close')[0];

    // Cargar menu al iniciar
    loadMenus();

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const categoria = document.getElementById('categoria').value;
        const nombreMenu = document.getElementById('nombreMenu').value;
        const precioMenu = document.getElementById('precioMenu').value;
        const stock = document.getElementById('stock').value;
        const descripcionMenu = document.getElementById('descripcionMenu').value;

        // Puedes llamar a tu función addMenu pasando todos los valores como un objeto
        addMenu({ categoria, nombreMenu, precioMenu, stock, descripcionMenu });
    });

    // Cargar menu
    function loadMenus() {
        fetch(API_URL)
            .then(response => response.json())
            .then(menus => {
                table.innerHTML = ''; // Limpiamos la tabla antes de agregar los nuevos datos
                menus.forEach(menu => {
                    addMenuToTable(menu);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Agregar menu
    function addMenu(menu) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menu),
        })
        .then(response => response.json())
        .then(newMenu => {
            addMenuToTable(newMenu);
            form.reset();
        })
        .catch(error => console.error('Error:', error));
    }

    // Agregar menu a la tabla
    function addMenuToTable(menu) {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${menu.menuId}</td>
            <td>${menu.categoria}</td>
            <td>${menu.nombreMenu}</td>
            <td>${menu.descripcionMenu}</td>
            <td>${menu.precioMenu}</td>
            <td>${menu.stock}</td>
            <td>
                <button onclick="editMenu('${menu.menuId}',${menu.categoria}', '${menu.nombreMenu}', '${menu.descripcionMenu}', '${menu.precioMenu}', '${menu.stock}')">Editar</button>
                <button onclick="deleteMenu('${menu.menuId}', this)">Eliminar</button>
            </td>

        `;
    }

    // Editar menu
    window.editMenu = function(menuId, nombreMenu, descripcionMenu, precioMenu, stock) {
        document.getElementById('editIdMenu').value = menuId;
        document.getElementById('editcategoriaMenu').value = categoria;
        document.getElementById('editNameMenu').value = nombreMenu;
        document.getElementById('editPreMenu').value = precioMenu;
        document.getElementById('editstockMenu').value = stock;
        document.getElementById('editDesMenu').value = descripcionMenu;
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

        const menuId = document.getElementById('editIdMenu').value;
        const categoria = document.getElementById('editcategoriaMenu').value;
        const nombreMenu = document.getElementById('editNameMenu').value;
        const precioMenu = document.getElementById('precioMenu').value;
        const stock = document.getElementById('editstockMenu').value;
        const descripcionMenu = document.getElementById('editDesMenu').value;

        updateMenu(menuId, { categoria, nombreMenu, descripcionMenu, precioMenu, stock });
    });

    // Actualizar menu
    function updateMenu(menuId, menu) {
        fetch(`${API_URL}/${menuId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menu),
        })
        .then(response => response.json())
        .then(updatedMenu => {
            const rows = table.getElementsByTagName('tr');
            for (let i = 0; i < rows.length; i++) {

                if (rows[i].cells[0].textContent == menuId) {
                    rows[i].cells[1].textContent = updatedMenu.categoria;
                    rows[i].cells[2].textContent = updatedMenu.nombreMenu;
                    rows[i].cells[3].textContent = updatedMenu.descripcionMenu;
                    rows[i].cells[4].textContent = updatedMenu.precioMenu;
                    rows[i].cells[5].textContent = updatedMenu.stock;
                    
                    rows[i].style.backgroundColor = '#FFFF99';  // Resaltar la fila actualizada
                    setTimeout(() => {
                        rows[i].style.backgroundColor = '';  // Volver al color normal después de 1 segundo
                    }, 1000);
                    break;
                }
                

            }
            modal.style.display = 'none';
            alert('Menú actualizado con éxito');  // Mostrar un mensaje de éxito
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el menú');  // Mostrar un mensaje de error
        });
    }

    // Eliminar menu
    window.deleteMenu = function(menuId, button) {
        fetch(`${API_URL}/${menuId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                button.closest('tr').remove();
            } else {
                throw new Error('No se pudo eliminar el menú');
            }
        })
        .catch(error => console.error('Error:', error));
    }
});