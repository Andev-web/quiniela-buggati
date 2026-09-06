// The published dashboard is read-only: native links/details need no hydration.
// Inline styles and omit React transport scripts to support any Pages subpath.
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist/client');
const file=path.join(root,'index.html');
if(!fs.existsSync(file)) throw new Error('La portada no se ha generado');
let html=fs.readFileSync(file,'utf8');
html=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
html=html.replace(/<link\b[^>]*>/gi,tag=>{
 if(/rel="(?:modulepreload|preload)"/.test(tag)) return '';
 if(!/rel="stylesheet"/.test(tag)) return tag;
 const href=tag.match(/href="([^"]+)"/)?.[1];
 if(!href||!href.startsWith('/'))throw new Error('Hoja de estilo inesperada');
 const css=fs.readFileSync(path.join(root,href),'utf8');
 return '<style>'+css.replaceAll('</style','<\\/style')+'</style>';
});
if(!/<link\b[^>]*rel="icon"/.test(html)) html=html.replace('</head>','<link rel="icon" type="image/svg+xml" href="./favicon.svg?v=2"></head>');
if(!html.includes('Andres Segovia')||!html.includes('id="bote"'))throw new Error('Portada incompleta');
fs.writeFileSync(file,html);
fs.writeFileSync(path.join(root,'.nojekyll'),'');
console.log('Portada estática lista para GitHub Pages.');
