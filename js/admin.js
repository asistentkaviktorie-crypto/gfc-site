(function(){
  var LANGS = ['en','es','de','ru','cs'];
  var items = (window.GFC_LISTINGS || []).slice();
  var form = document.getElementById('f'), list = document.getElementById('list');
  var out = document.getElementById('out'), msg = document.getElementById('msg'), saveBtn = document.getElementById('save');
  var editing = -1;
  function f(n){ return form.elements[n]; }
  function v(n){ return f(n).value.trim(); }
  function el(tag, cls, text){ var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function fileText(){
    return '/* Green Future Capital listings. Generated on the staff page, ' + new Date().toISOString().slice(0,10) +
      '.\n   Only entries with "published": true are shown to visitors. */\nwindow.GFC_LISTINGS = ' + JSON.stringify(items, null, 2) + ';\n';
  }
  function say(s){ msg.textContent = s; }
  function clear(){ form.reset(); editing = -1; saveBtn.textContent = 'Add asset to the list'; }
  function draw(){
    list.textContent = '';
    if (!items.length) list.appendChild(el('p', '', 'No assets in the list yet.'));
    items.forEach(function(x, i){
      var row = el('div', 'row'), left = el('div');
      left.appendChild(el('strong', '', (x.ref ? x.ref + ' \u00b7 ' : '') + ((x.title && x.title.en) || '')));
      left.appendChild(el('br'));
      left.appendChild(el('span', 's', x.category + ' \u00b7 ' + (x.published ? 'SHOWN on the site' : 'hidden')));
      var b = el('div', 'b');
      var e = el('button', '', 'Edit'); e.type = 'button'; e.onclick = function(){ load(i); };
      var s = el('button', '', x.published ? 'Hide' : 'Show'); s.type = 'button';
      s.onclick = function(){ x.published = !x.published; draw(); say('Changed. Download the file and upload it to the server.'); };
      var d = el('button', '', 'Delete'); d.type = 'button';
      d.onclick = function(){ items.splice(i, 1); clear(); draw(); say('Deleted from the list. Download the file and upload it to the server.'); };
      b.appendChild(e); b.appendChild(s); b.appendChild(d);
      row.appendChild(left); row.appendChild(b); list.appendChild(row);
    });
    out.value = fileText();
  }
  function load(i){
    var x = items[i]; editing = i;
    f('ref').value = x.ref || ''; f('category').value = x.category || 'hotel'; f('location').value = x.location || '';
    f('size').value = x.size || ''; f('price').value = x.price || ''; f('photo').value = x.photo || ''; f('published').checked = !!x.published;
    LANGS.forEach(function(l){ f('title_' + l).value = (x.title && x.title[l]) || ''; f('summary_' + l).value = (x.summary && x.summary[l]) || ''; });
    saveBtn.textContent = 'Save changes'; say('Editing ' + (x.ref || '')); form.scrollIntoView();
  }
  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    if (!v('ref') || !v('title_en')) { say('Reference and the English title are required.'); return; }
    var x = {ref: v('ref'), category: v('category'), published: f('published').checked, location: v('location'),
             size: v('size'), price: v('price'), photo: v('photo'), title: {}, summary: {}};
    LANGS.forEach(function(l){ if (v('title_' + l)) x.title[l] = v('title_' + l); if (v('summary_' + l)) x.summary[l] = v('summary_' + l); });
    if (editing >= 0) items[editing] = x; else items.push(x);
    clear(); draw(); say('Saved in the list. Now download the file and upload it to the server.');
  });
  document.getElementById('reset').onclick = function(){ clear(); say(''); };
  document.getElementById('download').onclick = function(){
    try {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([fileText()], {type: 'text/javascript'}));
      a.download = 'listings.js'; document.body.appendChild(a); a.click(); a.remove();
      say('File listings.js downloaded. Upload it to the folder data on the server.');
    } catch (e) { say('Download is not available here. Copy the text from the box below into data/listings.js.'); }
  };
  document.getElementById('copy').onclick = function(){
    out.select();
    try { navigator.clipboard.writeText(out.value).then(function(){ say('Copied.'); }, function(){ say('Select the text and copy it by hand.'); }); }
    catch (e) { say('Select the text and copy it by hand.'); }
  };
  draw();
})();
