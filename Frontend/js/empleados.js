const API = 'http://localhost:5150/api/empleados';
const API_DEP = 'http://localhost:5150/api/departamentos';
const API_BUSCAR = 'http://localhost:5150/api/empleados/buscar';

const lista = document.getElementById('listaEmpleados');
const form = document.getElementById('formEmpleado');
const formBuscar = document.getElementById('formBuscar');
const nombreInput = document.getElementById('nombre');
const correoInput = document.getElementById('correo');
const depSelect = document.getElementById('departamentoId');
const empleadoIdInput = document.getElementById('empleadoId');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle = document.getElementById('formTitle');
const buscarNombreInput = document.getElementById('buscarNombre');
const buscarCorreoInput = document.getElementById('buscarCorreo');
const limpiarBusquedaBtn = document.getElementById('limpiarBusqueda');

let editMode = false;

function cargarDepartamentos() {
  fetch(API_DEP)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    })
    .then(data => {
      depSelect.innerHTML = '<option value="">Seleccione</option>';
      data.forEach(dep => {
        depSelect.innerHTML += `<option value="${dep.id}">${dep.nombre}</option>`;
      });
    })
    .catch(error => {
      console.error('Error cargando departamentos:', error);
      alert('Error cargando departamentos: ' + error.message);
    });
}

function cargarEmpleados() {
  fetch(API)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    })
    .then(data => {
      mostrarEmpleados(data);
    })
    .catch(error => {
      console.error('Error cargando empleados:', error);
      alert('Error cargando empleados: ' + error.message);
    });
}

function mostrarEmpleados(empleados) {
  lista.innerHTML = '';
  empleados.forEach(emp => {
    lista.innerHTML += `
      <tr>
        <td>${emp.id}</td>
        <td>${emp.nombre}</td>
        <td>${emp.correo}</td>
        <td>${emp.departamento?.nombre ?? 'N/A'}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1" onclick="editarEmpleado(${emp.id}, '${emp.nombre}', '${emp.correo}', ${emp.departamentoId})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminar(${emp.id})">Eliminar</button>
        </td>
      </tr>`;
  });
}


form.onsubmit = e => {
  e.preventDefault();
  
  const empleadoData = {
    nombre: nombreInput.value,
    correo: correoInput.value,
    departamentoId: parseInt(depSelect.value)
  };

  if (editMode) {
    // Update employee
    empleadoData.id = parseInt(empleadoIdInput.value);
    
    fetch(`${API}/${empleadoData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empleadoData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Error updating employee');
      resetForm();
      cargarEmpleados();
      alert('Empleado actualizado correctamente');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error actualizando empleado: ' + error.message);
    });
  } else {
    // Create employee
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empleadoData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Error creating employee');
      form.reset();
      cargarEmpleados();
      alert('Empleado creado correctamente');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error creando empleado: ' + error.message);
    });
  }
};

// Search functionality
formBuscar.onsubmit = e => {
  e.preventDefault();
  buscarEmpleados();
};

function buscarEmpleados() {
  const nombre = buscarNombreInput.value.trim();
  const correo = buscarCorreoInput.value.trim();
  
  if (!nombre && !correo) {
    alert('Ingrese al menos un criterio de búsqueda');
    return;
  }
  
  const params = new URLSearchParams();
  if (nombre) params.append('nombre', nombre);
  if (correo) params.append('correo', correo);
  
  fetch(`${API_BUSCAR}?${params.toString()}`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    })
    .then(data => {
      mostrarEmpleados(data);
    })
    .catch(error => {
      console.error('Error buscando empleados:', error);
      alert('Error en la búsqueda: ' + error.message);
    });
}

// Clear search
limpiarBusquedaBtn.onclick = () => {
  buscarNombreInput.value = '';
  buscarCorreoInput.value = '';
  cargarEmpleados();
};

// Edit employee 
function editarEmpleado(id, nombre, correo, departamentoId) {
  editMode = true;
  empleadoIdInput.value = id;
  nombreInput.value = nombre;
  correoInput.value = correo;
  depSelect.value = departamentoId;
  
  
  formTitle.textContent = 'Editar Empleado';
  btnSubmit.textContent = 'Actualizar';
  btnSubmit.className = 'btn btn-success w-100';
  btnCancelar.style.display = 'block';
  form.scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit mode
btnCancelar.onclick = () => {
  resetForm();
};

function resetForm() {
  editMode = false;
  form.reset();
  empleadoIdInput.value = '';
  
  // Reset UI to add mode
  formTitle.textContent = 'Agregar Empleado';
  btnSubmit.textContent = 'Agregar';
  btnSubmit.className = 'btn btn-primary w-100';
  btnCancelar.style.display = 'none';
}

// Delete employee function
function eliminar(id) {
  if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error('Error deleting employee');
        cargarEmpleados();
        alert('Empleado eliminado correctamente');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error eliminando empleado: ' + error.message);
      });
  }
}

// Initialize
cargarDepartamentos();
cargarEmpleados();
