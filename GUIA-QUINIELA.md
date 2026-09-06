# La peña del Buggati

Web informativa de Andres Segovia, Jaime Pastor, Jesus Negrillo, Antonio Garcia y Miguel Garcia. Cada turno cuesta 24 € y lleva cinco dobles. Los premios van al bote común, inicialmente a 0 €.

## Cada semana

Pasa la foto legible o el texto del boleto en la conversación, indicando jornada y responsable. Se transcriben los 14 partidos, los cinco dobles y el pleno al 15 cuando esté disponible. Si es una apuesta reducida, facilita las columnas realmente jugadas para conocer los aciertos de la mejor columna. Después añade los resultados finales y el premio confirmado. Las correcciones se guardan en `public/datos.json` y se publican con una nueva versión de la web.

La web es informativa: no incluye subida de fotos, lectura automática, acceso a resultados en directo ni edición en el navegador. Todos consultan la misma versión publicada. No hay datos guardados solo en un dispositivo.

## Datos y cálculos

`public/datos.json` contiene el saldo inicial (`openingBalance`), el índice del próximo jugador (`nextPlayer`, de 0 a 4), las jornadas (`rounds`) y las salidas del bote (`withdrawals`). La rueda por edad es Miguel Garcia → Antonio Garcia → Jaime Pastor → Jesus Negrillo → Andres Segovia → Miguel Garcia. Las primeras cuatro jornadas fueron excepciones y conservan su responsable original. No se avanza automáticamente al añadir resultados: se actualiza al registrar el siguiente turno, sin saltarse jornadas al corregirlas.

Cada jornada lleva `id` único, `date` (AAAA-MM-DD), `player` (nombre exacto de la lista), `cost` (24), `prize` (null si está pendiente; 0 si se confirma sin premio), y 14 `matches`. Cada partido lleva `home`, `away`, `picks` (1, X, 2, 1X, 12 o X2) y `result` (1, X, 2 o null). Debe haber exactamente cinco dobles. `columns`, opcional, es una lista de cadenas de 14 signos simples, una por columna jugada. `pleno`, opcional, lleva `home`, `away`, `prediction` y `result` (formato 0-0 a M-M; null para resultado pendiente).

Bote = saldo inicial + premios confirmados − salidas. Los 24 € se contabilizan como gasto individual, no como ingresos del bote. Media y fallos por jugador usan solo jornadas con los 14 resultados completos. Los aciertos cubiertos comprueban los signos del boleto; la mejor columna se calcula únicamente con las columnas registradas. El pleno se muestra aparte y no se incorpora a la media sobre 14. No se deducen premios a partir de aciertos: se registra el premio confirmado del resguardo.

## Desarrollo

Node.js 24. `npm ci`, `npm run dev`. `npm test` valida los datos y las reglas de cálculo. `npm run build` genera la web estática en `dist/client`.

## GitHub Pages

Cada cambio enviado a `main` compila y publica mediante `.github/workflows/pages.yml`. Configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. La web estará en https://andev-web.github.io/quiniela-buggati/.

Los datos son visibles para cualquiera que tenga acceso a la web y al repositorio público.
