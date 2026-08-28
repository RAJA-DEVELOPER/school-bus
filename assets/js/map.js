/* ============================================================
   SafeRide Schools — map.js
   Interactive Route Map UI · GPS Simulation · Stop Markers
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initRouteMapUI();
  initMapFilters();
});

/* ── Route Map UI (SVG-based simulation) ─────────────────────── */
function initRouteMapUI() {
  const mapContainer = document.getElementById('route-map');
  if (!mapContainer) return;

  const routes = [
    { id: 'R1', name: 'Route A — North Suburbs', color: '#55D6BE', stops: [
      { x: 15, y: 20, name: 'Oak Hill Residential', eta: '7:05 AM', status: 'completed' },
      { x: 28, y: 35, name: 'Maple Grove Ave', eta: '7:12 AM', status: 'completed' },
      { x: 42, y: 28, name: 'Sunrise Park', eta: '7:18 AM', status: 'active' },
      { x: 58, y: 42, name: 'Central Library', eta: '7:25 AM', status: 'upcoming' },
      { x: 75, y: 38, name: 'Lincoln Middle School', eta: '7:35 AM', status: 'upcoming' }
    ]},
    { id: 'R2', name: 'Route B — East District', color: '#D6B36A', stops: [
      { x: 80, y: 15, name: 'Eastview Heights', eta: '7:00 AM', status: 'completed' },
      { x: 72, y: 30, name: 'Parkside Blvd', eta: '7:08 AM', status: 'completed' },
      { x: 65, y: 55, name: 'Community Center', eta: '7:18 AM', status: 'active' },
      { x: 75, y: 38, name: 'Lincoln Middle School', eta: '7:30 AM', status: 'upcoming' }
    ]},
    { id: 'R3', name: 'Route C — West Loop', color: '#168A72', stops: [
      { x: 10, y: 70, name: 'Westfield Commons', eta: '7:15 AM', status: 'completed' },
      { x: 25, y: 60, name: 'Birchwood Drive', eta: '7:22 AM', status: 'completed' },
      { x: 40, y: 65, name: 'Valley Sports Center', eta: '7:28 AM', status: 'active' },
      { x: 55, y: 72, name: 'Riverside Crossing', eta: '7:35 AM', status: 'upcoming' },
      { x: 75, y: 38, name: 'Lincoln Middle School', eta: '7:45 AM', status: 'upcoming' }
    ]}
  ];

  // Bus positions (simulated)
  const buses = [
    { route: 'R1', position: 2, students: 18, speed: 32, driver: 'Michael Chen' },
    { route: 'R2', position: 2, students: 22, speed: 28, driver: 'Sarah Johnson' },
    { route: 'R3', position: 2, students: 15, speed: 35, driver: 'David Park' }
  ];

  renderSVGMap(mapContainer, routes, buses);
  initMapInteractivity(mapContainer, routes, buses);
  simulateBusMovement(mapContainer, routes, buses);
}

function renderSVGMap(container, routes, buses) {
  const mapContent = container.querySelector('.map-svg-container');
  if (!mapContent) return;

  let svgContent = '';

  // Draw route lines
  routes.forEach(route => {
    const stops = route.stops;
    const pathPoints = stops.map(s => `${s.x}% ${s.y}%`).join(', ');

    // Polyline (SVG)
    const points = stops.map(s => `${s.x * 8},${s.y * 4.5}`).join(' ');
    svgContent += `<polyline
      class="route-line"
      points="${points}"
      stroke="${route.color}"
      stroke-width="3"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-dasharray="8 4"
      data-route="${route.id}"
      opacity="0.8"
    />`;

    // Stop markers
    stops.forEach((stop, i) => {
      const cx = stop.x * 8;
      const cy = stop.y * 4.5;
      const isDestination = i === stops.length - 1;
      const isActive = stop.status === 'active';
      const isCompleted = stop.status === 'completed';

      svgContent += `
        <g class="stop-marker" data-stop="${stop.name}" data-route="${route.id}"
           data-eta="${stop.eta}" style="cursor:pointer" transform="translate(${cx},${cy})">
          <circle r="${isDestination ? 8 : 5}"
            fill="${isCompleted ? route.color : isActive ? '#fff' : 'rgba(255,255,255,0.3)'}"
            stroke="${route.color}"
            stroke-width="${isActive ? 3 : 2}"
            class="${isActive ? 'active-stop' : ''}"
          />
          ${isActive ? `<circle r="10" fill="${route.color}" opacity="0.2" class="pulse-ring"/>` : ''}
          ${isDestination ? `<g transform="translate(0,-15)" fill="#fff">
            <path d="M-5 0 L0 -5 L5 0 Z"/>
            <rect x="-4" y="0" width="8" height="6" rx="1"/>
            <rect x="-1.5" y="2" width="3" height="4" fill="${route.color}"/>
          </g>` : ''}
        </g>
      `;
    });

    // Bus icon
    const busRoute = buses.find(b => b.route === route.id);
    if (busRoute) {
      const busStop = route.stops[busRoute.position] || route.stops[0];
      const bx = busStop.x * 8;
      const by = busStop.y * 4.5;
      svgContent += `
        <g class="bus-marker" data-bus-route="${route.id}"
           transform="translate(${bx},${by})">
          <rect x="-10" y="-8" width="20" height="16" rx="4"
            fill="${route.color}" stroke="white" stroke-width="1.5"/>
          <rect x="-5" y="-4" width="10" height="7" rx="1.5" fill="white"/>
          <circle cx="-4" cy="6" r="1.6" fill="white"/>
          <circle cx="4" cy="6" r="1.6" fill="white"/>
        </g>
      `;
    }
  });

  const svg = mapContent.querySelector('svg');
  if (svg) svg.innerHTML = svgContent;
}

