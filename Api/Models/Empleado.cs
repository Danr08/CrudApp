namespace Api.Models
{
    public class Empleado
    {
        public int Id { get; set; }
        public required string Nombre { get; set; }
        public required string Correo { get; set; }
        public int DepartamentoId { get; set; }
        public Departamento? Departamento { get; set; }
    }
}
