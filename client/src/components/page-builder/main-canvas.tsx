import { Button } from "@/components/ui/button";
import { Undo, Redo, Monitor, Tablet, Smartphone } from "lucide-react";
import { PageElement } from '@/lib/page-builder-types';
import { useDragDrop } from '@/hooks/use-drag-drop';
import { DraggableElement } from './draggable-element';
import { cn } from '@/lib/utils';

interface MainCanvasProps {
  elements: PageElement[];
  selectedElementId: string | null;
  canvasMode: 'desktop' | 'tablet' | 'mobile';
  canUndo: boolean;
  canRedo: boolean;
  onElementSelect: (id: string | null) => void;
  onElementDrop: (elementType: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onCanvasModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export function MainCanvas({
  elements,
  selectedElementId,
  canvasMode,
  canUndo,
  canRedo,
  onElementSelect,
  onElementDrop,
  onUndo,
  onRedo,
  onCanvasModeChange,
}: MainCanvasProps) {
  const { drop, isOver, canDropHere } = useDragDrop(onElementDrop, true);

  const getCanvasWidth = () => {
    switch (canvasMode) {
      case 'tablet': return 'max-w-3xl';
      case 'mobile': return 'max-w-sm';
      default: return 'max-w-6xl';
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onElementSelect(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Canvas Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="w-8 h-8 p-0"
            >
              <Undo size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="w-8 h-8 p-0"
            >
              <Redo size={16} />
            </Button>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">100%</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={canvasMode === 'desktop' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onCanvasModeChange('desktop')}
            className="w-8 h-8 p-0"
          >
            <Monitor size={16} />
          </Button>
          <Button
            variant={canvasMode === 'tablet' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onCanvasModeChange('tablet')}
            className="w-8 h-8 p-0"
          >
            <Tablet size={16} />
          </Button>
          <Button
            variant={canvasMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onCanvasModeChange('mobile')}
            className="w-8 h-8 p-0"
          >
            <Smartphone size={16} />
          </Button>
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className={cn("mx-auto transition-all duration-300", getCanvasWidth())}>
          <div
            ref={drop}
            className={cn(
              "bg-white rounded-lg shadow-sm border border-gray-200 min-h-screen relative",
              isOver && canDropHere && "ring-2 ring-primary ring-opacity-50",
              elements.length === 0 && "flex items-center justify-center"
            )}
            onClick={handleCanvasClick}
          >
            {elements.length === 0 ? (
              <div className="text-center p-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Comece criando sua descrição
                </h3>
                <p className="text-gray-600 mb-4">
                  Arraste seções da barra lateral para criar a descrição detalhada do seu produto.
                </p>
                {isOver && canDropHere && (
                  <div className="p-4 border-2 border-dashed border-primary bg-primary/5 rounded-lg">
                    <p className="text-primary font-medium">
                      Solte o componente aqui para adicioná-lo
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8">
                {elements.map((element) => (
                  <DraggableElement
                    key={element.id}
                    element={element}
                    isSelected={selectedElementId === element.id}
                    onSelect={onElementSelect}
                  />
                ))}
                
                {isOver && canDropHere && (
                  <div className="absolute inset-4 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center">
                    <p className="text-primary font-medium">
                      Solte o componente aqui
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
