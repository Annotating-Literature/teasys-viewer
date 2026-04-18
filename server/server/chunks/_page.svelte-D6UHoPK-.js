import { k as head, f as escape_html, l as ensure_array_like, o as attr_class, ao as attr_style, m as attr, q as derived, p as stringify } from './index-BFvLoYgI.js';
import { I as IconQuill, a as IconNotebook, b as IconTheatreMasks } from './IconTheatreMasks-e12W2aAG.js';
import { B as Breadcrumbs } from './Breadcrumbs-BIt4YWiV.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const texts = derived(() => data.textsWithAnnotations ?? []);
    const totalTexts = derived(() => texts().length);
    const totalAnnotations = derived(() => texts().reduce((sum, t) => sum + t.annotations.length, 0));
    const byType = derived(() => {
      const counts = { poetry: 0, prose: 0, drama: 0 };
      for (const t of texts()) counts[t.type] = (counts[t.type] || 0) + 1;
      return counts;
    });
    const byCategory = derived(() => {
      const groups = {};
      for (const t of texts()) {
        const cat = t.category || "Uncategorized";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(t);
      }
      return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
    });
    const byAuthor = derived(() => {
      const groups = {};
      for (const t of texts()) {
        const auth = t.author || "Unknown";
        if (!groups[auth]) groups[auth] = [];
        groups[auth].push(t);
      }
      return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
    });
    const typeLabel = { poetry: "Poetry", prose: "Prose", drama: "Drama" };
    head("1jef3w8", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Admin — TEASys Viewer</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-5xl mx-auto px-6 py-10"><div class="mb-8">`);
    Breadcrumbs($$renderer2, {
      crumbs: [{ label: "Library", href: "/" }, { label: "Admin" }]
    });
    $$renderer2.push(`<!----> <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1></div> <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8"><div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4"><p class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1"><svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="1" width="12" height="14" rx="1"></rect><path d="M5 4h6M5 7h6M5 10h4"></path></svg> Texts</p> <p class="text-2xl font-bold text-gray-900">${escape_html(totalTexts())}</p></div> <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4"><p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Annotations</p> <p class="text-2xl font-bold text-gray-900">${escape_html(totalAnnotations())}</p></div> <!--[-->`);
    const each_array = ensure_array_like(["poetry", "prose", "drama"]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let type = each_array[$$index];
      $$renderer2.push(`<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4"><p class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">`);
      if (type === "poetry") {
        $$renderer2.push("<!--[-->");
        IconQuill($$renderer2, { class: "w-3.5 h-3.5" });
      } else if (type === "prose") {
        $$renderer2.push("<!--[1-->");
        IconNotebook($$renderer2, { class: "w-3.5 h-3.5" });
      } else {
        $$renderer2.push("<!--[!-->");
        IconTheatreMasks($$renderer2, { class: "w-3.5 h-3.5" });
      }
      $$renderer2.push(`<!--]--> ${escape_html(typeLabel[type])}</p> <p class="text-2xl font-bold text-gray-900">${escape_html(byType()[type] || 0)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (totalAnnotations() > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"><div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5"><h3 class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Annotation Depth</h3> <div class="space-y-2.5"><!--[-->`);
      const each_array_1 = ensure_array_like([1, 2, 3]);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let level = each_array_1[$$index_1];
        const count = data.stats.levelCounts[level] || 0;
        const pct = totalAnnotations() > 0 ? Math.round(count / Math.max(data.stats.levelCounts[1] + data.stats.levelCounts[2] + data.stats.levelCounts[3], 1) * 100) : 0;
        $$renderer2.push(`<div><div class="flex items-center justify-between text[13px] mb-1"><span class="text-gray-600">Level ${escape_html(level)}</span> <span class="text-gray-500">${escape_html(count)}</span></div> <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div${attr_class("h-full rounded-full transition-all duration-500", void 0, {
          "bg-primary-300": level === 1,
          "bg-primary-500": level === 2,
          "bg-primary-700": level === 3
        })}${attr_style(`width: ${stringify(pct)}%`)}></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text[13px] text-gray-500"><span>Avg per text</span> <span class="font-semibold text-gray-700">${escape_html(data.stats.avgAnnotations)}</span></div></div> <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5"><h3 class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Categories</h3> <div class="space-y-2"><!--[-->`);
      const each_array_2 = ensure_array_like(data.stats.categoryCounts);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let [cat, count] = each_array_2[$$index_2];
        const total = data.stats.categoryCounts.reduce((s, [, c]) => s + c, 0);
        const pct = Math.round(count / Math.max(total, 1) * 100);
        $$renderer2.push(`<div class="flex items-center gap-2.5"><span class="text[13px] text-gray-600 w-28 truncate capitalize">${escape_html(cat.replace(/-/g, " "))}</span> <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-primary-400 rounded-full"${attr_style(`width: ${stringify(pct)}%`)}></div></div> <span class="text-[11px] text-gray-500 w-6 text-right">${escape_html(count)}</span></div>`);
      }
      $$renderer2.push(`<!--]--></div></div> <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"><h3 class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Highlights</h3> `);
      if (data.stats.mostAnnotated) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div><p class="text-[11px] text-gray-500 uppercase tracking-wider">Most Annotated</p> <a${attr("href", `/texts/${data.stats.mostAnnotated.id}`)} class="text-m font-medium text-gray-800 hover:text-primary-600 transition-colors line-clamp-1">${escape_html(data.stats.mostAnnotated.title)}</a> <p class="text-[11px] text-gray-500">${escape_html(data.stats.mostAnnotated.count)} annotations</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex gap-4"><div><p class="text-[11px] text-gray-500 uppercase tracking-wider">Contributors</p> <p class="text-lg font-bold text-gray-900">${escape_html(data.stats.contributors)}</p></div> <div><p class="text-[11px] text-gray-500 uppercase tracking-wider">Cross-refs</p> <p class="text-lg font-bold text-gray-900">${escape_html(data.stats.totalCrossRefs)}</p></div> <div><p class="text-[11px] text-gray-500 uppercase tracking-wider">Citations</p> <p class="text-lg font-bold text-gray-900">${escape_html(data.stats.totalWorksCited)}</p></div></div> `);
      if (data.stats.mostRecent) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="pt-2 border-t border-gray-50"><p class="text-[11px] text-gray-500 uppercase tracking-wider">Last Activity</p> <p class="text[13px] text-gray-600 mt-0.5 line-clamp-1">"${escape_html(data.stats.mostRecent.anchorText)}"</p> <p class="text-[11px] text-gray-500">by ${escape_html(data.stats.mostRecent.authors.join(", "))} · ${escape_html(new Date(data.stats.mostRecent.updatedAt).toLocaleDateString())}</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"><a href="/admin/texts" class="group block p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200"><div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2 text-primary-500"><svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="2" width="14" height="16" rx="1.5"></rect><path d="M7 6h6M7 9h6M7 12h4"></path></svg></div> <h2 class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Manage Texts</h2> <p class="text[13px] text-gray-500 mt-0.5">Add and remove literary texts</p></a> `);
    if (data.user?.role === "admin") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a href="/admin/users" class="group block p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200"><div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2 text-primary-500"><svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="7" r="3.5"></circle><path d="M3.5 17c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5"></path></svg></div> <h2 class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Manage Users</h2> <p class="text-[13px] text-gray-500 mt-0.5">Add and remove editor accounts</p></a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <a href="/admin/pages" class="group block p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200"><div class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2 text-primary-500"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div> <h2 class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Manage Pages</h2> <p class="text-[13px] text-gray-500 mt-0.5">Edit standalone CMS pages</p></a></div> <div class="mb-10"><h2 class="text-m font-semibold text-gray-900 mb-3">Author Profiles</h2> <p class="text[13px] text-gray-500 mb-4">Add bios and portraits to author pages. Click an author to edit
			their profile.</p> <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"><!--[-->`);
    const each_array_3 = ensure_array_like(byAuthor());
    for (let i = 0, $$length = each_array_3.length; i < $$length; i++) {
      let [author, authorTexts] = each_array_3[i];
      $$renderer2.push(`<a${attr("href", `/admin/authors/${author.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`)}${attr_class(`flex items-center justify-between p-3 ${stringify(i > 0 ? "border-t border-gray-50" : "")} hover:bg-gray-50/80 transition-colors`)}><span class="text-m font-medium text-gray-800">${escape_html(author)}</span> <span class="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">${escape_html(authorTexts.length)} text${escape_html(authorTexts.length !== 1 ? "s" : "")}</span></a>`);
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array_4 = ensure_array_like(data.extraAuthors);
    for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
      let extra = each_array_4[i];
      $$renderer2.push(`<a${attr("href", `/admin/authors/${extra.slug}`)} class="flex items-center justify-between p-3 border-t border-gray-50 hover:bg-gray-50/80 transition-colors"><span class="text-m font-medium text-gray-800">${escape_html(extra.name)}</span> <span class="text-[11px] font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">standalone</span></a>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (byCategory().length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mb-8"><h2 class="text-m font-semibold text-gray-900 mb-3">By Category</h2> <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"><!--[-->`);
      const each_array_5 = ensure_array_like(byCategory());
      for (let i = 0, $$length = each_array_5.length; i < $$length; i++) {
        let [category, categoryTexts] = each_array_5[i];
        $$renderer2.push(`<div${attr_class(`p-4 ${stringify(i > 0 ? "border-t border-gray-50" : "")}`)}><div class="flex items-center justify-between mb-2"><h3 class="text-m font-medium text-gray-800">${escape_html(category)}</h3> <span class="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">${escape_html(categoryTexts.length)} text${escape_html(categoryTexts.length !== 1 ? "s" : "")}</span></div> <div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array_6 = ensure_array_like(categoryTexts);
        for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
          let t = each_array_6[$$index_5];
          $$renderer2.push(`<a${attr("href", `/texts/${t.id}`)} class="inline-flex items-center gap-1.5 px-2.5 py-1 text[13px] bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-md transition-colors"><span class="text-[11px] text-gray-500 font-medium">${escape_html(t.type)}</span> <span class="font-medium">${escape_html(t.title)}</span> `);
          if (t.annotations.length > 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="text-gray-500">· ${escape_html(t.annotations.length)} ann.</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></a>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (byAuthor().length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div><h2 class="text-m font-semibold text-gray-900 mb-3">By Author</h2> <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"><!--[-->`);
      const each_array_7 = ensure_array_like(byAuthor());
      for (let i = 0, $$length = each_array_7.length; i < $$length; i++) {
        let [author, authorTexts] = each_array_7[i];
        $$renderer2.push(`<div${attr_class(`p-4 ${stringify(i > 0 ? "border-t border-gray-50" : "")}`)}><div class="flex items-center justify-between mb-2"><h3 class="text-m font-medium text-gray-800">${escape_html(author)}</h3> <span class="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">${escape_html(authorTexts.length)} text${escape_html(authorTexts.length !== 1 ? "s" : "")}</span></div> <div class="flex flex-wrap gap-2"><!--[-->`);
        const each_array_8 = ensure_array_like(authorTexts);
        for (let $$index_7 = 0, $$length2 = each_array_8.length; $$index_7 < $$length2; $$index_7++) {
          let t = each_array_8[$$index_7];
          $$renderer2.push(`<a${attr("href", `/texts/${t.id}`)} class="inline-flex items-center gap-1.5 px-2.5 py-1 text[13px] bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-md transition-colors"><span class="text-[11px] text-gray-500 font-medium">${escape_html(t.type)}</span> <span class="font-medium">${escape_html(t.title)}</span> `);
          if (t.annotations.length > 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="text-gray-500">· ${escape_html(t.annotations.length)} ann.</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></a>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-D6UHoPK-.js.map
