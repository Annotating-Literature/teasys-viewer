import { m as attr, ao as attr_style, f as escape_html, q as derived, l as ensure_array_like, o as attr_class, p as stringify } from './index-BFvLoYgI.js';
import { h as html } from './html-FW6Ia4bL.js';

const CATEGORIES = [
  "language",
  "form",
  "intratextuality",
  "intertextuality",
  "context",
  "interpretation",
  "textual-variants",
  "questions"
];
const CATEGORY_META = {
  language: { label: "Language", color: "#2563eb", bg: "#dbeafe" },
  form: { label: "Form", color: "#be185d", bg: "#fce7f3" },
  intratextuality: { label: "Intratextuality", color: "#047857", bg: "#d1fae5" },
  intertextuality: { label: "Intertextuality", color: "#b45309", bg: "#fef3c7" },
  context: { label: "Context", color: "#6d28d9", bg: "#ede9fe" },
  interpretation: { label: "Interpretation", color: "#b91c1c", bg: "#fee2e2" },
  "textual-variants": { label: "Textual Variants", color: "#0369a1", bg: "#e0f2fe" },
  questions: { label: "Questions", color: "#374151", bg: "#f3f4f6" }
};
const LEVEL_1_ALLOWED_CATEGORIES = CATEGORIES.filter((c) => c !== "interpretation");
function splitIntoSegments(rawText, annotations) {
  if (!annotations || annotations.length === 0) {
    return [{ text: rawText, start: 0, end: rawText.length, annotationIds: [] }];
  }
  const breakpoints = /* @__PURE__ */ new Set([0, rawText.length]);
  for (const ann of annotations) {
    if (ann.anchorStart < 0) continue;
    breakpoints.add(ann.anchorStart);
    breakpoints.add(ann.anchorEnd);
  }
  const sortedPoints = Array.from(breakpoints).sort((a, b) => a - b);
  const segments = [];
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const start = sortedPoints[i];
    const end = sortedPoints[i + 1];
    if (start === end) continue;
    const mid = (start + end) / 2;
    const text = rawText.substring(start, end);
    const annotationIds = annotations.filter((ann) => ann.anchorStart <= mid && ann.anchorEnd > mid).map((ann) => ann.id);
    segments.push({ text, start, end, annotationIds });
  }
  return segments;
}
function TextSegment($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { segment, annotations, activeAnnotationId } = $$props;
    const ids = derived(() => segment.annotationIds);
    const isPartOfActiveAnnotation = derived(() => ids().some((id) => id === activeAnnotationId));
    const categoryStyle = derived(() => {
      if (ids().length === 0) return "";
      const primaryId = isPartOfActiveAnnotation() ? activeAnnotationId : ids()[0];
      const ann = annotations.find((a) => a.id === primaryId);
      if (!ann) return "";
      const meta = CATEGORY_META[ann.levels[0].category];
      return `background-color: ${meta.color}25; border-bottom: 2px solid ${meta.color}60;`;
    });
    const renderInlineMarkdown = (text) => {
      const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      return escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
    };
    const parsedSegmentText = derived(() => renderInlineMarkdown(segment.text));
    if (ids().length > 1) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button type="button"${attr_class(`cursor-pointer transition-all duration-200 rounded-sm px-1 py-0.5 inline text-left text-inherit font-inherit focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 ${stringify(isPartOfActiveAnnotation() ? "ring-2 ring-primary-300 brightness-95" : "hover:brightness-95")}`)}${attr_style(categoryStyle())}${attr("data-segment-ids", JSON.stringify(ids()))}${attr("data-start", segment.start)}${attr("data-end", segment.end)}>${html(parsedSegmentText())}<sup class="font-bold text-gray-500 text-[11px] ml-0.5">${escape_html(ids().length)}</sup></button>`);
    } else if (ids().length === 1) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<button type="button"${attr_class(`cursor-pointer transition-all duration-200 rounded-sm px-1 py-0.5 inline text-left text-inherit font-inherit focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 hover:brightness-95 ${stringify(isPartOfActiveAnnotation() ? "ring-2 ring-primary-300 brightness-95" : "")}`)}${attr_style(categoryStyle())}${attr("data-segment-ids", JSON.stringify(ids()))}${attr("data-start", segment.start)}${attr("data-end", segment.end)}>${html(parsedSegmentText())}</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span${attr("data-start", segment.start)}${attr("data-end", segment.end)}>${html(parsedSegmentText())}</span>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function PoemRenderer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { poems, annotations, activeAnnotationId, getSegmentsForRange } = $$props;
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(poems);
    for (let $$index_4 = 0, $$length = each_array.length; $$index_4 < $$length; $$index_4++) {
      let poem = each_array[$$index_4];
      $$renderer2.push(`<div class="mb-10">`);
      if (poem.title !== "Untitled") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">`);
        if (poem.titleStart !== void 0 && poem.titleEnd !== void 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(getSegmentsForRange(poem.titleStart, poem.titleEnd));
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let segment = each_array_1[$$index];
            TextSegment($$renderer2, { segment, annotations, activeAnnotationId });
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(poem.title)}`);
        }
        $$renderer2.push(`<!--]--></h2>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_2 = ensure_array_like(poem.stanzas);
      for (let i = 0, $$length2 = each_array_2.length; i < $$length2; i++) {
        let stanza = each_array_2[i];
        $$renderer2.push(`<div${attr_class("", void 0, { "mt-6": i > 0 })}><!--[-->`);
        const each_array_3 = ensure_array_like(stanza);
        for (let $$index_2 = 0, $$length3 = each_array_3.length; $$index_2 < $$length3; $$index_2++) {
          let line = each_array_3[$$index_2];
          const lineNum = line.globalIndex + 1;
          $$renderer2.push(`<div class="flex items-baseline"><div class="w-10 text-right text-[12px] text-gray-400 pr-4 shrink-0 select-none font-serif tabular-nums leading-loose">`);
          if (!line.isDropLine && lineNum % 5 === 0 || !line.isDropLine && lineNum === 1) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`${escape_html(lineNum)}`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="leading-loose"${attr_style(line.indentCount ? `padding-left: ${line.indentCount * 0.5}rem;` : "")}><!--[-->`);
          const each_array_4 = ensure_array_like(getSegmentsForRange(line.start, line.end));
          for (let $$index_1 = 0, $$length4 = each_array_4.length; $$index_1 < $$length4; $$index_1++) {
            let segment = each_array_4[$$index_1];
            TextSegment($$renderer2, { segment, annotations, activeAnnotationId });
          }
          $$renderer2.push(`<!--]--></div></div>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function ProseRenderer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      chapters,
      annotations,
      activeAnnotationId,
      getSegmentsForRange
    } = $$props;
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(chapters);
    for (let $$index_3 = 0, $$length = each_array.length; $$index_3 < $$length; $$index_3++) {
      let chapter = each_array[$$index_3];
      $$renderer2.push(`<div class="mb-10">`);
      if (chapter.title !== "Untitled") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">`);
        if (chapter.titleStart !== void 0 && chapter.titleEnd !== void 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(getSegmentsForRange(chapter.titleStart, chapter.titleEnd));
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let segment = each_array_1[$$index];
            TextSegment($$renderer2, { segment, annotations, activeAnnotationId });
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(chapter.title)}`);
        }
        $$renderer2.push(`<!--]--></h2>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_2 = ensure_array_like(chapter.paragraphs);
      for (let pIdx = 0, $$length2 = each_array_2.length; pIdx < $$length2; pIdx++) {
        let paragraph = each_array_2[pIdx];
        $$renderer2.push(`<div class="flex items-baseline mb-4"><div class="w-10 text-right text-[11px] text-gray-500 pr-4 shrink-0 select-none font-sans tabular-nums">${escape_html(pIdx + 1)}</div> <p class="text-justify flex-1"><!--[-->`);
        const each_array_3 = ensure_array_like(getSegmentsForRange(paragraph.start, paragraph.end));
        for (let $$index_1 = 0, $$length3 = each_array_3.length; $$index_1 < $$length3; $$index_1++) {
          let segment = each_array_3[$$index_1];
          TextSegment($$renderer2, { segment, annotations, activeAnnotationId });
        }
        $$renderer2.push(`<!--]--></p></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function DramaRenderer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { acts, annotations, activeAnnotationId, getSegmentsForRange } = $$props;
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(acts);
    for (let $$index_5 = 0, $$length = each_array.length; $$index_5 < $$length; $$index_5++) {
      let act = each_array[$$index_5];
      $$renderer2.push(`<div class="mb-10"><h2 class="text-2xl font-semibold mb-6">`);
      if (act.titleStart !== void 0 && act.titleEnd !== void 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(getSegmentsForRange(act.titleStart, act.titleEnd));
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let segment = each_array_1[$$index];
          TextSegment($$renderer2, { segment, annotations, activeAnnotationId });
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`${escape_html(act.title)}`);
      }
      $$renderer2.push(`<!--]--></h2> <!--[-->`);
      const each_array_2 = ensure_array_like(act.scenes);
      for (let $$index_4 = 0, $$length2 = each_array_2.length; $$index_4 < $$length2; $$index_4++) {
        let scene = each_array_2[$$index_4];
        $$renderer2.push(`<div class="mb-6"><h3 class="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4">`);
        if (scene.titleStart !== void 0 && scene.titleEnd !== void 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<!--[-->`);
          const each_array_3 = ensure_array_like(getSegmentsForRange(scene.titleStart, scene.titleEnd));
          for (let $$index_1 = 0, $$length3 = each_array_3.length; $$index_1 < $$length3; $$index_1++) {
            let segment = each_array_3[$$index_1];
            TextSegment($$renderer2, { segment, annotations, activeAnnotationId });
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(scene.title)}`);
        }
        $$renderer2.push(`<!--]--></h3> <!--[-->`);
        const each_array_4 = ensure_array_like(scene.blocks);
        for (let bIdx = 0, $$length3 = each_array_4.length; bIdx < $$length3; bIdx++) {
          let block = each_array_4[bIdx];
          if (block.type === "stage") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<p class="italic text-gray-500 text-base my-3 pl-10">[${escape_html(block.text)}]</p>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<div class="flex items-baseline mb-1"><div class="w-10 text-right text-[11px] text-gray-500 pr-4 shrink-0 select-none font-sans tabular-nums leading-loose">`);
            if ((bIdx + 1) % 5 === 0 || bIdx === 0) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`${escape_html(bIdx + 1)}`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]--></div> <p><strong class="font-bold text-gray-600 dark:text-gray-300 text-m font-sans uppercase tracking-wide">${escape_html(block.speaker)}:</strong> <span class="ml-2"><!--[-->`);
            const each_array_5 = ensure_array_like(getSegmentsForRange(block.start, block.end));
            for (let $$index_2 = 0, $$length4 = each_array_5.length; $$index_2 < $$length4; $$index_2++) {
              let segment = each_array_5[$$index_2];
              TextSegment($$renderer2, { segment, annotations, activeAnnotationId });
            }
            $$renderer2.push(`<!--]--></span></p></div>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function AnnotatedText($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      rawText,
      parsedText,
      annotations,
      activeAnnotationId,
      title = ""
    } = $$props;
    const allSegments = derived(() => splitIntoSegments(rawText, annotations));
    const titleAnnotations = derived(() => title ? annotations.filter((a) => a.anchorStart < 0) : []);
    const titleStyle = derived(() => {
      if (titleAnnotations().length === 0) return "";
      const active = titleAnnotations().find((a) => a.id === activeAnnotationId);
      const ann = active || titleAnnotations()[0];
      const meta = CATEGORY_META[ann.levels[0]?.category];
      if (!meta) return "";
      return `background-color: ${meta.color}25; border-bottom: 2px solid ${meta.color}60;`;
    });
    function getSegmentsForRange(lineStart, lineEnd) {
      const overlapping = allSegments().filter((seg) => seg.start < lineEnd && seg.end > lineStart);
      return overlapping.map((seg) => {
        const start = Math.max(seg.start, lineStart);
        const end = Math.min(seg.end, lineEnd);
        return { ...seg, text: rawText.substring(start, end), start, end };
      });
    }
    if (!parsedText) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="animate-pulse space-y-6"><div class="h-8 bg-gray-100 rounded-lg w-2/3"></div> <div class="space-y-3"><div class="h-5 bg-gray-100 rounded w-full"></div> <div class="h-5 bg-gray-100 rounded w-5/6"></div> <div class="h-5 bg-gray-100 rounded w-full"></div> <div class="h-5 bg-gray-100 rounded w-3/4"></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="text-lg leading-loose text-gray-800">`);
      if (title) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<h2 class="text-2xl font-semibold text-gray-900 mb-6 font-serif cursor-pointer rounded-sm px-1"${attr("data-start", -title.length)}${attr("data-end", 0)}${attr("data-segment-ids", JSON.stringify(titleAnnotations().map((a) => a.id)))}${attr_style(titleStyle())}>${escape_html(title)}</h2>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (parsedText.type === "poetry") {
        $$renderer2.push("<!--[-->");
        PoemRenderer($$renderer2, {
          poems: parsedText.poems,
          annotations,
          activeAnnotationId,
          getSegmentsForRange
        });
      } else if (parsedText.type === "prose") {
        $$renderer2.push("<!--[1-->");
        ProseRenderer($$renderer2, {
          chapters: parsedText.chapters,
          annotations,
          activeAnnotationId,
          getSegmentsForRange
        });
      } else if (parsedText.type === "drama") {
        $$renderer2.push("<!--[2-->");
        DramaRenderer($$renderer2, {
          acts: parsedText.acts,
          annotations,
          activeAnnotationId,
          getSegmentsForRange
        });
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { AnnotatedText as A, CATEGORY_META as C, LEVEL_1_ALLOWED_CATEGORIES as L };
//# sourceMappingURL=AnnotatedText-CKXg5D-C.js.map
