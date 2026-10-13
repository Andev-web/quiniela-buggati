import fs from 'node:fs';
import assert from 'node:assert/strict';
import { players } from '../lib/quiniela.ts';
const data = JSON.parse(
  fs.readFileSync(new URL('../public/datos.json', import.meta.url), 'utf8'),
);
const cash = (n) =>
  typeof n === 'number' &&
  Number.isFinite(n) &&
  n >= 0 &&
  Math.abs(Math.round(n * 100) - n * 100) < 1e-6;
const date = (s) =>
  typeof s === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  !Number.isNaN(Date.parse(s)) &&
  new Date(s).toISOString().slice(0, 10) === s;
assert(cash(data.openingBalance), 'Saldo inicial inválido');
assert(
  Number.isInteger(data.nextPlayer) &&
    data.nextPlayer >= 0 &&
    data.nextPlayer < 5,
  'Turno inválido',
);
assert(
  Array.isArray(data.rounds) && Array.isArray(data.withdrawals),
  'Faltan jornadas o salidas',
);
const ids = new Set();
for (const r of data.rounds) {
  assert(
    typeof r.id === 'string' && r.id.trim() && !ids.has(r.id),
    'Identificador vacío o duplicado',
  );
  ids.add(r.id);
  assert(
    r.dateStart === undefined || (date(r.dateStart) && r.dateStart <= r.date),
    'Inicio de jornada inválido',
  );
  assert(date(r.date), 'Fecha inválida');
  assert(players.includes(r.player), 'Jugador desconocido');
  assert(r.cost === 24, 'El importe acordado es 24 €');
  assert(r.prize === null || cash(r.prize), 'Premio inválido');
  assert(
    Array.isArray(r.matches) && r.matches.length === 14,
    'Se requieren 14 partidos',
  );
  for (const m of r.matches) {
    assert(
      typeof m.home === 'string' &&
        m.home.trim() &&
        typeof m.away === 'string' &&
        m.away.trim(),
      'Faltan equipos',
    );
    assert(
      ['1', 'X', '2', '1X', '12', 'X2'].includes(m.picks),
      'Signos inválidos',
    );
    assert(
      m.result === null || ['1', 'X', '2'].includes(m.result),
      'Resultado inválido',
    );
  }
  assert(
    r.matches.filter((m) => m.picks.length === 2).length === 5,
    'Se requieren cinco dobles',
  );
  if (r.columns !== undefined) {
    assert(Array.isArray(r.columns) && r.columns.length > 0, 'Columnas vacías');
    for (const c of r.columns) {
      assert(
        typeof c === 'string' && /^[1X2]{14}$/.test(c),
        'Columna inválida',
      );
      assert(
        [...c].every((s, i) => r.matches[i].picks.includes(s)),
        'La columna no coincide con los signos del boleto',
      );
    }
  }
  if (r.pleno) {
    assert(r.pleno.home && r.pleno.away, 'Faltan equipos del pleno');
    assert(/^[012M]-[012M]$/.test(r.pleno.prediction), 'Pleno inválido');
    assert(
      r.pleno.result === null || /^[012M]-[012M]$/.test(r.pleno.result),
      'Resultado del pleno inválido',
    );
  }
}
for (const w of data.withdrawals) {
  assert(
    date(w.date) &&
      cash(w.amount) &&
      typeof w.reason === 'string' &&
      w.reason.trim(),
    'Salida del bote inválida',
  );
}
assert(
  data.openingBalance + data.rounds.reduce((n, r) => n + (r.prize ?? 0), 0) >=
    data.withdrawals.reduce((n, r) => n + r.amount, 0),
  'Las salidas superan el bote',
);
console.log(`Datos válidos: ${data.rounds.length} jornadas, 5 jugadores.`);
