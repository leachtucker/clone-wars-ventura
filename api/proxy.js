/**
 * In-app browser proxy for Clone Wars (OS Clone).
 *
 * Sites like GitHub and Netflix forbid being shown inside another page
 * (X-Frame-Options / CSP frame-ancestors), so the simulated Chrome cannot
 * iframe them directly. This function fetches the page server-side,
 * strips the anti-framing headers, and injects a small shim that keeps
 * navigation (link clicks, GET/POST forms, window.open) inside the
 * proxy — so pages stay in the simulated browser window instead of
 * escaping into real browser tabs.
 *
 * Scope guards (this is not a general-purpose open proxy):
 * - Only hosts on the allowlist (plus their subdomains) can be fetched,
 *   and redirects may not leave the allowlist.
 * - Only HTML documents are proxied; anything else is bounced back to
 *   the original URL with a redirect.
 * - No cookies are forwarded or stored: sites see an anonymous visitor,
 *   so sign-in flows and DRM playback (Netflix) cannot work through it.
 */

const ALLOWED_HOSTS = [
  'github.com',
  'netflix.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'amazon.com',
  'youtube.com',
  'linkedin.com',
  'twitch.tv',
];

const MAX_BODY_BYTES = 5 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15000;

function isAllowedHost(hostname) {
  const host = hostname.toLowerCase();
  return ALLOWED_HOSTS.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`)
  );
}

/** The script injected into proxied pages to keep navigation in-window. */
function navigationShim() {
  const allowedJson = JSON.stringify(ALLOWED_HOSTS);
  return `<script>
(function () {
  // Absolute prefix: proxied pages carry a <base href> pointing at the
  // original site, so a relative /api/proxy URL would resolve against
  // the original host instead of this one.
  var PREFIX = window.location.origin + '/api/proxy?url=';
  var ALLOWED = ${allowedJson};
  function isAllowed(host) {
    return ALLOWED.some(function (allowed) {
      return host === allowed || host.endsWith('.' + allowed);
    });
  }
  function toProxy(rawUrl) {
    try {
      var abs = new URL(rawUrl, document.baseURI);
      if (!/^https?:$/.test(abs.protocol)) return null;
      if (abs.pathname.indexOf('/api/proxy') === 0) return abs.href;
      // Only allowlisted hosts route through the proxy; anything else
      // navigates the frame directly (and loads if it allows framing).
      if (!isAllowed(abs.hostname.toLowerCase())) return null;
      return PREFIX + encodeURIComponent(abs.href);
    } catch (e) {
      return null;
    }
  }
  function skippable(href) {
    return (
      !href ||
      href.charAt(0) === '#' ||
      /^(mailto:|tel:|javascript:|data:)/i.test(href)
    );
  }
  // Rewrite link/form targets in the DOM itself, so framework routers
  // (which read href and fetch it themselves) also stay in the proxy —
  // those fetches become same-origin and actually succeed.
  function rewriteWithin(root) {
    if (!root || !root.querySelectorAll) return;
    var anchors = root.querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) {
      var anchor = anchors[i];
      if (anchor.dataset.proxiedHref) continue;
      var href = anchor.getAttribute('href');
      if (skippable(href)) continue;
      var proxied = toProxy(href);
      if (proxied) {
        anchor.dataset.proxiedHref = '1';
        anchor.setAttribute('href', proxied);
        anchor.removeAttribute('target');
      }
    }
    var forms = root.querySelectorAll('form[action]');
    for (var j = 0; j < forms.length; j++) {
      var form = forms[j];
      if (form.dataset.proxiedAction) continue;
      var formProxied = toProxy(form.getAttribute('action'));
      if (formProxied) {
        form.dataset.proxiedAction = '1';
        form.setAttribute('action', formProxied);
      }
    }
  }
  document.addEventListener(
    'click',
    function (event) {
      var node = event.target;
      var anchor = node && node.closest ? node.closest('a[href]') : null;
      if (!anchor || anchor.dataset.proxiedHref) return;
      var href = anchor.getAttribute('href');
      if (skippable(href)) return;
      var proxied = toProxy(href);
      if (proxied) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.href = proxied;
      }
    },
    true
  );
  document.addEventListener(
    'submit',
    function (event) {
      var form = event.target;
      if (!form || form.dataset.proxiedAction) return;
      var action = form.getAttribute('action') || document.baseURI;
      var proxied = toProxy(action);
      if (proxied) {
        form.dataset.proxiedAction = '1';
        form.setAttribute('action', proxied);
      }
    },
    true
  );
  window.open = function (rawUrl) {
    if (rawUrl) {
      var proxied = toProxy(rawUrl);
      if (proxied) window.location.href = proxied;
    }
    return window;
  };
  function init() {
    rewriteWithin(document);
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (added[j].nodeType === 1) {
            rewriteWithin(added[j].parentNode || document);
          }
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</scr` + `ipt>`;
}

function errorPage(status, message) {
  return {
    status,
    body: `<!doctype html><html><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;padding:2rem;color:#333">
<h2 style="font-weight:600">This page could not be loaded in the browser window</h2>
<p>${message}</p>
</body></html>`,
  };
}

export default async function handler(req, res) {
  const sendHtml = (status, body) => {
    res.writeHead(status, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    });
    res.end(body);
  };

  try {
    const requestUrl = new URL(req.url, 'http://localhost');
    const targetParam = requestUrl.searchParams.get('url');
    if (!targetParam) {
      const { status, body } = errorPage(400, 'Missing url parameter.');
      return sendHtml(status, body);
    }

    let target;
    try {
      target = new URL(targetParam);
    } catch (err) {
      const { status, body } = errorPage(400, 'That URL is not valid.');
      return sendHtml(status, body);
    }

    if (!/^https?:$/.test(target.protocol) || !isAllowedHost(target.hostname)) {
      const { status, body } = errorPage(
        403,
        `The built-in browser proxy only loads its known blocked sites (${ALLOWED_HOSTS.join(
          ', '
        )}).`
      );
      return sendHtml(status, body);
    }

    // Collect a request body for POST form submissions.
    let requestBody;
    if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > MAX_BODY_BYTES) {
          const { status, body } = errorPage(413, 'Request too large.');
          return sendHtml(status, body);
        }
        chunks.push(chunk);
      }
      requestBody = Buffer.concat(chunks);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let upstream;
    try {
      upstream = await fetch(target.href, {
        method: req.method || 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          accept:
            req.headers && req.headers.accept
              ? req.headers.accept
              : 'text/html,application/xhtml+xml',
          'accept-language': 'en-US,en;q=0.9',
          ...(req.headers && req.headers['content-type']
            ? { 'content-type': req.headers['content-type'] }
            : {}),
        },
        body: requestBody,
      });
    } finally {
      clearTimeout(timeout);
    }

    // Redirects may not smuggle the proxy off the allowlist.
    const finalUrl = new URL(upstream.url || target.href);
    if (!isAllowedHost(finalUrl.hostname)) {
      const { status, body } = errorPage(
        403,
        'That site redirected somewhere the proxy does not load.'
      );
      return sendHtml(status, body);
    }

    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      // Assets and downloads load straight from the source — only
      // framed *documents* are blocked by anti-framing headers.
      res.writeHead(302, { location: finalUrl.href });
      return res.end();
    }

    let html = await upstream.text();
    if (html.length > MAX_BODY_BYTES) {
      const { status, body } = errorPage(413, 'That page is too large to proxy.');
      return sendHtml(status, body);
    }

    // Remove any existing <base> so ours wins, and drop meta refreshes
    // that would navigate the frame out of the proxy.
    html = html.replace(/<base\b[^>]*>/gi, '');
    html = html.replace(
      /<meta\b[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*>/gi,
      ''
    );

    const injection = `<base href="${finalUrl.href.replace(
      /"/g,
      '%22'
    )}">${navigationShim()}`;

    if (/<head\b[^>]*>/i.test(html)) {
      html = html.replace(/<head\b[^>]*>/i, (match) => `${match}${injection}`);
    } else if (/<html\b[^>]*>/i.test(html)) {
      html = html.replace(/<html\b[^>]*>/i, (match) => `${match}${injection}`);
    } else {
      html = injection + html;
    }

    // Serve from our own origin WITHOUT the headers that forbid framing:
    // no X-Frame-Options, no Content-Security-Policy, no COOP/COEP/CORP.
    return sendHtml(upstream.status, html);
  } catch (err) {
    const { status, body } = errorPage(
      502,
      'The proxy could not reach that site. It may be down, or it may be blocking automated requests.'
    );
    return sendHtml(status, body);
  }
}
