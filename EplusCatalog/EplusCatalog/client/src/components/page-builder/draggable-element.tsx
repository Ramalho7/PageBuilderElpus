import { PageElement } from '@/lib/page-builder-types';
import { applyElementStyle } from '@/lib/page-builder-utils';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface DraggableElementProps {
  element: PageElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function DraggableElement({ element, isSelected, onSelect }: DraggableElementProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const style = element.style ? applyElementStyle(element.style) : {};

  const renderElement = () => {
    switch (element.type) {
      case 'product-section':
        const { title: sectionTitle, description, imageUrl, imagePosition } = element.props || {};
        const isImageLeft = imagePosition === 'left';
        
        return (
          <div
            style={style}
            className={cn(
              "rounded-lg overflow-hidden",
              isSelected && "ring-2 ring-primary"
            )}
          >
            <div className={cn(
              "flex flex-col md:flex-row items-center gap-6 md:gap-8 p-6 md:p-8",
              !isImageLeft && "md:flex-row-reverse"
            )}>
              <div className="w-full md:flex-1">
                <img
                  src={imageUrl || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400'}
                  alt={sectionTitle || 'Produto'}
                  className="w-full h-auto rounded-lg object-cover max-h-80"
                />
              </div>
              <div className="w-full md:flex-1 text-white">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-blue-400">
                  {sectionTitle || 'TÍTULO DA SEÇÃO'}
                </h2>
                <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                  {description || 'Descrição da seção do produto com detalhes técnicos e benefícios.'}
                </p>
              </div>
            </div>
          </div>
        );

      case 'specs-section':
        const { title: specsTitle, specs } = element.props || {};
        
        return (
          <div
            style={style}
            className={cn(
              "border border-gray-200 rounded-lg",
              isSelected && "ring-2 ring-primary"
            )}
          >
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              {specsTitle || 'Especificações Técnicas'}
            </h2>
            <div className="space-y-8">
              {(specs || []).map((category: any, categoryIndex: number) => (
                <div key={categoryIndex}>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {(category.items || []).map((item: any, itemIndex: number) => (
                      <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{item.label}</span>
                        <span className="text-gray-600">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta-button':
        const { link } = element.props || {};
        
        return (
          <div className="text-center py-6">
            <button
              style={style}
              className={cn(
                "inline-block px-8 py-4 rounded-lg font-semibold border-none cursor-pointer transition-all hover:transform hover:scale-105",
                isSelected && "ring-2 ring-primary"
              )}
            >
              {element.content || 'Botão de Ação'}
            </button>
            {link && (
              <p className="text-xs text-gray-500 mt-2">Link: {link}</p>
            )}
          </div>
        );

      default:
        return (
          <div
            style={style}
            className={cn(
              "p-4 border border-gray-300 rounded",
              isSelected && "ring-2 ring-primary"
            )}
          >
            {element.content || 'Elemento desconhecido'}
          </div>
        );
    }
  };

  return (
    <div
      className="mb-4 cursor-pointer"
      onClick={handleClick}
    >
      {renderElement()}
    </div>
  );
}
