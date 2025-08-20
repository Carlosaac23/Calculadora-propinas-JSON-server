let cliente = {
  mesa: '',
  hora: '',
  pedido: [],
};

const btnGuardarCliente = document.getElementById('guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
  const mesa = document.getElementById('mesa').value;
  const hora = document.getElementById('hora').value;

  // Revisar si hay campos vacios
  const camposVacios = [mesa, hora].some(campo => campo === '');
  if (camposVacios) {
    return mostrarAlerta('¡Todos los campos son obligatorios!');
  }

  cliente = { ...cliente, mesa, hora };
  console.log(cliente);
  const modalFormulario = document.getElementById('formulario');
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  mostrarSecciones();
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll('.d-none');
  seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
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
