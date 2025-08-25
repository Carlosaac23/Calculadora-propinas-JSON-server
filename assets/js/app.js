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

  console.log(cliente.pedido);
}
