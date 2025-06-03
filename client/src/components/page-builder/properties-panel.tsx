import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Trash2, Copy, Bold, Italic, Underline } from "lucide-react";
import { PageElement } from '@/lib/page-builder-types';

interface PropertiesPanelProps {
  selectedElement: PageElement | null;
  onUpdateElement: (id: string, updates: Partial<PageElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
}

export function PropertiesPanel({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
}: PropertiesPanelProps) {
  const [activeStyleTab, setActiveStyleTab] = useState('content');

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Propriedades</h2>
          <p className="text-sm text-gray-600 mt-1">Selecione um elemento para editar</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Copy className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600">Nenhum elemento selecionado</p>
          </div>
        </div>
      </div>
    );
  }

  const updateContent = (content: string) => {
    onUpdateElement(selectedElement.id, { content });
  };

  const updateStyle = (styleUpdates: any) => {
    onUpdateElement(selectedElement.id, {
      style: { ...selectedElement.style, ...styleUpdates }
    });
  };

  const updateProps = (propUpdates: any) => {
    onUpdateElement(selectedElement.id, {
      props: { ...selectedElement.props, ...propUpdates }
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Propriedades</h2>
        <p className="text-sm text-gray-600 mt-1">
          {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Content Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Conteúdo</h3>
            <div className="space-y-3">
              {selectedElement.type === 'product-section' && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Título da Seção</Label>
                    <Input
                      value={selectedElement.props?.title || ''}
                      onChange={(e) => updateProps({ title: e.target.value })}
                      placeholder="Ex: FAST IPS ALTA PERFORMANCE"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Descrição</Label>
                    <Textarea
                      value={selectedElement.props?.description || ''}
                      onChange={(e) => updateProps({ description: e.target.value })}
                      placeholder="Descrição detalhada da funcionalidade..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">URL da Imagem</Label>
                    <Input
                      value={selectedElement.props?.imageUrl || ''}
                      onChange={(e) => updateProps({ imageUrl: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Posição da Imagem</Label>
                    <Select
                      value={selectedElement.props?.imagePosition || 'left'}
                      onValueChange={(value) => updateProps({ imagePosition: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Esquerda</SelectItem>
                        <SelectItem value="right">Direita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {selectedElement.type === 'specs-section' && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Título da Seção</Label>
                    <Input
                      value={selectedElement.props?.title || ''}
                      onChange={(e) => updateProps({ title: e.target.value })}
                      placeholder="Especificações Técnicas"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-2">Especificações</Label>
                    <div className="space-y-4 max-h-64 overflow-y-auto">
                      {(selectedElement.props?.specs || []).map((category: any, categoryIndex: number) => (
                        <div key={categoryIndex} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Input
                              value={category.category}
                              onChange={(e) => {
                                const newSpecs = [...(selectedElement.props?.specs || [])];
                                newSpecs[categoryIndex].category = e.target.value;
                                updateProps({ specs: newSpecs });
                              }}
                              placeholder="Nome da categoria"
                              className="text-sm font-medium"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSpecs = (selectedElement.props?.specs || []).filter((_: any, i: number) => i !== categoryIndex);
                                updateProps({ specs: newSpecs });
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(category.items || []).map((item: any, itemIndex: number) => (
                              <div key={itemIndex} className="flex gap-2">
                                <Input
                                  value={item.label}
                                  onChange={(e) => {
                                    const newSpecs = [...(selectedElement.props?.specs || [])];
                                    newSpecs[categoryIndex].items[itemIndex].label = e.target.value;
                                    updateProps({ specs: newSpecs });
                                  }}
                                  placeholder="Propriedade"
                                  className="text-xs"
                                />
                                <Input
                                  value={item.value}
                                  onChange={(e) => {
                                    const newSpecs = [...(selectedElement.props?.specs || [])];
                                    newSpecs[categoryIndex].items[itemIndex].value = e.target.value;
                                    updateProps({ specs: newSpecs });
                                  }}
                                  placeholder="Valor"
                                  className="text-xs"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newSpecs = [...(selectedElement.props?.specs || [])];
                                    newSpecs[categoryIndex].items = newSpecs[categoryIndex].items.filter((_: any, i: number) => i !== itemIndex);
                                    updateProps({ specs: newSpecs });
                                  }}
                                >
                                  <Trash2 size={12} />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newSpecs = [...(selectedElement.props?.specs || [])];
                                newSpecs[categoryIndex].items.push({ label: '', value: '' });
                                updateProps({ specs: newSpecs });
                              }}
                              className="w-full text-xs"
                            >
                              + Adicionar Item
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newSpecs = [...(selectedElement.props?.specs || []), { category: '', items: [{ label: '', value: '' }] }];
                          updateProps({ specs: newSpecs });
                        }}
                        className="w-full"
                      >
                        + Adicionar Categoria
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {selectedElement.type === 'cta-button' && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Texto do Botão</Label>
                    <Input
                      value={selectedElement.content || ''}
                      onChange={(e) => updateContent(e.target.value)}
                      placeholder="Ver Mais Detalhes"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Link de Destino</Label>
                    <Input
                      value={selectedElement.props?.link || ''}
                      onChange={(e) => updateProps({ link: e.target.value })}
                      placeholder="https://exemplo.com"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="openInNewTab"
                      checked={selectedElement.props?.openInNewTab || false}
                      onChange={(e) => updateProps({ openInNewTab: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="openInNewTab" className="text-xs text-gray-700">
                      Abrir em nova aba
                    </Label>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Style Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Estilo</h3>
            <div className="space-y-3">
              {['title', 'description', 'text', 'price', 'button'].includes(selectedElement.type) && (
                <>
                  <div>
                    <Label className="text-xs font-medium text-gray-700">Tamanho da Fonte</Label>
                    <Select
                      value={selectedElement.style?.fontSize || '16px'}
                      onValueChange={(value) => updateStyle({ fontSize: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12px">12px</SelectItem>
                        <SelectItem value="14px">14px</SelectItem>
                        <SelectItem value="16px">16px</SelectItem>
                        <SelectItem value="18px">18px</SelectItem>
                        <SelectItem value="24px">24px</SelectItem>
                        <SelectItem value="32px">32px</SelectItem>
                        <SelectItem value="48px">48px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs font-medium text-gray-700">Cor do Texto</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="color"
                        value={selectedElement.style?.textColor || '#000000'}
                        onChange={(e) => updateStyle({ textColor: e.target.value })}
                        className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        value={selectedElement.style?.textColor || '#000000'}
                        onChange={(e) => updateStyle({ textColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={selectedElement.style?.fontWeight === 'bold' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateStyle({ 
                        fontWeight: selectedElement.style?.fontWeight === 'bold' ? 'normal' : 'bold' 
                      })}
                    >
                      <Bold size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStyle({ fontStyle: 'italic' })}
                    >
                      <Italic size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStyle({ textDecoration: 'underline' })}
                    >
                      <Underline size={16} />
                    </Button>
                  </div>
                </>
              )}

              <div>
                <Label className="text-xs font-medium text-gray-700">Cor de Fundo</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="color"
                    value={selectedElement.style?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                    className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <Input
                    value={selectedElement.style?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Layout Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Layout</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-medium text-gray-700">Largura</Label>
                  <Input
                    value={selectedElement.style?.width || '100%'}
                    onChange={(e) => updateStyle({ width: e.target.value })}
                    placeholder="100%"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-700">Altura</Label>
                  <Input
                    value={selectedElement.style?.height || 'auto'}
                    onChange={(e) => updateStyle({ height: e.target.value })}
                    placeholder="auto"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2">Espaçamento Interno</Label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Input
                    type="number"
                    placeholder="Topo"
                    value={selectedElement.style?.padding?.top || 0}
                    onChange={(e) => updateStyle({
                      padding: {
                        ...selectedElement.style?.padding,
                        top: parseInt(e.target.value) || 0
                      }
                    })}
                    className="text-center"
                  />
                  <Input
                    type="number"
                    placeholder="Direita"
                    value={selectedElement.style?.padding?.right || 0}
                    onChange={(e) => updateStyle({
                      padding: {
                        ...selectedElement.style?.padding,
                        right: parseInt(e.target.value) || 0
                      }
                    })}
                    className="text-center"
                  />
                  <Input
                    type="number"
                    placeholder="Baixo"
                    value={selectedElement.style?.padding?.bottom || 0}
                    onChange={(e) => updateStyle({
                      padding: {
                        ...selectedElement.style?.padding,
                        bottom: parseInt(e.target.value) || 0
                      }
                    })}
                    className="text-center"
                  />
                  <Input
                    type="number"
                    placeholder="Esquerda"
                    value={selectedElement.style?.padding?.left || 0}
                    onChange={(e) => updateStyle({
                      padding: {
                        ...selectedElement.style?.padding,
                        left: parseInt(e.target.value) || 0
                      }
                    })}
                    className="text-center"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Animation Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Animação</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-gray-700">Efeito de Entrada</Label>
                <Select
                  value={selectedElement.style?.animation?.type || 'none'}
                  onValueChange={(value) => updateStyle({
                    animation: {
                      ...selectedElement.style?.animation,
                      type: value
                    }
                  })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="fadeIn">Fade In</SelectItem>
                    <SelectItem value="slideUp">Slide Up</SelectItem>
                    <SelectItem value="zoomIn">Zoom In</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-gray-700">Duração</Label>
                <Slider
                  value={[selectedElement.style?.animation?.duration || 0.5]}
                  onValueChange={([value]) => updateStyle({
                    animation: {
                      ...selectedElement.style?.animation,
                      duration: value
                    }
                  })}
                  min={0.1}
                  max={2}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-600 text-center mt-1">
                  {selectedElement.style?.animation?.duration || 0.5}s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => onDeleteElement(selectedElement.id)}
        >
          <Trash2 size={16} className="mr-2" />
          Remover Elemento
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onDuplicateElement(selectedElement.id)}
        >
          <Copy size={16} className="mr-2" />
          Duplicar Elemento
        </Button>
      </div>
    </div>
  );
}
