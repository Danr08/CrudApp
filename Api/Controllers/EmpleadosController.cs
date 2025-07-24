using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api.Models;
using Api.Data;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmpleadosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetEmpleados()
        {
            return await _context.Empleados
                                 .Include(e => e.Departamento)
                                 .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Empleado>> GetEmpleado(int id)
        {
            var empleado = await _context.Empleados
                                         .Include(e => e.Departamento)
                                         .FirstOrDefaultAsync(e => e.Id == id);

            if (empleado == null)
                return NotFound();

            return empleado;
        }

        [HttpPost]
        public async Task<ActionResult<Empleado>> CreateEmpleado(Empleado empleado)
        {
            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEmpleado), new { id = empleado.Id }, empleado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmpleado(int id, Empleado empleado)
        {
            if (id != empleado.Id)
                return BadRequest();

            _context.Entry(empleado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Empleados.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
                return NotFound();

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Endpoint de búsqueda por nombre o correo
        [HttpGet("buscar")]
        public async Task<ActionResult<IEnumerable<Empleado>>> Buscar(string? nombre, string? correo)
        {
            var query = _context.Empleados
                                .Include(e => e.Departamento)
                                .AsQueryable();

            if (!string.IsNullOrEmpty(nombre))
                query = query.Where(e => e.Nombre.Contains(nombre));

            if (!string.IsNullOrEmpty(correo))
                query = query.Where(e => e.Correo.Contains(correo));

            return await query.ToListAsync();
        }
    }
}
