// dgotix.com: language menu (ar / en / fr / id / es), analytics chart and pricing switch.
  (function () {
    var root = document.documentElement, sel = document.getElementById('lang');
    var TITLE = { ar: 'DGOTIX — حلول إنتاجية رقمية | Digital Productivity Solutions', en: 'DGOTIX — Digital Productivity Solutions', fr: 'DGOTIX — Solutions de productivité numérique', id: 'DGOTIX — Solusi Produktivitas Digital', es: 'DGOTIX — Soluciones de productividad digital' };
    function ok(l) { return l === 'ar' || l === 'en' || l === 'fr' || l === 'id' || l === 'es'; }
    function set(l) {
      root.lang = l; root.dir = l === 'ar' ? 'rtl' : 'ltr';
      sel.value = l;
      document.title = TITLE[l];
      try { localStorage.setItem('dgotix-lang', l); } catch (e) {}
    }
    var saved = null; try { saved = localStorage.getItem('dgotix-lang'); } catch (e) {}
    var q = new URLSearchParams(location.search).get('lang');
    var nav = (navigator.language || 'ar').slice(0, 2);
    set(ok(q) ? q : ok(saved) ? saved : ok(nav) ? nav : 'en');
    sel.addEventListener('change', function () { set(sel.value); });
    document.getElementById('yr').textContent = new Date().getFullYear();
  })();
