export interface TextMetadata {
  id: string;
  title: string;
  author: string;
  year?: number;
  category: string;
  type: 'poetry' | 'prose' | 'drama' | 'collection';
  parentId?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PoetryLine {
  globalIndex: number;
  text: string;
  start: number;
  end: number;
  indentCount?: number;
  isDropLine?: boolean;
}

export interface Poem {
  title: string;
  titleStart?: number;
  titleEnd?: number;
  stanzas: PoetryLine[][];
}

export interface ProseParagraph {
  globalIndex: number;
  text: string;
  start: number;
  end: number;
}

export interface ProseChapter {
  title: string;
  titleStart?: number;
  titleEnd?: number;
  paragraphs: ProseParagraph[];
}

export interface DramaBlock {
  globalIndex: number;
  type: 'stage' | 'speech';
  speaker?: string;
  text: string;
  start: number;
  end: number;
}

export interface DramaScene {
  title: string;
  titleStart?: number;
  titleEnd?: number;
  blocks: DramaBlock[];
}

export interface DramaAct {
  title: string;
  titleStart?: number;
  titleEnd?: number;
  scenes: DramaScene[];
}

export type ParsedText =
  | { type: 'poetry'; poems: Poem[] }
  | { type: 'prose'; chapters: ProseChapter[] }
  | { type: 'drama'; acts: DramaAct[] };
