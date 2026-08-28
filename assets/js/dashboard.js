/* ============================================================
   SafeRide Schools — dashboard.js
   Parent Dashboard: Live Tracking · Notifications · Payments
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (!document.querySelector('.dashboard-wrapper')) return;
  initDashboardOverview();
  initLiveTracker();
  initNotifications();
  initPaymentSection();
  initDashboardNav();
  initProfileSettings();
  initBoardingLog();
});

/* ── Mock Data ───────────────────────────────────────────────── */
const mockData = {
  child: { name: 'Emma Thompson', grade: '5th Grade', id: 'SR-2024-0847', school: 'Lincoln Middle School' },
  bus: { number: 'Bus #24', driver: 'Michael Chen', license: 'B-Class CDL', phone: '+1 (555) 012-3456', capacity: 35, students: 28 },
  route: { name: 'Route A – North Suburbs', stops: 5, morning: '7:18 AM', afternoon: '3:45 PM', nextStop: 'Sunrise Park', eta: '7 min' },
  subscription: { plan: 'Premium Family', status: 'Active', renewal: 'Jan 15, 2027', nextPayment: '$89.00' }
};

const notifications = [
  { id: 1, type: 'boarding',   icon: 'ph ph-check-circle', color: '#22c55e', title: 'Emma Boarded the Bus',  time: '7:18 AM', desc: 'Emma scanned her ID card and boarded Bus #24 at Sunrise Park stop.',   read: false },
  { id: 2, type: 'arrival',    icon: 'ph ph-map-pin', color: '#55D6BE', title: 'Bus Arriving in 3 min', time: '7:15 AM', desc: 'Bus #24 is 0.8 miles away and arriving at Sunrise Park in ~3 minutes.', read: false },
  { id: 3, type: 'alighting',  icon: 'ph ph-buildings', color: '#168A72', title: 'Emma Arrived at School', time: '7:35 AM', desc: 'Emma safely arrived and alighted at Lincoln Middle School.',              read: true  },
  { id: 4, type: 'payment',    icon: 'ph ph-credit-card', color: '#D6B36A', title: 'Payment Processed',      time: 'Yesterday', desc: 'Monthly subscription payment of $89.00 was successfully processed.', read: true  },
  { id: 5, type: 'alert',      icon: 'ph ph-warning-circle', color: '#f59e0b', title: 'Route Delay Notice',     time: '2 days ago', desc: 'Minor delay on Route A due to traffic. Estimated 8-min delay.',    read: true  }
];

/* ── Dashboard Overview ──────────────────────────────────────── */
function initDashboardOverview() {
  // Populate child info cards
  const childCard = document.getElementById('child-info-card');
  if (childCard) {
    childCard.querySelector('.child-name')  && (childCard.querySelector('.child-name').textContent  = mockData.child.name);
    childCard.querySelector('.child-grade') && (childCard.querySelector('.child-grade').textContent = mockData.child.grade);
    childCard.querySelector('.child-id')    && (childCard.querySelector('.child-id').textContent    = mockData.child.id);
  }

  const busCard = document.getElementById('bus-info-card');
  if (busCard) {
    busCard.querySelector('.bus-number')  && (busCard.querySelector('.bus-number').textContent  = mockData.bus.number);
    busCard.querySelector('.bus-driver')  && (busCard.querySelector('.bus-driver').textContent  = mockData.bus.driver);
    busCard.querySelector('.bus-students')&& (busCard.querySelector('.bus-students').textContent= `${mockData.bus.students}/${mockData.bus.capacity}`);
  }

  // Update unread badge
  const unreadCount = notifications.filter(n => !n.read).length;
  const badge = document.querySelector('.notif-badge');
  if (badge) badge.textContent = unreadCount;
}

