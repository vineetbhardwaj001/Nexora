'use strict';

const ROLES = ['first-time visitor', 'returning customer', 'mobile customer', 'accessibility-focused user', 'busy professional', 'price-conscious buyer', 'detail-oriented researcher', 'new staff member', 'power user', 'error-recovery user'];
const GOALS = ['understand the product and find the primary action', 'complete the main customer journey', 'find account and profile controls', 'compare available options before deciding', 'recover from an interrupted journey', 'find help and contact information', 'complete a task with keyboard-only navigation', 'use the product on a narrow mobile screen', 'find policy, pricing or trust information', 'understand validation and error feedback'];
const DEVICES = ['desktop-1440', 'laptop-1280', 'tablet-768', 'mobile-390', 'mobile-360'];
const CONSTRAINTS = ['slow network', 'short attention window', 'keyboard only', 'large text preference', 'unfamiliar terminology', 'small viewport', 'interrupted session', 'minimal data entry', 'needs clear confirmation', 'prefers self-service'];
const JOURNEYS = ['explore then act', 'direct-to-task', 'compare then decide', 'recover and retry', 'navigate by landmarks', 'search and verify', 'mobile-first flow', 'returning-session flow', 'help-first flow', 'edge-case exploration'];

function generatePersonas(count = 100, seed = 'nexora') {
  if (!Number.isInteger(count) || count < 1 || count > 10000) {
    throw new RangeError('Persona count must be an integer between 1 and 10000.');
  }
  const hash = [...String(seed)].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7);
  return Array.from({ length: count }, (_, index) => {
    const offset = (index + hash) % 50000;
    return {
      id: 'NX-' + String(index + 1).padStart(4, '0'),
      role: ROLES[offset % ROLES.length],
      goal: GOALS[Math.floor(offset / 10) % GOALS.length],
      device: DEVICES[Math.floor(offset / 100) % DEVICES.length],
      constraint: CONSTRAINTS[Math.floor(offset / 500) % CONSTRAINTS.length],
      journey: JOURNEYS[Math.floor(offset / 5000) % JOURNEYS.length],
      seed: String(seed),
      status: 'planned-not-executed'
    };
  });
}

module.exports = { generatePersonas, ROLES, GOALS, DEVICES, CONSTRAINTS, JOURNEYS };
