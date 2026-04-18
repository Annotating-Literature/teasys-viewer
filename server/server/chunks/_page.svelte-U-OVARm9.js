import { k as head, f as escape_html, m as attr, l as ensure_array_like, o as attr_class, p as stringify, ao as attr_style, q as derived } from './index-BFvLoYgI.js';
import { A as AnnotatedText, C as CATEGORY_META } from './AnnotatedText-CKXg5D-C.js';
import { g } from './marked.esm-9kFglIxa.js';
import DOMPurify from 'isomorphic-dompurify';
import { h as html } from './html-FW6Ia4bL.js';
import { B as Breadcrumbs } from './Breadcrumbs-BIt4YWiV.js';
import { s as slugify } from './slug-CnYtB6EQ.js';

function CategoryBadge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { category } = $$props;
    const meta = derived(() => CATEGORY_META[category]);
    $$renderer2.push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[13px] font-medium"${attr_style(`background-color: ${stringify(meta().color)}20; color: ${stringify(meta().color)};`)}><span class="w-1.5 h-1.5 rounded-full"${attr_style("", { "background-color": meta().color })}></span> ${escape_html(meta().label)}</span>`);
  });
}
function AnnotationEntry($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      annotation,
      allAnnotations = []
    } = $$props;
    let expandedLevels = /* @__PURE__ */ new Set();
    const enclosedAnnotations = derived(() => allAnnotations.filter((a) => {
      if (a.id === annotation.id) return false;
      return a.anchorStart >= annotation.anchorStart && a.anchorEnd <= annotation.anchorEnd && (a.anchorStart > annotation.anchorStart || a.anchorEnd < annotation.anchorEnd);
    }));
    function applySmartQuotes(html2) {
      const unescaped = html2.replace(/&quot;/g, '"');
      let insideTag = false;
      let open = true;
      let result = "";
      for (const ch of unescaped) {
        if (ch === "<") {
          insideTag = true;
          result += ch;
        } else if (ch === ">") {
          insideTag = false;
          result += ch;
        } else if (ch === '"' && !insideTag) {
          result += open ? "“" : "”";
          open = !open;
        } else {
          result += ch;
        }
      }
      return result;
    }
    function renderBody(body) {
      const resolved = body.replace(/\[\[([^\]]+)\]\]/g, (match, annId) => {
        const ref = allAnnotations.find((a) => a.id === annId);
        if (ref) {
          return `<a class="crossref-link" data-ann-id="${annId}" title="Cross-reference: ${ref.anchorText}">“${ref.anchorText}”</a>`;
        }
        return match;
      });
      const html2 = applySmartQuotes(g(resolved));
      return DOMPurify.sanitize(html2, { ADD_ATTR: ["data-ann-id"] });
    }
    function renderWorkCited(work) {
      const strippedWork = work.replace(/<[^>]*>?/gm, "");
      let mdWork = strippedWork;
      const doiRegex = /(?:https?:\/\/)?(?:doi\.org\/|doi:\s*)(10\.\d{4,9}\/[-\._;()\/:A-Z0-9]+)/gi;
      mdWork = mdWork.replace(doiRegex, (match, p1) => {
        return `[doi.org/${p1}](https://doi.org/${p1})`;
      });
      let html2 = g(mdWork);
      html2 = html2.replace(/^<p>/, "").replace(/<\/p>\n?$/, "");
      html2 = html2.replace(/<a([^>]*)>/g, '<a$1 target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline hover:underline-offset-2 transition-all">');
      html2 = applySmartQuotes(html2);
      return DOMPurify.sanitize(html2, { ADD_ATTR: ["target"] });
    }
    $$renderer2.push(`<div><div class="mb-4 bg-gray-50 rounded-lg p-3 border-l-[3px] border-primary-200"><p class="text[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Passage</p> <p class="text-m text-gray-700 leading-relaxed">“${escape_html(annotation.anchorText)}”</p></div> <div class="mb-4 text[13px] text-gray-500"><span>by <strong class="text-gray-600 font-medium">${escape_html(annotation.authors.join(", "))}</strong></span></div> `);
    if (enclosedAnnotations().length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mb-6 pb-5 border-b border-gray-100"><h4 class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3">Subphrase Annotations</h4> <div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(enclosedAnnotations());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let enc = each_array[$$index];
        $$renderer2.push(`<button class="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"><p class="text-[13px] text-gray-800 font-serif line-clamp-2 leading-relaxed mb-1.5">“${escape_html(enc.anchorText)}”</p> <div class="flex items-center gap-1.5"><span class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">${escape_html(enc.levels[0].category)}</span> <span class="text-[10px] text-gray-300">·</span> <span class="text-[10px] text-gray-400">${escape_html(enc.authors.join(", "))}</span></div></button>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array_1 = ensure_array_like(annotation.levels);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let level = each_array_1[i];
      $$renderer2.push(`<div class="mb-5 last:mb-0"><button type="button" class="w-full flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50/50 p-1.5 -ml-1.5 rounded-lg transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"${attr("aria-expanded", expandedLevels.has(level.level))}${attr("aria-controls", `level-content-${i}`)}><span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-[11px] font-bold text-gray-500 group-hover:bg-gray-200 transition-colors">${escape_html(level.level)}</span> `);
      CategoryBadge($$renderer2, { category: level.category });
      $$renderer2.push(`<!----> <span${attr_class(`ml-auto text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${stringify(expandedLevels.has(level.level) ? "rotate-180" : "")}`)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg></span></button> `);
      if (expandedLevels.has(level.level)) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr("id", `level-content-${i}`)} class="prose max-w-none text-[13px] text-gray-700 leading-relaxed prose-p:text-[13px] prose-p:text-gray-700 prose-strong:text-gray-800 prose-a:text-primary-600 prose-li:text-[13px] mt-3" role="presentation">${html(renderBody(level.body))}</div> `);
        if (level.worksCited && level.worksCited.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="mt-3 pt-3 border-t border-gray-100"><h5 class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Works Cited</h5> <ul class="text-[13px] text-gray-500 space-y-1"><!--[-->`);
          const each_array_2 = ensure_array_like(level.worksCited);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let work = each_array_2[$$index_1];
            $$renderer2.push(`<li class="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-gray-500">${html(renderWorkCited(work))}</li>`);
          }
          $$renderer2.push(`<!--]--></ul></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (i < annotation.levels.length - 1) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<hr class="border-t-[1.5px] border-dashed border-gray-200 my-5 opacity-70"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let activeAnnotationId = null;
    let selectedCategory = "All";
    const activeAnnotation = derived(() => data.annotations.find((a) => a.id === activeAnnotationId) ?? null);
    const availableCategories = derived(() => [
      "All",
      ...new Set(data.annotations.flatMap((a) => a.levels.map((l) => l.category)))
    ].sort());
    function isEnclosed(a) {
      return data.annotations.some((parent) => parent.id !== a.id && parent.anchorStart <= a.anchorStart && parent.anchorEnd >= a.anchorEnd && (parent.anchorStart < a.anchorStart || parent.anchorEnd > a.anchorEnd));
    }
    const sortedAnnotations = derived(() => [...data.annotations].filter((a) => {
      const shouldHide = isEnclosed(a);
      return !shouldHide;
    }).sort((a, b) => {
      if (a.anchorStart !== b.anchorStart) {
        return a.anchorStart - b.anchorStart;
      }
      return b.anchorEnd - a.anchorEnd;
    }));
    head("g92dt0", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.text.metadata.title)} — TEASys Viewer</title>`);
      });
      $$renderer3.push(`<meta name="description"${attr("content", `${stringify(data.text.metadata.title)} by ${stringify(data.text.metadata.author)} — annotated reading view`)}/>`);
    });
    $$renderer2.push(`<div class="max-w-7xl mx-auto px-6 py-10 relative">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="mb-8">`);
    Breadcrumbs($$renderer2, {
      crumbs: [
        { label: "Library", href: "/" },
        {
          label: data.text.metadata.author,
          href: `/authors/${slugify(data.text.metadata.author)}`
        },
        { label: data.text.metadata.title }
      ]
    });
    $$renderer2.push(`<!----> <div class="flex items-start justify-between"><div><h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">${escape_html(data.text.metadata.title)}</h1> <p class="mt-2 text-lg text-gray-500"><a${attr("href", `/authors/${slugify(data.text.metadata.author)}`)} class="hover:text-primary-600 transition-colors">${escape_html(data.text.metadata.author)}</a>`);
    if (data.text.metadata.year) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="text-gray-500 mx-2">·</span><span class="text-gray-500">${escape_html(data.text.metadata.year)}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></p></div> `);
    if (data.user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr("href", `/texts/${data.text.metadata.id}/annotate`)} class="shrink-0 ml-4 inline-flex items-center gap-2 px-4 py-2 text-m font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300 dark:hover:bg-primary-800 rounded-lg transition-colors"><svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2l2 2-7 7H3v-2l7-7z"></path></svg> Annotate</a>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (data.text.metadata.type === "collection") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="max-w-2xl mt-12"><h2 class="text-xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-3">Table of Contents <div class="flex-1 h-px bg-gray-200"></div></h2> `);
      if (data.children.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12 border-2 text-gray-400 border-dashed border-gray-200 rounded-xl bg-surface-card/50">This collection is empty.</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="space-y-4"><!--[-->`);
        const each_array = ensure_array_like(data.children);
        for (let i = 0, $$length = each_array.length; i < $$length; i++) {
          let child = each_array[i];
          $$renderer2.push(`<a${attr("href", `/texts/${child.id}`)} class="block bg-surface-card hover:bg-surface-elevated rounded-xl border border-gray-100 shadow-sm p-5 transition-colors group"><div class="flex items-center gap-4"><div class="w-10 h-10 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center font-serif text-gray-400 font-semibold border border-gray-100/50">${escape_html(child.order || i + 1)}</div> <div class="flex-1"><h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">${escape_html(child.title)}</h3> `);
          if (child.author !== data.text.metadata.author) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<p class="text-sm text-gray-500 mt-1">${escape_html(child.author)}</p>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="text-gray-300 group-hover:text-primary-500 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></div></div></a>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="flex gap-6 items-start"><div class="flex-1 min-w-0"><div class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8 sm:p-10" role="presentation">`);
      AnnotatedText($$renderer2, {
        rawText: data.text.rawText,
        parsedText: data.parsedText,
        annotations: data.annotations,
        title: data.text.metadata.title,
        activeAnnotationId
      });
      $$renderer2.push(`<!----></div> `);
      if (data.annotations.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-12 mt-6 border-2 border-dashed border-gray-200 rounded-xl bg-surface-card/50"><div class="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-elevated flex items-center justify-center border border-gray-200/60"><svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20"></path></svg></div> <h3 class="text-base font-semibold text-gray-900">No annotations yet</h3> `);
        if (data.user) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="mt-1 text-m text-gray-500"><a${attr("href", `/texts/${data.text.metadata.id}/annotate`)} class="text-primary-600 hover:text-primary-700 font-medium">Create one</a> to get started.</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (data.annotations.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="fixed inset-x-0 mx-auto max-w-lg md:max-w-none bottom-0 z-40 md:inset-auto md:w-[380px] md:shrink-0 md:sticky md:top-24 pointer-events-none md:pointer-events-auto"><div${attr_class(`bg-surface-card rounded-t-2xl md:rounded-xl border border-gray-200/50 shadow-2xl md:shadow-sm max-h-[60vh] md:max-h-[calc(100vh-6rem)] flex flex-col overflow-y-auto pointer-events-auto transition-transform duration-300 ease-out ${stringify(!activeAnnotation() ? "translate-y-full md:translate-y-0" : "translate-y-0")}`)}>`);
        if (activeAnnotation()) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="sticky top-0 bg-surface-card/90 backdrop-blur-sm border-b border-gray-200/50 px-5 py-3 flex items-center justify-between z-10"><span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Annotation</span> <div class="flex items-center gap-2">`);
          if (data.user) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<a${attr("href", `/texts/${data.text.metadata.id}/annotate?annotationId=${activeAnnotation().id}`)} class="text[13px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded-md bg-primary-50 hover:bg-primary-100 transition-colors">Edit</a>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--> <button class="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 transition-colors text-xl">×</button></div></div> <div class="p-5">`);
          AnnotationEntry($$renderer2, {
            annotation: activeAnnotation(),
            allAnnotations: data.annotations
          });
          $$renderer2.push(`<!----></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="px-5 py-3 border-b border-gray-200/50 flex items-center justify-between"><span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">${escape_html(sortedAnnotations().length)} Annotation${escape_html(sortedAnnotations().length !== 1 ? "s" : "")}</span> `);
          if (availableCategories().length > 2) {
            $$renderer2.push("<!--[-->");
            $$renderer2.select(
              {
                class: "text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-shadow",
                value: selectedCategory
              },
              ($$renderer3) => {
                $$renderer3.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(availableCategories());
                for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                  let cat = each_array_1[$$index_1];
                  $$renderer3.option({ value: cat }, ($$renderer4) => {
                    $$renderer4.push(`${escape_html(cat === "All" ? "All" : CATEGORY_META[cat]?.label || cat)}`);
                  });
                }
                $$renderer3.push(`<!--]-->`);
              }
            );
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="divide-y divide-gray-50"><!--[-->`);
          const each_array_2 = ensure_array_like(sortedAnnotations());
          for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
            let ann = each_array_2[$$index_2];
            $$renderer2.push(`<button class="w-full text-left px-5 py-3 hover:bg-gray-50/80 focus:outline-none focus:bg-primary-50 focus:ring-2 focus:ring-inset focus:ring-primary-400 transition-colors"><div class="flex items-center gap-2 mb-1.5"><div class="w-1.5 h-1.5 rounded-full"${attr_style(`background-color: ${stringify(CATEGORY_META[ann.levels[0].category]?.color || "var(--color-primary-400)")};`)}></div> <p class="text-[11px] font-medium text-gray-500 uppercase tracking-wide">${escape_html(CATEGORY_META[ann.levels[0].category]?.label || ann.levels[0].category)}</p></div> <p class="text-[13px] text-gray-800 line-clamp-2 leading-relaxed font-serif">“${escape_html(ann.anchorText)}”</p> <p class="text-[11px] text-gray-400 mt-1.5">${escape_html(ann.levels.length)} level${escape_html(ann.levels.length !== 1 ? "s" : "")}</p></button>`);
          }
          $$renderer2.push(`<!--]--> `);
          if (sortedAnnotations().length === 0) {
            $$renderer2.push("<!--[-->");
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-U-OVARm9.js.map
