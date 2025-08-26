let cliente = {
  mesa: '',
  hora: '',
  pedido: [],
};

const categorias = {
  1: 'Comida',
  2: 'Bebida',
  3: 'Postre',
};

const btnGuardarCliente = document.getElementById('guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
  const mesa = document.getElementById('mesa').value;
  const hora = document.getElementById('hora').value;

  // Revisar si hay campos vacios
  const camposVacios = [mesa, hora].some(campo => campo.trim() === '');
  if (camposVacios) {
    return mostrarAlerta('¡Todos los campos son obligatorios!');
  }

  cliente = { ...cliente, mesa, hora };

  const modalFormulario = document.getElementById('formulario');
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  mostrarSecciones();

  // Obtener platillos de la API JSON-Server
  obtenerPlatillos();
}

function mostrarAlerta(mensaje) {
  const alerta = document.createElement('div');
  const alertaExiste = document.querySelector('.alert');

  if (!alertaExiste) {
    alerta.classList.add('alert');
    alerta.textContent = mensaje;
    document.querySelector('.modal-body form').appendChild(alerta);
    setTimeout(() => {
      alerta.classList.add('hide');

      alerta.addEventListener('animationend', () => {
        alerta.remove();
      });
    }, 2500);
  }
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll('.d-none');
  seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
  const URL_PLATILLOS = 'http://localhost:4000/platillos';
  fetch(URL_PLATILLOS)
    .then(res => res.json())
    .then(data => mostrarPlatillos(data))
    .catch(error => console.error(error));
}

