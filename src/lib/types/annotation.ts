export type Category =
  | 'language' | 'form' | 'intratextuality' | 'intertextuality'
  | 'context' | 'interpretation' | 'textual-variants' | 'questions';

export interface AnnotationLevel {
  level: 1 | 2 | 3;
  category: Category;
  body: string;          // Markdown text
  worksCited: string[];
}

export interface CrossRef {
  annotationId: string;
  annotationTitle: string;
  level: 1 | 2 | 3;
  category: Category;
}

export interface Annotation {
  id: string;            // UUID
  anchorText: string;    // exact quoted text from primary source
  anchorStart: number;   // char offset in text.txt
  anchorEnd: number;
  authors: string[];     // one or more author names
  version: number;       // internal version counter
  createdAt: string;     // ISO
  updatedAt: string;
  levels: AnnotationLevel[];
  crossRefs: CrossRef[];
}
