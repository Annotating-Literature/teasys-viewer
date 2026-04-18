import { k as head, f as escape_html, l as ensure_array_like, m as attr, q as derived } from './index-BFvLoYgI.js';
import { B as Breadcrumbs } from './Breadcrumbs-BIt4YWiV.js';
import { s as slugify } from './slug-CnYtB6EQ.js';
import { h as html } from './html-FW6Ia4bL.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const groupedByCategory = derived(() => {
      if (!data.categoryTexts) return [];
      const catMap = {};
      for (const t of data.categoryTexts) {
        const cat = t.category || "Uncategorized";
        if (!catMap[cat]) catMap[cat] = [];
        catMap[cat].push(t);
      }
      return Object.entries(catMap).sort((a, b) => a[0].localeCompare(b[0])).map(([name, texts]) => ({ name, texts }));
    });
    head("jot9ci", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.page.title)} — TEASys Viewer</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-6 py-12 md:py-16"><div class="mb-10">`);
    Breadcrumbs($$renderer2, {
      crumbs: [{ label: "Home", href: "/" }, { label: data.page.title }]
    });
    $$renderer2.push(`<!----> <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 font-serif leading-tight mt-4 mb-2">${escape_html(data.page.title)}</h1></div> `);
    if (data.htmlContent && data.htmlContent.trim().length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8 sm:p-12 mb-12"><article class="prose prose-slate md:prose-lg max-w-prose prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-6 prose-h1:hidden prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-p:text-gray-900 prose-p:leading-relaxed prose-p:mb-6 [&amp;_p]:text-wrap-pretty prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-700 transition-colors prose-strong:font-semibold prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-900 prose-li:my-2 prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-invert dark:prose-blockquote:border-primary-800">${html(data.htmlContent)}</article></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (groupedByCategory().length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mt-8"><!--[-->`);
      const each_array = ensure_array_like(groupedByCategory());
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let category = each_array[$$index_1];
        $$renderer2.push(`<div class="mb-10"><h3 class="text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-400 mb-4 flex items-center gap-3">${escape_html(category.name)} <span class="flex-1 border-t border-dotted border-gray-300 dark:border-gray-700"></span></h3> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><!--[-->`);
        const each_array_1 = ensure_array_like(category.texts);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let text = each_array_1[$$index];
          $$renderer2.push(`<div class="group block relative p-5 bg-surface-card backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-surface-elevated hover:border-gray-400 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 ease-out"><h4 class="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug font-serif"><a${attr("href", `/texts/${text.id}`)} class="after:absolute after:inset-0">${escape_html(text.title)}</a></h4> <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 relative z-10"><a${attr("href", `/authors/${slugify(text.author)}`)} class="hover:text-primary-600 transition-colors">${escape_html(text.author)}</a> `);
          if (text.year) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="text-gray-400 dark:text-gray-600 mx-1.5">·</span>${escape_html(text.year)}`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></p></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D6dEUx6x.js.map
