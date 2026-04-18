import { f as escape_html, h as store_get, j as unsubscribe_stores } from './index-BFvLoYgI.js';
import { p as page } from './stores-GIpWCqRP.js';
import './root-BIbsLGYc.js';
import './state.svelte-uz4JHIbh.js';

function _error($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100"><h1 class="text-6xl font-bold text-red-600">${escape_html(store_get($$store_subs ??= {}, "$page", page).status)}</h1> <p class="text-2xl mt-4">${escape_html(store_get($$store_subs ??= {}, "$page", page).error?.message)}</p> <a href="/" class="mt-8 px-4 py-2 bg-blue-600 text-white rounded-md">Go to Homepage</a></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _error as default };
//# sourceMappingURL=_error.svelte-B7W3vclW.js.map
