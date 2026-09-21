(function () {
  const { designs, rows, agg, pct, meta } = Bench;
  const p1 = rows('P1');
  const A = Object.fromEntries(designs.map((d) => [d.key, agg(p1.filter((r) => r.d === d.key))]));
  const PRINCIPLE = {
    wheel: 'An inverted bottle drops pills into a rotating wheel with one slot per pill; a scraper strikes off extras.',
    arm: 'A vacuum-cup arm picks one pill from a bottle docked below and carries it to the outlet.',
    shuttle: 'A sliding plate with an adjustable pocket and compliant wiper lips carries exactly one pill to an exit hole.',
    lane: 'A sloped single-file lane, a clamp-pad escapement and a trapdoor chamber release one pill at a time.',
    belt: 'A slow feed belt, a fast spacing belt and an encoder-based optical count stop the feed at the dose.',
    vacdisc: 'A seed-meter disc with suction ports; a wedge strips anything not sealed to a port.',
  };
  const best = [...designs].sort((a, b) => A[b.key].doseRate.p - A[a.key].doseRate.p)[0];
  const tot = p1.length, cyc = p1.reduce((s, r) => s + r.ok + r.miss + r.multi, 0);
  document.getElementById('heroStats').innerHTML = [
    ['6', 'dispensing concepts, each a working simulated machine'],
    [meta.trials.toLocaleString(), 'simulated dispensing trials in the bench'],
    [cyc.toLocaleString(), 'metering cycles counted in the reliability protocol'],
    [best ? pct(A[best.key].doseRate.p) : '–', best ? `best dose-exact rate (${best.short}) across 8 real pills` : ''],
  ].map((s) => `<div class="card"><div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div></div>`).join('');
  document.getElementById('conceptCards').innerHTML = designs.map((d) => {
    const a = A[d.key];
    return `<div class="card concept-card" style="--dot:${d.color}"><div class="top"><span class="letter">${d.letter}</span><div><h3 style="margin:0">${d.name}</h3><div class="meta" style="margin:0">${d.family}</div></div></div><p>${PRINCIPLE[d.key]}</p><div class="nums"><div class="stat"><b>${pct(a.doseRate.p)}</b><span>doses exact</span></div><div class="stat"><b>${pct(a.single.p)}</b><span>single-pill</span></div><div class="stat"><b>${a.dmgPer100.toFixed(1)}</b><span>broken / 100</span></div></div><p style="margin:0"><a href="/work/prodose/simulation/simulator/?design=${d.key}">Simulate →</a></p></div>`;
  }).join('');
})();