/* ── Live GPS Tracker Simulation ─────────────────────────────── */
function initLiveTracker() {
  const tracker = document.getElementById('live-tracker');
  if (!tracker) return;

  const busEl    = tracker.querySelector('.tracker-bus');
  const etaEl    = tracker.querySelector('.tracker-eta');
  const distEl   = tracker.querySelector('.tracker-dist');
  const speedEl  = tracker.querySelector('.tracker-speed');
  const statusEl = tracker.querySelector('.tracker-status');

  // Animate bus along a CSS path
  let progress = 0;
  const pathLength = 320; // SVG path length simulation
  const stops = [
    { pct: 0,    label: 'Depot',             arrival: '6:45 AM' },
    { pct: 20,   label: 'Oak Hill',          arrival: '7:05 AM' },
    { pct: 40,   label: 'Maple Grove',       arrival: '7:12 AM' },
    { pct: 60,   label: 'Sunrise Park',      arrival: '7:18 AM' },
    { pct: 80,   label: 'Central Library',   arrival: '7:25 AM' },
    { pct: 100,  label: 'Lincoln School',    arrival: '7:35 AM' }
  ];

  let currentStop = 3; // Currently at stop 3 (Sunrise Park)

  function updateTracker() {
    progress = (progress + 0.3) % 100;
    const speed = 28 + Math.floor(Math.random() * 10);
    const dist  = (2.4 - progress / 100 * 2.4).toFixed(1);
    const eta   = Math.max(0, 7 - Math.floor(progress / 15));

    if (busEl) busEl.style.left = `${Math.min(progress, 95)}%`;
    if (etaEl)   etaEl.textContent   = eta + (eta === 1 ? ' min' : ' mins');
    if (distEl)  distEl.textContent  = dist + ' km';
    if (speedEl) speedEl.textContent = speed + ' km/h';
    if (statusEl) statusEl.textContent = progress < 50 ? '● En Route' : '● Approaching';
  }

  // Render the stop markers
  const stopsContainer = tracker.querySelector('.tracker-stops');
  if (stopsContainer) {
    stopsContainer.innerHTML = stops.map((stop, i) => `
      <div class="tracker-stop ${i < currentStop ? 'done' : i === currentStop ? 'current' : ''}">
        <div class="stop-dot"></div>
        <div class="stop-info">
          <span class="stop-name">${stop.label}</span>
          <span class="stop-time">${stop.arrival}</span>
        </div>
      </div>
    `).join('');
  }

  setInterval(updateTracker, 2000);
  updateTracker(); // Initial call
}

/* ── Notifications Panel ─────────────────────────────────────── */
function initNotifications() {
  const container = document.getElementById('notifications-panel');
  if (!container) return;

  function renderNotifications() {
    container.innerHTML = notifications.map(n => `
      <div class="notif-card ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
        <div class="notif-icon" style="background:${n.color}22; color:${n.color}">
          <i class="${n.icon}"></i>
        </div>
        <div class="notif-body">
          <div class="notif-header">
            <strong class="notif-title">${n.title}</strong>
            <span class="notif-time">${n.time}</span>
          </div>
          <p class="notif-desc">${n.desc}</p>
        </div>
        ${!n.read ? '<div class="notif-unread-dot"></div>' : ''}
      </div>
    `).join('');

    // Mark as read on click
    container.querySelectorAll('.notif-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-notif-id'));
        const notif = notifications.find(n => n.id === id);
        if (notif) {
          notif.read = true;
          card.classList.remove('unread');
          card.querySelector('.notif-unread-dot')?.remove();
          // Update badge
          const unread = notifications.filter(n => !n.read).length;
          const badge = document.querySelector('.notif-badge');
          if (badge) badge.textContent = unread || '';
        }
      });
    });
  }

  renderNotifications();

  // Mark all read button
  document.getElementById('mark-all-read')?.addEventListener('click', () => {
    notifications.forEach(n => n.read = true);
    renderNotifications();
    const badge = document.querySelector('.notif-badge');
    if (badge) badge.textContent = '';
  });
}

/* ── Payment Section ─────────────────────────────────────────── */
function initPaymentSection() {
  const container = document.getElementById('payment-section');
  if (!container) return;

  // Downloadable receipts mock
  const receipts = [
    { month: 'December 2026', amount: '$89.00', date: 'Dec 1, 2026', id: 'SR-INV-2026-12' },
    { month: 'November 2026', amount: '$89.00', date: 'Nov 1, 2026', id: 'SR-INV-2026-11' },
    { month: 'October 2026',  amount: '$89.00', date: 'Oct 1, 2026', id: 'SR-INV-2026-10' },
    { month: 'September 2026',amount: '$89.00', date: 'Sep 1, 2026', id: 'SR-INV-2026-09' }
  ];

  const receiptsContainer = document.getElementById('receipts-list');
  if (receiptsContainer) {
    receiptsContainer.innerHTML = receipts.map(r => `
      <div class="receipt-row">
        <div class="receipt-info">
          <strong>${r.month}</strong>
          <span>${r.date} &middot; ${r.id}</span>
        </div>
        <div class="receipt-amount">${r.amount}</div>
        <button class="btn btn-outline btn-sm" onclick="downloadReceipt('${r.id}')">
          <i class="ph ph-download-simple"></i> Receipt
        </button>
      </div>
    `).join('');
  }
}

