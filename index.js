// Declaración de objetos para el registro de productos y movimientos
const productos = [];
const movimientos = [];

// Función para agregar productos a la tabla y al registro de productos
function agregarAlListado() {
    const id = document.getElementById('registration-form-id').value;
    const nombre = document.getElementById('registration-form-name').value;
    const descripcion = document.getElementById('registration-form-description').value;
    const cantidad = parseFloat(document.getElementById('registration-form-quantity').value);
    const costoUnitario = parseFloat(document.getElementById('registration-form-cost').value);

    // Crear una nueva fila de tabla <tr> para mostrar el producto
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
        <td>${id}</td>
        <td>${nombre}</td>
        <td>${descripcion}</td>
        <td>${cantidad}</td>
        <td>${costoUnitario}</td>
        <td>${cantidad}</td> <!-- Aquí se muestra la cantidad en stock -->
    `;

    // Agregar la nueva fila de tabla a la tabla
    const tableBody = document.getElementById('product-table-body');
    tableBody.appendChild(tableRow);

    // Agregar producto al registro de productos
    const producto = {
        id,
        nombre,
        descripcion,
        cantidad,
        costoUnitario,
    };
    productos.push(producto);

    // Limpiar los campos del formulario
    document.getElementById('registration-form-id').value = '';
    document.getElementById('registration-form-name').value = '';
    document.getElementById('registration-form-description').value = '';
    document.getElementById('registration-form-quantity').value = '';
    document.getElementById('registration-form-cost').value = '';
}

// Función para agregar movimientos a la tabla y al registro de movimientos
function agregarMovimiento() {
    const tipoTransaccion = document.querySelector('input[name="input-tipo-transaccion"]:checked').value;
    const fecha = document.getElementById('movement-form-date').value;
    const productoNombre = document.getElementById('movement-form-product').value;
    const cantidad = parseFloat(document.getElementById('movement-form-quantity').value);
    const costoUnitario = parseFloat(document.getElementById('movement-form-cost').value);

    // Buscar el producto en el registro de productos por su nombre
    const producto = productos.find((p) => p.nombre === productoNombre);

    if (!producto) {
        alert('El producto no existe en el registro.');
        return;
    }

    // Verificar si hay suficiente cantidad en stock para una venta
    if (tipoTransaccion === 'venta' && cantidad > producto.cantidad) {
        alert('No hay suficiente cantidad en stock para esta venta.');
        return;
    }

    // Calcular el valor del IVA
    const valorIVA = calcularIVA2().valorIVA;

    // Calcular el subtotal
    const subtotal = cantidad * costoUnitario;

    // Actualizar la cantidad en stock del producto
    if (tipoTransaccion === 'compra') {
        producto.cantidad += cantidad;
    } else if (tipoTransaccion === 'venta') {
        producto.cantidad -= cantidad;

        // Actualizar la cantidad en la tabla de productos
        const tableRows = document.getElementById('product-table-body').getElementsByTagName('tr');
        for (let i = 0; i < tableRows.length; i++) {
            const row = tableRows[i];
            const nombreCell = row.cells[1];
            const quantityCell = row.cells[3];

            if (nombreCell.textContent === producto.nombre) {
                const newQuantity = producto.cantidad;
                quantityCell.textContent = newQuantity;
                break;
            }
        }
    }
    // Crear una nueva fila de tabla <tr> para mostrar el movimiento
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
        <td>${tipoTransaccion}</td>
        <td>${fecha}</td>
        <td>${productoNombre}</td>
        <td>${cantidad}</td>
        <td>${costoUnitario}</td>
        <td>${valorIVA}</td>
        <td>${subtotal + valorIVA}</td>
    `;

    // Agregar la nueva fila de tabla a la tabla de movimientos
    const tableBodymovs = document.getElementById('product-table-body-movs');
    tableBodymovs.appendChild(tableRow);

    // Agregar movimiento al registro de movimientos
    const movimiento = {
        tipoTransaccion,
        fecha,
        producto: productoNombre,
        cantidad,
        costoUnitario,
        subtotal: cantidad * costoUnitario,
        iva: valorIVA,
        total: subtotal + valorIVA,
    };
    movimientos.push(movimiento);

    // Limpiar los campos del formulario de movimientos
    document.querySelector('input[name="input-tipo-transaccion"]:checked').checked = false;
    document.getElementById('movement-form-date').value = '';
    document.getElementById('movement-form-product').value = '';
    document.getElementById('movement-form-quantity').value = '';
    document.getElementById('movement-form-cost').value = '';
    document.getElementById('subtotal').innerText = '';
    document.getElementById('valor-iva').innerText = '';
    document.getElementById('total').innerText = '';
}

