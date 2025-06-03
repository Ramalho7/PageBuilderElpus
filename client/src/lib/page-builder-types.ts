export interface ElementPosition {
  x: number;
  y: number;
}

export interface ElementSize {
  width: string;
  height: string;
}

export interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  textColor?: string;
  backgroundColor?: string;
  width?: string;
  height?: string;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  borderRadius?: string;
  animation?: {
    type?: string;
    duration?: number;
  };
}

export interface PageElement {
  id: string;
  type: string;
  content?: string;
  style?: ElementStyle;
  props?: Record<string, any>;
  children?: string[];
  parentId?: string;
}

export interface ComponentDefinition {
  type: string;
  label: string;
  icon: string;
  category: 'layout' | 'product' | 'content';
  defaultContent?: string;
  defaultStyle?: ElementStyle;
  defaultProps?: Record<string, any>;
}

export interface HistoryState {
  elements: PageElement[];
  selectedElementId: string | null;
}

export interface PageBuilderState {
  elements: PageElement[];
  selectedElementId: string | null;
  isDragging: boolean;
  draggedElementType: string | null;
  history: HistoryState[];
  historyIndex: number;
  canvasMode: 'desktop' | 'tablet' | 'mobile';
  isExportModalOpen: boolean;
}
