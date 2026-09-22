/* Prodose site chrome: shared header/nav, theme toggle, accessible tabs. No dependencies, works from file:// */
/* ProDose design lab helpers: storage, accessible tabs, small DOM utilities. The page chrome comes from the site. */
(function (G) {
  const S = (G.ProdoseSite = {});
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  S.store = store;
  S.theme = () => 'dark';

  // ---- accessible tabs: <div role=tablist> buttons[role=tab][aria-controls] + [role=tabpanel] ----
  S.tabs = function (list, onChange) {
    const tabs = [...list.querySelectorAll('[role=tab]')];
    const select = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (focus) t.focus(); if (onChange) onChange(t.dataset.tab || t.id);
    };
    tabs.forEach((t) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(t); let n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length]; else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0]; else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
    const start = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]; select(start);
    return { select: (id) => { const t = tabs.find((x) => (x.dataset.tab || x.id) === id); if (t) select(t); } };
  };

  // ---- small helpers used by several pages ----
  S.el = (tag, attrs, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) { if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v != null) e.setAttribute(k, v); }
    for (const c of kids.flat()) if (c != null) e.append(c.nodeType ? c : document.createTextNode(c));
    return e;
  };
  S.download = (name, text, type) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
})(window);