function mostrarPlatillos(platillos) {
  const contenido = document.querySelector('#platillos .contenido');

  platillos.forEach(platillo => {
    const { id, nombre, precio, categoria } = platillo;
    const row = document.createElement('div');
    row.classList.add('row', 'py-3', 'border-top');

    const nombrePlatillo = document.createElement('div');
    nombrePlatillo.classList.add('col-md-4');
    nombrePlatillo.textContent = nombre;

    const precioPlatillo = document.createElement('div');
    precioPlatillo.classList.add('col-md-3', 'fw-bold');
    precioPlatillo.textContent = `$${precio}`;

    const categoriaPlatillo = document.createElement('div');
    categoriaPlatillo.classList.add('col-md-3');
    categoriaPlatillo.textContent = categorias[categoria];

    const inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${id}`;
    inputCantidad.classList.add('form-control');

    inputCantidad.onchange = () => {
      const cantidad = parseInt(inputCantidad.value);
      agregarPlatillo({ ...platillo, cantidad });
    };

    const agregar = document.createElement('div');
    agregar.classList.add('col-md-2');
    agregar.appendChild(inputCantidad);

    row.appendChild(nombrePlatillo);
    row.appendChild(precioPlatillo);
    row.appendChild(categoriaPlatillo);
    row.appendChild(agregar);

    contenido.appendChild(row);
  });
}

function agregarPlatillo(producto) {
  let { pedido } = cliente;

  if (producto.cantidad > 0) {
    const articuloExiste = pedido.some(articulo => articulo.id === producto.id);

    if (articuloExiste) {
      const pedidoActualizado = pedido.map(articulo => {
        if (articulo.id === producto.id) {
          articulo.cantidad = producto.cantidad;
        }

        return articulo;
      });

      cliente.pedido = [...pedidoActualizado];
    } else {
      cliente.pedido = [...pedido, producto];
    }
  } else {
    const resultado = pedido.filter(articulo => articulo.id !== producto.id);
    cliente.pedido = [...resultado];
  }

  limpiarHTML();

  if (cliente.pedido.length) {
    return actualizarResumen();
  }

  mensajePedidoVacio();
}

function actualizarResumen() {
  const contenido = document.querySelector('#resumen .contenido');

  const resumen = document.createElement('div');
  resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

  const mesa = document.createElement('p');
  mesa.textContent = 'Mesa: ';
  mesa.classList.add('fw-bold');

  const mesaSpan = document.createElement('span');
  mesaSpan.textContent = cliente.mesa;
  mesaSpan.classList.add('fw-normal');

  const hora = document.createElement('p');
  hora.textContent = 'Hora: ';
  hora.classList.add('fw-bold');

  const horaSpan = document.createElement('span');
  horaSpan.textContent = cliente.hora;
  horaSpan.classList.add('fw-normal');

  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);

  const heading = document.createElement('h3');
  heading.textContent = 'Platillos Consumidos';
  heading.classList.add('my-4', 'text-center');

  const grupo = document.createElement('ul');
  grupo.classList.add('list-group');

  const { pedido } = cliente;
  pedido.forEach(articulo => {
    const { nombre, cantidad, precio, id } = articulo;

    const lista = document.createElement('li');
    lista.classList.add('list-group-item');

    const nombreEl = document.createElement('h4');
    nombreEl.classList.add('my-4');
    nombreEl.textContent = nombre;

    const cantidadEl = document.createElement('p');
    cantidadEl.classList.add('fw-bold');
    cantidadEl.textContent = 'Cantidad: ';

    const cantidadValor = document.createElement('span');
    cantidadValor.classList.add('fw-normal');
    cantidadValor.textContent = cantidad;

    const precioEl = document.createElement('p');
    precioEl.classList.add('fw-bold');
    precioEl.textContent = 'Precio: ';

    const precioValor = document.createElement('span');
    precioValor.classList.add('fw-normal');
    precioValor.textContent = `$${precio}`;

    const subtotalEl = document.createElement('p');
    subtotalEl.classList.add('fw-bold');
    subtotalEl.textContent = 'Subtotal: ';

    const subtotalValor = document.createElement('span');
    subtotalValor.classList.add('fw-normal');
    subtotalValor.textContent = `$${precio * cantidad}`;

    const btnEliminar = document.createElement('button');
    btnEliminar.classList.add('btn', 'btn-danger');
    btnEliminar.textContent = 'Eliminar del Pedido';

    btnEliminar.onclick = () => {
      eliminarProducto(id);
    };

    cantidadEl.appendChild(cantidadValor);
    precioEl.appendChild(precioValor);
    subtotalEl.appendChild(subtotalValor);

    lista.appendChild(nombreEl);
    lista.appendChild(cantidadEl);
    lista.appendChild(precioEl);
    lista.appendChild(subtotalEl);
    lista.appendChild(btnEliminar);

    grupo.appendChild(lista);
  });

  resumen.appendChild(heading);
  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(grupo);

  contenido.appendChild(resumen);

  formularioPropinas();
}

function limpiarHTML() {
  const contenido = document.querySelector('#resumen .contenido');
  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}

function eliminarProducto(id) {
  const { pedido } = cliente;
  const resultado = pedido.filter(articulo => articulo.id !== id);
  cliente.pedido = [...resultado];

  limpiarHTML();

  if (cliente.pedido.length) {
    return actualizarResumen();
  }

  mensajePedidoVacio();

  const productoEliminado = `producto-${id}`;
  const inputEliminado = document.getElementById(productoEliminado);
  inputEliminado.value = 0;
}

function mensajePedidoVacio() {
  const contenido = document.querySelector('#resumen .contenido');
  const texto = document.createElement('p');
  texto.classList.add('text-center');
  texto.textContent = 'Añade los elementos del pedido';

  contenido.appendChild(texto);
}

function formularioPropinas() {
  const contenido = document.querySelector('#resumen .contenido');
  const formulario = document.createElement('div');
  formulario.classList.add('col-md-6', 'formulario');

  const divFormulario = document.createElement('div');
  divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

  const heading = document.createElement('h3');
  heading.classList.add('my-4', 'text-center');
  heading.textContent = 'Propina';

  // Radio 10%
  const radio10 = document.createElement('input');
  radio10.type = 'radio';
  radio10.name = 'propina';
  radio10.value = '10';
  radio10.classList.add('form-check-input');
  radio10.onclick = calcularPropina;

  const radio10Label = document.createElement('label');
  radio10Label.textContent = '10%';
  radio10Label.classList.add('form-check-label');

  const radio10Div = document.createElement('div');
  radio10Div.classList.add('form-check');

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);

  // Radio 25%
  const radio25 = document.createElement('input');
  radio25.type = 'radio';
  radio25.name = 'propina';
  radio25.value = '25';
  radio25.classList.add('form-check-input');
  radio25.onclick = calcularPropina;

  const radio25Label = document.createElement('label');
  radio25Label.textContent = '25%';
  radio25Label.classList.add('form-check-label');

  const radio25Div = document.createElement('div');
  radio25Div.classList.add('form-check');

  radio25Div.appendChild(radio25);
  radio25Div.appendChild(radio25Label);

  // Radio 50%
  const radio50 = document.createElement('input');
  radio50.type = 'radio';
  radio50.name = 'propina';
  radio50.value = '50';
  radio50.classList.add('form-check-input');
  radio50.onclick = calcularPropina;

  const radio50Label = document.createElement('label');
  radio50Label.textContent = '50%';
  radio50Label.classList.add('form-check-label');

  const radio50Div = document.createElement('div');
  radio50Div.classList.add('form-check');

  radio50Div.appendChild(radio50);
  radio50Div.appendChild(radio50Label);

  formulario.appendChild(divFormulario);
  divFormulario.appendChild(heading);
  divFormulario.appendChild(radio10Div);
  divFormulario.appendChild(radio25Div);
  divFormulario.appendChild(radio50Div);

  contenido.appendChild(formulario);
}

function calcularPropina() {
  const { pedido } = cliente;
  let subtotal = 0;

  pedido.forEach(articulo => {
    subtotal += articulo.cantidad * articulo.precio;
  });

  const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
  const propina = (subtotal * parseInt(propinaSeleccionada)) / 100;
  const total = subtotal + propina;

  mostrarTotalHTML(subtotal, propina, total);
}

function mostrarTotalHTML(subtotal, propina, total) {
  const divTotales = document.createElement('div');
  divTotales.classList.add('total-pagar', 'my-5');

  // Subtotal
  const subtotalParrafo = document.createElement('p');
  subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  subtotalParrafo.textContent = 'Subtotal Consumo: ';

  const subtotalSpan = document.createElement('span');
  subtotalSpan.classList.add('fw-normal');
  subtotalSpan.textContent = `$${subtotal}`;

  subtotalParrafo.appendChild(subtotalSpan);

  // Propina
  const propinaParrafo = document.createElement('p');
  propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  propinaParrafo.textContent = 'Propina: ';

  const propinaSpan = document.createElement('span');
  propinaSpan.classList.add('fw-normal');
  propinaSpan.textContent = `$${propina}`;

  propinaParrafo.appendChild(propinaSpan);

  // Total
  const totalParrafo = document.createElement('p');
  totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
  totalParrafo.textContent = 'Total: ';

  const totalSpan = document.createElement('span');
  totalSpan.classList.add('fw-normal');
  totalSpan.textContent = `$${total}`;

  totalParrafo.appendChild(totalSpan);

  const totalPagarDiv = document.querySelector('.total-pagar');
  if (totalPagarDiv) {
    totalPagarDiv.remove();
  }

  divTotales.appendChild(subtotalParrafo);
  divTotales.appendChild(propinaParrafo);
  divTotales.appendChild(totalParrafo);

  const formulario = document.querySelector('.formulario > div');
  formulario.appendChild(divTotales);
}
