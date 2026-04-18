import { k as head, l as ensure_array_like, m as attr, f as escape_html } from './index-BFvLoYgI.js';
import { B as Breadcrumbs } from './Breadcrumbs-BIt4YWiV.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("ypy25b", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Authors — TEASys Viewer</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Browse annotated literature by author."/>`);
    });
    $$renderer2.push(`<div class="max-w-5xl mx-auto px-6 py-12 md:py-16"><div class="mb-10">`);
    Breadcrumbs($$renderer2, {
      crumbs: [{ label: "Library", href: "/" }, { label: "Authors" }]
    });
    $$renderer2.push(`<!----> <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 font-serif leading-tight mt-4">Authors</h1> <p class="text-lg text-gray-500 mt-3 max-w-2xl leading-relaxed">Browse the collection by author.</p></div> `);
    if (data.authors.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"><svg class="w-12 h-12 mx-auto mb-3 text-stone-400" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="16" r="8"></circle><path d="M6 42c0-9 8-14 18-14s18 5 18 14"></path></svg> <h3 class="text-lg font-semibold text-gray-900">No authors yet</h3> <p class="text-m text-gray-500 mt-1">Authors will appear here once texts are added.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
      const each_array = ensure_array_like(data.authors);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let author = each_array[$$index_1];
        $$renderer2.push(`<a${attr("href", `/authors/${author.slug}`)} class="group flex items-center gap-4 p-4 bg-surface-card border border-gray-200/60 rounded-xl hover:bg-surface-elevated hover:border-gray-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 ease-out">`);
        if (author.portraitPath) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="w-14 h-14 rounded-xl overflow-hidden border border-stone-200/80 shrink-0"><img${attr("src", author.portraitPath)} alt="" class="w-full h-full object-cover object-top"/></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-stone-200/50 dark:border-stone-700"><span class="text-xl font-serif text-stone-400">${escape_html(author.name[0])}</span></div>`);
        }
        $$renderer2.push(`<!--]--> <div class="min-w-0"><h2 class="text-base font-bold text-gray-800 group-hover:text-primary-700 transition-colors font-serif leading-snug">${escape_html(author.name)}</h2> `);
        if (author.birthYear || author.deathYear) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-[12px] text-gray-400 font-serif mt-0.5">${escape_html(author.birthYear ?? "?")}–${escape_html(author.deathYear ?? "")}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <p class="text-[12px] text-gray-500 mt-1 uppercase tracking-wider font-medium">${escape_html(author.textCount)}
                            ${escape_html(author.textCount === 1 ? "text" : "texts")} <!--[-->`);
        const each_array_1 = ensure_array_like(author.types);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let type = each_array_1[$$index];
          $$renderer2.push(`<span class="ml-1.5 text-[10px] normal-case tracking-normal font-normal text-stone-400 dark:text-stone-500">· ${escape_html(type)}</span>`);
        }
        $$renderer2.push(`<!--]--></p></div></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B0XEZfQ5.js.map
