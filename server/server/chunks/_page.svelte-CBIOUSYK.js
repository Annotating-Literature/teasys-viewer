import { k as head, l as ensure_array_like, o as attr_class, f as escape_html, m as attr, p as stringify } from './index-BFvLoYgI.js';
import './root-BIbsLGYc.js';
import './state.svelte-uz4JHIbh.js';
import { B as Breadcrumbs } from './Breadcrumbs-BIt4YWiV.js';

function UserForm($$renderer) {
  $$renderer.push(`<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6"><h3 class="text-m font-semibold text-gray-900 mb-4">Add New User</h3> <form action="?/createUser" method="POST"><div class="flex items-end gap-3"><div class="flex-1"><label for="username" class="block text[13px] font-medium text-gray-600 mb-1">Username</label> <input id="username" type="text" name="username" required="" placeholder="Enter username" class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"/></div> <div class="flex-1"><label for="password" class="block text[13px] font-medium text-gray-600 mb-1">Password</label> <input id="password" type="password" name="password" required="" placeholder="Enter password" class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"/></div> <div class="w-32"><label for="role" class="block text[13px] font-medium text-gray-600 mb-1">Role</label> <select id="role" name="role" class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white">`);
  $$renderer.option({ value: "editor" }, ($$renderer2) => {
    $$renderer2.push(`Editor`);
  });
  $$renderer.option({ value: "admin" }, ($$renderer2) => {
    $$renderer2.push(`Admin`);
  });
  $$renderer.push(`</select></div> <button type="submit" class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors whitespace-nowrap">Add User</button></div></form></div>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    let editingPasswordId = null;
    head("1p497kv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Manage Users — TEASys Viewer</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-4xl mx-auto px-6 py-10"><div class="mb-8">`);
    Breadcrumbs($$renderer2, {
      crumbs: [
        { label: "Library", href: "/" },
        { label: "Admin", href: "/admin" },
        { label: "Users" }
      ]
    });
    $$renderer2.push(`<!----> <h1 class="text-2xl font-bold text-gray-900">Manage Users</h1></div> <div class="mb-8">`);
    if (data.currentUser?.role === "admin") {
      $$renderer2.push("<!--[-->");
      UserForm($$renderer2);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex items-center justify-between"><div><h3 class="font-semibold text-gray-900 mb-1">Editor Account</h3> <p class="text-sm text-gray-500">You can manage your own password below. Ask an administrator to add or remove new accounts.</p></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (data.users.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"><!--[-->`);
      const each_array = ensure_array_like(data.users);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let user = each_array[i];
        $$renderer2.push(`<div${attr_class(`flex items-center justify-between p-4 ${stringify(i > 0 ? "border-t border-gray-50" : "")} hover:bg-gray-50/50 transition-colors`)}><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center"><span class="text[13px] font-semibold text-primary-700">${escape_html(user.username[0].toUpperCase())}</span></div> <div><p class="font-semibold text-m text-gray-900">${escape_html(user.username)}</p> <p class="text[13px] text-gray-500 capitalize">${escape_html(user.role)}</p></div></div> <div class="flex items-center gap-2">`);
        if (data.currentUser?.role === "admin" || data.currentUser?.id === user.id) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<button type="button" class="text[13px] font-medium text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors">${escape_html(editingPasswordId === user.id ? "Cancel" : "Change Password")}</button>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (data.currentUser?.role === "admin") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<form${attr("action", `?/deleteUser`)} method="POST"><input type="hidden" name="id"${attr("value", user.id)}/> <button type="submit" class="text-[13px] font-medium text-red-500 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors">Delete</button></form>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div></div> `);
        if (editingPasswordId === user.id) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="p-4 border-t border-gray-50 bg-gray-50/30"><form action="?/changePassword" method="POST" class="flex items-start gap-4"><input type="hidden" name="id"${attr("value", user.id)}/> <div class="flex-1"><input type="password" name="new_password" placeholder="New password" required="" minlength="6" class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"/> `);
          if (form?.message) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<p class="text-[11px] text-red-500 mt-1.5 ml-1">${escape_html(form.message)}</p>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <button type="submit" class="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors">Save</button></form></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-CBIOUSYK.js.map
