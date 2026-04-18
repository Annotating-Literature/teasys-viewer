import { k as head, f as escape_html, l as ensure_array_like, o as attr_class, m as attr, q as derived, ap as bind_props, ao as attr_style } from './index-BFvLoYgI.js';
import { C as CATEGORY_META, L as LEVEL_1_ALLOWED_CATEGORIES, A as AnnotatedText } from './AnnotatedText-CKXg5D-C.js';
import './marked.esm-9kFglIxa.js';
import 'isomorphic-dompurify';
import './html-FW6Ia4bL.js';

function CategorySelect($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { id, selected, level, onChange } = $$props;
    const availableCategories = derived(() => level === 1 ? LEVEL_1_ALLOWED_CATEGORIES : Object.keys(CATEGORY_META));
    $$renderer2.select(
      {
        id,
        class: "w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white",
        value: selected,
        onchange: (e) => onChange(e.currentTarget.value)
      },
      ($$renderer3) => {
        $$renderer3.option({ disabled: true, value: "" }, ($$renderer4) => {
          $$renderer4.push(`Select a category`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(availableCategories());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let category = each_array[$$index];
          $$renderer3.option({ value: category }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(CATEGORY_META[category].label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
  });
}
function MarkdownEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      id,
      value = void 0,
      placeholder = "Write your annotation here (Markdown supported)...",
      availableAnnotations = []
    } = $$props;
    let showPreview = false;
    $$renderer2.push(`<div class="border border-gray-200 rounded-lg relative"><div class="flex border-b border-gray-100 bg-gray-50 rounded-t-lg"><button${attr_class("px-3 py-1.5 text-[11px] font-medium transition-colors rounded-tl-lg", void 0, {
      "text-primary-600": !showPreview,
      "bg-white": !showPreview,
      "text-gray-500": showPreview,
      "bg-gray-50": showPreview
    })}>Write</button> <button${attr_class("px-3 py-1.5 text-[11px] font-medium transition-colors", void 0, {
      "text-primary-600": showPreview,
      "bg-white": showPreview,
      "text-gray-500": !showPreview,
      "bg-gray-50": !showPreview
    })}>Preview</button> `);
    if (availableAnnotations.length > 0 && !showPreview) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="ml-auto px-3 py-1.5 text-[11px] text-gray-500 flex items-center gap-2"><div class="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1"><button type="button" class="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-sans font-bold text[13px]" title="Bold (select text first)">B</button> <button type="button" class="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-serif italic font-bold text[13px]" title="Italic (select text first)">I</button></div> <span>Type <kbd class="px-1 py-0.5 bg-gray-200 rounded text-[9px] font-mono">[[</kbd> to cross-reference</span></span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="relative"><textarea${attr("id", id)} class="w-full h-32 p-3 text-m focus:outline-none placeholder:text-gray-500 resize-y bg-transparent rounded-b-lg"${attr("placeholder", placeholder)}>`);
      const $$body = escape_html(value);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
function WorksCitedEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { id, works } = $$props;
    $$renderer2.push(`<div${attr("id", id)} class="space-y-2"><!--[-->`);
    const each_array = ensure_array_like(works);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let work = each_array[i];
      $$renderer2.push(`<div class="flex items-start gap-1"><textarea class="flex-1 px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500 min-h-[80px] resize-y" placeholder="e.g., Pound, Ezra. *A Retrospect.* **1918**.">`);
      const $$body = escape_html(work);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea> <div class="flex flex-col gap-1"><button type="button" class="w-7 h-7 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center text-m font-sans font-bold" title="Bold (select text first)">B</button> <button type="button" class="w-7 h-7 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center text-m font-serif italic font-bold" title="Italic (select text first)">I</button></div> <button class="w-7 h-7 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">×</button></div>`);
    }
    $$renderer2.push(`<!--]--> <button class="text-[11px] font-medium text-primary-600 hover:text-primary-700 transition-colors">+ Add source</button></div>`);
  });
}
function LevelEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { level, availableAnnotations = [], onChange } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="space-y-4"><div><label for="category-select" class="block text[13px] font-medium text-gray-600 mb-1">Category</label> `);
      CategorySelect($$renderer3, {
        id: "category-select",
        selected: level.category,
        level: level.level,
        onChange: (c) => onChange({ ...level, category: c })
      });
      $$renderer3.push(`<!----></div> <div><label for="body-editor" class="block text[13px] font-medium text-gray-600 mb-1">Body <span class="text-gray-500">(Markdown)</span></label> `);
      MarkdownEditor($$renderer3, {
        id: "body-editor",
        availableAnnotations,
        get value() {
          return level.body;
        },
        set value($$value) {
          level.body = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> <div><label for="works-cited-editor" class="block text[13px] font-medium text-gray-600 mb-1">Works Cited</label> `);
      WorksCitedEditor($$renderer3, {
        id: "works-cited-editor",
        works: level.worksCited
      });
      $$renderer3.push(`<!----></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function AnnotationForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const CAT_SHORT = {
      language: "Lang",
      form: "Form",
      intratextuality: "IntraT",
      intertextuality: "InterT",
      context: "Ctx",
      interpretation: "Interp",
      "textual-variants": "Var",
      questions: "Qst"
    };
    let {
      annotation,
      availableAnnotations = []
    } = $$props;
    let formData = JSON.parse(JSON.stringify(annotation));
    let activeLevelIndex = 0;
    let newAuthorInput = "";
    const maxLevelNum = derived(() => formData.levels.length > 0 ? Math.max(...formData.levels.map((l) => l.level)) : 1);
    $$renderer2.push(`<div class="space-y-5"><div><label class="block text[13px] font-medium text-gray-600 mb-1">Authors</label> <div class="flex flex-wrap gap-1.5 mb-2"><!--[-->`);
    const each_array = ensure_array_like(formData.authors);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let author = each_array[i];
      $$renderer2.push(`<span class="inline-flex items-center gap-1 px-2 py-0.5 text[13px] font-medium bg-primary-50 text-primary-700 rounded-md">${escape_html(author)} <button class="text-primary-400 hover:text-primary-600 transition-colors ml-0.5">×</button></span>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-2"><input type="text" list="author-suggestions" class="flex-1 px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500" placeholder="Add an author..."${attr("value", newAuthorInput)}/> <datalist id="author-suggestions"><!--[-->`);
    const each_array_1 = ensure_array_like(Array.from(new Set(availableAnnotations.flatMap((a) => a.authors))).filter((a) => !formData.authors.includes(a)));
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let author = each_array_1[$$index_1];
      $$renderer2.option({ value: author }, ($$renderer3) => {
      });
    }
    $$renderer2.push(`<!--]--></datalist> <button class="px-3 py-2 text-m font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">Add</button></div></div> <div><label for="annotation-version" class="block text[13px] font-medium text-gray-600 mb-1">Version</label> <input id="annotation-version" type="number" min="1" class="w-24 px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"${attr("value", formData.version)}/></div> <div><div class="flex items-center justify-between mb-2"><span class="text[13px] font-medium text-gray-600">Levels</span> <div class="flex gap-2"><button class="text-[11px] font-medium text-primary-600 hover:text-primary-700 transition-colors">+ L${escape_html(maxLevelNum())}</button> `);
    if (maxLevelNum() < 3) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="text-[11px] font-medium text-primary-600 hover:text-primary-700 transition-colors">+ L${escape_html(maxLevelNum() + 1)}</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex flex-wrap gap-1 mb-3"><!--[-->`);
    const each_array_2 = ensure_array_like(formData.levels);
    for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
      let level = each_array_2[i];
      $$renderer2.push(`<button${attr_class("text[13px] font-medium px-2.5 py-1.5 rounded-md transition-all border", void 0, {
        "bg-primary-600": i === activeLevelIndex,
        "text-white": i === activeLevelIndex,
        "border-primary-600": i === activeLevelIndex,
        "bg-white": i !== activeLevelIndex,
        "text-gray-500": i !== activeLevelIndex,
        "border-gray-200": i !== activeLevelIndex,
        "hover:border-gray-500": i !== activeLevelIndex
      })}>L${escape_html(level.level)} · ${escape_html(CAT_SHORT[level.category] ?? level.category)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div>`);
    LevelEditor($$renderer2, {
      level: formData.levels[activeLevelIndex],
      availableAnnotations,
      onChange: (updated) => {
        const newLevels = [...formData.levels];
        newLevels[activeLevelIndex] = updated;
        formData.levels = newLevels;
      }
    });
    $$renderer2.push(`<!----> `);
    if (formData.levels.length > 1) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="mt-2 text-[11px] text-red-500 hover:text-red-600 transition-colors">Remove this level</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="flex items-center justify-between pt-4 border-t border-gray-100"><div>`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-3"><button class="text[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors">Cancel</button> <button class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors">Save</button></div></div></div>`);
  });
}
function TextSelector($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    $$renderer2.push(`<div class="relative">`);
    children($$renderer2);
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let selectedAnnotation = null;
    const formAnnotation = derived(() => {
      return null;
    });
    const titleAnnotations = derived(() => data.annotations.filter((a) => a.anchorStart < 0));
    const titleStyle = derived(() => {
      if (titleAnnotations().length === 0) return "";
      const active = titleAnnotations().find((a) => a.id === selectedAnnotation?.id);
      const ann = active || titleAnnotations()[0];
      const meta = CATEGORY_META[ann.levels[0]?.category];
      if (!meta) return "";
      return `background-color: ${meta.color}25; border-bottom: 2px solid ${meta.color}60;`;
    });
    head("1ykbh2z", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Annotate: ${escape_html(data.text.metadata.title)} — TEASys Viewer</title>`);
      });
    });
    $$renderer2.push(`<div class="flex" style="height: calc(100vh - 4rem);"><div class="w-[400px] shrink-0 overflow-y-auto border-r border-gray-200 bg-white flex flex-col">`);
    if (formAnnotation()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="p-4 border-b border-gray-100 bg-gray-50"><div class="flex items-center justify-between mb-2"><h2 class="font-semibold text-m text-gray-900">${escape_html("New Annotation")}</h2> <button class="text[13px] text-gray-500 hover:text-gray-600 transition-colors">Cancel</button></div> <div class="bg-primary-50 rounded-lg p-3 border-l-4 border-primary-300"><p class="text[13px] text-gray-500 mb-0.5">Annotating:</p> <p class="text-m text-gray-700">“${escape_html(formAnnotation().anchorText)}”</p></div></div> <div class="flex-1 overflow-y-auto p-4">`);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      AnnotationForm($$renderer2, {
        annotation: formAnnotation(),
        availableAnnotations: data.annotations.filter((a) => a.id !== formAnnotation().id)
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="p-4 border-b border-gray-100"><h2 class="font-semibold text-m text-gray-900">Annotations</h2> <p class="text[13px] text-gray-500 mt-0.5">Select text in the reading area to annotate</p></div> <div class="flex-1 overflow-y-auto p-4">`);
      if (data.annotations.length === 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="text-center py-8"><div class="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center"><span class="text-gray-500">—</span></div> <p class="text-m text-gray-500">No annotations yet</p> <p class="text[13px] text-gray-500 mt-1">Highlight text to create one</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like(data.annotations);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let ann = each_array[$$index];
          $$renderer2.push(`<button${attr_class("w-full text-left p-3 rounded-lg mb-2 transition-all border hover:border-primary-200 hover:bg-primary-50/50", void 0, {
            "border-primary-300": selectedAnnotation?.id === ann.id,
            "bg-primary-50": selectedAnnotation?.id === ann.id,
            "border-transparent": selectedAnnotation?.id !== ann.id
          })}><p class="text-m text-gray-800 line-clamp-1">“${escape_html(ann.anchorText)}”</p> <p class="text-[11px] text-gray-500 mt-0.5">by ${escape_html(ann.authors.join(", "))}</p></button>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex-1 overflow-y-auto p-8 bg-surface"><div class="max-w-3xl mx-auto"><div class="mb-6"><a${attr("href", `/texts/${data.text.metadata.id}`)} class="inline-flex items-center gap-1.5 text-m text-gray-500 hover:text-primary-600 transition-colors"><svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11L5 7l4-4"></path></svg> Back to reading view</a> <h1 class="text-2xl font-bold text-gray-900 mt-2">${escape_html(data.text.metadata.title)}</h1> <p class="text-m text-gray-500 mt-1">${escape_html(data.text.metadata.author)}</p></div> <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-8">`);
    TextSelector($$renderer2, {
      children: ($$renderer3) => {
        $$renderer3.push(`<h2 class="text-2xl font-semibold text-gray-900 mb-6 font-serif rounded-sm px-1"${attr("data-start", -data.text.metadata.title.length)}${attr("data-end", 0)}${attr_style(titleStyle())}>${escape_html(data.text.metadata.title)}</h2> `);
        AnnotatedText($$renderer3, {
          rawText: data.text.rawText,
          parsedText: data.parsedText,
          annotations: data.annotations,
          activeAnnotationId: null
        });
        $$renderer3.push(`<!---->`);
      }
    });
    $$renderer2.push(`<!----></div></div></div></div>`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-BUDLpilF.js.map
