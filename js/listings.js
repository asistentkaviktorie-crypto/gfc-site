(function(){
  var EMAIL = 'greenfuturecapitalspain@gmail.com';
  var all = (window.GFC_LISTINGS || []).filter(function(x){ return x && x.published; });
  var lang = document.documentElement.lang || 'en';
  var T = {
    en:{hotel:'Hotel',land:'Land',residential:'Residential',loc:'Location',size:'Size',price:'Price guide',ask:'Request details'},
    es:{hotel:'Hotel',land:'Suelo',residential:'Residencial',loc:'Ubicaci\u00f3n',size:'Tama\u00f1o',price:'Precio orientativo',ask:'Solicitar informaci\u00f3n'},
    de:{hotel:'Hotel',land:'Grundst\u00fcck',residential:'Wohnprojekt',loc:'Lage',size:'Gr\u00f6\u00dfe',price:'Preisrahmen',ask:'Details anfragen'},
    ru:{hotel:'\u041e\u0442\u0435\u043b\u044c',land:'\u0417\u0435\u043c\u043b\u044f',residential:'\u0416\u0438\u043b\u043e\u0439 \u043f\u0440\u043e\u0435\u043a\u0442',loc:'\u0420\u0430\u0441\u043f\u043e\u043b\u043e\u0436\u0435\u043d\u0438\u0435',size:'\u0420\u0430\u0437\u043c\u0435\u0440',price:'\u041e\u0440\u0438\u0435\u043d\u0442\u0438\u0440 \u0446\u0435\u043d\u044b',ask:'\u0417\u0430\u043f\u0440\u043e\u0441\u0438\u0442\u044c \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u043e\u0441\u0442\u0438'},
    cs:{hotel:'Hotel',land:'Pozemek',residential:'Reziden\u010dn\u00ed projekt',loc:'Lokalita',size:'Velikost',price:'Orienta\u010dn\u00ed cena',ask:'Vy\u017e\u00e1dat podrobnosti'}
  };
  var t = T[lang] || T.en;
  var ART = {hotel:'photos/hotel.jpg', land:'photos/land.jpg', residential:'photos/residential.jpg'};
  function pick(o){ return (o && (o[lang] || o.en)) || ''; }
  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  var sections = document.querySelectorAll('[data-listings]');
  for (var i = 0; i < sections.length; i++) {
    var sec = sections[i], cat = sec.getAttribute('data-listings'), root = sec.getAttribute('data-root') || '';
    var items = all.filter(function(x){ return cat === 'all' || x.category === cat; });
    if (!items.length) continue;
    var grid = sec.querySelector('.cards');
    items.forEach(function(x){
      var card = el('article', 'card');
      var img = el('img');
      img.src = x.photo ? root + 'img/listings/' + x.photo : root + 'img/' + (ART[x.category] || 'photos/coast.jpg');
      img.alt = pick(x.title);
      card.appendChild(img);
      var box = el('div', 'in');
      box.appendChild(el('span', 'ref', (t[x.category] || '') + (x.ref ? ' \u00b7 ' + x.ref : '')));
      box.appendChild(el('h3', '', pick(x.title)));
      if (pick(x.summary)) box.appendChild(el('p', '', pick(x.summary)));
      var dl = el('dl');
      [[t.loc, x.location], [t.size, x.size], [t.price, x.price]].forEach(function(r){
        if (!r[1]) return;
        var d = el('div'); d.appendChild(el('dt', '', r[0])); d.appendChild(el('dd', '', r[1])); dl.appendChild(d);
      });
      if (dl.children.length) box.appendChild(dl);
      var a = el('a', 'more', t.ask);
      a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Ref ' + (x.ref || pick(x.title)));
      box.appendChild(a);
      card.appendChild(box);
      grid.appendChild(card);
    });
    sec.hidden = false;
  }
  /* Photographs: if img/photos/<name>.jpg exists it replaces the illustration img/<name>.svg. */
  var pics = document.querySelectorAll('img');
  for (var j = 0; j < pics.length; j++) {
    (function(im){
      var m = /^(.*)img\/(coast|hotel|land|residential)\.svg$/.exec(im.getAttribute('src') || '');
      if (!m) return;
      var probe = new Image();
      probe.onload = function(){ im.src = probe.src; };
      probe.src = m[1] + 'img/photos/' + m[2] + '.jpg';
    })(pics[j]);
  }
  /* Copy the email address: works where no mail program is set up. */
  var copies = document.querySelectorAll('[data-copy]');
  for (var k = 0; k < copies.length; k++) {
    copies[k].addEventListener('click', function(){
      var b = this, text = b.getAttribute('data-copy'), label = b.textContent;
      function done(){ b.textContent = b.getAttribute('data-done') + ': ' + text; setTimeout(function(){ b.textContent = label; }, 4000); }
      function fallback(){
        var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch (e) {}
        t.remove(); done();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    });
  }
})();
