// Resolution-independent artwork: all icons remain sharp on high-DPI and 4K displays.
export function icon(name,cls=''){
 const paths={
  voice:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/>',
  dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>',
  house:'<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/>',
  hotel:'<path d="M4 21V5h16v16M8 5V2h8v3M2 21h20M9 21v-5h6v5M8 9h1m6 0h1M8 12h1m6 0h1"/>',
  trade:'<path d="M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4"/>',
  book:'<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  station:'<rect x="6" y="2" width="12" height="17" rx="4"/><path d="M6 10h12M9 19l-3 3m9-3 3 3M10 5h4"/><circle cx="9" cy="15" r=".7"/><circle cx="15" cy="15" r=".7"/>',
  utility:'<path d="m14 2-9 12h7l-2 8 9-12h-7l2-8Z"/>',
  water:'<path d="M12 2C10 6 5 11 5 15a7 7 0 0 0 14 0c0-4-5-9-7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
  chest:'<path d="M3 11h18v9H3zm1 0V7c0-3 16-3 16 0v4M9 4v7m6-7v7"/><rect x="10" y="10" width="4" height="5" rx="1"/>',
  chance:'<path d="M8 7a4 4 0 1 1 6 3.5c-2 1-2 2-2 4M12 19v.1"/>',
  bank:'<path d="m2 8 10-6 10 6H2Zm3 3v8m5-8v8m4-8v8m5-8v8M2 22h20M3 19h18"/>',
  tax:'<path d="M5 2h14v20l-3-2-4 2-4-2-3 2V2Zm3 5h8M8 11h8M8 15h4"/>',
  jail:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 3v18m8-18v18M3 9h18m-18 6h18"/>',
  gotojail:'<path d="M3 7h10a6 6 0 0 1 0 12H9M7 3 3 7l4 4M9 15v7m4-7v7m4-8v7"/>',
  parking:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
  go:'<path d="M21 12H3m7-7-7 7 7 7M19 5h2v14h-2"/>',
  landmark:'<path d="M3 20h18M5 20V9h14v11M3 9l9-7 9 7M9 20v-7h6v7"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  layers:'<path d="m12 2 10 6-10 6L2 8l10-6Zm-10 11 10 6 10-6M2 18l10 6 10-6"/>',
  fullscreen:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9 8a3 3 0 1 1 4 3c-1 .5-1 1-1 3M12 18v.1"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  save:'<path d="M4 3h13l4 4v14H3V3h1Zm3 0v6h10V3M7 21v-8h10v8"/>',
  lock:'<rect x="4" y="10" width="16" height="12" rx="3"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v3"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  plus:'<path d="M12 4v16M4 12h16"/>',minus:'<path d="M4 12h16"/>',
  crown:'<path d="m3 7 4 4 5-8 5 8 4-4-2 13H5L3 7ZM6 16h12"/>',
  history:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-5v6l4 2"/>'
 };
 return `<svg class="ui-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.landmark}</svg>`;
}
export function tokenArt(i){
 const a=[
  '<path d="m18 13 2-8 4 5 4-5 2 8" fill="#e9bf7c"/><path d="M24 12c-13-7-20 6-16 18 3 10 14 15 20 12 18-7 17-29-4-30Z" fill="currentColor"/><path d="M16 20c-4 5-3 10 0 14" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/><circle cx="28" cy="29" r="8" fill="#210d12" fill-opacity=".18"/><path d="m25 24 2 2m4 1 1 2m-8 2 2 2m4 0 1 1" stroke="#fbd7bd" stroke-width="2" stroke-linecap="round"/>',
  '<path d="M24 14c-13-8-22 3-18 16 4 14 21 17 30 7 11-14 2-28-12-23Z" fill="currentColor"/><path d="M24 15c3 9 3 18 0 25" fill="none" stroke="#b86628" stroke-opacity=".4" stroke-width="1.5"/><path d="M24 13c3-10 12-10 15-8-2 8-7 11-15 8Z" fill="#78a277"/><path d="M24 14v-5" stroke="#997049" stroke-width="2"/><path d="M13 21c-4 4-3 9-1 12" fill="none" stroke="#fff2cb" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>',
  '<path d="M2 39 20 7l14 24 5-10 9 18H2Z" fill="currentColor"/><path d="m20 7-8 14 7-3 5 5 3-4-7-12Z" fill="#ecf2e9"/><path d="M20 7v32H2L20 7Z" fill="#122e2d" fill-opacity=".16"/><path d="m39 21-4 9 4-2 4 3-4-10Z" fill="#ecf2e9"/>',
  '<g transform="rotate(27 24 24)"><rect x="18" y="6" width="12" height="36" rx="4" fill="currentColor"/><path d="M20 6V2h8v4M19 37h10" fill="none" stroke="#e7bf7d" stroke-width="2.5"/><path d="M22 11v21" stroke="#fff" stroke-opacity=".24" stroke-width="2"/><g fill="#ddbb80"><circle cx="25" cy="14" r="1.5"/><circle cx="25" cy="20" r="1.5"/><circle cx="25" cy="26" r="1.5"/><circle cx="25" cy="32" r="1.5"/></g></g>'
 ,'<rect x="13" y="5" width="22" height="36" rx="5" fill="currentColor"/><path d="M24 11v21m-7-14h14" stroke="#f0dfbd" stroke-width="3"/><circle cx="24" cy="35" r="4" fill="none" stroke="#d3b578" stroke-width="2"/><path d="M9 42h30" stroke="#d3b578" stroke-width="4"/>'
 ,'<path d="M10 7h28v34H10z" fill="currentColor"/><path d="M14 11h20v26H14z" fill="none" stroke="#d9b675" stroke-width="2"/><path d="m24 15 7 9-7 9-7-9z" fill="#efdec0"/><path d="m24 20 3 4-3 4-3-4z" fill="currentColor"/><path d="M12 42v4m6-4v4m6-4v4m6-4v4m6-4v4" stroke="#dac594" stroke-width="2"/>'
 ,'<ellipse cx="24" cy="29" rx="20" ry="13" fill="#b97c3f"/><ellipse cx="24" cy="25" rx="20" ry="14" fill="#e0ad66"/><path d="m10 22 25 11M14 16l25 11M9 28l18 8M13 31l17-15M21 35l17-15M8 26l13-12" stroke="#b0783e" stroke-width="1.3"/><circle cx="24" cy="25" r="4" fill="#efd19b"/>'
 ,'<path d="M13 38h23l-4-5-5-1c-3-4 1-8 5-13 4-7-1-12-4-15l-4 4-6 1-8 10 4 6 8-6-4 14-5 5Z" fill="currentColor"/><circle cx="26" cy="13" r="1.6" fill="#f4e6c9"/><path d="M12 42h26M27 7l7 4m-5 2 6 3m-5 2 4 3" stroke="#d2b57d" stroke-width="2"/>'

 ];
 return `<svg class="token-art" viewBox="0 0 48 48" aria-hidden="true">${a[i]||a[0]}</svg>`;
}
export function cityArt(prefix='city'){
 return `<svg class="city-art" viewBox="0 0 1000 450" fill="none" aria-hidden="true"><defs><linearGradient id="${prefix}-mountain" x1="500" y1="60" x2="500" y2="320" gradientUnits="userSpaceOnUse"><stop stop-color="#718b83"/><stop offset="1" stop-color="#b8c3a7"/></linearGradient><linearGradient id="${prefix}-stone" x1="500" y1="210" x2="500" y2="400" gradientUnits="userSpaceOnUse"><stop stop-color="#deb69a"/><stop offset="1" stop-color="#b7816a"/></linearGradient></defs>
 <circle cx="529" cy="135" r="95" fill="#d1b27c" opacity=".08"/><circle cx="529" cy="135" r="121" stroke="#bea477" stroke-opacity=".18" stroke-dasharray="2 9"/>
 <path d="m110 299 305-226 173 172 96-89 205 143H110Z" fill="url(#${prefix}-mountain)" opacity=".8"/><path d="m415 73-85 63 51-12 18 20 23-17 38 14-45-68Z" fill="#eef0e1"/><path d="m684 156-36 34 25-7 16 12 15-8-20-31Z" fill="#eef0e1" opacity=".8"/><path d="m415 73 38 226H110L415 73Z" fill="#375c54" opacity=".08"/>
 <path d="M69 362h862" stroke="#8e9b82" opacity=".4"/>
 <g fill="url(#${prefix}-stone)"><path d="M340 289c0-56 320-56 320 0v66H340v-66Z"/><path d="M325 348h350v17H325zM350 267c26-41 274-41 300 0H350Z"/><path d="M376 240c25-20 223-20 248 0H376Z"/></g><g stroke="#775b4b" stroke-opacity=".45" stroke-width="5">${Array.from({length:18},(_,i)=>`<path d="M${354+i*17.3} 290v52"/>`).join('')}</g><path d="M345 281h310M357 272h286M384 243h232" stroke="#f7d5b4" stroke-width="3"/>
 <g fill="#b78269"><path d="M80 354h210v12H80zM94 340h182v14H94zM108 325h154v15H108zM122 309h126v16H122zM136 293h98v16h-98zM150 276h70v17h-70z"/></g><g stroke="#e9c8a4" stroke-width="2"><path d="M94 340h182M108 325h154M122 309h126M136 293h98M150 276h70"/><path d="M183 280v74"/></g><path d="M147 274v-28h8v28m62 0v-28h8v28" stroke="#c5a371" stroke-width="3"/>
 <g fill="#c5977a"><path d="M708 293h62v69h-62zM782 270h61v92h-61zM855 309h60v53h-60z"/></g><g fill="#a8735e"><path d="M700 286h78v10h-78zM775 261h74v11h-74zM848 302h74v10h-74z"/></g><g fill="#6c7462" opacity=".6">${[718,737,756,793,812,831,864,884,903].map(x=>`<path d="M${x} 316h7v15h-7zM${x} 340h7v13h-7z"/>`).join('')}</g>
 <g fill="#749078"><path d="M53 356c-26-11-18-42-2-51 15 11 29 35 2 51Zm891 0c-26-11-18-42-2-51 15 11 29 35 2 51Z"/></g><path d="M52 337v30m891-30v30" stroke="#8e775c" stroke-width="3"/>
 <ellipse cx="500" cy="387" rx="122" ry="16" fill="#839d95" opacity=".16"/><ellipse cx="500" cy="385" rx="88" ry="11" stroke="#839d95" stroke-opacity=".4"/><path d="M500 380v-24m0 24c-12-32-30-22-30-22m30 22c12-32 30-22 30-22" stroke="#95b9b0" stroke-width="2"/>
 <path d="M185 395h92m438 0h92" stroke="#ac9468" opacity=".45"/><path d="m289 390 5 5-5 5-5-5 5-5Zm420 0 5 5-5 5-5-5 5-5Z" fill="#ac9468" opacity=".6"/>
 </svg>`;
}
