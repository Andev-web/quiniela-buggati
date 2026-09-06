import test from 'node:test';
import assert from 'node:assert/strict';
import {results,summary} from '../lib/quiniela.ts';
const matches=Array.from({length:14},(_,i)=>({home:`Local ${i}`,away:`Visitante ${i}`,picks:i<5?'1X':'1',result:'1'}));
const round={id:'Prueba',date:'2026-09-06',player:'Andres Segovia',cost:24,prize:0,matches};
test('El gasto individual no se suma ni resta al bote',()=>{assert.deepEqual(summary({openingBalance:0,nextPlayer:0,rounds:[round],withdrawals:[]}),{prizes:0,spent:24,withdrawn:0,balance:0,closed:1})});
test('Premios y retiradas actualizan el saldo',()=>{assert.equal(summary({openingBalance:0,nextPlayer:0,rounds:[{...round,prize:65.5}],withdrawals:[{date:'2026-09-07',amount:10,reason:'Reparto'}]}).balance,55.5)});
test('Un doble cubierto no garantiza el acierto de la columna reducida',()=>{const r=results({...round,columns:['X'.repeat(5)+'1'.repeat(9)]});assert.equal(r.covered,14);assert.equal(r.best,9);assert.equal(results(round).best,null)});
test('Partidos pendientes no cuentan como fallos',()=>{const r=results({...round,matches:matches.map((m,i)=>({...m,result:i===0?'2':null}))});assert.equal(r.errors,1);assert.equal(r.played,1);assert.equal(r.complete,false);assert.equal(r.best,null)});