function downloadReceipt(id) {
  // Simulate download
  const a = document.createElement('a');
  const content = `SafeRide Schools — Receipt ${id}\nThank you for your payment.\nAmount: $89.00\nPlan: Premium Family`;
  const blob = new Blob([content], { type: 'text/plain' });
  a.href = URL.createObjectURL(blob);
  a.download = `${id}.txt`;
  a.click();
}

window.downloadReceipt = downloadReceipt;

/* ── Dashboard Navigation ────────────────────────────────────── */
function initDashboardNav() {
  const panels = document.querySelectorAll('.dash-panel');
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-panel]');

  function showPanel(panelId) {
    panels.forEach(p => {
      p.hidden = p.id !== panelId;
    });
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-panel') === panelId);
    });
    // Update page title
    const active = document.querySelector(`.sidebar-nav-item[data-panel="${panelId}"]`);
    const titleEl = document.getElementById('dash-page-title');
    if (titleEl && active) titleEl.textContent = active.querySelector('.nav-label')?.textContent || 'Dashboard';
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      showPanel(item.getAttribute('data-panel'));
    });
  });

  // Show overview by default
  showPanel('panel-overview');
}

/* ── Profile & Settings ──────────────────────────────────────── */
function initProfileSettings() {
  const saveBtn = document.getElementById('save-profile');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', async () => {
    const orig = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="ph ph-circle-notch spin"></i> Saving…';
    saveBtn.disabled = true;
    await new Promise(r => setTimeout(r, 1200));
    saveBtn.innerHTML = orig;
    saveBtn.disabled = false;

    // Toast
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed;bottom:90px;right:24px;z-index:9999;
      padding:14px 20px;background:var(--emerald);color:#fff;
      border-radius:12px;font-family:var(--font-body);font-size:0.875rem;
      font-weight:600;box-shadow:0 8px 30px rgba(0,0,0,0.25);
    `;
    toast.textContent = '✓ Profile saved successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  });

  // Notification preference toggles
  document.querySelectorAll('.pref-toggle').forEach(toggle => {
    toggle.addEventListener('change', () => {
      const label = toggle.closest('.pref-row')?.querySelector('.pref-label');
      if (label) {
        label.style.opacity = toggle.checked ? '1' : '0.5';
      }
    });
  });
}

/* ── Boarding/Alighting Log ──────────────────────────────────── */
function initBoardingLog() {
  const logContainer = document.getElementById('boarding-log');
  if (!logContainer) return;

  const log = [
    { date: 'Today', events: [
      { time: '7:18 AM', event: 'Boarded', location: 'Sunrise Park Stop', bus: 'Bus #24', icon: 'ph ph-check-circle' },
      { time: '7:35 AM', event: 'Arrived at School', location: 'Lincoln Middle School', bus: 'Bus #24', icon: 'ph ph-buildings' }
    ]},
    { date: 'Yesterday', events: [
      { time: '3:48 PM', event: 'Boarded Return Bus', location: 'Lincoln Middle School', bus: 'Bus #24', icon: 'ph ph-check-circle' },
      { time: '4:12 PM', event: 'Alighted', location: 'Sunrise Park Stop', bus: 'Bus #24', icon: 'ph ph-house' },
      { time: '7:17 AM', event: 'Boarded', location: 'Sunrise Park Stop', bus: 'Bus #24', icon: 'ph ph-check-circle' },
      { time: '7:34 AM', event: 'Arrived at School', location: 'Lincoln Middle School', bus: 'Bus #24', icon: 'ph ph-buildings' }
    ]}
  ];

  logContainer.innerHTML = log.map(day => `
    <div class="log-day">
      <div class="log-date-header">${day.date}</div>
      ${day.events.map(ev => `
        <div class="log-event">
          <div class="log-event-icon"><i class="${ev.icon}"></i></div>
          <div class="log-event-body">
            <strong>${ev.event}</strong> · <span>${ev.location}</span>
            <div class="log-event-meta">${ev.time} &middot; ${ev.bus}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');
}
