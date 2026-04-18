import { k as head, l as ensure_array_like, m as attr, f as escape_html, q as derived } from './index-BFvLoYgI.js';
import { I as IconQuill, a as IconNotebook, b as IconTheatreMasks } from './IconTheatreMasks-e12W2aAG.js';
import { s as slugify } from './slug-CnYtB6EQ.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const typeOrder = ["poetry", "prose", "drama", "collection"];
    const typeLabel = {
      poetry: "Poetry",
      prose: "Prose",
      drama: "Drama",
      collection: "Collections & Extended Texts"
    };
    const groupedByType = derived(() => {
      const result = [];
      for (const type of typeOrder) {
        const textsOfType = data.groupedTexts[type] ?? [];
        if (textsOfType.length === 0) continue;
        const catMap = {};
        for (const t of textsOfType) {
          const cat = t.category || "Uncategorized";
          if (!catMap[cat]) catMap[cat] = [];
          catMap[cat].push(t);
        }
        const categories = Object.entries(catMap).sort((a, b) => a[0].localeCompare(b[0])).map(([name, texts]) => ({ name, texts }));
        result.push({ type, categories });
      }
      return result;
    });
    const hasTexts = derived(() => !Object.values(data.groupedTexts).every((arr) => arr.length === 0));
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>TEASys Viewer — Annotated Literature</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Explore and annotate literary texts collaboratively with TEASys Viewer."/>`);
    });
    $$renderer2.push(`<div class="max-w-5xl mx-auto px-6 py-12 md:py-16"><div class="mb-14 md:mb-20 relative"><h1 class="relative text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 font-serif leading-tight mb-2">Annotated Literature</h1> <p class="text-lg text-gray-600 max-w-2xl leading-relaxed">Explore literary texts with multi-level annotations — from language
			and form to interpretation and context.</p></div> `);
    if (!hasTexts()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"><svg class="w-14 h-14 mx-auto mb-4 text-gray-400" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h14c2 0 4 2 4 4v24c0-2-2-4-4-4H6V8z"></path><path d="M42 8H28c-2 0-4 2-4 4v24c0-2 2-4 4-4h14V8z"></path></svg> <h3 class="text-lg font-semibold text-gray-900">No texts yet</h3> `);
      if (data.user?.role === "admin") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="mt-2 text-m text-gray-500"><a href="/admin/texts" class="text-primary-600 hover:text-primary-700 font-medium">Add a text</a> to get started.</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="space-y-16"><!--[-->`);
      const each_array = ensure_array_like(groupedByType());
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let group = each_array[$$index_2];
        $$renderer2.push(`<div><div class="flex items-center gap-3 mb-8"><a${attr("href", `/${group.type}`)} class="flex items-center gap-2 hover:text-primary-700 transition-colors group">`);
        if (group.type === "poetry") {
          $$renderer2.push("<!--[-->");
          IconQuill($$renderer2, {
            class: "w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors"
          });
        } else if (group.type === "prose") {
          $$renderer2.push("<!--[1-->");
          IconNotebook($$renderer2, {
            class: "w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors"
          });
        } else if (group.type === "drama") {
          $$renderer2.push("<!--[2-->");
          IconTheatreMasks($$renderer2, {
            class: "w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors"
          });
        } else {
          $$renderer2.push("<!--[!-->");
          IconNotebook($$renderer2, {
            class: "w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors"
          });
        }
        $$renderer2.push(`<!--]--> <h2 class="text-2xl font-serif text-gray-800 tracking-wide group-hover:text-primary-700 transition-colors">${escape_html(typeLabel[group.type])}</h2></a> <div class="flex-1 h-px bg-gray-200"></div></div> <div class="space-y-10"><!--[-->`);
        const each_array_1 = ensure_array_like(group.categories);
        for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
          let cat = each_array_1[$$index_1];
          $$renderer2.push(`<div><div class="flex items-center gap-4 mb-5 pl-1"><h3 class="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">${escape_html(cat.name)}</h3> <div class="flex-1 border-t border-dashed border-gray-200"></div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
          const each_array_2 = ensure_array_like(cat.texts);
          for (let $$index = 0, $$length3 = each_array_2.length; $$index < $$length3; $$index++) {
            let text = each_array_2[$$index];
            $$renderer2.push(`<div class="group block relative p-6 bg-surface-card backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-surface-elevated hover:border-gray-400 hover:shadow-[2px_2px_12px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 ease-out overflow-hidden"><h4 class="text-base font-semibold text-gray-800 group-hover:text-primary-700 transition-colors leading-snug font-serif"><a${attr("href", `/texts/${text.id}`)} class="after:absolute after:inset-0">${escape_html(text.title)}</a></h4> <p class="text-m text-gray-500 mt-2 relative z-10"><a${attr("href", `/authors/${slugify(text.author)}`)} class="hover:text-primary-600 transition-colors">${escape_html(text.author)}</a>`);
            if (text.year) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<span class="text-gray-500 mx-1.5">·</span>${escape_html(text.year)}`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--></p></div>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CtGPgk0q.js.map
