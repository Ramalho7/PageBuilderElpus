import { useState, useCallback, useEffect } from 'react';
import { PageElement, HistoryState, PageBuilderState } from '@/lib/page-builder-types';
import { createElement, savePageToLocalStorage, loadPageFromLocalStorage, ProductTemplate, applyTemplate } from '@/lib/page-builder-utils';

export function usePageBuilder() {
  const [state, setState] = useState<PageBuilderState>({
    elements: [],
    selectedElementId: null,
    isDragging: false,
    draggedElementType: null,
    history: [],
    historyIndex: -1,
    canvasMode: 'desktop',
    isExportModalOpen: false,
  });

  const [pageTitle, setPageTitle] = useState('Página sem título');

  // Load initial data from localStorage
  useEffect(() => {
    const savedData = loadPageFromLocalStorage();
    if (savedData) {
      setState(prev => ({ ...prev, elements: savedData.elements }));
      setPageTitle(savedData.title);
    }
  }, []);

  // Save to localStorage whenever elements change
  useEffect(() => {
    if (state.elements.length > 0) {
      savePageToLocalStorage(state.elements, pageTitle);
    }
  }, [state.elements, pageTitle]);

  const saveToHistory = useCallback(() => {
    setState(prev => {
      const newHistoryItem: HistoryState = {
        elements: [...prev.elements],
        selectedElementId: prev.selectedElementId,
      };

      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(newHistoryItem);

      // Limit history to 50 items
      const limitedHistory = newHistory.slice(-50);

      return {
        ...prev,
        history: limitedHistory,
        historyIndex: limitedHistory.length - 1,
      };
    });
  }, []);

  const addElement = useCallback((type: string, parentId?: string) => {
    const newElement = createElement(type, parentId);
    
    setState(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      selectedElementId: newElement.id,
    }));

    saveToHistory();
  }, [saveToHistory]);

  const updateElement = useCallback((id: string, updates: Partial<PageElement>) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      ),
    }));

    saveToHistory();
  }, [saveToHistory]);

  const deleteElement = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      selectedElementId: prev.selectedElementId === id ? null : prev.selectedElementId,
    }));

    saveToHistory();
  }, [saveToHistory]);

  const duplicateElement = useCallback((id: string) => {
    const element = state.elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.id}_copy_${Date.now()}`,
      };
      
      setState(prev => ({
        ...prev,
        elements: [...prev.elements, newElement],
        selectedElementId: newElement.id,
      }));

      saveToHistory();
    }
  }, [state.elements, saveToHistory]);

  const selectElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElementId: id }));
  }, []);

  const setDragging = useCallback((isDragging: boolean, elementType?: string) => {
    setState(prev => ({
      ...prev,
      isDragging,
      draggedElementType: elementType || null,
    }));
  }, []);

  const setCanvasMode = useCallback((mode: 'desktop' | 'tablet' | 'mobile') => {
    setState(prev => ({ ...prev, canvasMode: mode }));
  }, []);

  const openExportModal = useCallback(() => {
    setState(prev => ({ ...prev, isExportModalOpen: true }));
  }, []);

  const closeExportModal = useCallback(() => {
    setState(prev => ({ ...prev, isExportModalOpen: false }));
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        const historyItem = prev.history[newIndex];
        
        return {
          ...prev,
          elements: [...historyItem.elements],
          selectedElementId: historyItem.selectedElementId,
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        const historyItem = prev.history[newIndex];
        
        return {
          ...prev,
          elements: [...historyItem.elements],
          selectedElementId: historyItem.selectedElementId,
          historyIndex: newIndex,
        };
      }
      return prev;
    });
  }, []);

  const applyProductTemplate = useCallback((template: ProductTemplate) => {
    const templateElements = applyTemplate(template);
    
    setState(prev => ({
      ...prev,
      elements: templateElements,
      selectedElementId: null,
    }));

    saveToHistory();
  }, [saveToHistory]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const selectedElement = state.selectedElementId 
    ? state.elements.find(el => el.id === state.selectedElementId) 
    : null;

  return {
    // State
    elements: state.elements,
    selectedElement,
    selectedElementId: state.selectedElementId,
    isDragging: state.isDragging,
    draggedElementType: state.draggedElementType,
    canvasMode: state.canvasMode,
    isExportModalOpen: state.isExportModalOpen,
    pageTitle,
    canUndo,
    canRedo,

    // Actions
    addElement,
    updateElement,
    deleteElement,
    duplicateElement,
    selectElement,
    setDragging,
    setCanvasMode,
    openExportModal,
    closeExportModal,
    setPageTitle,
    undo,
    redo,
    applyProductTemplate,
  };
}
