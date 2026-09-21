/* Prodose, contact model.
 *
 * Matter.js's stock velocity solver is not Coulomb friction: its kinetic friction impulse is μ·timeScale³ per step,
 * independent of the normal force, which at a 2 ms step is ~20× too weak (the validation suite shows blocks sliding
 * down a μ = 0.3 plane exactly as if frictionless) and its restitution is attenuated by the resting-contact logic.
 * This file replaces `Resolver.preSolveVelocity` / `Resolver.solveVelocity` with a sequential-impulse solver:
 *
 *   • normal impulse  jn ≥ 0 accumulated over the velocity iterations, target separating speed −e·vn0
 *                    (e = pair restitution, only above a resting threshold, vn0 = approach speed before any impulse)
 *   • friction        jt clamped to ±μ·jn, μs when the contact starts (nearly) sticking, μk when sliding
 *   • contacts share the pair's impulse; rotation and body inertia are included (rolling works)
 *
 * The position solver, constraints and broad/narrow phase remain Matter's.  Everything else in the simulation therefore
 * gets real friction: pills held on a ramp need μ ≥ tan θ, the wheel drags what it should, belts transport by friction. */
(function (G) {
  const Matter = G.Matter || require('matter-js');
  const R = Matter.Resolver;
  const P = (G.Prodose = G.Prodose || {});

  const REST_THRESH = 0.09;      // mm/ms approach speed above which restitution acts (90 mm/s)
  const STICK_THRESH = 0.012;    // mm/ms tangential speed below which the contact starts in static friction

  R.preSolveVelocity = function (pairs) {
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (!pair.isActive || pair.isSensor) continue;
      const cs = pair.contacts;
      for (let j = 0; j < pair.contactCount; j++) { const c = cs[j]; c.jn = 0; c.jt = 0; c.init = false; }
    }
  };

  R.solveVelocity = function (pairs, delta) {
    const step = delta || 2;                                       // ms
    const restThr = REST_THRESH * step, stickThr = STICK_THRESH * step;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (!pair.isActive || pair.isSensor) continue;
      const col = pair.collision, A = col.parentA, B = col.parentB;
      const nx = col.normal.x, ny = col.normal.y, tx = col.tangent.x, ty = col.tangent.y;
      const invMA = A.isStatic || A.isSleeping ? 0 : A.inverseMass, invMB = B.isStatic || B.isSleeping ? 0 : B.inverseMass;
      const invIA = A.isStatic || A.isSleeping ? 0 : A.inverseInertia, invIB = B.isStatic || B.isSleeping ? 0 : B.inverseInertia;
      const muK = pair.friction, muS = Math.max(pair.friction, pair.frictionStatic), e = pair.restitution;
      const cs = pair.contacts, cc = pair.contactCount, share = 1 / cc;

      for (let j = 0; j < cc; j++) {
        const c = cs[j], v = c.vertex;
        const rAx = v.x - A.position.x, rAy = v.y - A.position.y, rBx = v.x - B.position.x, rBy = v.y - B.position.y;

        // ---- relative velocity at the contact. Matter's collision normal points from B towards A, so approach means
        //      a NEGATIVE normal component of (vA - vB); s below is the approach speed (positive when closing).
        let vAx = A.position.x - A.positionPrev.x, vAy = A.position.y - A.positionPrev.y, wA = A.angle - A.anglePrev;
        let vBx = B.position.x - B.positionPrev.x, vBy = B.position.y - B.positionPrev.y, wB = B.angle - B.anglePrev;
        let ux = (vAx - rAy * wA) - (vBx - rBy * wB), uy = (vAy + rAx * wA) - (vBy + rBx * wB);
        let s = -(nx * ux + ny * uy), vt = tx * ux + ty * uy;
        if (!c.init) { c.init = true; c.vn0 = s; c.vt0 = vt; }

        // ---- normal impulse J = n*jn on A and -J on B (pushes them apart)
        const rnA = rAx * ny - rAy * nx, rnB = rBx * ny - rBy * nx;
        const kn = invMA + invMB + invIA * rnA * rnA + invIB * rnB * rnB;
        if (kn > 0) {
          const target = c.vn0 > restThr ? -e * c.vn0 : 0;
          let jn = ((s - target) / kn) * share;
          const acc = Math.max(0, c.jn + jn); jn = acc - c.jn; c.jn = acc;
          const Jx = nx * jn, Jy = ny * jn;
          if (invMA) { A.positionPrev.x -= Jx * invMA; A.positionPrev.y -= Jy * invMA; A.anglePrev -= (rAx * Jy - rAy * Jx) * invIA; }
          if (invMB) { B.positionPrev.x += Jx * invMB; B.positionPrev.y += Jy * invMB; B.anglePrev += (rBx * Jy - rBy * Jx) * invIB; }
          vAx = A.position.x - A.positionPrev.x; vAy = A.position.y - A.positionPrev.y; wA = A.angle - A.anglePrev;
          vBx = B.position.x - B.positionPrev.x; vBy = B.position.y - B.positionPrev.y; wB = B.angle - B.anglePrev;
          ux = (vAx - rAy * wA) - (vBx - rBy * wB); uy = (vAy + rAx * wA) - (vBy + rBx * wB);
          vt = tx * ux + ty * uy;
        }

        // ---- Coulomb friction: |jt| <= mu * jn  (static mu when the contact starts sticking, kinetic when sliding)
        const rtA = rAx * ty - rAy * tx, rtB = rBx * ty - rBy * tx;
        const kt = invMA + invMB + invIA * rtA * rtA + invIB * rtB * rtB;
        if (kt > 0 && c.jn > 0) {
          const mu = Math.abs(c.vt0) < stickThr ? muS : muK;
          const lim = mu * c.jn;
          let jt = (-vt / kt) * share;
          const acc = Math.max(-lim, Math.min(lim, c.jt + jt)); jt = acc - c.jt; c.jt = acc;
          const Jx = tx * jt, Jy = ty * jt;
          if (invMA) { A.positionPrev.x -= Jx * invMA; A.positionPrev.y -= Jy * invMA; A.anglePrev -= (rAx * Jy - rAy * Jx) * invIA; }
          if (invMB) { B.positionPrev.x += Jx * invMB; B.positionPrev.y += Jy * invMB; B.anglePrev += (rBx * Jy - rBy * Jx) * invIB; }
        }
      }
    }
  };

  P.contactModel = 'sequential-impulse, Coulomb friction';
})(typeof window !== 'undefined' ? window : globalThis);
