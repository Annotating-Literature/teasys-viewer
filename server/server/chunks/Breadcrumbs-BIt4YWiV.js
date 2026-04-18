import { l as ensure_array_like, m as attr, f as escape_html } from './index-BFvLoYgI.js';

function Breadcrumbs($$renderer, $$props) {
  let { crumbs } = $$props;
  $$renderer.push(`<nav class="flex items-center gap-1.5 text-m text[13px]tone-500 mb-4"><!--[-->`);
  const each_array = ensure_array_like(crumbs);
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let crumb = each_array[i];
    if (i > 0) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<span class="text[13px]tone-400">›</span>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--> `);
    if (crumb.href) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<a${attr("href", crumb.href)} class="hover:text-primary-600 transition-colors">${escape_html(crumb.label)}</a>`);
    } else {
      $$renderer.push("<!--[!-->");
      $$renderer.push(`<span class="text[13px]tone-600">${escape_html(crumb.label)}</span>`);
    }
    $$renderer.push(`<!--]-->`);
  }
  $$renderer.push(`<!--]--></nav>`);
}

export { Breadcrumbs as B };
//# sourceMappingURL=Breadcrumbs-BIt4YWiV.js.map
