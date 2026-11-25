(() => {
  const DATA = window.LEONIDA_MAP_DATA;
  if (!DATA || typeof L === 'undefined') {
    console.error('LEONIDA_MAP_DATA ou Leaflet não encontrado.');
    return;
  }

  // Inline SVG paths for category & subcategory icons
  const ICONS = {
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
    landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
    swords: '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    'shopping-bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    trees: '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
    'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
  };

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
  const STORAGE_THEME = 'leonida-theme';
  const STORAGE_LANG = 'leonida-lang';

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

  let foundSet = new Set(JSON.parse(localStorage.getItem(STORAGE_FOUND) || '[]'));
  let customPois = JSON.parse(localStorage.getItem(STORAGE_CUSTOM) || '[]');

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
    keepBuffer: 4,
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

  map.on('moveend zoomend', () => renderMarkers());

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
  document.getElementById('fullscreenBtn').addEventListener('click', () => {
    mapViewport.classList.toggle('is-fullscreen');
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
              <span class="subcat-ring" style="color:${s.color || cat.color}"></span>
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

  function renderMarkers() {
    if (!map._loaded) return;
    const filtered = getFilteredPois();
    visibleCountLabel.textContent = `${filtered.length.toLocaleString('pt-BR')} ${t('visibleLabel')}`;
    foundCountLabel.textContent = `${foundSet.size.toLocaleString('pt-BR')} ${t('foundLabel')}`;

    const viewBounds = map.getBounds().pad(0.15);
    const inView = filtered.filter(p => viewBounds.contains(worldToLatLng(p.x, p.y)));

    // Keep DOM responsive at low zoom
    const zoom = map.getZoom();
    let toRender = inView;
    if (zoom < 3.5 && inView.length > 350) {
      const step = Math.ceil(inView.length / 350);
      toRender = inView.filter((_, idx) => idx % step === 0);
    }

    markersLayer.clearLayers();
    toRender.forEach(p => {
      const cat = catById.get(p.subcategory) || catById.get(p.category);
      const color = p.custom ? '#ff3b8e' : (cat ? cat.color : '#3b82f6');
      const icon = p.custom ? 'star' : (cat ? cat.icon : 'map-pin');
      const isFound = foundSet.has(p.slug);
      const isSelected = state.selectedPoi && state.selectedPoi.slug === p.slug;

      const divIcon = L.divIcon({
        className: 'poi-marker-wrap',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        html: `<div class="poi-marker${isFound ? ' is-found' : ''}${isSelected ? ' is-selected' : ''}" style="background-color:${color}" title="${p.title.replace(/"/g, '&quot;')}">${iconSvg(icon)}</div>`
      });

      const marker = L.marker(worldToLatLng(p.x, p.y), { icon: divIcon });
      marker.on('click', () => openPoiPopup(p));
      marker.addTo(markersLayer);
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
      ${parentCat ? `<span class="poi-badge" style="color:${parentCat.color}">${catLabel(parentCat)}</span>` : ''}
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
    localStorage.setItem(STORAGE_FOUND, JSON.stringify([...foundSet]));
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

  // --- Init ---
  window.addEventListener('resize', () => map.invalidateSize());
  resetView(false);
  applyLanguage(currentLang);
  renderRegionPolygons();
  renderHub();
  renderMarkers();
})();
