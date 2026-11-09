import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errors = new Rate('request_errors');
const latency = new Trend('request_latency', true);
const target = __ENV.NEXORA_LOAD_URL || '';
const approved = __ENV.NEXORA_LOAD_AUTHORIZED === 'true';
const environment = (__ENV.NEXORA_LOAD_ENV || '').toLowerCase();
const allowlist = (__ENV.NEXORA_LOAD_HOST_ALLOWLIST || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
const vus = Number(__ENV.NEXORA_LOAD_VUS || 1);
const durationSeconds = Number(__ENV.NEXORA_LOAD_DURATION_SECONDS || 30);

function validate() {
  if (!approved) throw new Error('Set NEXORA_LOAD_AUTHORIZED=true only after receiving explicit written approval.');
  if (environment !== 'staging') throw new Error('Load tests are staging-only: set NEXORA_LOAD_ENV=staging.');
  let parsed;
  try { parsed = new URL(target); } catch { throw new Error('NEXORA_LOAD_URL must be an absolute URL.'); }
  if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') throw new Error('Use HTTPS for non-local targets.');
  if (!allowlist.includes(parsed.hostname.toLowerCase())) throw new Error('Target hostname is not in NEXORA_LOAD_HOST_ALLOWLIST.');
  if (!Number.isInteger(vus) || vus < 1 || vus > 100) throw new Error('NEXORA_LOAD_VUS must be between 1 and 100.');
  if (!Number.isInteger(durationSeconds) || durationSeconds < 30 || durationSeconds > 300) throw new Error('NEXORA_LOAD_DURATION_SECONDS must be between 5 and 300.');
  if (/vercel\.app$|netlify\.app$|github\.io$/i.test(parsed.hostname)) throw new Error('Hosted preview aliases are blocked by default; use an explicitly approved staging hostname.');
  return parsed;
}

const safeTarget = validate();
export const options = {
  scenarios: {
    bounded_smoke: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '10s', target: Math.min(vus, 5) },
        { duration: Math.max(5, durationSeconds - 20) + 's', target: vus },
        { duration: '10s', target: 0 }
      ],
      gracefulRampDown: '5s'
    }
  },
  thresholds: {
    request_errors: ['rate<0.02'],
    http_req_duration: ['p(95)<1500']
  },
  noConnectionReuse: false
};

export default function () {
  const response = http.get(safeTarget.href, { redirects: 5, timeout: '10s', tags: { scenario: 'read-only-homepage' } });
  const ok = check(response, { 'HTTP status below 400': value => value.status > 0 && value.status < 400 });
  errors.add(!ok);
  latency.add(response.timings.duration);
  sleep(1);
}
