// Crea una objeto date desde dd/mm/yyyy
export function crearFecha(dateString) {
  const partes = dateString.split('/');
  const dia = parseInt(partes[0], 10);
  const mes = parseInt(partes[1], 10) - 1;
  const año = parseInt(partes[2], 10);

  return new Date(año, mes, dia);
}