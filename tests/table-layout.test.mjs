import test from 'node:test';
import assert from 'node:assert/strict';
import {fitTableSplit} from '../public/game/table-layout.js';
test('split conserves space while protecting a usable board and table panel',()=>{for(const height of [200,400,650,900,1600])for(const drag of [-500,0,100,300,2000]){const s=fitTableSplit(height,drag,40);assert.equal(s.tray+s.board,height);assert.ok(s.tray>=s.min&&s.tray<=s.max);assert.ok(s.board>=Math.min(240,height*.55));assert.ok(s.tray>=Math.min(145,height-Math.min(240,height*.55)));}});
test('maximizing leaves table tabs visible and returns space to the board',()=>{const normal=fitTableSplit(800,250,40),full=fitTableSplit(800,250,40,true);assert.equal(full.tray,42);assert.equal(full.board,758);assert.ok(full.board>normal.board);});
