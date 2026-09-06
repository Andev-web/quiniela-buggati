# Editar la quiniela en Visual Studio Code

La carpeta de trabajo es `/Users/cash/Desktop/Quiniela`.

## Ver la web mientras editas

1. Abre Visual Studio Code y selecciona **Archivo → Abrir carpeta… → Escritorio → Quiniela**.
2. Abre **Terminal → Nuevo terminal**.
3. Ejecuta `npm run dev`.
4. Abre la dirección que aparezca junto a **Local**, normalmente http://localhost:3000/.
5. Edita un archivo y guarda con **⌘S**. El servidor actualiza la vista al guardar. Si no ves un cambio, recarga el navegador.

Mantén ese terminal abierto. Para detener el servidor, pulsa **Ctrl+C**. Para volver a verlo otro día, ejecuta otra vez `npm run dev`.

También puedes pulsar **F5** (o **fn+F5** en algunos teclados) y elegir **Quiniela: abrir servidor y navegador**. Otra opción es **Terminal → Ejecutar tarea → Quiniela: servidor local**. Utiliza solo una de estas opciones a la vez; si el puerto está ocupado, el servidor puede elegir otro, que aparecerá en el terminal.

## Qué archivo cambiar

| Archivo | Qué puedes modificar |
|---|---|
| `public/datos.json` | Próximo turno, jornadas, resultados, premios y salidas del bote. |
| `app/page.tsx` | Textos, secciones y estructura de la pantalla. |
| `app/globals.css` | Colores, tipografías, tamaños y diseño para móvil. |
| `lib/quiniela.ts` | Nombres de los jugadores y reglas de cálculo. |
| `GUIA-QUINIELA.md` | Explicación del formato de las jornadas y de cada dato. |

Para abrir rápidamente cualquiera de ellos, pulsa **⌘P** y escribe su nombre.

Los índices de `nextPlayer` son: 0 Miguel, 1 Antonio, 2 Jaime, 3 Jesus y 4 Andres. Cambiar, por ejemplo, `"nextPlayer": 0` a `"nextPlayer": 1` muestra a Antonio como próximo jugador. No modifiques `openingBalance` para registrar un premio: los premios van en su jornada y se suman automáticamente.

Después de editar datos, ejecuta `npm test` en un segundo terminal para detectar errores. El servidor de desarrollo sigue funcionando en el primero.

## Copia para abrir sin servidor

La carpeta `web` contiene una copia estática de la primera versión. Esa copia no refleja tus cambios automáticamente. Para trabajar y ver cambios, utiliza el servidor y los archivos de la tabla. `npm run build` genera una copia nueva en `dist/client`.

## Dependencias y publicación

Las dependencias ya están instaladas en este ordenador. En otro equipo necesitarás Node.js 24 y ejecutar `npm ci` antes de `npm run dev`.

Todo este flujo es local. Guardar archivos, arrancar el servidor y compilar no sube cambios a GitHub.
