

function calculatePrice(type, kg = 0, distanceKm = 0) {
  let base = 100, perKg = 5, perKm = 10;
  if (type === 'reciclavel') { base = 80; perKg = 3; perKm = 8; }
  if (type === 'entulho') { base = 150; perKg = 7; perKm = 12; }
  if (type === 'especial') { base = 200; perKg = 10; perKm = 15; }
  const extra = Math.max(0, distanceKm - 2.0);
  return Math.round(base + (kg * perKg) + (extra * perKm));
}

module.exports = { calculatePrice };