(function () {
  // Illustrative demo account (QAR), Oct 2025 - Sep 2026: [income, expenses].
  var M = [[37500,28395],[37500,30757],[45500,28957],[37500,41661],[37500,31056],[37500,39749],[37500,23668],[37500,24258],[43500,24500],[37500,33688],[37500,24935],[37500,26051]];
  var MON = {ar:['أكتوبر','نوفمبر','ديسمبر','يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر'], en:['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'], fr:['oct.','nov.','déc.','janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.'], id:['Okt','Nov','Des','Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep'], es:['oct','nov','dic','ene','feb','mar','abr','may','jun','jul','ago','sept']};
  var T = {ar:{inc:'الدخل',exp:'المصاريف',sav:'المدّخرات',period:'الفترة',cur:'ر.ق',q:['الربع 4 · 2025','الربع 1 · 2026','الربع 2 · 2026','الربع 3 · 2026'],h:['أكتوبر – مارس','أبريل – سبتمبر'],y:['أكتوبر 2025 – سبتمبر 2026']},
           en:{inc:'Income',exp:'Expenses',sav:'Savings',period:'Period',cur:'QAR',q:['Q4 2025','Q1 2026','Q2 2026','Q3 2026'],h:['Oct – Mar','Apr – Sep'],y:['Oct 2025 – Sep 2026']},
           fr:{inc:'Revenus',exp:'Dépenses',sav:'Épargne',period:'Période',cur:'QAR',q:['T4 2025','T1 2026','T2 2026','T3 2026'],h:['oct. – mars','avr. – sept.'],y:['oct. 2025 – sept. 2026']},
           id:{inc:'Pemasukan',exp:'Pengeluaran',sav:'Tabungan',period:'Periode',cur:'QAR',q:['K4 2025','K1 2026','K2 2026','K3 2026'],h:['Okt – Mar','Apr – Sep'],y:['Okt 2025 – Sep 2026']},
           es:{inc:'Ingresos',exp:'Gastos',sav:'Ahorro',period:'Periodo',cur:'QAR',q:['T4 2025','T1 2026','T2 2026','T3 2026'],h:['oct – mar','abr – sept'],y:['oct 2025 – sept 2026']}};
  var per = 'm', NS = 'http://www.w3.org/2000/svg';
  var svg = document.getElementById('chart'), tip = document.getElementById('tip');
  function lang() { var l = document.documentElement.lang; return l === 'en' || l === 'fr' || l === 'id' || l === 'es' ? l : 'ar'; }
  function groups() {
    var L = lang(), out = [], k = per === 'm' ? 1 : per === 'q' ? 3 : per === 'h' ? 6 : 12;
    for (var i = 0; i < 12; i += k) {
      var a = 0, b = 0; for (var j = i; j < i + k; j++) { a += M[j][0]; b += M[j][1]; }
      out.push({ label: per === 'm' ? MON[L][i] : T[L][per][i / k], inc: a, exp: b, sav: a - b });
    }
    return out;
  }
  function fmt(n) { return Math.round(n).toLocaleString('en-US'); }
  function short(n) { var a = Math.abs(n); return (n < 0 ? '\u200E−' : '') + (a >= 1000 ? (a / 1000).toFixed(a >= 100000 ? 0 : 1).replace(/\.0$/, '') + 'K' : String(a)); }
  function el(n, at) { var e = document.createElementNS(NS, n); for (var k in at) e.setAttribute(k, at[k]); return e; }
  function niceMax(v) { var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; }

  function render() {
    var L = lang(), G = groups(), rtl = L === 'ar';
    var W = Math.max(300, Math.round(svg.parentNode.clientWidth || 1000)), narrow = W < 600, H = narrow ? 300 : 380, padT = 14, padB = 40, padS = narrow ? 44 : 56, padE = 6;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var lo = Math.min(0, Math.min.apply(null, G.map(function (g) { return g.sav; })));
    var hi = niceMax(Math.max.apply(null, G.map(function (g) { return g.inc; })) * 1.05);
    var step = hi / 4, loN = lo < 0 ? -Math.ceil(-lo / step) * step : 0;
    var y = function (v) { return padT + (hi - v) / (hi - loN) * (H - padT - padB); };
    var x0 = rtl ? padE : padS, x1 = rtl ? W - padS : W - padE, cw = (x1 - x0) / G.length;
    var cx = function (i) { var k = rtl ? G.length - 1 - i : i; return x0 + cw * (k + .5); };
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    for (var v = loN; v <= hi + 1; v += step) {
      svg.appendChild(el('line', { x1: x0, x2: x1, y1: y(v), y2: y(v), stroke: v === 0 ? '#CBD5E1' : '#EEF2F7', 'stroke-width': v === 0 ? 1.5 : 1 }));
      var t = el('text', { x: rtl ? W - padS + 10 : padS - 10, y: y(v) + 4, 'text-anchor': rtl ? 'start' : 'end' }); t.textContent = short(v); svg.appendChild(t);
    }
    var bw = Math.min(26, cw * (narrow ? .34 : .28)), gap = 2;
    G.forEach(function (g, i) {
      var c = cx(i), grp = el('g', { class: 'grp', tabindex: 0 });
      grp.appendChild(el('rect', { class: 'hl', x: c - cw / 2 + 2, y: padT, width: cw - 4, height: H - padT - padB, rx: 8 }));
      [[g.inc, '#2a78d6', rtl ? 1 : -1], [g.exp, '#eb6834', rtl ? -1 : 1]].forEach(function (b) {
        var bx = b[2] < 0 ? c - gap / 2 - bw : c + gap / 2, top = y(b[0]), h = y(0) - top, r = Math.min(4, bw / 2);
        grp.appendChild(el('path', { class: 'bar', fill: b[1], d: 'M' + bx + ',' + y(0) + 'V' + (top + r) + 'Q' + bx + ',' + top + ' ' + (bx + r) + ',' + top + 'H' + (bx + bw - r) + 'Q' + (bx + bw) + ',' + top + ' ' + (bx + bw) + ',' + (top + r) + 'V' + y(0) + 'Z' }));
      });
      if (!(narrow && per === 'm' && i % 2)) { var lt = el('text', { x: c, y: H - 14, 'text-anchor': 'middle' }); lt.textContent = narrow && per === 'q' ? ({ ar: ['الربع 4', 'الربع 1', 'الربع 2', 'الربع 3'], en: ['Q4 25', 'Q1 26', 'Q2 26', 'Q3 26'], fr: ['T4 25', 'T1 26', 'T2 26', 'T3 26'], id: ['K4 25', 'K1 26', 'K2 26', 'K3 26'], es: ['T4 25', 'T1 26', 'T2 26', 'T3 26'] })[L][i] : g.label; grp.appendChild(lt); }
      var hit = el('rect', { class: 'hit', x: c - cw / 2, y: 0, width: cw, height: H });
      grp.appendChild(hit);
      function show() {
        svg.querySelectorAll('.grp.on').forEach(function (n) { n.classList.remove('on'); }); grp.classList.add('on');
        while (tip.firstChild) tip.removeChild(tip.firstChild);
        var tt = document.createElement('div'); tt.className = 't'; tt.textContent = g.label; tip.appendChild(tt);
        [[g.inc, T[L].inc, '#2a78d6'], [g.exp, T[L].exp, '#eb6834'], [g.sav, T[L].sav, '#1baf7a']].forEach(function (r) {
          var row = document.createElement('div'); row.className = 'r';
          var nm = document.createElement('span'); var key = document.createElement('i'); key.style.background = r[2];
          nm.appendChild(key); nm.appendChild(document.createTextNode(' ' + r[1]));
          var val = document.createElement('b'); val.textContent = (r[0] < 0 ? '−' : '') + fmt(Math.abs(r[0])) + ' ' + T[L].cur;
          row.appendChild(nm); row.appendChild(val); tip.appendChild(row);
        });
        var box = svg.getBoundingClientRect(), sc = box.width / W, px = c * sc, tw = tip.offsetWidth || 180;
        tip.style.left = Math.max(0, Math.min(box.width - tw, px - tw / 2)) + 'px'; tip.style.top = (y(Math.max(g.inc, g.exp)) * sc - 10 - (tip.offsetHeight || 90)) + 'px';
        if (parseFloat(tip.style.top) < 0) tip.style.top = '0px';
        tip.classList.add('on');
      }
      function hide() { grp.classList.remove('on'); tip.classList.remove('on'); }
      grp.addEventListener('pointerenter', show); grp.addEventListener('pointerleave', hide);
      grp.addEventListener('focus', show); grp.addEventListener('blur', hide);
      svg.appendChild(grp);
    });
    // savings line on the same axis (same unit), drawn above the bars
    var pts = G.map(function (g, i) { return [cx(i), y(g.sav)]; });
    if (pts.length > 1) svg.appendChild(el('polyline', { points: pts.map(function (p) { return p.join(','); }).join(' '), fill: 'none', stroke: '#1baf7a', 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'pointer-events': 'none' }));
    pts.forEach(function (p, i) {
      svg.appendChild(el('circle', { cx: p[0], cy: p[1], r: 5.5, fill: '#1baf7a', stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }));
    });
    // selective direct label: the latest period's savings
    var last = pts.length - 1, lb = el('text', { x: pts[last][0], y: pts[last][1] - 12, 'text-anchor': 'middle', style: 'font-weight:700;fill:#0F172A' });
    lb.textContent = short(G[last].sav); svg.appendChild(lb);
    // KPIs + table
    var LG = G[G.length - 1], tI = LG.inc, tE = LG.exp;
    document.getElementById('kcap').textContent = ({ ar: per === 'y' ? 'آخر 12 شهراً: ' : 'آخر فترة: ', en: per === 'y' ? 'Last 12 months: ' : 'Latest period: ', fr: per === 'y' ? '12 derniers mois\u202f: ' : 'Dernière période\u202f: ', id: per === 'y' ? '12 bulan terakhir: ' : 'Periode terakhir: ', es: per === 'y' ? 'Últimos 12 meses: ' : 'Último periodo: ' })[L] + LG.label;
    document.getElementById('kI').textContent = fmt(tI); document.getElementById('kE').textContent = fmt(tE);
    document.getElementById('kS').textContent = (tI - tE < 0 ? '−' : '') + fmt(Math.abs(tI - tE));
    ['kI', 'kE', 'kS'].forEach(function (id) { var s = document.createElement('small'); s.textContent = T[L].cur; document.getElementById(id).appendChild(s); });
    document.getElementById('kR').textContent = (Math.round((tI - tE) / tI * 1000) / 10) + '%';
    var tb = document.getElementById('tbl'); while (tb.firstChild) tb.removeChild(tb.firstChild);
    var hr = tb.insertRow(); [T[L].period, T[L].inc, T[L].exp, T[L].sav].forEach(function (h) { var th = document.createElement('th'); th.textContent = h; hr.appendChild(th); });
    G.forEach(function (g) { var r = tb.insertRow(); var c0 = r.insertCell(); c0.textContent = g.label;
      [g.inc, g.exp, g.sav].forEach(function (v) { var c = r.insertCell(); c.className = 'n'; c.textContent = (v < 0 ? '−' : '') + fmt(Math.abs(v)); }); });
  }
  document.getElementById('seg').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; per = b.getAttribute('data-p');
    this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); render();
  });
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  var rz; window.addEventListener('resize', function () { tip.classList.remove('on'); clearTimeout(rz); rz = setTimeout(render, 120); });
  render();
})();

  // Pricing: yearly / monthly switch.
  (function () {
    var btns = document.querySelectorAll('#pricing .seg button');
    function show(period) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.period === period)); });
      var L = document.documentElement.lang;
      var U = { ar: ['/ سنة', '/ شهر'], en: ['/ year', '/ month'], fr: ['/ an', '/ mois'], id: ['/ tahun', '/ bulan'], es: ['/ año', '/ mes'] }[L] || ['/ year', '/ month'];
      document.querySelectorAll('#pricing .price[data-m]').forEach(function (el) {
        var y = period === 'yearly';
        el.querySelector('b').textContent = '$' + (y ? el.dataset.y : el.dataset.m);
        el.querySelector('[data-u]').textContent = y ? U[0] : U[1];
        var per = el.nextElementSibling, pm = per.dataset.pm;
        per.textContent = !y ? '' : L === 'ar' ? 'أي ' + pm + '$ شهرياً' : L === 'fr' ? 'soit ' + pm + '\u00a0$ par mois' : L === 'id' ? 'atau $' + pm + ' per bulan' : L === 'es' ? 'o sea ' + pm + ' $ al mes' : 'that is $' + pm + ' a month';
      });
      window.__period = period;
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.period); }); });
    show('yearly');
    document.getElementById('lang').addEventListener('change', function () { setTimeout(function () { show(window.__period || 'yearly'); }, 0); });
  })();