// Función para calcular el subtotal
function calcularSubtotal() {
    const cantidad = parseFloat(document.getElementById('movement-form-quantity').value);
    const costoUnitario = parseFloat(document.getElementById('movement-form-cost').value);
    const subtotal = cantidad * costoUnitario;
    document.getElementById('subtotal').innerText = subtotal.toFixed(2);
}

// Función para calcular el IVA
function calcularIVA() {
    const sinIVA = document.getElementById('sin-iva').checked;
    const ivaMinimo = document.getElementById('iva-minimo').checked;
    const ivaBasico = document.getElementById('iva-basico').checked;
    const subtotal = parseFloat(document.getElementById('subtotal').innerText);
    let valorIVA = 0;

    if (sinIVA) {
        valorIVA = 0;
    } else if (ivaMinimo) {
        valorIVA = subtotal * 0.1;
    } else if (ivaBasico) {
        valorIVA = subtotal * 0.22;
    }

    document.getElementById('valor-iva').innerText = valorIVA.toFixed(2);
}

// Función para calcular el IVA
function calcularIVA2() {
    const sinIVA = document.getElementById('sin-iva').checked;
    const ivaMinimo = document.getElementById('iva-minimo').checked;
    const ivaBasico = document.getElementById('iva-basico').checked;
    const subtotal = parseFloat(document.getElementById('subtotal').innerText);
    let valorIVA = 0;

    if (sinIVA) {
        valorIVA = 0;
    } else if (ivaMinimo) {
        valorIVA = subtotal * 0.1;
    } else if (ivaBasico) {
        valorIVA = subtotal * 0.22;
    }

    return { valorIVA };
}

// Función para calcular el total
function calcularTotal() {
    const subtotal = parseFloat(document.getElementById('subtotal').innerText);
    const valorIVA = parseFloat(document.getElementById('valor-iva').innerText);
    const total = subtotal + valorIVA;
    document.getElementById('total').innerText = total.toFixed(2);
}

// Agregar evento para mostrar productos cuando se envía el formulario de registro
document.getElementById('product-registration').addEventListener('submit', function (e) {
    e.preventDefault();
    agregarAlListado();
});

// Agregar evento para mostrar movimientos cuando se envía el formulario de movimientos
document.getElementById('product-movement').addEventListener('submit', function (e) {
    e.preventDefault();
    agregarMovimiento();
});

// Agregar eventos para llamar a las funciones de cálculo cuando cambien los valores
document.getElementById('movement-form-quantity').addEventListener('input', calcularSubtotal);
document.getElementById('movement-form-cost').addEventListener('input', calcularSubtotal);
document.querySelectorAll('input[name="input-tipo-iva"]').forEach((radio) => {
    radio.addEventListener('change', calcularIVA);
});

// Agregar evento para calcular el total cuando cambie el subtotal o el valor del IVA
document.getElementById('subtotal').addEventListener('DOMSubtreeModified', calcularTotal);
document.getElementById('valor-iva').addEventListener('DOMSubtreeModified', calcularTotal);

// Función para verificar el stock y mostrar alertas de bajo stock
function verificarStock() {
    const umbralBajoStock = 10; // Define tu umbral de bajo stock aquí
    productos.forEach((producto) => {
        if (producto.cantidad < umbralBajoStock) {
            alert(`¡Bajo stock para ${producto.nombre}! Cantidad actual: ${producto.cantidad}`);
        }
    });
}