function initMapInteractivity(container, routes, buses) {
  const mapContent = container.querySelector('.map-svg-container');
  const infoPanel = container.querySelector('.map-info-panel');
  if (!mapContent || !infoPanel) return;

  // Route filter buttons
  container.querySelectorAll('[data-filter-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      const routeId = btn.getAttribute('data-filter-route');
      container.querySelectorAll('[data-filter-route]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide routes
      mapContent.querySelectorAll('.route-line').forEach(line => {
        if (routeId === 'all' || line.getAttribute('data-route') === routeId) {
          line.style.opacity = '0.9';
        } else {
          line.style.opacity = '0.2';
        }
      });
    });
  });

  // Stop tooltip on click
  mapContent.addEventListener('click', (e) => {
    const marker = e.target.closest('.stop-marker');
    if (marker) {
      const stopName = marker.getAttribute('data-stop');
      const routeId  = marker.getAttribute('data-route');
      const eta      = marker.getAttribute('data-eta');
      const route    = routes.find(r => r.id === routeId);
      if (!route || !infoPanel) return;

      infoPanel.innerHTML = `
        <div class="map-popup">
          <div class="map-popup-header" style="background:${route.color}">
            <span class="popup-icon"><i class="ph ph-map-pin"></i></span>
            <strong>${stopName}</strong>
          </div>
          <div class="map-popup-body">
            <div class="popup-row"><span>Route:</span><strong>${route.name}</strong></div>
            <div class="popup-row"><span>Scheduled ETA:</span><strong>${eta}</strong></div>
            <div class="popup-row"><span>Status:</span>
              <span class="badge badge-success">On Schedule</span>
            </div>
          </div>
        </div>
      `;
      infoPanel.classList.add('visible');
    }

    // Bus info on click
    const busMarker = e.target.closest('.bus-marker');
    if (busMarker) {
      const routeId = busMarker.getAttribute('data-bus-route');
      const bus = buses.find(b => b.route === routeId);
      const route = routes.find(r => r.id === routeId);
      if (!bus || !route) return;

      infoPanel.innerHTML = `
        <div class="map-popup">
          <div class="map-popup-header" style="background:${route.color}">
            <span class="popup-icon"><i class="ph ph-bus"></i></span>
            <strong>Bus ${routeId} — Live</strong>
          </div>
          <div class="map-popup-body">
            <div class="popup-row"><span>Driver:</span><strong>${bus.driver}</strong></div>
            <div class="popup-row"><span>Students:</span><strong>${bus.students} aboard</strong></div>
            <div class="popup-row"><span>Speed:</span><strong>${bus.speed} km/h</strong></div>
            <div class="popup-row"><span>Status:</span>
              <span class="badge badge-success">● On Route</span>
            </div>
          </div>
        </div>
      `;
      infoPanel.classList.add('visible');
    }
  });

  // Close panel on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      infoPanel.classList.remove('visible');
    }
  });
}

function simulateBusMovement(container, routes, buses) {
  const infoCards = container.querySelectorAll('.live-bus-card');
  if (!infoCards.length) return;

  let tick = 0;
  setInterval(() => {
    tick++;
    infoCards.forEach((card, i) => {
      const bus = buses[i];
      if (!bus) return;
      const route = routes.find(r => r.id === bus.route);
      if (!route) return;

      // Simulate tiny speed variations
      const speed = bus.speed + Math.floor(Math.random() * 6 - 3);
      const eta = new Date();
      eta.setMinutes(eta.getMinutes() + Math.floor(Math.random() * 5 + 3));

      card.querySelector('.bus-speed')  && (card.querySelector('.bus-speed').textContent   = speed + ' km/h');
      card.querySelector('.bus-eta')    && (card.querySelector('.bus-eta').textContent     = eta.toLocaleTimeString('en', {hour:'2-digit',minute:'2-digit'}));
      card.querySelector('.bus-ticker') && (card.querySelector('.bus-ticker').textContent  = tick % 2 === 0 ? '● LIVE' : '○ LIVE');
    });
  }, 3000);
}

/* ── Map Filter Interactivity ────────────────────────────────── */
function initMapFilters() {
  const filterBtns = document.querySelectorAll('[data-map-filter]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}
