export const players = [
  'Miguel Garcia',
  'Antonio Garcia',
  'Jaime Pastor',
  'Jesus Negrillo',
  'Andres Segovia',
];
export type Match = {
  home: string;
  away: string;
  picks: string;
  result: string | null;
};
export type Round = {
  id: string;
  date: string;
  dateStart?: string;
  player: string;
  cost: number;
  prize: number | null;
  matches: Match[];
  columns?: string[];
  pleno?: {
    home: string;
    away: string;
    prediction: string;
    result: string | null;
  };
};
export type PeñaData = {
  openingBalance: number;
  nextPlayer: number;
  rounds: Round[];
  withdrawals: { date: string; amount: number; reason: string }[];
};
export const money = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(n);
export function results(round: Round) {
  const played = round.matches.filter((m) => m.result !== null);
  const covered = played.filter((m) => m.picks.includes(m.result!)).length;
  const complete = round.matches.length === 14 && played.length === 14;
  const best =
    complete && round.columns?.length
      ? Math.max(
          ...round.columns.map(
            (c) =>
              [...c].filter((s, i) => s === round.matches[i]?.result).length,
          ),
        )
      : null;
  return {
    played: played.length,
    covered,
    errors: played.length - covered,
    complete,
    best,
  };
}
export function summary(data: PeñaData) {
  const prizes = data.rounds.reduce((a, r) => a + (r.prize ?? 0), 0),
    spent = data.rounds.reduce((a, r) => a + r.cost, 0),
    withdrawn = data.withdrawals.reduce((a, r) => a + r.amount, 0);
  return {
    prizes,
    spent,
    withdrawn,
    balance: data.openingBalance + prizes - withdrawn,
    closed: data.rounds.filter((r) => results(r).complete).length,
  };
}
