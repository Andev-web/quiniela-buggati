# La peña del Buggati

Web de la quiniela: bote de la temporada 2026-2027, turnos, jornadas y estadísticas de los cinco jugadores.

## Desarrollo

Con Node.js 24:

```sh
npm ci
npm run dev
```

Edita `public/datos.json` para actualizar jornadas, resultados y premios. Consulta `EMPEZAR-AQUI.md` y `GUIA-QUINIELA.md`.

## Publicación

GitHub Pages publica automáticamente cada cambio enviado a `main`. En Settings → Pages selecciona GitHub Actions.

Web: https://andev-web.github.io/quiniela-buggati/

Antes de subir cambios:

```sh
npm test
npm run build
git add .
git commit -m "Actualizar quiniela"
git push
```
