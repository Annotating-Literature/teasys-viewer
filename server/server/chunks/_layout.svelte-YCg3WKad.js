import { H as Header } from './Header-BgwZ4kuZ.js';
import { f as escape_html } from './index-BFvLoYgI.js';

function Footer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<footer class="border-t border-gray-200/50 mt-20"><div class="max-w-5xl mx-auto px-6 py-8"><div class="flex flex-col sm:flex-row items-center justify-between gap-4"><div class="flex items-center gap-2 text-m text-gray-500"><span class="font-serif text-gray-400">Θ</span> <span>TEASys Viewer</span> <span class="text-gray-300">·</span> <span class="text-[13px]">v3β</span></div> <div class="flex items-center gap-3 text-[13px] text-gray-500"><p class="text-center max-w-sm leading-relaxed">© 2012–${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Lehrstuhl Prof. Matthias Bauer.
                    All rights reserved.</p> <p class="text-right max-w-sm leading-relaxed">A tool for collaborative multi-level annotation of literary
                    texts.</p> <span class="text-gray-300">·</span> <a href="/impressum" class="hover:text-primary-600 transition-colors whitespace-nowrap">Impressum</a></div></div></div></footer>`);
  });
}
function PageShell($$renderer, $$props) {
  let { user, availableTypes, pages, children } = $$props;
  $$renderer.push(`<div class="min-h-screen bg-surface flex flex-col">`);
  Header($$renderer, { user, availableTypes, pages });
  $$renderer.push(`<!----> <main class="flex-1">`);
  children($$renderer);
  $$renderer.push(`<!----></main> `);
  Footer($$renderer);
  $$renderer.push(`<!----></div>`);
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, children } = $$props;
    PageShell($$renderer2, {
      user: data.user,
      availableTypes: data.availableTypes,
      pages: data.pages,
      children: ($$renderer3) => {
        children($$renderer3);
        $$renderer3.push(`<!---->`);
      }
    });
  });
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-YCg3WKad.js.map
