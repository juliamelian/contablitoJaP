
// Función para calcular el subtotal y agregar productos a la lista
function agregarAlListado() {
    const id = document.getElementById('registration-form-id').value;
    const nombre = document.getElementById('registration-form-name').value;
    const descripcion = document.getElementById('registration-form-description').value;
    const cantidad = parseFloat(document.getElementById('registration-form-quantity').value);
    const costoUnitario = parseFloat(document.getElementById('registration-form-cost').value);

    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${nombre}</strong> (ID: ${id}), Cantidad: ${cantidad}, Costo: $${costoUnitario} <br> Descripción: ${descripcion}`;
    const productList = document.getElementById('product-list');
    productList.appendChild(listItem);
    
    // Limpiar los campos del formulario
    document.getElementById('registration-form-id').value = '';
    document.getElementById('registration-form-name').value = '';
    document.getElementById('registration-form-description').value = '';
    document.getElementById('registration-form-quantity').value = '';
    document.getElementById('registration-form-cost').value = '';

}

// Agregar evento para mostrar productos cuando se envía el formulario
document.getElementById('product-registration').addEventListener('submit', function (e) {
    e.preventDefault(); 
    agregarAlListado(); 
});

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

// Función para calcular el total
function calcularTotal() {
    const subtotal = parseFloat(document.getElementById('subtotal').innerText);
    const valorIVA = parseFloat(document.getElementById('valor-iva').innerText);
    const total = subtotal + valorIVA;
    document.getElementById('total').innerText = total.toFixed(2);
}

// Agregar eventos para llamar a las funciones de cálculo cuando cambien los valores
document.getElementById('movement-form-quantity').addEventListener('input', calcularSubtotal);
document.getElementById('movement-form-cost').addEventListener('input', calcularSubtotal);
document.querySelectorAll('input[name="input-tipo-iva"]').forEach((radio) => {
    radio.addEventListener('change', calcularIVA);
});

// Agregar evento para calcular el total cuando cambie el subtotal o el valor del IVA
document.getElementById('subtotal').addEventListener('DOMSubtreeModified', calcularTotal);
document.getElementById('valor-iva').addEventListener('DOMSubtreeModified', calcularTotal);
