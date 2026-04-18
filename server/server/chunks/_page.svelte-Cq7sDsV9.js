import { k as head, f as escape_html, m as attr, p as stringify, l as ensure_array_like, q as derived } from './index-BFvLoYgI.js';
import { g } from './marked.esm-9kFglIxa.js';
import { h as html } from './html-FW6Ia4bL.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const typeLabel = { poetry: "Poetry", prose: "Prose", drama: "Drama" };
    const renderedBio = derived(() => data.bio ? g(data.bio) : "");
    head("1e381i", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.author)} — TEASys Viewer</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", `Annotated texts by ${data.author} in the TEASys Viewer.`)}/>`);
    });
    $$renderer2.push(`<div class="max-w-5xl mx-auto px-6 py-12 md:py-16"><nav class="text-sm text-gray-400 mb-10"><a href="/authors" class="hover:text-primary-600 transition-colors">Authors</a> <span class="mx-1.5">›</span> <span class="text-gray-600 dark:text-gray-400">${escape_html(data.author)}</span></nav> <div class="flex items-start gap-8 mb-12">`);
    if (data.portraitPath) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="shrink-0"><div class="group/portrait relative w-40 h-40 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm"><img${attr("src", data.portraitPath)}${attr("alt", `Portrait of ${stringify(data.author)}`)} class="w-full h-full object-cover object-top"/> `);
      if (data.photoCredit) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="absolute inset-x-0 bottom-0 px-2.5 py-2 bg-black/50 backdrop-blur-sm opacity-0 group-hover/portrait:opacity-100 transition-opacity duration-200">`);
        if (data.photoCreditUrl) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<a${attr("href", data.photoCreditUrl)} target="_blank" rel="noopener noreferrer" class="text-[10px] text-white/80 hover:text-white leading-tight block">© ${escape_html(data.photoCredit)}</a>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<p class="text-[10px] text-white/80 leading-tight">© ${escape_html(data.photoCredit)}</p>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="pt-1"><h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 font-serif leading-tight">${escape_html(data.author)}</h1> `);
    if (data.birthYear || data.deathYear) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="text-base text-gray-400 font-serif mt-2">${escape_html(data.birthYear ?? "?")}–${escape_html(data.deathYear ?? "")}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr("href", `/admin/authors/${data.slug}`)} class="inline-flex items-center gap-1.5 mt-4 text-[13px] font-medium text-primary-600 hover:text-primary-700 transition-colors"><svg class="w-3 h-3" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2l2 2-7 7H3v-2l7-7z"></path></svg> Edit profile</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (renderedBio()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="prose prose-sm max-w-2xl text-gray-600 dark:text-gray-400 dark:prose-invert leading-relaxed mb-12">${html(renderedBio())}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (data.texts.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20"><h3 class="text-lg font-semibold text-gray-900">No texts by this author yet</h3></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
      const each_array = ensure_array_like(data.texts);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let text = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `/texts/${text.id}`)} class="group block relative p-6 bg-surface-card backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-surface-elevated hover:border-gray-400 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 ease-out overflow-hidden"><h4 class="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug font-serif">${escape_html(text.title)}</h4> <div class="flex items-center gap-2 mt-2">`);
        if (text.year) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-sm text-gray-400">${escape_html(text.year)}</span> <span class="text-gray-300 dark:text-gray-600">·</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <span class="text-[11px] uppercase tracking-wider font-medium text-stone-400 dark:text-stone-500 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800">${escape_html(typeLabel[text.type] ?? text.type)}</span> `);
        if (text.annotationCount > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="text-gray-300 dark:text-gray-600">·</span> <span class="text-[12px] text-gray-400">${escape_html(text.annotationCount)}
                                ${escape_html(text.annotationCount === 1 ? "annotation" : "annotations")}</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-Cq7sDsV9.js.map
