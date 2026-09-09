import { PenaStats } from '@/components/pena-stats';
import {
  ArrowUpRight,
  Wallet,
  Ticket,
  Target,
  Trophy,
  ClipboardList,
  Users,
  Check,
  Clock3,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from '@/components/ui/empty';
import initial from '../public/datos.json';
import {
  players,
  money,
  summary,
  results,
  type PeñaData,
} from '@/lib/quiniela';
export const dynamic = 'force-static';
const data = initial as PeñaData;
const initials = (name: string) =>
  name
    .split(' ')
    .map((s) => s[0])
    .join('');
export default function Home() {
  const totals = summary(data),
    next = data.nextPlayer;
  const stats = players.map((name) => {
    const rounds = data.rounds.filter((r) => r.player === name);
    const closed = rounds.filter((r) => results(r).complete);
    const covered = closed.reduce((n, r) => n + results(r).covered, 0);
    return {
      name,
      rounds: rounds.length,
      closed: closed.length,
      average: closed.length ? (covered / closed.length).toFixed(1) : '—',
      errors: closed.length
        ? closed.reduce((n, r) => n + results(r).errors, 0)
        : '—',
      prizes: rounds.reduce((n, r) => n + (r.prize ?? 0), 0),
      paid: rounds.reduce((n, r) => n + r.cost, 0),
    };
  });
  const closed = data.rounds.filter((r) => results(r).complete);
  const average = closed.length
    ? (
        closed.reduce((n, r) => n + results(r).covered, 0) / closed.length
      ).toFixed(1)
    : '—';
  return (
    <>
      <header>
        <div className="topbar">
          <a className="brand" href="#resumen">
            <span className="brandmark">1X2</span>
            <span>
              La peña del Buggati<small>NUESTRA QUINIELA</small>
            </span>
          </a>
          <nav aria-label="Navegación principal">
            <a href="#resumen">Resumen</a>
            <a href="#jugadores">Jugadores</a>
            <a href="#turnos">Turnos</a>
            <a href="#jornadas">Jornadas</a>
          </nav>
          <span className="season">5 amigos · Un bote común</span>
        </div>
      </header>
      <main className="page" id="resumen">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EL MARCADOR DE LA PEÑA</p>
            <h1>Cada semana, una oportunidad.</h1>
          </div>
          <span className="badge">
            <Clock3 size={14} />{' '}
            {data.rounds.length
              ? 'Seguimiento de jornadas'
              : 'A la espera de la primera jornada'}
          </span>
        </div>
        <div className="overview">
          <section className="bank" aria-labelledby="bote">
            <div className="bank-top">
              <h2 className="eyebrow" id="bote">
                BOTE TEMPORADA 2026-2027
              </h2>
              <Wallet size={21} color="#f5cd45" />
            </div>
            <div className="balance">
              {totals.balance.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
              })}{' '}
              <span>€</span>
            </div>
            <p>Los premios se quedan en casa.</p>
            <div className="bank-bottom">
              <div>
                <span>Premios acumulados</span>
                <strong>{money(totals.prizes)}</strong>
              </div>
            </div>
          </section>
          <section className="ticket">
            <div className="ticket-head">
              <span className="eyebrow">PRÓXIMO TURNO</span>
              <span className="badge light">Le toca a…</span>
            </div>
            <div>
              <div className="next-name">{players[next]}</div>
              <p className="muted">Después: {players[(next + 1) % 5]}</p>
            </div>
            <div className="ticket-footer">
              <div>
                <strong>24 €</strong>
                <span>A cargo del jugador</span>
              </div>
              <div>
                <strong>5 dobles</strong>
                <span>Por quiniela</span>
              </div>
              <ArrowUpRight
                size={26}
                style={{ marginLeft: 'auto', alignSelf: 'center' }}
              />
            </div>
          </section>
        </div>
        <div className="kpis">
          {[
            {
              label: 'Dinero jugado',
              value: money(totals.spent),
              hint: 'Pagado por cada responsable',
              Icon: Ticket,
            },
            {
              label: 'Jornadas registradas',
              value: data.rounds.length,
              hint: `${totals.closed} con resultados completos`,
              Icon: ClipboardList,
            },
            {
              label: 'Media de aciertos cubiertos',
              value: average === '—' ? '—' : `${average} / 14`,
              hint: 'Con resultados completos',
              Icon: Target,
            },
            {
              label: 'Jornadas con premio',
              value: data.rounds.filter((r) => (r.prize ?? 0) > 0).length,
              hint: 'Premios confirmados',
              Icon: Trophy,
            },
          ].map(({ label, value, hint, Icon }) => (
            <section className="kpi" key={label}>
              <div className="kpi-label">
                {label}
                <Icon size={17} />
              </div>
              <strong>{value}</strong>
              <small>{hint}</small>
            </section>
          ))}
        </div>
        <PenaStats data={data} />
        <section className="panel" id="jugadores">
          <div className="panel-title">
            <div>
              <h2>Los cinco de la peña</h2>
              <p>Cada uno tiene su turno. Aquí se ven los resultados.</p>
            </div>
            <span className="badge">
              <Users size={14} /> 5 jugadores
            </span>
          </div>
          <div className="players">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>JUGADOR</TableHead>
                  <TableHead>JORNADAS</TableHead>
                  <TableHead>MEDIA / 14</TableHead>
                  <TableHead>FALLOS</TableHead>
                  <TableHead>APORTADO</TableHead>
                  <TableHead>PREMIOS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((p, i) => (
                  <TableRow key={p.name}>
                    <TableCell>
                      <div className="player">
                        <span
                          className={`avatar ${i === next ? 'active' : ''}`}
                        >
                          {initials(p.name)}
                        </span>
                        <div>
                          {p.name}
                          <small>
                            {i === next ? 'Próximo en jugar' : 'En la peña'}
                          </small>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{p.rounds}</TableCell>
                    <TableCell>{p.average}</TableCell>
                    <TableCell>{p.errors}</TableCell>
                    <TableCell>{money(p.paid)}</TableCell>
                    <TableCell>{money(p.prizes)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
        <p className="note">
          La media cuenta partidos cuyo resultado está entre los signos
          marcados. En apuestas reducidas, los aciertos de la mejor columna se
          muestran cuando se registran las columnas jugadas. El pleno al 15 se
          cuenta aparte.
        </p>
        <section className="section panel" id="turnos">
          <div className="panel-title">
            <div>
              <h2>La rueda de turnos</h2>
              <p>Una quiniela por persona; después, vuelta a empezar.</p>
            </div>
            <span className="badge">24 € por turno</span>
          </div>
          <div className="turns">
            {Array.from({ length: 5 }, (_, j) => {
              const i = (next + j) % 5;
              return (
                <div key={i} className={`turn ${j === 0 ? 'active' : ''}`}>
                  <div className="turn-label">
                    {j === 0 ? 'PRÓXIMO' : `DESPUÉS · ${j + 1}`}
                  </div>
                  <span className={`avatar ${j === 0 ? 'active' : ''}`}>
                    {initials(players[i])}
                  </span>
                  <strong>{players[i]}</strong>
                  <small>
                    {j === 0 ? 'Quiniela pendiente' : 'En la rueda'}
                  </small>
                </div>
              );
            })}
          </div>
        </section>
        <div className="bottom-grid">
          <section className="panel" id="jornadas">
            <div className="panel-title">
              <h2>Diario de jornadas</h2>
              <span className="badge">{data.rounds.length} registradas</span>
            </div>
            {!data.rounds.length ? (
              <Empty className="history-empty">
                <EmptyHeader>
                  <EmptyMedia>
                    <span className="empty-icon">
                      <ClipboardList size={26} />
                    </span>
                  </EmptyMedia>
                  <EmptyTitle>
                    <h3>El primer boleto abre la temporada</h3>
                  </EmptyTitle>
                  <EmptyDescription>
                    Cuando registremos la primera quiniela, aquí aparecerán los
                    partidos, los signos y sus resultados.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              data.rounds
                .slice()
                .reverse()
                .map((r, index) => {
                  const s = results(r);
                  return (
                    <details
                      className="history-item"
                      key={r.id}
                      open={index === 0}
                    >
                      <summary>
                        {r.id} · {r.player}
                      </summary>
                      <p className="muted">
                        {r.dateStart &&
                          `${r.dateStart.split('-').reverse().join('/')} – `}
                        {r.date.split('-').reverse().join('/')}
                        {' · '}
                        {s.played === 0
                          ? 'Resultados pendientes · 0/14 resueltos'
                          : `${s.covered} aciertos cubiertos · ${s.errors} fallos · ${s.played}/14 resueltos`}
                      </p>
                      <p>
                        Premio:{' '}
                        {r.prize === null
                          ? 'Pendiente de confirmar'
                          : money(r.prize)}{' '}
                        · Mejor columna:{' '}
                        {s.best === null
                          ? 'Sin columnas verificadas'
                          : `${s.best}/14`}
                      </p>
                      <div className="match-grid muted">
                        <span>#</span>
                        <span>Partido</span>
                        <span>Signos</span>
                        <span>Final</span>
                      </div>
                      {r.matches.map((m, i) => (
                        <div className="match-grid" key={i}>
                          <span>{i + 1}</span>
                          <span>
                            {m.home} — {m.away}
                          </span>
                          <strong>{m.picks}</strong>
                          <span
                            className={`match-state ${m.result ? (m.picks.includes(m.result) ? 'correct' : 'wrong') : ''}`}
                          >
                            {m.result ?? '—'}
                          </span>
                        </div>
                      ))}
                      {r.pleno && (
                        <div className="match-grid" aria-label="Pleno al 15">
                          <span>15</span>
                          <span>
                            {r.pleno.home} — {r.pleno.away}
                          </span>
                          <strong>{r.pleno.prediction}</strong>
                          <span
                            className={`match-state ${r.pleno.result ? (r.pleno.prediction === r.pleno.result ? 'correct' : 'wrong') : ''}`}
                            aria-label={
                              r.pleno.result
                                ? `Resultado ${r.pleno.result}: ${r.pleno.prediction === r.pleno.result ? 'acierto' : 'fallo'}`
                                : 'Resultado pendiente'
                            }
                          >
                            {r.pleno.result ?? '—'}
                          </span>
                        </div>
                      )}
                      {r.scrutiny && (
                        <section className="scrutiny" aria-label={`Escrutinio de ${r.id}`}>
                          <div className="scrutiny-head">
                            <div>
                              <span className="eyebrow">ESCRUTINIO OFICIAL</span>
                              <h3>Lo que se podía ganar</h3>
                            </div>
                            <span className={`scrutiny-verdict ${s.best !== null && s.best >= 10 ? 'won' : ''}`}>
                              {s.best !== null
                                ? s.best >= 10
                                  ? `Mejor columna: ${s.best} · ${money(r.scrutiny.find((p) => p.hits === s.best)?.amount ?? 0)}`
                                  : `Mejor columna: ${s.best}/14 · Sin premio`
                                : `${s.covered} signos cubiertos · Mejor columna no registrada`}
                            </span>
                          </div>
                          <div className="scrutiny-grid">
                            {r.scrutiny.map((category) => (
                              <div className={`scrutiny-category ${s.best === category.hits ? 'achieved' : ''}`} key={category.hits}>
                                <span>{category.hits === 15 ? 'PLENO AL 15' : `${category.hits} ACIERTOS`}</span>
                                <strong>{category.amount ? money(category.amount) : 'Bote'}</strong>
                                <small>{category.winners.toLocaleString('es-ES')} acertante{category.winners === 1 ? '' : 's'}</small>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </details>
                  );
                })
            )}
          </section>
        </div>
        <footer className="footer">
          <span>La peña del Buggati · Nuestra quiniela</span>
          <div className="rules">
            <span className="rule">
              <Check size={13} /> 24 € por jornada
            </span>
            <span className="rule">
              <Check size={13} /> 5 dobles
            </span>
            <span className="rule">
              <Check size={13} /> Premios al bote
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}
