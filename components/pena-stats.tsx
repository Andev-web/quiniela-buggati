import { players, results, type PeñaData } from '@/lib/quiniela';

const decimal = (n: number) =>
  n.toLocaleString('es-ES', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

export function PenaStats({ data }: { data: PeñaData }) {
  const completed = data.rounds.filter((r) => results(r).complete);
  const hits = completed.reduce((total, r) => total + results(r).covered, 0);
  const total = completed.length * 14;
  const misses = total - hits;
  const percent = total ? (hits / total) * 100 : 0;
  const pending = data.rounds.length - completed.length;
  const ranking = players
    .map((name) => {
      const rounds = data.rounds.filter((r) => r.player === name);
      const closed = rounds.filter((r) => results(r).complete);
      const average = closed.length
        ? closed.reduce((sum, r) => sum + results(r).covered, 0) / closed.length
        : null;
      return {
        name,
        average,
        count: closed.length,
        pending: rounds.length - closed.length,
      };
    })
    .sort(
      (a, b) => (b.average ?? -1) - (a.average ?? -1) || b.pending - a.pending,
    );

  return (
    <section className="performance" aria-labelledby="performance-title">
      <div className="performance-heading">
        <div>
          <p className="performance-kicker">TEMPORADA 2026–2027</p>
          <h2 id="performance-title">Así afinamos la puntería</h2>
          <p>Aciertos y fallos de la peña, de un vistazo.</p>
        </div>
        <span className="performance-count">
          {completed.length} jornadas completas
          {pending > 0
            ? ` · ${pending} pendiente${pending === 1 ? '' : 's'}`
            : ''}
        </span>
      </div>
      <div className="performance-content">
        <figure className="performance-overall">
          <div className="performance-ring">
            <svg
              viewBox="0 0 220 220"
              role="img"
              aria-label={
                total
                  ? `${hits} aciertos y ${misses} fallos de ${total} partidos: ${decimal(percent)} por ciento de aciertos`
                  : 'Todavía no hay jornadas con resultados completos'
              }
            >
              <circle
                cx="110"
                cy="110"
                r="91"
                fill="none"
                stroke="#2b3b4c"
                strokeWidth="17"
              />
              {total > 0 && (
                <>
                  <circle
                    cx="110"
                    cy="110"
                    r="91"
                    fill="none"
                    stroke="#f18b98"
                    strokeWidth="17"
                  />
                  <circle
                    className="performance-arc"
                    cx="110"
                    cy="110"
                    r="91"
                    fill="none"
                    stroke="#85d775"
                    strokeWidth="17"
                    pathLength="100"
                    strokeDasharray={`${percent} ${100 - percent}`}
                    transform="rotate(-90 110 110)"
                  />
                </>
              )}
              <circle
                cx="110"
                cy="110"
                r="72"
                fill="none"
                stroke="#334355"
                strokeDasharray="1 8"
              />
            </svg>
            <div className="performance-ring-label" aria-hidden="true">
              <strong>
                {total ? decimal(percent) : '—'}
                {total > 0 && <span>%</span>}
              </strong>
              <span>DE ACIERTO</span>
            </div>
          </div>
          <figcaption>El marcador de todos</figcaption>
          <div className="performance-totals">
            <div>
              <span className="performance-dot hit" />
              <strong>{hits}</strong>
              <span>aciertos</span>
            </div>
            <div>
              <span className="performance-dot miss" />
              <strong>{misses}</strong>
              <span>fallos</span>
            </div>
          </div>
          <p className="performance-sample">
            {total
              ? `${total} partidos comprobados`
              : 'Esperando los primeros resultados'}
          </p>
        </figure>
        <figure className="performance-comparison">
          <figcaption>
            <h3>Rendimiento por jugador</h3>
            <span>Media sobre 14 partidos</span>
          </figcaption>
          <div className="performance-legend" aria-hidden="true">
            <span>
              <i className="performance-dot hit" /> Aciertos
            </span>
            <span>
              <i className="performance-dot miss" /> Fallos
            </span>
          </div>
          <div className="performance-rows">
            {ranking.map((p) => (
              <div className="performance-row" key={p.name}>
                <div className="performance-player">
                  <span>{p.name}</span>
                  <span>
                    {p.average !== null ? (
                      <>
                        <strong>{decimal(p.average)}</strong>
                        <span className="performance-denominator"> / 14</span>
                      </>
                    ) : (
                      <span className="performance-pending">
                        {p.pending ? 'Pendiente' : 'Sin jornadas'}
                      </span>
                    )}
                  </span>
                </div>
                {p.average !== null ? (
                  <>
                    <div
                      className="performance-bar"
                      role="img"
                      aria-label={`${p.name}: media de ${decimal(p.average)} aciertos y ${decimal(14 - p.average)} fallos sobre 14, en ${p.count} jornadas completas`}
                    >
                      <div
                        className="performance-bar-hits"
                        style={{ width: `${(p.average / 14) * 100}%` }}
                      />
                      <div
                        className="performance-bar-misses"
                        style={{ width: `${((14 - p.average) / 14) * 100}%` }}
                      />
                      <div className="performance-bar-grid" />
                    </div>
                    <div className="performance-row-note">
                      <span>
                        {p.count} jornada{p.count === 1 ? '' : 's'} completa
                        {p.count === 1 ? '' : 's'}
                        {p.pending
                          ? ` · ${p.pending} pendiente${p.pending === 1 ? '' : 's'}`
                          : ''}
                      </span>
                      <span>{decimal((p.average / 14) * 100)}% de acierto</span>
                    </div>
                  </>
                ) : (
                  <div className="performance-empty-bar">
                    <span>
                      {p.pending
                        ? 'Esperando resultados'
                        : 'Su gráfica empieza cuando juegue'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </figure>
      </div>
      <p className="performance-footnote">
        Se cuentan los signos cubiertos, incluidos los dobles. Solo jornadas
        completas; pleno al 15 aparte.
      </p>
    </section>
  );
}
