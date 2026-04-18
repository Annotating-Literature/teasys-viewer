import { k as head, l as ensure_array_like, f as escape_html, o as attr_class, m as attr, q as derived, p as stringify } from './index-BFvLoYgI.js';
import { B as Breadcrumbs } from './Breadcrumbs-BIt4YWiV.js';

function TextForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { collections = [] } = $$props;
    let categoryValue = "";
    let typeValue = "poetry";
    let isSubText = false;
    let submitting = false;
    $$renderer2.push(`<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6"><h3 class="text-m font-semibold text-gray-900 mb-4">Add New Text</h3> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <form><div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div><label for="title" class="block text[13px] font-medium text-gray-600 mb-1">Title *</label> <input id="title" type="text" name="title" required="" placeholder="e.g., The Red Wheelbarrow" class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"/></div> <div><label for="author" class="block text[13px] font-medium text-gray-600 mb-1">Author *</label> <input id="author" type="text" name="author" required="" placeholder="e.g., William Carlos Williams" class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"/></div> <div><label for="year" class="block text[13px] font-medium text-gray-600 mb-1">Year <span class="text-gray-500">(optional)</span></label> <input id="year" type="number" name="year" placeholder="e.g., 1923" class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"/></div> <div class="relative"><label for="category" class="block text[13px] font-medium text-gray-600 mb-1">Category *</label> <input id="category" type="text" name="category" required="" placeholder="e.g., Imagism"${attr("value", categoryValue)} class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"/> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="mb-4"><label for="type" class="block text[13px] font-medium text-gray-600 mb-1">Type *</label> `);
    $$renderer2.select(
      {
        id: "type",
        name: "type",
        required: true,
        value: typeValue,
        class: "w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "poetry" }, ($$renderer4) => {
          $$renderer4.push(`Poetry`);
        });
        $$renderer3.option({ value: "prose" }, ($$renderer4) => {
          $$renderer4.push(`Prose`);
        });
        $$renderer3.option({ value: "drama" }, ($$renderer4) => {
          $$renderer4.push(`Drama`);
        });
        $$renderer3.option({ value: "collection" }, ($$renderer4) => {
          $$renderer4.push(`Collection (Book, Anthology, 5-Act Play)`);
        });
      }
    );
    $$renderer2.push(`</div> `);
    if (collections.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mb-4"><label class="flex items-center gap-2 mb-2 cursor-pointer"><input type="checkbox"${attr("checked", isSubText, true)} class="text-primary-600 focus:ring-primary-500 rounded border-gray-300"/> <span class="text-[13px] font-medium text-gray-700">This text belongs to a larger Collection / Book</span></label> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mb-4"><label for="textContent" class="block text-[13px] font-medium text-gray-600 mb-1">Full Text *</label> <textarea id="textContent" name="textContent" required="" rows="8" placeholder="Paste the full text here..." class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500 font-mono"></textarea></div>`);
    }
    $$renderer2.push(`<!--]--> <button type="submit"${attr("disabled", submitting, true)} class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50">${escape_html("Create Text")}</button></form></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const typeOrder = ["poetry", "prose", "drama"];
    const typeLabel = { poetry: "Poetry", prose: "Prose", drama: "Drama" };
    const groupedTexts = derived(() => {
      const result = [];
      for (const type of typeOrder) {
        const textsOfType = data.texts.filter((t) => t.type === type);
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
    let editingId = null;
    let editingCategory = "";
    const existingCategories = derived(() => [
      ...new Set(data.texts.map((t) => t.category).filter(Boolean))
    ]);
    head("17fd87v", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Manage Texts — TEASys Viewer</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-6 py-10"><div class="mb-8">`);
    Breadcrumbs($$renderer2, {
      crumbs: [
        { label: "Library", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Texts" }
      ]
    });
    $$renderer2.push(`<!----> <h1 class="text-2xl font-bold text-gray-900">Manage Texts</h1></div> <div class="mb-8">`);
    TextForm($$renderer2, {
      existingCategories: [
        ...new Set(data.texts.map((t) => t.category).filter(Boolean))
      ],
      collections: data.texts.filter((t) => t.type === "collection")
    });
    $$renderer2.push(`<!----></div> `);
    if (data.texts.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(groupedTexts());
      for (let $$index_3 = 0, $$length = each_array.length; $$index_3 < $$length; $$index_3++) {
        let group = each_array[$$index_3];
        $$renderer2.push(`<div class="mb-6"><h2 class="text[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">${escape_html(typeLabel[group.type])}</h2> <!--[-->`);
        const each_array_1 = ensure_array_like(group.categories);
        for (let $$index_2 = 0, $$length2 = each_array_1.length; $$index_2 < $$length2; $$index_2++) {
          let cat = each_array_1[$$index_2];
          $$renderer2.push(`<div class="mb-4 last:mb-0"><p class="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1 pl-4">${escape_html(cat.name)}</p> <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"><!--[-->`);
          const each_array_2 = ensure_array_like(cat.texts);
          for (let i = 0, $$length3 = each_array_2.length; i < $$length3; i++) {
            let text = each_array_2[i];
            $$renderer2.push(`<div${attr_class(`flex items-center justify-between p-4 ${stringify(i > 0 ? "border-t border-gray-50" : "")} hover:bg-gray-50/50 transition-colors`)}><div class="min-w-0 flex-1"><p class="font-semibold text-m text-gray-900">${escape_html(text.title)}</p> <p class="text[13px] text-gray-500 mt-0.5">${escape_html(text.author)}`);
            if (text.year) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<span class="text-gray-500 mx-1">·</span>${escape_html(text.year)}`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--></p></div> <div class="flex items-center gap-3 ml-4">`);
            if (editingId === text.id) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<input type="text"${attr("value", editingCategory)} list="category-suggestions" placeholder="e.g. Gothic" class="px-2 py-1 text-m border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-40"/> <datalist id="category-suggestions"><!--[-->`);
              const each_array_3 = ensure_array_like(existingCategories());
              for (let $$index = 0, $$length4 = each_array_3.length; $$index < $$length4; $$index++) {
                let cat2 = each_array_3[$$index];
                $$renderer2.option({ value: cat2 }, ($$renderer3) => {
                });
              }
              $$renderer2.push(`<!--]--></datalist> <button${attr("disabled", editingCategory === (text.category || ""), true)} class="text[13px] font-medium text-white bg-primary-600 hover:bg-primary-700 px-2.5 py-1 rounded-md transition-colors disabled:opacity-40">Save</button> <button class="text[13px] font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors">Cancel</button>`);
            } else {
              $$renderer2.push("<!--[!-->");
              $$renderer2.push(`<a${attr("href", `/texts/${text.id}`)} class="text[13px] font-medium text-primary-600 hover:text-primary-700 px-2.5 py-1 rounded-md hover:bg-primary-50 transition-colors">View</a> <button class="text[13px] font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors">Edit genre</button> <button class="text[13px] font-medium text-red-500 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors">Delete</button>`);
            }
            $$renderer2.push(`<!--]--></div></div>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="text-center py-12 bg-white rounded-xl border border-gray-100"><p class="text-m text-gray-500">No texts yet. Use the form above to add one.</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-A0cGgf8l.js.map
