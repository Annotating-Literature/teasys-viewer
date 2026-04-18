import { k as head, l as ensure_array_like, o as attr_class, f as escape_html, m as attr, p as stringify } from './index-BFvLoYgI.js';
import { B as Breadcrumbs } from './Breadcrumbs-BIt4YWiV.js';
import './root-BIbsLGYc.js';
import './state.svelte-uz4JHIbh.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    head("mihd6b", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Manage Pages — TEASys Viewer</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-6 py-10"><div class="mb-8 flex items-end justify-between"><div>`);
    Breadcrumbs($$renderer2, {
      crumbs: [
        { label: "Library", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Pages" }
      ]
    });
    $$renderer2.push(`<!----> <h1 class="text-2xl font-bold text-gray-900 mt-2">Manage Pages</h1></div> <a href="/admin/pages/new" class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors">Create Page</a></div> `);
    if (data.pages.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"><h3 class="text-lg font-semibold text-gray-900">No pages found</h3> <p class="mt-2 text-gray-500">Create a new static page to publish content.</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"><!--[-->`);
      const each_array = ensure_array_like(data.pages);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let page = each_array[i];
        $$renderer2.push(`<div${attr_class(`flex items-center justify-between p-4 ${stringify(i > 0 ? "border-t border-gray-50" : "")} hover:bg-gray-50/50 transition-colors`)}><div class="min-w-0 flex-1"><p class="font-semibold text-m text-gray-900">${escape_html(page.title)}</p> <p class="text-[13px] text-gray-500 mt-0.5">Slug: /${escape_html(page.id)}</p></div> <div class="flex items-center gap-3 ml-4"><a${attr("href", `/${page.id}`)} target="_blank" class="text-[13px] font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors">View</a> <a${attr("href", `/admin/pages/${page.id}`)} class="text-[13px] font-medium text-primary-600 hover:text-primary-700 px-2.5 py-1 rounded-md hover:bg-primary-50 transition-colors">Edit</a> <form method="POST" action="?/delete"><input type="hidden" name="slug"${attr("value", page.id)}/> <button type="submit" class="text-[13px] font-medium text-red-500 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors">Delete</button></form></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-B0oEB2Hg.js.map
