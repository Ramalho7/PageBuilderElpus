import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { usePageBuilder } from '@/hooks/use-page-builder';
import { TopToolbar } from '@/components/page-builder/top-toolbar';
import { ComponentLibrary } from '@/components/page-builder/component-library';
import { MainCanvas } from '@/components/page-builder/main-canvas';
import { PropertiesPanel } from '@/components/page-builder/properties-panel';
import { ExportModal } from '@/components/page-builder/export-modal';

export default function PageBuilder() {
  const {
    // State
    elements,
    selectedElement,
    selectedElementId,
    isDragging,
    canvasMode,
    isExportModalOpen,
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
  } = usePageBuilder();

  const handleDragStart = (elementType: string) => {
    setDragging(true, elementType);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  const handleElementDrop = (elementType: string) => {
    addElement(elementType);
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Preview mode not implemented yet');
  };

  const handleResponsiveToggle = () => {
    const modes: Array<'desktop' | 'tablet' | 'mobile'> = ['desktop', 'tablet', 'mobile'];
    const currentIndex = modes.indexOf(canvasMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setCanvasMode(modes[nextIndex]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50 font-sans overflow-hidden">
        <TopToolbar
          pageTitle={pageTitle}
          onExport={openExportModal}
          onPreview={handlePreview}
          onResponsiveToggle={handleResponsiveToggle}
        />
        
        <div className="flex h-full">
          <ComponentLibrary
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onApplyTemplate={applyProductTemplate}
          />
          
          <MainCanvas
            elements={elements}
            selectedElementId={selectedElementId}
            canvasMode={canvasMode}
            canUndo={canUndo}
            canRedo={canRedo}
            onElementSelect={selectElement}
            onElementDrop={handleElementDrop}
            onUndo={undo}
            onRedo={redo}
            onCanvasModeChange={setCanvasMode}
          />
          
          <PropertiesPanel
            selectedElement={selectedElement}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            onDuplicateElement={duplicateElement}
          />
        </div>
        
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={closeExportModal}
          elements={elements}
          pageTitle={pageTitle}
        />
      </div>
    </DndProvider>
  );
}
