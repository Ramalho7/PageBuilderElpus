import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { componentDefinitions, productTemplates, applyTemplate, ProductTemplate } from '@/lib/page-builder-utils';
import { useDragComponent } from '@/hooks/use-drag-drop';
import { cn } from '@/lib/utils';
import { usePageBuilder } from '@/hooks/use-page-builder';

interface ComponentLibraryProps {
  onDragStart: (elementType: string) => void;
  onDragEnd: () => void;
  onApplyTemplate: (template: ProductTemplate) => void;
}

export function ComponentLibrary({ onDragStart, onDragEnd, onApplyTemplate }: ComponentLibraryProps) {
  const [activeTab, setActiveTab] = useState<'elements' | 'templates'>('elements');

  const categories = {
    product: componentDefinitions.filter(def => def.category === 'product'),
    content: componentDefinitions.filter(def => def.category === 'content'),
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-3">Componentes</h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeTab === 'elements' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('elements')}
            className="flex-1"
          >
            Elementos
          </Button>
          <Button
            variant={activeTab === 'templates' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('templates')}
            className="flex-1"
          >
            Templates
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'elements' && (
          <div className="space-y-6">
            <ComponentCategory
              title="Seções do Produto"
              components={categories.product}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
            
            <ComponentCategory
              title="Elementos Extras"
              components={categories.content}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          </div>
        )}
        
        {activeTab === 'templates' && (
          <TemplateLibrary onApplyTemplate={onApplyTemplate} />
        )}
      </div>
    </div>
  );
}

interface ComponentCategoryProps {
  title: string;
  components: any[];
  onDragStart: (elementType: string) => void;
  onDragEnd: () => void;
}

function ComponentCategory({ title, components, onDragStart, onDragEnd }: ComponentCategoryProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
        {title}
      </h3>
      <div className={cn(
        "gap-2",
        title === "Layout" ? "grid grid-cols-2" : "space-y-2"
      )}>
        {components.map((component) => (
          <DraggableComponent
            key={component.type}
            component={component}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

interface DraggableComponentProps {
  component: any;
  onDragStart: (elementType: string) => void;
  onDragEnd: () => void;
}

function DraggableComponent({ component, onDragStart, onDragEnd }: DraggableComponentProps) {
  const { drag, isDragging } = useDragComponent(component.type);

  const handleDragStart = () => {
    onDragStart(component.type);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div
      ref={drag}
      className={cn(
        "p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-move transition-colors",
        "border-2 border-dashed border-transparent hover:border-primary/30",
        isDragging && "opacity-50"
      )}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {component.type === 'product-section' && (
        <>
          <div className="bg-gray-800 rounded-lg p-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gray-600 rounded"></div>
              <div className="flex-1">
                <div className="h-2 bg-blue-400 rounded mb-1"></div>
                <div className="h-1.5 bg-gray-400 rounded w-3/4"></div>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 text-center font-medium">{component.label}</div>
        </>
      )}
      
      {component.type === 'specs-section' && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
            <div className="h-3 bg-gray-700 rounded mb-2"></div>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-1.5 bg-gray-400 rounded w-1/3"></div>
                <div className="h-1.5 bg-gray-300 rounded w-1/4"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-1.5 bg-gray-400 rounded w-2/5"></div>
                <div className="h-1.5 bg-gray-300 rounded w-1/5"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-1.5 bg-gray-400 rounded w-1/4"></div>
                <div className="h-1.5 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-600 text-center font-medium">{component.label}</div>
        </>
      )}
      
      {component.type === 'cta-button' && (
        <>
          <div className="bg-blue-600 rounded-lg p-3 mb-2 text-center">
            <div className="h-2 bg-blue-200 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="text-xs text-gray-600 text-center font-medium">{component.label}</div>
        </>
      )}
    </div>
  );
}

interface TemplateLibraryProps {
  onApplyTemplate: (template: ProductTemplate) => void;
}

function TemplateLibrary({ onApplyTemplate }: TemplateLibraryProps) {
  const handleApplyTemplate = (template: ProductTemplate) => {
    if (window.confirm(`Aplicar o template "${template.name}"? Isso substituirá o conteúdo atual.`)) {
      onApplyTemplate(template);
    }
  };

  const templatesByCategory = productTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, ProductTemplate[]>);

  const categoryNames = {
    gaming: 'Gaming',
    electronics: 'Eletrônicos',
    tech: 'Tecnologia',
    fashion: 'Moda',
    home: 'Casa'
  };

  return (
    <div className="space-y-6">
      {Object.entries(templatesByCategory).map(([category, templates]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">
            {categoryNames[category as keyof typeof categoryNames] || category}
          </h3>
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-transparent hover:border-primary/30"
                onClick={() => handleApplyTemplate(template)}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{template.preview}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                    <p className="text-xs text-gray-600">{template.description}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {template.elements.length} elemento(s)
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 text-sm mb-1">Dica</h4>
        <p className="text-xs text-blue-700">
          Clique em um template para aplicá-lo instantaneamente. Você pode personalizar todos os elementos depois.
        </p>
      </div>
    </div>
  );
}
