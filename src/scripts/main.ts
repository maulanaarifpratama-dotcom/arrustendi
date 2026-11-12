// @ts-nocheck
import Alpine from 'alpinejs';
import { createIcons, Copy, MessageCircle, Globe, Building2, ChevronDown, ChevronRight, ChevronUp, Menu, X, HelpCircle, Search, SearchX, Heart, Quote, CalendarCheck2, ArrowRight, BookOpen, Calculator, Camera, CheckCircle2, Compass, ExternalLink, GraduationCap, HandHeart, HeartHandshake, Home, Info, Layers, Link, Loader, Map, MapPin, Megaphone, Paintbrush, Settings, Share2, ShieldCheck, Target, TrendingUp, Users, Video, Newspaper, BadgeCheck, Clock } from 'lucide';
import { DONORS, WAQAF, waqafState, rupiah, persenID, PARTNERS } from '../data/waqaf';

const lucideIcons = { Copy, MessageCircle, Globe, Building2, ChevronDown, ChevronRight, ChevronUp, Menu, X, HelpCircle, Search, SearchX, Heart, Quote, CalendarCheck2, ArrowRight, BookOpen, Calculator, Camera, CheckCircle2, Compass, ExternalLink, GraduationCap, HandHeart, HeartHandshake, Home, Info, Layers, Link, Loader, Map, MapPin, Megaphone, Paintbrush, Settings, Share2, ShieldCheck, Target, TrendingUp, Users, Video, Newspaper, BadgeCheck, Clock };

const w = window as any;
w.Alpine = Alpine;
w.WAQAF = waqafState;
w.copyToClipboard = copyToClipboard;
Alpine.data('waqafLedger', waqafLedger);
Alpine.data('donorRoll', donorRoll);

// ==========================================
// 1b. KOMPONEN ALPINE — LEDGER & DAFTAR DONATUR
// ==========================================
function waqafLedger() {
  return {
    ...waqafState,
    donors: DONORS,
    showNote: false,
    get persenLabel() { return persenID(this.persen); },
    rp: rupiah
  };
}

function donorRoll() {
  return {
    donors: DONORS,
    query: '',
    expanded: false,
    previewCount: 12,
    rp: rupiah,

    normalize(text) {
      return String(text).toLowerCase().replace(/['’.]/g, '').replace(/\s+/g, ' ').trim();
    },
    matches(donor) {
      if (!this.query.trim()) return true;
      return this.normalize(donor.n).includes(this.normalize(this.query));
    },
    isVisible(donor, index) {
      if (this.query.trim()) return this.matches(donor);
      return this.expanded || index < this.previewCount;
    },
    get matchCount() {
      if (!this.query.trim()) return this.donors.length;
      return this.donors.filter((d) => this.matches(d)).length;
    },
    get visibleTotal() {
      if (!this.query.trim()) return waqafState.rollTotal;
      return this.donors.filter((d) => this.matches(d)).reduce((s, d) => s + d.v, 0);
    },
    clearQuery() {
      this.query = '';
      this.$nextTick(() => {
        const input = document.getElementById('donor-search');
        if (input) input.focus();
      });
    }
  };
}

// CONFIG diturunkan dari WAQAF supaya counter, gauge, dan
// progress bar tidak pernah lepas dari sumber datanya.
const CONFIG = {
  totalRAB:       waqafState.totalRAB,
  terkumpul:      waqafState.danaProgres,
  sisa:           waqafState.sisa,
  persentase:     waqafState.persen,
  updateTerakhir: waqafState.updated
};

// Helper: Format Rupiah (alias lama, dipakai animateCounter)
const formatRupiah = rupiah;

// Helper: Copy to Clipboard Utility with visual toast feedback
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  showToast('✓ Nomor rekening berhasil disalin!');
}

// Helper: Show custom toast alert
function showToast(msg) {
  const t = document.getElementById('toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => {
      t.classList.remove('show');
    }, 2800);
  }
}

// ==========================================
// 2. INTERACTIVE ANIMATIONS ON SCROLL
// ==========================================

// Smooth Number Counting Animation (0 -> target)
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const easeOutCube = t => 1 - Math.pow(1 - t, 3);
  
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = formatRupiah(Math.round(target * easeOutCube(p)));
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = formatRupiah(target);
    }
  }
  requestAnimationFrame(step);
}

// SVG Semicircle Gauge Progressive Loading Animation
function animateGauge(persen) {
  const circle = document.getElementById('gauge-fill');
  const text = document.getElementById('gauge-percent-text');
  if (!circle) return;
  
  const r = 90;
  const circ = Math.PI * r; // semicircle circumference is ~282.74
  const offset = circ - (circ * persen / 100);
  
  circle.style.strokeDasharray = circ;
  circle.style.strokeDashoffset = circ; // init at 100% gap (0% fill)
  
  // Animate stroke dashoffset
  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 100);

  // Animate percentage label text
  const start = performance.now();
  const duration = 2000;
  const easeOutCube = t => 1 - Math.pow(1 - t, 3);
  
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    if (text) {
      text.textContent = persenID(persen * easeOutCube(p)) + '%';
    }
    if (p < 1) {
      requestAnimationFrame(step);
    } else if (text) {
      // Selalu lewat persenID. Sebelumnya baris ini menulis `persen`
      // mentah, dan begitu CONFIG.persentase jadi float turunan
      // (53.75119866163336) angka panjang itu muncul di layar.
      text.textContent = persenID(persen) + '%';
    }
  }
  requestAnimationFrame(step);
}

