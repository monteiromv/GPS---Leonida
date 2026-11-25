(() => {
  const DATA = window.LEONIDA_MAP_DATA;
  if (!DATA || typeof L === 'undefined') {
    console.error('LEONIDA_MAP_DATA ou Leaflet não encontrado.');
    return;
  }

  // Inline SVG paths for all category & subcategory icons
  const ICONS = {
    banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    bird: '<path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/><path d="m20 7 2 .5-2 .5"/><path d="M10 18v3"/><path d="M14 17.75V21"/><path d="M7 18a6 6 0 0 0 3.84-10.61"/>',
    'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    brush: '<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
    'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    'car-front': '<path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>',
    'chevrons-down': '<path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/>',
    circle: '<circle cx="12" cy="12" r="10"/>',
    'circle-dot': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    crosshair: '<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>',
    droplets: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
    dumbbell: '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
    fan: '<path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"/><path d="M12 12v.01"/>',
    fish: '<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M18 12v.5"/><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86"/><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"/><path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4"/><path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    'flag-triangle-right': '<path d="M7 22V2l10 5-10 5"/>',
    focus: '<circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>',
    footprints: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>',
    fuel: '<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>',
    'gamepad-2': '<line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    hammer: '<path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    'key-round': '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
    landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    'list-checks': '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    'lock-keyhole': '<circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>',
    'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    martini: '<path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8Z"/>',
    'music-2': '<circle cx="8" cy="18" r="4"/><path d="M12 18V2l7 4"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',
    'paw-print': '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    pistol: '<path fill="currentColor" stroke="none" d="M3 6h16l1 2-1.5 2H13l-.8 3H9.5l-1.2 5H4.2l1.6-7.2L3 10.5V6Zm10.5 4.2v2.1h1.7l.6-2.1h-2.3Z"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    sandwich: '<path d="m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777"/><path d="M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25"/><path d="M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9"/><path d="m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2"/><rect width="20" height="4" x="2" y="11" rx="1"/>',
    'scan-line': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
    'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    spade: '<path d="M5 9c-1.5 1.5-3 3.2-3 5.5A5.5 5.5 0 0 0 7.5 20c1.8 0 3-.5 4.5-2 1.5 1.5 2.7 2 4.5 2a5.5 5.5 0 0 0 5.5-5.5c0-2.3-1.5-4-3-5.5l-7-7-7 7Z"/><path d="M12 18v4"/>',
    sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
    'spray-can': '<path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14 8-2"/><path d="m13 19 8-2"/>',
    store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    swords: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'tree-palm': '<path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3"/><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"/><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14"/>',
    trees: '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
    warehouse: '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><rect width="12" height="12" x="6" y="10"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
  };

  function catIconName(cat, fallback) {
    if (!cat) return fallback || 'map-pin';
    if (cat.slug === 'ammunation' || cat.id === 269) return 'pistol';
    return cat.icon || fallback || 'map-pin';
  }

  function catColor(cat, fallback) {
    if (!cat) return fallback || '#3b82f6';
    if (cat.id === 176 || cat.parent === 176) return '#06b6d4';
    return cat.color || fallback || '#3b82f6';
  }

  function iconSvg(name) {
    const path = ICONS[name] || ICONS['map-pin'];
    return `<svg viewBox="0 0 24 24">${path}</svg>`;
  }

  // Exact game-to-Leaflet CRS.Simple coordinate mapping (16384x16384 HD tile space)
  const GAME_BOUNDS = { minX: -4000, maxX: 4500, minY: -4000, maxY: 8200 };
  const IMG_SIZE = 16384;
  const SCALE_FACTOR = IMG_SIZE / 256; // 64

  function worldToLatLng(x, y) {
    const px = ((x - GAME_BOUNDS.minX) / (GAME_BOUNDS.maxX - GAME_BOUNDS.minX)) * IMG_SIZE;
    const py = (1 - (y - GAME_BOUNDS.minY) / (GAME_BOUNDS.maxY - GAME_BOUNDS.minY)) * IMG_SIZE;
    return L.latLng(-py / SCALE_FACTOR, px / SCALE_FACTOR);
  }

  function latLngToWorld(latlng) {
    const px = latlng.lng * SCALE_FACTOR;
    const py = -latlng.lat * SCALE_FACTOR;
    return {
      x: Math.round(GAME_BOUNDS.minX + (px / IMG_SIZE) * (GAME_BOUNDS.maxX - GAME_BOUNDS.minX)),
      y: Math.round(GAME_BOUNDS.minY + (1 - py / IMG_SIZE) * (GAME_BOUNDS.maxY - GAME_BOUNDS.minY))
    };
  }

  // Index categories & regions
  const parentCategories = DATA.categories.filter(c => !c.parent);
  const subCategories = DATA.categories.filter(c => c.parent);
  const catById = new Map(DATA.categories.map(c => [c.id, c]));
  const regionById = new Map(DATA.regions.map(r => [r.id, r]));

  const catCounts = new Map();
  const subCatCounts = new Map();
  const regionCounts = new Map();
  DATA.pois.forEach(p => {
    catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1);
    subCatCounts.set(p.subcategory, (subCatCounts.get(p.subcategory) || 0) + 1);
    regionCounts.set(p.region, (regionCounts.get(p.region) || 0) + 1);
  });

  // Persistent state
  const STORAGE_FOUND = 'leonidaverse_clone_found_v1';
  const STORAGE_CUSTOM = 'leonidaverse_clone_custom_v1';
  const STORAGE_ACHIEVEMENTS = 'leonida_achievements_v1';
  const STORAGE_THEME = 'leonida-theme';
  const STORAGE_LANG = 'leonida-lang';
  const STORAGE_USERS = 'leonida_users_v1';
  const STORAGE_SESSION = 'leonida_active_user_v1';

  const I18N = window.LEONIDA_I18N || {};
  let currentLang = localStorage.getItem(STORAGE_LANG) || 'PT';
  if (!I18N[currentLang]) currentLang = 'PT';

  function t(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.PT && I18N.PT[key]) || key;
  }

  function catLabel(cat) {
    if (!cat) return '';
    const translated = I18N[currentLang] && I18N[currentLang].cats && I18N[currentLang].cats[cat.slug];
    return translated || cat.name;
  }

  function getUsersMap() {
    try { return JSON.parse(localStorage.getItem(STORAGE_USERS) || '{}'); } catch { return {}; }
  }
  function saveUsersMap(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }

  let activeUser = localStorage.getItem(STORAGE_SESSION);
  if (activeUser) activeUser = activeUser.toLowerCase();
  let foundSet = new Set();
  let customPois = [];
  let achievementsSet = new Set();

  function loadActiveProgress() {
    const users = getUsersMap();
    if (activeUser && users[activeUser]) {
      foundSet = new Set(users[activeUser].found || []);
      customPois = users[activeUser].customPois || [];
      achievementsSet = new Set(users[activeUser].achievements || []);
    } else {
      activeUser = null;
      foundSet = new Set(JSON.parse(localStorage.getItem(STORAGE_FOUND) || '[]'));
      customPois = JSON.parse(localStorage.getItem(STORAGE_CUSTOM) || '[]');
      achievementsSet = new Set(JSON.parse(localStorage.getItem(STORAGE_ACHIEVEMENTS) || '[]'));
    }
  }

  function saveActiveProgress() {
    if (activeUser) {
      const users = getUsersMap();
      if (users[activeUser]) {
        users[activeUser].found = [...foundSet];
        users[activeUser].customPois = customPois;
        users[activeUser].achievements = [...achievementsSet];
        saveUsersMap(users);
        return;
      }
    }
    localStorage.setItem(STORAGE_FOUND, JSON.stringify([...foundSet]));
    localStorage.setItem(STORAGE_CUSTOM, JSON.stringify(customPois));
    localStorage.setItem(STORAGE_ACHIEVEMENTS, JSON.stringify([...achievementsSet]));
  }

  loadActiveProgress();

  const state = {
    activeSubcategories: new Set(),
    collapsedCategories: new Set(),
    activeRegion: null,
    hideFound: false,
    showBorders: true,
    addPinMode: false,
    selectedPoi: null
  };

  // DOM Elements
  const mapViewport = document.getElementById('mapViewport');
  const mapStage = document.getElementById('mapStage');
  const categoryGrid = document.getElementById('categoryGrid');
  const regionPills = document.getElementById('regionPills');
  const visibleCountLabel = document.getElementById('visibleCountLabel');
  const foundCountLabel = document.getElementById('foundCountLabel');
  const coordsReadout = document.getElementById('coordsReadout');
  const mapSearchInput = document.getElementById('mapSearchInput');
  const searchDropdown = document.getElementById('searchDropdown');
  const poiPopup = document.getElementById('poiPopup');
  const poiPopupTitle = document.getElementById('poiPopupTitle');
  const poiPopupBadges = document.getElementById('poiPopupBadges');
  const poiPopupCoords = document.getElementById('poiPopupCoords');
  const toggleFoundBtn = document.getElementById('toggleFoundBtn');

  // --- Initialize Leaflet Map (CRS.Simple) ---
  const mapBounds = L.latLngBounds([-256, 0], [0, 256]);
  const map = L.map(mapStage, {
    crs: L.CRS.Simple,
    minZoom: 1.5,
    maxZoom: 7.32,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    zoomControl: false,
    attributionControl: false,
    maxBounds: [[-290, -40], [34, 296]],
    maxBoundsViscosity: 0.85
  });

  // High-res 16384x16384 HD tile layer (TMS bottom-up Y)
  const HDTileLayer = L.TileLayer.extend({
    getTileUrl(coords) {
      const y = Math.pow(2, coords.z) - 1 - coords.y;
      return `https://tiles.leonidaverse.com/leonida/rockstar-carte-hd/${coords.z}/${coords.x}/${y}.png`;
    }
  });

  new HDTileLayer('', {
    tileSize: 256,
    minNativeZoom: 2,
    maxNativeZoom: 6,
    minZoom: 1.5,
    maxZoom: 7.32,
    bounds: mapBounds,
    noWrap: true,
    keepBuffer: 2,
    updateWhenIdle: true,
    zIndex: 2
  }).addTo(map);

  const regionsLayer = L.layerGroup().addTo(map);
  const markersLayer = L.layerGroup().addTo(map);

  function resetView(animate = true) {
    const islandBounds = L.latLngBounds(
      worldToLatLng(-2450, -3150),
      worldToLatLng(3250, 7600)
    );
    map.fitBounds(islandBounds, {
      paddingTopLeft: [16, 16],
      paddingBottomRight: [16, 16],
      animate
    });
  }

  function flyToWorld(x, y, targetZoom = 5) {
    const ll = worldToLatLng(x, y);
    map.flyTo(ll, Math.max(map.getZoom(), targetZoom), { duration: 0.55 });
  }

  // Track coordinates & re-render visible markers on pan/zoom
  map.on('mousemove', e => {
    if (!coordsReadout) return;
    const w = latLngToWorld(e.latlng);
    coordsReadout.textContent = `X: ${w.x} · Y: ${w.y}`;
  });

  let renderRafId = null;
  function scheduleRenderMarkers() {
    if (renderRafId) cancelAnimationFrame(renderRafId);
    renderRafId = requestAnimationFrame(() => {
      renderRafId = null;
      renderMarkers();
    });
  }

  map.on('moveend zoomend', scheduleRenderMarkers);

  map.on('click', e => {
    if (!state.addPinMode) return;
    const { x, y } = latLngToWorld(e.latlng);
    const title = prompt('Nome do novo marcador em Leonida:', 'Minha descoberta');
    if (title && title.trim()) {
      const newPin = {
        slug: 'custom-' + Date.now(),
        title: title.trim(),
        x,
        y,
        region: state.activeRegion || 1,
        category: 291,
        subcategory: 300,
        custom: true
      };
      customPois.push(newPin);
      localStorage.setItem(STORAGE_CUSTOM, JSON.stringify(customPois));
      state.addPinMode = false;
      document.getElementById('addPinModeBtn').classList.remove('active');
      mapStage.style.cursor = '';
      renderMarkers();
      openPoiPopup(newPin);
    }
  });

  // Top-right map controls
  document.getElementById('zoomInBtn').addEventListener('click', () => map.zoomIn(0.5));
  document.getElementById('zoomOutBtn').addEventListener('click', () => map.zoomOut(0.5));
  document.getElementById('resetViewBtn').addEventListener('click', () => resetView(true));
  const mapWorkspace = document.querySelector('.map-workspace');
  document.getElementById('fullscreenBtn').addEventListener('click', () => {
    mapViewport.classList.toggle('is-fullscreen');
    if (mapWorkspace) mapWorkspace.classList.toggle('is-fullscreen');
    setTimeout(() => map.invalidateSize(), 80);
  });

  // --- Filter Sidebar ---
  function renderFilters() {
    categoryGrid.innerHTML = '';

    // Compute found counts per category & subcategory
    const catFound = new Map();
    const subFound = new Map();
    DATA.pois.forEach(p => {
      if (foundSet.has(p.slug)) {
        catFound.set(p.category, (catFound.get(p.category) || 0) + 1);
        subFound.set(p.subcategory, (subFound.get(p.subcategory) || 0) + 1);
      }
    });

    parentCategories.forEach(cat => {
      const subs = subCategories.filter(s => (subCatCounts.get(s.id) || 0) > 0 && s.parent === cat.id);
      const activeCount = subs.filter(s => state.activeSubcategories.has(s.id)).length;
      const allSelected = subs.length > 0 && activeCount === subs.length;
      const isPartial = activeCount > 0 && activeCount < subs.length;
      const isCollapsed = state.collapsedCategories.has(cat.id);

      const group = document.createElement('div');
      group.className = 'cat-group'
        + (activeCount > 0 ? ' has-active' : '')
        + (isCollapsed ? ' is-collapsed' : '');

      const headRow = document.createElement('div');
      headRow.className = 'cat-head-row';

      const accBtn = document.createElement('button');
      accBtn.type = 'button';
      accBtn.className = 'cat-accordion-btn';
      accBtn.innerHTML = `
        <svg class="cat-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
        <span class="cat-name">${catLabel(cat)}</span>
      `;
      accBtn.addEventListener('click', () => {
        if (state.collapsedCategories.has(cat.id)) {
          state.collapsedCategories.delete(cat.id);
        } else {
          state.collapsedCategories.add(cat.id);
        }
        renderFilters();
      });

      const headRight = document.createElement('div');
      headRight.className = 'cat-head-right';

      const countSpan = document.createElement('span');
      countSpan.className = 'cat-count';
      countSpan.textContent = `${catFound.get(cat.id) || 0}/${catCounts.get(cat.id) || 0}`;

      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'cat-checkbox'
        + (allSelected ? ' checked' : '')
        + (isPartial ? ' partial' : '');
      checkBtn.setAttribute('aria-label', catLabel(cat));
      if (allSelected) {
        checkBtn.innerHTML = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
      } else if (isPartial) {
        checkBtn.innerHTML = '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>';
      }
      checkBtn.addEventListener('click', () => {
        if (allSelected || activeCount > 0) {
          subs.forEach(s => state.activeSubcategories.delete(s.id));
        } else {
          subs.forEach(s => state.activeSubcategories.add(s.id));
        }
        renderFilters();
        renderMarkers();
      });

      headRight.appendChild(countSpan);
      headRight.appendChild(checkBtn);
      headRow.appendChild(accBtn);
      headRow.appendChild(headRight);
      group.appendChild(headRow);

      if (subs.length) {
        const subList = document.createElement('div');
        subList.className = 'cat-sub-list';
        subs.forEach(s => {
          const isSubOn = state.activeSubcategories.has(s.id);
          const sRow = document.createElement('button');
          sRow.type = 'button';
          sRow.className = 'subcat-row' + (isSubOn ? ' active' : '');
          sRow.innerHTML = `
            <span class="subcat-left">
              <span class="subcat-icon" style="color:${catColor(s, cat.color)}">${iconSvg(catIconName(s, cat.icon))}</span>
              <span class="subcat-label">${catLabel(s)}</span>
            </span>
            <span class="subcat-ratio">${subFound.get(s.id) || 0}/${subCatCounts.get(s.id) || 0}</span>
          `;
          sRow.addEventListener('click', () => {
            if (state.activeSubcategories.has(s.id)) {
              state.activeSubcategories.delete(s.id);
            } else {
              state.activeSubcategories.add(s.id);
            }
            renderFilters();
            renderMarkers();
          });
          subList.appendChild(sRow);
        });
        group.appendChild(subList);
      }

      categoryGrid.appendChild(group);
    });

    regionPills.innerHTML = '';
    const allPill = document.createElement('button');
    allPill.type = 'button';
    allPill.className = 'region-pill' + (state.activeRegion === null ? ' active' : '');
    allPill.textContent = t('allLeonida');
    allPill.addEventListener('click', () => selectRegion(null));
    regionPills.appendChild(allPill);

    DATA.regions.forEach(reg => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'region-pill' + (state.activeRegion === reg.id ? ' active' : '');
      pill.innerHTML = `<span class="region-dot" style="background:${reg.color}"></span><span>${reg.name}</span>`;
      pill.addEventListener('click', () => selectRegion(reg.id));
      regionPills.appendChild(pill);
    });
  }

  function selectRegion(regionId) {
    state.activeRegion = regionId;
    renderFilters();
    renderRegionPolygons();
    renderMarkers();
    if (regionId !== null) {
      const reg = regionById.get(regionId);
      if (reg && reg.center) {
        flyToWorld(reg.center[0], reg.center[1], 3.75);
      }
    } else {
      resetView(true);
    }
  }

  document.getElementById('showAllCatsBtn').addEventListener('click', () => {
    subCategories.forEach(s => state.activeSubcategories.add(s.id));
    renderFilters();
    renderMarkers();
  });

  document.getElementById('hideAllCatsBtn').addEventListener('click', () => {
    state.activeSubcategories.clear();
    renderFilters();
    renderMarkers();
  });

  // --- Region Polygon Overlay ---
  function renderRegionPolygons() {
    regionsLayer.clearLayers();
    if (!state.showBorders) return;

    DATA.regions.forEach(reg => {
      if (!reg.polygon || !reg.polygon.length) return;
      const isSelected = state.activeRegion === reg.id;
      if (state.activeRegion !== null && !isSelected) return;

      const latlngs = reg.polygon.map(([px, py]) => worldToLatLng(px, py));
      L.polygon(latlngs, {
        color: reg.color,
        weight: isSelected ? 2.5 : 1.2,
        opacity: isSelected ? 0.9 : 0.38,
        dashArray: isSelected ? null : '5 4',
        fillColor: reg.color,
        fillOpacity: isSelected ? 0.14 : 0.04,
        interactive: false
      }).addTo(regionsLayer);
    });
  }

  // --- Filtered POIs & Markers ---
  function getFilteredPois() {
    const all = customPois.length ? DATA.pois.concat(customPois) : DATA.pois;
    return all.filter(p => {
      if (!p.custom && !state.activeSubcategories.has(p.subcategory)) return false;
      if (state.activeRegion !== null && p.region !== state.activeRegion) return false;
      if (state.hideFound && foundSet.has(p.slug)) return false;
      return true;
    });
  }

  // Pre-compute LatLngs and reuse marker instances across pan/zoom
  DATA.pois.forEach(p => { p._ll = worldToLatLng(p.x, p.y); });
  const markerPool = new Map();
  const activeMarkers = new Set();

  function buildMarkerIcon(p, isFound, isSelected) {
    const cat = catById.get(p.subcategory) || catById.get(p.category);
    const color = p.custom ? '#ff3b8e' : catColor(cat);
    const icon = p.custom ? 'star' : catIconName(cat);
    return L.divIcon({
      className: 'poi-marker-wrap',
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      html: `<div class="poi-marker${isFound ? ' is-found' : ''}${isSelected ? ' is-selected' : ''}" style="background-color:${color}" title="${p.title.replace(/"/g, '&quot;')}">${iconSvg(icon)}</div>`
    });
  }

  function renderMarkers() {
    if (!map._loaded) return;
    const filtered = getFilteredPois();
    visibleCountLabel.textContent = `${filtered.length.toLocaleString('pt-BR')} ${t('visibleLabel')}`;
    foundCountLabel.textContent = `${foundSet.size.toLocaleString('pt-BR')} ${t('foundLabel')}`;

    const viewBounds = map.getBounds().pad(0.15);
    const inView = filtered.filter(p => {
      if (!p._ll) p._ll = worldToLatLng(p.x, p.y);
      return viewBounds.contains(p._ll);
    });

    // Keep DOM responsive at low zoom
    const zoom = map.getZoom();
    let toRender = inView;
    if (zoom < 3.5 && inView.length > 320) {
      const step = Math.ceil(inView.length / 320);
      toRender = inView.filter((_, idx) => idx % step === 0);
    }

    const nextSlugs = new Set(toRender.map(p => p.slug));

    // Remove markers that left view or filter
    activeMarkers.forEach(slug => {
      if (!nextSlugs.has(slug)) {
        const entry = markerPool.get(slug);
        if (entry) markersLayer.removeLayer(entry.marker);
        activeMarkers.delete(slug);
      }
    });

    // Add or update only changed markers
    toRender.forEach(p => {
      const isFound = foundSet.has(p.slug);
      const isSelected = Boolean(state.selectedPoi && state.selectedPoi.slug === p.slug);
      let entry = markerPool.get(p.slug);

      if (!entry) {
        const marker = L.marker(p._ll, { icon: buildMarkerIcon(p, isFound, isSelected) });
        marker.on('click', () => openPoiPopup(p));
        entry = { marker, isFound, isSelected };
        markerPool.set(p.slug, entry);
      } else if (entry.isFound !== isFound || entry.isSelected !== isSelected) {
        entry.marker.setIcon(buildMarkerIcon(p, isFound, isSelected));
        entry.isFound = isFound;
        entry.isSelected = isSelected;
      }

      if (!activeMarkers.has(p.slug)) {
        entry.marker.addTo(markersLayer);
        activeMarkers.add(p.slug);
      }
    });
  }

  // --- POI Popup ---
  function openPoiPopup(poi) {
    state.selectedPoi = poi;
    poiPopupTitle.textContent = poi.title;
    const reg = regionById.get(poi.region);
    const parentCat = catById.get(poi.category);
    const subCat = catById.get(poi.subcategory);

    poiPopupBadges.innerHTML = `
      ${parentCat ? `<span class="poi-badge" style="color:${catColor(parentCat)}">${catLabel(parentCat)}</span>` : ''}
      ${subCat ? `<span class="poi-badge">${catLabel(subCat)}</span>` : ''}
      ${reg ? `<span class="poi-badge"><span class="region-dot" style="background:${reg.color}"></span>${reg.name}</span>` : ''}
    `;
    poiPopupCoords.textContent = `${t('coordsPrefix')}: X ${poi.x} · Y ${poi.y}`;

    const isFound = foundSet.has(poi.slug);
    toggleFoundBtn.textContent = isFound ? t('markedFound') : t('markFound');
    toggleFoundBtn.classList.toggle('is-found', isFound);

    poiPopup.classList.add('open');
    renderMarkers();
  }

  document.getElementById('closePopupBtn').addEventListener('click', () => {
    state.selectedPoi = null;
    poiPopup.classList.remove('open');
    renderMarkers();
  });

  toggleFoundBtn.addEventListener('click', () => {
    if (!state.selectedPoi) return;
    const slug = state.selectedPoi.slug;
    if (foundSet.has(slug)) {
      foundSet.delete(slug);
    } else {
      foundSet.add(slug);
    }
    saveActiveProgress();
    renderFilters();
    openPoiPopup(state.selectedPoi);
  });

  document.getElementById('zoomToPoiBtn').addEventListener('click', () => {
    if (!state.selectedPoi) return;
    flyToWorld(state.selectedPoi.x, state.selectedPoi.y, 6);
  });

  // --- Search & Smart Query ---
  function runSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      searchDropdown.classList.remove('open');
      return;
    }

    const terms = q
      .replace(/onde|encontro|achar|tem|em|no|na|à|noite|de|do|da|os|as/g, ' ')
      .split(/\s+/)
      .filter(t => t.length >= 2);

    const pool = customPois.length ? DATA.pois.concat(customPois) : DATA.pois;
    const matches = pool.filter(p => {
      const title = p.title.toLowerCase();
      const sub = (catById.get(p.subcategory)?.name || '').toLowerCase();
      const cat = (catById.get(p.category)?.name || '').toLowerCase();
      const reg = (regionById.get(p.region)?.name || '').toLowerCase();
      const hay = `${title} ${sub} ${cat} ${reg}`;
      if (q.includes('supercarro') || q.includes('carro') || q.includes('veículo')) {
        if (p.category === 175) return true;
      }
      return terms.length ? terms.every(t => hay.includes(t)) : hay.includes(q);
    }).slice(0, 18);

    if (!matches.length) {
      searchDropdown.innerHTML = `<div style="padding:12px;font-size:0.84rem;color:var(--rs-text-3);">Nenhum local encontrado para "${query}".</div>`;
      searchDropdown.classList.add('open');
      return;
    }

    searchDropdown.innerHTML = '';
    matches.forEach(p => {
      const cat = catById.get(p.subcategory) || catById.get(p.category);
      const reg = regionById.get(p.region);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-result-item';
      btn.innerHTML = `
        <span class="cat-icon-badge" style="background:${cat?.color || '#3b82f6'}22;color:${cat?.color || '#3b82f6'}">
          ${iconSvg(cat?.icon || 'map-pin')}
        </span>
        <span style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:0.84rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</div>
          <div style="font-size:0.72rem;color:var(--rs-text-3);">${cat?.name || ''} · ${reg?.name || ''}</div>
        </span>
      `;
      btn.addEventListener('click', () => {
        searchDropdown.classList.remove('open');
        state.activeSubcategories.add(p.subcategory);
        state.activeRegion = null;
        renderFilters();
        flyToWorld(p.x, p.y, 5.5);
        openPoiPopup(p);
      });
      searchDropdown.appendChild(btn);
    });
    searchDropdown.classList.add('open');
  }

  if (mapSearchInput && searchDropdown) {
    mapSearchInput.addEventListener('input', e => runSearch(e.target.value));
    mapSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') searchDropdown.classList.remove('open');
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.map-search-wrap')) searchDropdown.classList.remove('open');
    });
  }

  // Search toolbar buttons
  const addPinModeBtn = document.getElementById('addPinModeBtn');
  if (addPinModeBtn) {
    addPinModeBtn.addEventListener('click', () => {
      state.addPinMode = !state.addPinMode;
      addPinModeBtn.classList.toggle('active', state.addPinMode);
      mapStage.style.cursor = state.addPinMode ? 'crosshair' : '';
    });
  }

  const toggleBordersBtn = document.getElementById('toggleBordersBtn');
  if (toggleBordersBtn) {
    toggleBordersBtn.addEventListener('click', () => {
      state.showBorders = !state.showBorders;
      toggleBordersBtn.classList.toggle('active', state.showBorders);
      renderRegionPolygons();
    });
  }

  const progressFilterBtn = document.getElementById('progressFilterBtn');
  if (progressFilterBtn) {
    progressFilterBtn.addEventListener('click', () => {
      state.hideFound = !state.hideFound;
      progressFilterBtn.classList.toggle('active', state.hideFound);
      renderMarkers();
    });
  }

  document.getElementById('mobileFilterToggle').addEventListener('click', () => {
    document.getElementById('filterPanel').classList.toggle('mobile-open');
  });

  // --- Hub Below Map ---
  function renderHub() {
    const hubRegionsList = document.getElementById('hubRegionsList');
    const hubCategoriesList = document.getElementById('hubCategoriesList');
    if (!hubRegionsList || !hubCategoriesList) return;
    hubRegionsList.innerHTML = '';
    DATA.regions.forEach(reg => {
      const li = document.createElement('li');
      li.className = 'hub-region-card';
      li.innerHTML = `
        <span class="region-dot" style="width:11px;height:11px;background:${reg.color}"></span>
        <span>${reg.name}</span>
        <span class="hub-region-count">${regionCounts.get(reg.id) || 0}</span>
      `;
      li.addEventListener('click', () => {
        document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => selectRegion(reg.id), 280);
      });
      hubRegionsList.appendChild(li);
    });

    hubCategoriesList.innerHTML = '';
    parentCategories.forEach(cat => {
      const subs = subCategories.filter(s => s.parent === cat.id);
      const wrap = document.createElement('div');
      const head = document.createElement('div');
      head.className = 'hub-cat-head';
      head.innerHTML = `
        <span style="color:${cat.color};display:inline-flex;width:18px;height:18px;">${iconSvg(cat.icon)}</span>
        <span>${cat.name}</span>
        <span style="font-weight:500;font-size:0.82rem;color:var(--rs-text-3)">${catCounts.get(cat.id) || 0}</span>
      `;
      head.addEventListener('click', () => {
        state.activeSubcategories.clear();
        subs.forEach(s => state.activeSubcategories.add(s.id));
        renderFilters();
        renderMarkers();
        document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
      });

      const subP = document.createElement('p');
      subP.className = 'hub-subcats';
      subs.forEach((s, idx) => {
        if (idx > 0) subP.appendChild(document.createTextNode(' · '));
        const span = document.createElement('span');
        span.className = 'hub-subcat-link';
        span.textContent = s.name;
        span.addEventListener('click', () => {
          state.activeSubcategories.clear();
          state.activeSubcategories.add(s.id);
          renderFilters();
          renderMarkers();
          document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
        });
        subP.appendChild(span);
      });

      wrap.appendChild(head);
      wrap.appendChild(subP);
      hubCategoriesList.appendChild(wrap);
    });

    document.querySelectorAll('[data-search]').forEach(el => {
      el.addEventListener('click', () => {
        const term = el.getAttribute('data-search');
        document.getElementById('mapa').scrollIntoView({ behavior: 'smooth' });
        mapSearchInput.value = term;
        runSearch(term);
      });
    });
  }

  // --- Theme & Language ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (localStorage.getItem(STORAGE_THEME) === 'light') {
    document.documentElement.classList.add('light');
  }
  themeToggleBtn.addEventListener('click', () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem(STORAGE_THEME, isLight ? 'light' : 'dark');
  });

  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');

  function applyLanguage(lang) {
    if (!I18N[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = t('htmlLang');
    langBtn.textContent = lang;

    langMenu.querySelectorAll('.lang-option').forEach(o => {
      o.classList.toggle('active', o.getAttribute('data-lang') === lang);
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    renderFilters();
    renderMarkers();
    renderAchievements();
    if (state.selectedPoi) {
      openPoiPopup(state.selectedPoi);
    }
  }

  langBtn.addEventListener('click', e => {
    e.stopPropagation();
    langMenu.classList.toggle('open');
  });
  document.addEventListener('click', () => langMenu.classList.remove('open'));
  langMenu.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      applyLanguage(opt.getAttribute('data-lang'));
      langMenu.classList.remove('open');
    });
  });

  // --- Auth & Progress Account ---
  const authOpenBtn = document.getElementById('authOpenBtn');
  const authNavLabel = document.getElementById('authNavLabel');
  const authModalBackdrop = document.getElementById('authModalBackdrop');
  const authCloseBtn = document.getElementById('authCloseBtn');
  const authForm = document.getElementById('authForm');
  const authUsername = document.getElementById('authUsername');
  const authPassword = document.getElementById('authPassword');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const authProfileView = document.getElementById('authProfileView');
  const authProfileAvatar = document.getElementById('authProfileAvatar');
  const authProfileName = document.getElementById('authProfileName');
  const authProfileStats = document.getElementById('authProfileStats');
  const authProgressFill = document.getElementById('authProgressFill');
  const authLogoutBtn = document.getElementById('authLogoutBtn');
  const exportSaveBtn = document.getElementById('exportSaveBtn');
  const importSaveInput = document.getElementById('importSaveInput');
  const authMasterPanel = document.getElementById('authMasterPanel');
  const authMasterList = document.getElementById('authMasterList');
  const authForgotBtn = document.getElementById('authForgotBtn');
  const authRecoverForm = document.getElementById('authRecoverForm');
  const authBackLoginBtn = document.getElementById('authBackLoginBtn');
  const recoverUsername = document.getElementById('recoverUsername');
  const recoverCode = document.getElementById('recoverCode');
  const recoverNewPass = document.getElementById('recoverNewPass');
  const recoverMsg = document.getElementById('recoverMsg');
  const authProfileRecoveryCode = document.getElementById('authProfileRecoveryCode');
  const copyRecoveryBtn = document.getElementById('copyRecoveryBtn');

  function generateRecoveryCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
    return `LEONIDA-${suffix}`;
  }

  function renderMasterPanel() {
    if (!authMasterPanel || !authMasterList) return;
    if (activeUser !== 'monteiromv') {
      authMasterPanel.hidden = true;
      return;
    }
    authMasterPanel.hidden = false;
    const users = getUsersMap();
    const keys = Object.keys(users);
    authMasterList.innerHTML = '';

    if (!keys.length) {
      authMasterList.innerHTML = '<div style="font-size:0.8rem;color:var(--rs-text-3);">Nenhuma conta criada neste navegador.</div>';
      return;
    }

    keys.forEach(k => {
      const u = users[k];
      const count = Array.isArray(u.found) ? u.found.length : 0;
      const customCount = Array.isArray(u.customPois) ? u.customPois.length : 0;
      const item = document.createElement('div');
      item.className = 'auth-master-item';
      item.innerHTML = `
        <div>
          <strong style="color:${k === 'monteiromv' ? '#00F0FF' : 'var(--rs-fg)'}">${u.displayName || k}</strong>
          <div style="font-size:0.74rem;color:var(--rs-text-3);">${count}/${DATA.pois.length} encontrados · ${customCount} pins</div>
        </div>
        ${k === 'monteiromv' ? '<span style="font-size:0.7rem;color:#4ade80;font-weight:700;">ADMIN</span>' : `<button type="button" class="auth-master-del" data-del-user="${k}">Remover</button>`}
      `;
      authMasterList.appendChild(item);
    });

    authMasterList.querySelectorAll('[data-del-user]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetKey = btn.getAttribute('data-del-user');
        const mapUsers = getUsersMap();
        delete mapUsers[targetKey];
        saveUsersMap(mapUsers);
        renderMasterPanel();
      });
    });
  }

  async function hashPass(str) {
    if (window.crypto && window.crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return String(h);
  }

  function updateAuthUI() {
    if (!authOpenBtn || !authNavLabel) return;
    const users = getUsersMap();
    const profile = activeUser && users[activeUser];
    if (activeUser && profile) {
      if (!profile.recoveryCode) {
        profile.recoveryCode = generateRecoveryCode();
        users[activeUser] = profile;
        saveUsersMap(users);
      }
      const displayName = profile.displayName || activeUser;
      authOpenBtn.classList.add('logged-in');
      authNavLabel.removeAttribute('data-i18n');
      authNavLabel.textContent = displayName;
      if (authForm) authForm.hidden = true;
      if (authRecoverForm) authRecoverForm.hidden = true;
      if (authProfileView) authProfileView.hidden = false;
      if (authProfileAvatar) authProfileAvatar.textContent = displayName.charAt(0).toUpperCase();
      if (authProfileName) authProfileName.textContent = displayName;
      if (authProfileRecoveryCode) authProfileRecoveryCode.textContent = profile.recoveryCode;
      const total = DATA.pois.length;
      const count = foundSet.size;
      const pct = total ? Math.min(100, Math.round((count / total) * 100)) : 0;
      if (authProfileStats) authProfileStats.textContent = `${count.toLocaleString('pt-BR')} / ${total.toLocaleString('pt-BR')} ${t('foundLabel')} (${pct}%)`;
      if (authProgressFill) authProgressFill.style.width = `${pct}%`;
      renderMasterPanel();
    } else {
      authOpenBtn.classList.remove('logged-in');
      authNavLabel.setAttribute('data-i18n', 'authLoginBtn');
      authNavLabel.textContent = t('authLoginBtn');
      if (authForm) authForm.hidden = false;
      if (authRecoverForm) authRecoverForm.hidden = true;
      if (authProfileView) authProfileView.hidden = true;
      if (authMasterPanel) authMasterPanel.hidden = true;
    }
  }

  if (authOpenBtn && authModalBackdrop) {
    authOpenBtn.addEventListener('click', () => {
      updateAuthUI();
      if (authErrorMsg) authErrorMsg.hidden = true;
      authModalBackdrop.hidden = false;
    });
    authCloseBtn.addEventListener('click', () => { authModalBackdrop.hidden = true; });
    authModalBackdrop.addEventListener('click', e => {
      if (e.target === authModalBackdrop) authModalBackdrop.hidden = true;
    });

    authForm.addEventListener('submit', async e => {
      e.preventDefault();
      const username = authUsername.value.trim();
      const password = authPassword.value;
      if (!username || !password) return;
      const key = username.toLowerCase();
      const users = getUsersMap();
      const passHash = await hashPass(password);

      if (users[key]) {
        if (users[key].passHash !== passHash) {
          authErrorMsg.textContent = t('authWrongPass');
          authErrorMsg.hidden = false;
          return;
        }
      } else {
        // Create isolated profile (only import guest marks if this is the first account on the device)
        const isFirstAccount = Object.keys(users).length === 0;
        users[key] = {
          displayName: username,
          passHash,
          recoveryCode: generateRecoveryCode(),
          found: isFirstAccount ? [...foundSet] : [],
          customPois: isFirstAccount ? customPois : []
        };
        if (isFirstAccount) {
          localStorage.removeItem(STORAGE_FOUND);
          localStorage.removeItem(STORAGE_CUSTOM);
        }
        saveUsersMap(users);
      }

      activeUser = key;
      localStorage.setItem(STORAGE_SESSION, activeUser);
      loadActiveProgress();
      authErrorMsg.hidden = true;
      authUsername.value = '';
      authPassword.value = '';
      updateAuthUI();
      renderFilters();
      renderMarkers();
      if (state.selectedPoi) openPoiPopup(state.selectedPoi);
    });

    authLogoutBtn.addEventListener('click', () => {
      activeUser = null;
      localStorage.removeItem(STORAGE_SESSION);
      localStorage.removeItem(STORAGE_FOUND);
      localStorage.removeItem(STORAGE_CUSTOM);
      if (authUsername) authUsername.value = '';
      if (authPassword) authPassword.value = '';
      loadActiveProgress();
      updateAuthUI();
      renderFilters();
      renderMarkers();
      if (state.selectedPoi) openPoiPopup(state.selectedPoi);
    });

    if (authForgotBtn && authRecoverForm && authBackLoginBtn) {
      authForgotBtn.addEventListener('click', () => {
        authForm.hidden = true;
        authRecoverForm.hidden = false;
        if (recoverMsg) recoverMsg.hidden = true;
        if (recoverUsername && authUsername.value) recoverUsername.value = authUsername.value;
      });

      authBackLoginBtn.addEventListener('click', () => {
        authRecoverForm.hidden = true;
        authForm.hidden = false;
        if (authErrorMsg) authErrorMsg.hidden = true;
      });

      authRecoverForm.addEventListener('submit', async e => {
        e.preventDefault();
        const key = recoverUsername.value.trim().toLowerCase();
        const code = recoverCode.value.trim().toUpperCase();
        const newPass = recoverNewPass.value;
        const users = getUsersMap();
        if (!users[key] || !users[key].recoveryCode || users[key].recoveryCode.toUpperCase() !== code) {
          recoverMsg.textContent = t('authRecoverInvalid');
          recoverMsg.hidden = false;
          return;
        }
        users[key].passHash = await hashPass(newPass);
        saveUsersMap(users);
        activeUser = key;
        localStorage.setItem(STORAGE_SESSION, activeUser);
        loadActiveProgress();
        recoverCode.value = '';
        recoverNewPass.value = '';
        recoverMsg.hidden = true;
        updateAuthUI();
        renderFilters();
        renderMarkers();
        if (state.selectedPoi) openPoiPopup(state.selectedPoi);
      });
    }

    if (copyRecoveryBtn && authProfileRecoveryCode) {
      copyRecoveryBtn.addEventListener('click', () => {
        navigator.clipboard?.writeText(authProfileRecoveryCode.textContent);
        copyRecoveryBtn.textContent = t('authCopied');
        setTimeout(() => { copyRecoveryBtn.textContent = t('authCopyCode'); }, 1600);
      });
    }

    exportSaveBtn.addEventListener('click', () => {
      const payload = {
        user: activeUser || 'guest',
        exportedAt: new Date().toISOString(),
        found: [...foundSet],
        customPois
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gps-leonida-${(activeUser || 'backup').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    importSaveInput.addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (Array.isArray(data.found)) foundSet = new Set(data.found);
          if (Array.isArray(data.customPois)) customPois = data.customPois;
          saveActiveProgress();
          updateAuthUI();
          renderFilters();
          renderMarkers();
        } catch {
          alert('Arquivo de backup inválido.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  // --- GTA 6 Achievements Panel ---
  const ACHIEVEMENTS = window.LEONIDA_ACHIEVEMENTS || [];
  const achListEl = document.getElementById('achList');
  const achCountBadge = document.getElementById('achCountBadge');
  const achEarnedCountEl = document.getElementById('achEarnedCount');
  const achTotalCountEl = document.getElementById('achTotalCount');
  const achPctTextEl = document.getElementById('achPctText');
  const achRingFillEl = document.getElementById('achRingFill');
  const achCountPlatEl = document.getElementById('achCountPlatinum');
  const achCountGoldEl = document.getElementById('achCountGold');
  const achCountSilverEl = document.getElementById('achCountSilver');
  const achCountBronzeEl = document.getElementById('achCountBronze');
  let achFilter = 'all';

  const TIER_LABELS_I18N = {
    PT: { platinum: 'Platina', gold: 'Ouro', silver: 'Prata', bronze: 'Bronze' },
    EN: { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' },
    ES: { platinum: 'Platino', gold: 'Oro', silver: 'Plata', bronze: 'Bronce' },
    FR: { platinum: 'Platine', gold: 'Or', silver: 'Argent', bronze: 'Bronze' }
  };

  function achText(a) {
    if (currentLang === 'EN') return { title: a.title, desc: a.descEn || a.desc };
    if (currentLang === 'ES') return { title: a.titleEs || a.title, desc: a.descEs || a.desc };
    if (currentLang === 'FR') return { title: a.titleFr || a.title, desc: a.descFr || a.desc };
    return { title: a.titlePt || a.title, desc: a.desc };
  }

  function renderAchievements() {
    if (!achListEl) return;
    const total = ACHIEVEMENTS.length;
    const unlockedList = ACHIEVEMENTS.filter(a => achievementsSet.has(a.id));
    const unlocked = unlockedList.length;
    const pct = total ? Math.round((unlocked / total) * 100) : 0;
    if (achCountBadge) achCountBadge.textContent = `${unlocked}/${total}`;
    if (achEarnedCountEl) achEarnedCountEl.textContent = String(unlocked);
    if (achTotalCountEl) achTotalCountEl.textContent = String(total);
    if (achPctTextEl) achPctTextEl.textContent = `${pct}%`;
    if (achRingFillEl) {
      const circ = 169.65;
      achRingFillEl.style.strokeDashoffset = (circ * (1 - pct / 100)).toFixed(2);
    }
    const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
    unlockedList.forEach(a => { if (counts[a.tier] !== undefined) counts[a.tier]++; });
    if (achCountPlatEl) achCountPlatEl.textContent = String(counts.platinum);
    if (achCountGoldEl) achCountGoldEl.textContent = String(counts.gold);
    if (achCountSilverEl) achCountSilverEl.textContent = String(counts.silver);
    if (achCountBronzeEl) achCountBronzeEl.textContent = String(counts.bronze);

    const tiers = TIER_LABELS_I18N[currentLang] || TIER_LABELS_I18N.PT;
    const visible = ACHIEVEMENTS.filter(a => {
      const isDone = achievementsSet.has(a.id);
      if (achFilter === 'done') return isDone;
      if (achFilter === 'pending') return !isDone;
      return true;
    });

    achListEl.innerHTML = '';
    visible.forEach(a => {
      const isDone = achievementsSet.has(a.id);
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'ach-row' + (isDone ? ' unlocked' : '');
      const { title, desc } = achText(a);
      row.innerHTML = `
        <div class="ach-info">
          <div class="ach-title-line">
            <span class="ach-tier ach-tier--${a.tier}" title="${tiers[a.tier] || a.tier}" aria-label="${tiers[a.tier] || a.tier}"><svg class="ach-trophy-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg></span>
            ${a.missable ? `<span class="ach-missable">${t('achMissable')}</span>` : ''}
            <span class="ach-name">${title}</span>
          </div>
          <p class="ach-desc">${desc}</p>
        </div>
        <span class="ach-check" aria-hidden="true">
          ${isDone ? '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </span>
      `;
      row.addEventListener('click', () => {
        if (achievementsSet.has(a.id)) {
          achievementsSet.delete(a.id);
        } else {
          achievementsSet.add(a.id);
        }
        saveActiveProgress();
        renderAchievements();
      });
      achListEl.appendChild(row);
    });
  }

  document.querySelectorAll('[data-ach-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      achFilter = btn.getAttribute('data-ach-filter');
      document.querySelectorAll('[data-ach-filter]').forEach(b => b.classList.toggle('active', b === btn));
      renderAchievements();
    });
  });

  // --- Init ---
  window.addEventListener('resize', () => map.invalidateSize());
  resetView(false);
  updateAuthUI();
  applyLanguage(currentLang);
  renderAchievements();
  renderRegionPolygons();
  renderHub();
  renderMarkers();
})();
