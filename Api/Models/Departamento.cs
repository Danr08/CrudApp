namespace Api.Models
{
    public class Departamento
    {
        public int Id { get; set; }
        public required string Nombre { get; set; }
        public List<Empleado> Empleados { get; set; } = new();

    }

}