// IntersectionObserver to trigger animations when section is visible
const boot = () => {
  // Initialize Lucide icons
  createIcons({ icons: lucideIcons });

  // 1. Sinkronkan semua angka statis dengan sumber data, lalu
  //    jalankan progress bar hero.
  const syncFigures = {
    'hero-progress-text': persenID(CONFIG.persentase),
    'hero-progress-amount': rupiah(CONFIG.terkumpul),
    'metric-persen': persenID(CONFIG.persentase),
    'metric-rab': rupiah(CONFIG.totalRAB),
    'metric-sisa': rupiah(CONFIG.sisa),
    'metric-kekurangan': persenID(100 - CONFIG.persentase),
    'bar-persen': persenID(CONFIG.persentase),
    'bar-amount': rupiah(CONFIG.terkumpul)
  };
  Object.entries(syncFigures).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  setTimeout(() => {
    const bar = document.getElementById('hero-progress-bar');
    if (bar) bar.style.clipPath = 'inset(0 ' + (100 - CONFIG.persentase).toFixed(1) + '% 0 0)';
  }, 500);

  // 2. Observer for Scroll Reveal elements
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
  
  reveals.forEach(el => revealObserver.observe(el));

  // 3. Observer for triggering Progress Counter and SVG Gauge
  const progressSection = document.getElementById('progress');
  let progressAnimated = false;
  
  if (progressSection) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !progressAnimated) {
          progressAnimated = true;
          
          // Run smooth counter based on current CONFIG value
          const counterEl = document.getElementById('counter-terkumpul');
          if (counterEl) {
            animateCounter(counterEl, CONFIG.terkumpul, 2500);
          }
          
          // Run semicircle gauge based on current CONFIG value
          animateGauge(CONFIG.persentase);
        }
      });
    }, { threshold: 0.1 });
    
    progressObserver.observe(progressSection);
  }

  // 4. Header Scroll styling & Mobile Sticky Donation bar Observer
  const headerLogo = document.getElementById('header-logo');
  const header = document.getElementById('main-header');
  const mobileDonateBar = document.getElementById('mobile-donate-bar');
  
  // Referensi di-cache sekali; sebelumnya querySelectorAll dipanggil
  // ulang tiap frame scroll dan itu sumber jank di perangkat lemah.
  const hLogo     = document.getElementById('header-logo');
  const hNama     = document.getElementById('header-nama');
  const hSub      = document.getElementById('header-sub');
  const hNavLinks = Array.from(document.querySelectorAll('.nav-link'));

  const HEADER_SOLID = 'position:fixed;top:0;left:0;right:0;z-index:100;'
    + 'background:rgba(255,255,255,0.98);backdrop-filter:blur(24px) saturate(160%);'
    + '-webkit-backdrop-filter:blur(24px) saturate(160%);'
    + 'box-shadow:0 1px 0 rgba(13,27,75,0.08);';
  const HEADER_CLEAR = 'position:fixed;top:0;left:0;right:0;z-index:100;background:transparent;';

  // Filter logo navy untuk header putih
  const LOGO_NAVY = 'brightness(0) saturate(100%) invert(15%) sepia(60%) '
    + 'saturate(700%) hue-rotate(200deg) brightness(85%)';

  function paintHeader(solid) {
    header.style.cssText = solid ? HEADER_SOLID : HEADER_CLEAR;
    if (hLogo) hLogo.style.filter = solid ? LOGO_NAVY : 'brightness(0) invert(1)';
    if (hNama) hNama.style.color  = solid ? '#1B2B6B' : '#ffffff';
    if (hSub)  hSub.style.color   = solid ? '#6B7280' : 'rgba(255,255,255,0.55)';
    const linkColor = solid ? '#374151' : 'rgba(255,255,255,0.85)';
    hNavLinks.forEach(l => { l.style.color = linkColor; });
  }

  // rAF-throttled: satu penulisan DOM per frame, dan hanya saat
  // state benar-benar berubah.
  let ticking = false;
  let isSolid = null;
  let barShown = null;

  function onScrollFrame() {
    ticking = false;
    const scrollPos = window.scrollY;

    const solid = scrollPos > 60 || document.body.dataset.solidHeader === "true";
    if (solid !== isSolid) {
      isSolid = solid;
      paintHeader(solid);
    }

    if (mobileDonateBar) {
      const show = scrollPos > 400;
      if (show !== barShown) {
        barShown = show;
        mobileDonateBar.classList.toggle('visible', show);
      }
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });

  // Cat sekali saat load secara sinkron. Jangan lewat rAF: di tab
  // yang belum terlihat rAF ditunda, dan header akan terlanjur
  // salah warna saat halaman dibuka lewat deep-link (#donatur).
  onScrollFrame();

  // Saat tab kembali terlihat, rAF yang tertunda bisa basi.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) onScrollFrame();
  });
};
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
Alpine.start();
