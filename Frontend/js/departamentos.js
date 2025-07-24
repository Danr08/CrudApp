const API = 'http://localhost:5150/api/departamentos';
const lista = document.getElementById('listaDepartamentos');
const form = document.getElementById('formDepartamento');
const nombreInput = document.getElementById('nombre');
const departamentoIdInput = document.getElementById('departamentoId');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle = document.getElementById('formTitle');

let editMode = false;

function cargarDepartamentos() {
  fetch(API)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
      return r.json();
    })
    .then(data => {
      lista.innerHTML = '';
      data.forEach(dep => {
        lista.innerHTML += `
          <tr>
            <td>${dep.id}</td>
            <td>${dep.nombre}</td>
            <td>
              <button class="btn btn-warning btn-sm me-1" onclick="editarDepartamento(${dep.id}, '${dep.nombre}')">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminar(${dep.id})">Eliminar</button>
            </td>
          </tr>`;
      });
    })
    .catch(error => {
      console.error('Error cargando departamentos:', error);
      alert('Error cargando departamentos: ' + error.message);
    });
}

// Form submission (Create/Update)
form.onsubmit = e => {
  e.preventDefault();
  
  const departamentoData = {
    nombre: nombreInput.value
  };

  if (editMode) {
    // Update existing department
    departamentoData.id = parseInt(departamentoIdInput.value);
    
    fetch(`${API}/${departamentoData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(departamentoData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Error updating department');
      resetForm();
      cargarDepartamentos();
      alert('Departamento actualizado correctamente');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error actualizando departamento: ' + error.message);
    });
  } else {
    // Create new department
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(departamentoData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Error creating department');
      form.reset();
      cargarDepartamentos();
      alert('Departamento creado correctamente');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error creando departamento: ' + error.message);
    });
  }
};

// Edit department function
function editarDepartamento(id, nombre) {
  editMode = true;
  departamentoIdInput.value = id;
  nombreInput.value = nombre;
  
  // Update UI for edit mode
  formTitle.textContent = 'Editar Departamento';
  btnSubmit.textContent = 'Actualizar';
  btnSubmit.className = 'btn btn-success';
  btnCancelar.style.display = 'inline-block';
  
  // Focus on input
  nombreInput.focus();
}

// Cancel edit mode
btnCancelar.onclick = () => {
  resetForm();
};

function resetForm() {
  editMode = false;
  form.reset();
  departamentoIdInput.value = '';
  
  // Reset UI to add mode
  formTitle.textContent = 'Agregar Departamento';
  btnSubmit.textContent = 'Agregar';
  btnSubmit.className = 'btn btn-primary';
  btnCancelar.style.display = 'none';
}

// Delete department function
function eliminar(id) {
  if (confirm('¿Está seguro de que desea eliminar este departamento?')) {
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error('Error deleting department');
        cargarDepartamentos();
        alert('Departamento eliminado correctamente');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error eliminando departamento: ' + error.message);
      });
  }
}

// Initialize
cargarDepartamentos();
