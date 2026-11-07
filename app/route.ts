import html from '../public/game/index.html?raw';
export function GET(){return new Response(html.replace('href="./style.css"','href="/game/style.css"').replace('src="./app.js"','src="/game/app.js"'),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}});}
