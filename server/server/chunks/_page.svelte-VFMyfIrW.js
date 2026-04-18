import { k as head, f as escape_html, m as attr, l as ensure_array_like, q as derived, h as store_get, j as unsubscribe_stores } from './index-BFvLoYgI.js';
import { B as Breadcrumbs } from './Breadcrumbs-BIt4YWiV.js';
import './root-BIbsLGYc.js';
import './state.svelte-uz4JHIbh.js';
import { p as page } from './stores-GIpWCqRP.js';

function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let title = "";
    let content = "";
    let menu = true;
    let parent = "";
    let isUploading = false;
    const isNew = derived(() => store_get($$store_subs ??= {}, "$page", page).params.slug === "new");
    head("1winvip", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(isNew() ? "Create Page" : `Edit ${data.page?.title}`)} — TEASys Viewer</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-6 py-10"><div class="mb-8">`);
    Breadcrumbs($$renderer2, {
      crumbs: [
        { label: "Library", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Pages", href: "/admin/pages" },
        {
          label: isNew() ? "New Page" : data.page?.title || "Edit Page"
        }
      ]
    });
    $$renderer2.push(`<!----> <h1 class="text-2xl font-bold text-gray-900 mt-2">${escape_html(isNew() ? "Create New Page" : `Edit Page`)}</h1></div> <form method="POST" class="bg-white rounded-xl border border-gray-100 shadow-sm p-6"><div class="grid gap-6"><div><label for="title" class="block text-sm font-medium text-gray-700 mb-1">Page Title</label> <input type="text" id="title" name="title"${attr("value", title)} required="" placeholder="e.g., About Us, Meeting Times" class="w-full px-4 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-serif"/> <p class="mt-1.5 text-[13px] text-gray-500">`);
    if (isNew()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`A URL-friendly slug will be automatically created from
                        this title.`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`Slug: <code>/${escape_html(data.page?.id)}</code>`);
    }
    $$renderer2.push(`<!--]--></p></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50/50 rounded-lg border border-gray-100"><div><label class="flex items-center gap-3 cursor-pointer h-full pt-1"><div class="relative flex items-center"><input type="checkbox" name="menu" id="menu"${attr("checked", menu, true)} class="sr-only peer"/> <div class="w-10 h-5.5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div></div> <div class="flex flex-col"><span class="text-sm font-medium text-gray-700">Display in Navigation Menu</span> <span class="text-[12px] text-gray-500">If disabled, page is only accessible via direct link.</span></div></label></div> <div><label for="parent" class="block text-sm font-medium text-gray-700 mb-1">Parent Page</label> `);
    $$renderer2.select(
      {
        id: "parent",
        name: "parent",
        value: parent,
        disabled: !menu,
        class: "w-full px-4 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-serif bg-white disabled:bg-gray-50 disabled:text-gray-400"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`None (Top Level)`);
        });
        if (data.allPages) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<!--[-->`);
          const each_array = ensure_array_like(data.allPages.filter((p) => p.id !== data.page?.id));
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let p = each_array[$$index];
            $$renderer3.option({ value: p.id }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(p.title)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` <p class="mt-1.5 text-[12px] text-gray-500">Nest this page under another in the menu dropdown.</p></div></div> <div><label for="content" class="flex text-sm font-medium text-gray-700 mb-1 items-center justify-between">Content <div class="flex items-center gap-3"><input type="file" accept="image/*" class="hidden"/> <button type="button"${attr("disabled", isUploading, true)} class="flex items-center gap-1 text-[12px] font-medium text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${escape_html("Insert Image")}</button> <span class="text-[11px] font-normal text-gray-400">Markdown supported</span></div></label> <textarea id="content" name="content" required="" rows="18" placeholder="# Heading  Write your page content here..." class="w-full px-4 py-3 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono resize-y">`);
    const $$body = escape_html(content);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea></div> <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-50 mt-2"><a href="/admin/pages" class="px-5 py-2 text-m font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">Cancel</a> <button type="submit"${attr("disabled", !title?.trim() || !content?.trim(), true)} class="px-5 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`${escape_html(isNew() ? "Publish Page" : "Save Changes")}`);
    }
    $$renderer2.push(`<!--]--></button></div></div></form></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-VFMyfIrW.js.map
