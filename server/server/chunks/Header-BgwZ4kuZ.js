import { l as ensure_array_like, m as attr, f as escape_html, o as attr_class, p as stringify, q as derived } from './index-BFvLoYgI.js';

function ThemeToggle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<button class="p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors"${attr("title", "Switch to dark mode")}${attr("aria-label", "Switch to dark mode")}>`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></button>`);
  });
}
const MAIN_NAV = [
  {
    label: "The Texts",
    children: [
      { label: "Library Index", href: "/" },
      { label: "Poetry", href: "/poetry" },
      { label: "Drama", href: "/drama" },
      { label: "Prose", href: "/prose" }
    ]
  },
  {
    label: "Authors",
    href: "/authors"
  }
];
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { user, availableTypes = [], pages = [] } = $$props;
    let activeDropdown = null;
    let isMobileMenuOpen = false;
    const filteredNav = derived(() => {
      const baseNav = MAIN_NAV.map((item) => {
        if (item.label === "The Texts" && item.children) {
          return {
            ...item,
            children: item.children.filter((child) => {
              if (child.label === "Poetry") return availableTypes.includes("poetry");
              if (child.label === "Drama") return availableTypes.includes("drama");
              if (child.label === "Prose") return availableTypes.includes("prose");
              return true;
            })
          };
        }
        return item;
      });
      const visiblePages = pages.filter((p) => p.menu !== false && !["poetry", "drama", "prose"].includes(p.id));
      const topLevelPages = visiblePages.filter((p) => !p.parent);
      const childPages = visiblePages.filter((p) => !!p.parent);
      const childrenByParent = /* @__PURE__ */ new Map();
      for (const child of childPages) {
        if (!child.parent) continue;
        if (!childrenByParent.has(child.parent)) {
          childrenByParent.set(child.parent, []);
        }
        childrenByParent.get(child.parent).push({ label: child.title, href: `/${child.id}` });
      }
      const dynamicNav = topLevelPages.map((page) => {
        const children = childrenByParent.get(page.id);
        return {
          label: page.title,
          href: children && children.length > 0 ? void 0 : `/${page.id}`,
          children: children && children.length > 0 ? [
            // Add the parent page itself as the first item in the dropdown
            { label: "Overview", href: `/${page.id}` },
            ...children
          ] : void 0
        };
      });
      return [...baseNav, ...dynamicNav];
    });
    $$renderer2.push(`<header class="bg-surface-elevated/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 shadow-sm transition-colors"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center h-16"><div class="shrink-0 flex items-center gap-3"><a href="/" class="flex items-center gap-2 group"><div class="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm text-white"><span class="text-white font-serif text-xl font-bold leading-none">Θ</span></div> <span class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">TEASys<span class="text-gray-500 font-normal">Viewer</span></span></a></div> <nav class="hidden md:flex items-center gap-6"><!--[-->`);
    const each_array = ensure_array_like(filteredNav());
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array[$$index_1];
      if (item.children) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="relative nav-dropdown"><button${attr("aria-expanded", activeDropdown === item.label)} aria-haspopup="true" class="text-[15px] font-serif font-medium text-gray-600 hover:text-gray-900 transition-colors py-2 flex items-center gap-1">${escape_html(item.label)} <svg${attr_class(`w-3.5 h-3.5 text-gray-400 transition-transform ${stringify(activeDropdown === item.label ? "rotate-180 text-gray-600" : "")}`)} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button> `);
        if (activeDropdown === item.label) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="absolute top-full left-0 mt-1 w-56 bg-surface-elevated rounded-xl shadow-lg shadow-black/10 ring-1 ring-black/10 dark:shadow-black/40 dark:ring-white/10 transition-all duration-200 z-50 overflow-hidden"><!--[-->`);
          const each_array_1 = ensure_array_like(item.children);
          for (let ci = 0, $$length2 = each_array_1.length; ci < $$length2; ci++) {
            let child = each_array_1[ci];
            if (ci > 0 && item.children[ci - 1].href === "/" && child.href !== "/") {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<hr class="border-gray-100 dark:border-white/10 mx-3"/>`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--> <a${attr("href", child.href)} class="block px-4 py-2.5 text-[14px] font-serif font-medium text-gray-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-gray-900 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0">${escape_html(child.label)}</a>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<a${attr("href", item.href)} class="text-[15px] font-serif font-medium text-gray-600 hover:text-gray-900 transition-colors py-2">${escape_html(item.label)}</a>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></nav> <div class="flex items-center gap-4">`);
    ThemeToggle($$renderer2);
    $$renderer2.push(`<!----> <div class="hidden md:flex items-center gap-4">`);
    if (user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a href="/admin" class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">Admin</a> <div class="flex items-center gap-3 pl-3 border-l border-gray-200"><div class="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center"><span class="text-[13px] font-semibold text-primary-700">${escape_html(user.username[0].toUpperCase())}</span></div> <span class="text-sm text-gray-600">${escape_html(user.username)}</span> <form action="/logout" method="POST"><button type="submit" class="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors">Sign out</button></form></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<a href="/login" class="text-sm font-medium text-primary-600 hover:text-primary-700 px-4 py-1.5 rounded-full border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-950 transition-all">Sign in</a>`);
    }
    $$renderer2.push(`<!--]--></div> <button class="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"${attr("aria-expanded", isMobileMenuOpen)} aria-label="Toggle mobile menu"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`);
    }
    $$renderer2.push(`<!--]--></svg></button></div></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></header>`);
  });
}

export { Header as H };
//# sourceMappingURL=Header-BgwZ4kuZ.js.map
