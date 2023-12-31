// Declaración de objetos para el registro de productos y movimientos
const productos = [{
    id: 1,
    nombre: "Bloque",
    descripcion: "Medida: 40x20x12 Peso: 1,5kg",
    cantidad: 5700,
    costoUnitario: 25,
},
{
    id: 2,
    nombre: "Ticholo",
    descripcion: "Medida: 25x25x12 Peso: 0.9kg",
    cantidad: 15600,
    costoUnitario: 30,
}];
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

// Obtener una referencia al campo de nombre
const nombreProductoInput = document.getElementById('movement-form-product');

nombreProductoInput.addEventListener('input', function () {

    // Obtener el valor actual del campo de nombre
    const productoNombre = nombreProductoInput.value.toLowerCase();

    // Buscar el producto en el registro de productos por su nombre
    const producto = productos.find((p) => p.nombre.toLowerCase() === productoNombre);

    // Si se encuentra el producto, establecer el costo unitario en el campo de costo
    if (producto) {
        document.getElementById('movement-form-cost').value = producto.costoUnitario;
    } else {
        // Si el producto no se encuentra, puedes limpiar el campo de costo
        document.getElementById('movement-form-cost').value = '';
    }
});



// Función para agregar movimientos a la tabla y al registro de movimientos
function agregarMovimiento() {
    const tipoTransaccion = document.querySelector('input[name="input-tipo-transaccion"]:checked').value;
    const fecha = document.getElementById('movement-form-date').value;
    const productoNombre = document.getElementById('movement-form-product').value;
    const cantidad = parseFloat(document.getElementById('movement-form-quantity').value);
    const costoUnitario = parseFloat(document.getElementById('movement-form-cost').value);

    // Buscar el producto en el registro de productos por su nombre 
    const producto = productos.find((p) => p.nombre.toLowerCase() === productoNombre.toLowerCase() );

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
    const tableRows = document.getElementById('product-table-body').getElementsByTagName('tr');

    // Actualizar la cantidad en stock del producto
    if (tipoTransaccion === 'compra') {
        producto.cantidad += cantidad;

        // Actualizar la cantidad en la tabla de productos
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
    } else if (tipoTransaccion === 'venta') {
        producto.cantidad -= cantidad;

        // Actualizar la cantidad en la tabla de productos
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
    verificarStock()
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

// Crear una función de devolución de llamada para el observador de mutación
function handleDOMChanges(mutationsList, observer) {
    // Llamar a la función calcularTotal cuando se detecten cambios en el DOM
    calcularTotal();
}
// Crear un observador de mutación para el elemento con ID 'subtotal'
const subtotalObserver = new MutationObserver(handleDOMChanges);

// Configurar el observador para observar cambios en el contenido del elemento
subtotalObserver.observe(document.getElementById('subtotal'), { childList: true });

// Crear un observador de mutación para el elemento con ID 'valor-iva'
const valorIvaObserver = new MutationObserver(handleDOMChanges);

// Configurar el observador para observar cambios en el contenido del elemento
valorIvaObserver.observe(document.getElementById('valor-iva'), { childList: true });


// Función para verificar el stock y mostrar alertas de bajo stock
function verificarStock() {
    const umbralBajoStock = 10; // Define tu umbral de bajo stock aquí
    productos.forEach((producto) => {
        if (producto.cantidad < umbralBajoStock) {
            alert(`¡Bajo stock para ${producto.nombre}! Cantidad actual: ${producto.cantidad}`);
        }
    });
}
// JavaScript para desplazamiento suave al hacer clic en enlaces del navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const offsetTop = targetElement.offsetTop - document.querySelector('.navbar').offsetHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
