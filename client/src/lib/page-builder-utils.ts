import { PageElement, ElementStyle, ComponentDefinition } from './page-builder-types';

export const componentDefinitions: ComponentDefinition[] = [
  // Seção de Descrição
  {
    type: 'product-section',
    label: 'Seção do Produto',
    icon: 'fas fa-th-large',
    category: 'product',
    defaultContent: '',
    defaultStyle: {
      width: '100%',
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
    },
    defaultProps: {
      title: 'FAST IPS ALTA PERFORMANCE',
      description: 'Painel Fast IPS de 27" oferece cores vibrantes e tempos de resposta ultrarrápidos. Com sRGB 120% e ângulo de visão de 178°, ideal para gamers que exigem precisão e qualidade visual excepcional.',
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
      imagePosition: 'left'
    },
  },
  {
    type: 'specs-section',
    label: 'Especificações Técnicas',
    icon: 'fas fa-list',
    category: 'content',
    defaultContent: '',
    defaultStyle: {
      width: '100%',
      backgroundColor: '#ffffff',
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      margin: { top: 16, right: 0, bottom: 16, left: 0 },
    },
    defaultProps: {
      title: 'Especificações Técnicas',
      specs: [
        { category: 'Tela', items: [
          { label: 'Tamanho', value: '27 polegadas' },
          { label: 'Tipo de painel', value: 'Fast IPS' },
          { label: 'Resolução', value: '2560x1440 (QHD)' },
          { label: 'Taxa de atualização', value: '180Hz' }
        ]},
        { category: 'Conectividade', items: [
          { label: 'HDMI', value: '2x HDMI 2.1' },
          { label: 'DisplayPort', value: '2x DisplayPort 1.4' },
          { label: 'USB', value: '2x USB 3.0' }
        ]}
      ]
    },
  },
  {
    type: 'cta-button',
    label: 'Botão de Ação',
    icon: 'fas fa-external-link-alt',
    category: 'content',
    defaultContent: 'Ver Mais Detalhes',
    defaultStyle: {
      backgroundColor: '#2563eb',
      textColor: '#ffffff',
      padding: { top: 16, right: 32, bottom: 16, left: 32 },
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: 'bold',
      width: 'auto',
      margin: { top: 24, right: 0, bottom: 24, left: 0 },
    },
    defaultProps: {
      link: 'https://exemplo.com',
      openInNewTab: true
    },
  },
];

export function generateElementId(): string {
  return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createElement(type: string, parentId?: string): PageElement {
  const definition = componentDefinitions.find(def => def.type === type);
  if (!definition) {
    throw new Error(`Unknown element type: ${type}`);
  }

  return {
    id: generateElementId(),
    type,
    content: definition.defaultContent,
    style: definition.defaultStyle,
    props: definition.defaultProps,
    parentId,
  };
}

export function applyElementStyle(style: ElementStyle): React.CSSProperties {
  const cssStyle: React.CSSProperties = {};

  if (style.fontSize) cssStyle.fontSize = style.fontSize;
  if (style.fontWeight) cssStyle.fontWeight = style.fontWeight;
  if (style.textColor) cssStyle.color = style.textColor;
  if (style.backgroundColor) cssStyle.backgroundColor = style.backgroundColor;
  if (style.width) cssStyle.width = style.width;
  if (style.height) cssStyle.height = style.height;
  if (style.borderRadius) cssStyle.borderRadius = style.borderRadius;

  if (style.padding) {
    cssStyle.paddingTop = style.padding.top ? `${style.padding.top}px` : undefined;
    cssStyle.paddingRight = style.padding.right ? `${style.padding.right}px` : undefined;
    cssStyle.paddingBottom = style.padding.bottom ? `${style.padding.bottom}px` : undefined;
    cssStyle.paddingLeft = style.padding.left ? `${style.padding.left}px` : undefined;
  }

  if (style.margin) {
    cssStyle.marginTop = style.margin.top ? `${style.margin.top}px` : undefined;
    cssStyle.marginRight = style.margin.right ? `${style.margin.right}px` : undefined;
    cssStyle.marginBottom = style.margin.bottom ? `${style.margin.bottom}px` : undefined;
    cssStyle.marginLeft = style.margin.left ? `${style.margin.left}px` : undefined;
  }

  return cssStyle;
}

export function exportPageToHTML(elements: PageElement[], title: string = 'Descrição do Produto'): string {
  const renderElement = (element: PageElement): string => {
    const style = element.style ? applyElementStyle(element.style) : {};
    const styleString = Object.entries(style)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');

    switch (element.type) {
      case 'product-section':
        const { title: sectionTitle, description, imageUrl, imagePosition } = element.props || {};
        const isImageLeft = imagePosition === 'left';
        
        const sectionId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return `
          <div class="${sectionId}" style="${styleString}">
            <div class="section-content">
              <div class="image-container">
                <img src="${imageUrl || ''}" alt="${sectionTitle || ''}" class="product-image" />
              </div>
              <div class="content-container">
                <h2 class="section-title">${sectionTitle || ''}</h2>
                <p class="section-description">${description || ''}</p>
              </div>
            </div>
          </div>
        `;
      
      case 'specs-section':
        const { title: specsTitle, specs } = element.props || {};
        const specsHTML = (specs || []).map((category: any) => `
          <div style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;">${category.category}</h3>
            <div style="display: grid; gap: 0.75rem;">
              ${(category.items || []).map((item: any) => `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f3f4f6;">
                  <span style="font-weight: 500; color: #374151;">${item.label}</span>
                  <span style="color: #6b7280;">${item.value}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('');
        
        return `
          <div style="${styleString}; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; color: #1f2937;">${specsTitle || ''}</h2>
            ${specsHTML}
          </div>
        `;
      
      case 'cta-button':
        const { link, openInNewTab } = element.props || {};
        const target = openInNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
        
        return `
          <div style="text-align: center; margin: 2rem 0;">
            <a href="${link || '#'}" ${target} style="${styleString}; display: inline-block; text-decoration: none; transition: transform 0.2s;">
              ${element.content || ''}
            </a>
          </div>
        `;
      
      default:
        return `<div style="${styleString}">${element.content || ''}</div>`;
    }
  };

  const elementsHTML = elements.map(renderElement).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8fafc;
            line-height: 1.6;
        }
        .page-container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        
        /* Product Section Styles */
        .section-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            padding: 2rem;
        }
        
        .image-container {
            width: 100%;
            max-width: 500px;
        }
        
        .product-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
            object-fit: cover;
            max-height: 300px;
        }
        
        .content-container {
            width: 100%;
            text-align: center;
            color: white;
        }
        
        .section-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
            color: #3b82f6;
        }
        
        .section-description {
            font-size: 1rem;
            line-height: 1.6;
            color: #e5e7eb;
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Desktop Styles */
        @media (min-width: 768px) {
            .section-content {
                flex-direction: row;
                align-items: center;
                gap: 3rem;
                padding: 3rem;
            }
            
            .image-container {
                flex: 1;
                max-width: none;
            }
            
            .product-image {
                max-height: 400px;
            }
            
            .content-container {
                flex: 1;
                text-align: left;
            }
            
            .section-title {
                font-size: 2rem;
            }
            
            .section-description {
                font-size: 1.1rem;
                margin: 0;
            }
        }
        
        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .page-container {
                margin: 10px;
                padding: 0;
            }
            body {
                padding: 10px;
            }
            .section-content {
                padding: 1.5rem;
            }
            .product-image {
                max-height: 250px;
            }
        }
    </style>
</head>
<body>
    <div class="page-container">
        ${elementsHTML}
    </div>
</body>
</html>`;
}

export function savePageToLocalStorage(elements: PageElement[], title: string): void {
  const pageData = {
    id: 'current-page',
    title,
    elements,
    lastModified: new Date().toISOString(),
  };
  localStorage.setItem('eplus-page-builder', JSON.stringify(pageData));
}

export function loadPageFromLocalStorage(): { elements: PageElement[]; title: string } | null {
  try {
    const data = localStorage.getItem('eplus-page-builder');
    if (data) {
      const pageData = JSON.parse(data);
      return {
        elements: pageData.elements || [],
        title: pageData.title || 'Página sem título',
      };
    }
  } catch (error) {
    console.error('Error loading page from localStorage:', error);
  }
  return null;
}

// Templates predefinidos
export interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  category: 'tech' | 'fashion' | 'home' | 'gaming' | 'electronics';
  preview: string;
  elements: PageElement[];
}

export const productTemplates: ProductTemplate[] = [
  {
    id: 'gaming-monitor',
    name: 'Monitor Gamer',
    description: 'Template otimizado para monitores e periféricos gamer',
    category: 'gaming',
    preview: '🎮',
    elements: [
      {
        id: 'gaming-section-1',
        type: 'product-section',
        style: {
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'FAST IPS ALTA PERFORMANCE',
          description: 'Painel Fast IPS de 27" oferece cores vibrantes e tempos de resposta ultrarrápidos. Com sRGB 120% e ângulo de visão de 178°, ideal para gamers que exigem precisão e qualidade visual excepcional.',
          imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          imagePosition: 'left'
        }
      },
      {
        id: 'gaming-section-2',
        type: 'product-section',
        style: {
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'TAXA DE ATUALIZAÇÃO 180Hz',
          description: 'Taxa de atualização de 180Hz para jogabilidade ultra fluída. Experimente movimentos suaves e precisão timing em jogos competitivos.',
          imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          imagePosition: 'right'
        }
      },
      {
        id: 'gaming-specs',
        type: 'specs-section',
        style: {
          backgroundColor: '#ffffff',
          padding: { top: 24, right: 24, bottom: 24, left: 24 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'Especificações Técnicas',
          specs: [
            { 
              category: 'Tela', 
              items: [
                { label: 'Tamanho', value: '27 polegadas' },
                { label: 'Tipo de painel', value: 'Fast IPS' },
                { label: 'Resolução', value: '2560x1440 (QHD)' },
                { label: 'Taxa de atualização', value: '180Hz' },
                { label: 'Tempo de resposta', value: '1ms (GtG)' }
              ]
            },
            { 
              category: 'Conectividade', 
              items: [
                { label: 'HDMI', value: '2x HDMI 2.1' },
                { label: 'DisplayPort', value: '2x DisplayPort 1.4' },
                { label: 'USB', value: '2x USB 3.0' },
                { label: 'Áudio', value: '1x Saída de áudio' }
              ]
            }
          ]
        }
      },
      {
        id: 'gaming-cta',
        type: 'cta-button',
        content: 'Ver Especificações Completas',
        style: {
          backgroundColor: '#2563eb',
          textColor: '#ffffff',
          padding: { top: 16, right: 32, bottom: 16, left: 32 },
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          margin: { top: 24, right: 0, bottom: 24, left: 0 },
        },
        props: {
          link: 'https://exemplo.com/monitor-gamer',
          openInNewTab: true
        }
      }
    ]
  },
  {
    id: 'smartphone',
    name: 'Smartphone',
    description: 'Template para celulares e dispositivos móveis',
    category: 'electronics',
    preview: '📱',
    elements: [
      {
        id: 'phone-section-1',
        type: 'product-section',
        style: {
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'CÂMERA PROFISSIONAL 108MP',
          description: 'Sistema de câmera tripla com sensor principal de 108MP, ultra-wide de 12MP e telefoto de 12MP. Capture fotos com qualidade profissional em qualquer condição de luz.',
          imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          imagePosition: 'left'
        }
      },
      {
        id: 'phone-specs',
        type: 'specs-section',
        style: {
          backgroundColor: '#ffffff',
          padding: { top: 24, right: 24, bottom: 24, left: 24 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'Especificações Técnicas',
          specs: [
            { 
              category: 'Display', 
              items: [
                { label: 'Tamanho', value: '6.7 polegadas' },
                { label: 'Tipo', value: 'AMOLED' },
                { label: 'Resolução', value: '2400 x 1080' },
                { label: 'Taxa de atualização', value: '120Hz' }
              ]
            },
            { 
              category: 'Performance', 
              items: [
                { label: 'Processador', value: 'Snapdragon 8 Gen 2' },
                { label: 'RAM', value: '8GB / 12GB' },
                { label: 'Armazenamento', value: '256GB / 512GB' }
              ]
            }
          ]
        }
      },
      {
        id: 'phone-cta',
        type: 'cta-button',
        content: 'Comprar Agora',
        style: {
          backgroundColor: '#10b981',
          textColor: '#ffffff',
          padding: { top: 16, right: 32, bottom: 16, left: 32 },
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          margin: { top: 24, right: 0, bottom: 24, left: 0 },
        },
        props: {
          link: 'https://exemplo.com/smartphone',
          openInNewTab: true
        }
      }
    ]
  },
  {
    id: 'laptop',
    name: 'Laptop/Notebook',
    description: 'Template para laptops e notebooks',
    category: 'tech',
    preview: '💻',
    elements: [
      {
        id: 'laptop-section-1',
        type: 'product-section',
        style: {
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'PERFORMANCE PROFISSIONAL',
          description: 'Processador Intel Core i7 de 12ª geração combinado com 16GB de RAM DDR5 e SSD de 1TB. Ideal para trabalho, criação de conteúdo e multitarefas exigentes.',
          imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          imagePosition: 'left'
        }
      },
      {
        id: 'laptop-specs',
        type: 'specs-section',
        style: {
          backgroundColor: '#ffffff',
          padding: { top: 24, right: 24, bottom: 24, left: 24 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'Especificações Técnicas',
          specs: [
            { 
              category: 'Processamento', 
              items: [
                { label: 'Processador', value: 'Intel Core i7-1260P' },
                { label: 'Memória RAM', value: '16GB DDR5' },
                { label: 'Armazenamento', value: '1TB SSD NVMe' },
                { label: 'Placa de vídeo', value: 'Intel Iris Xe' }
              ]
            },
            { 
              category: 'Display', 
              items: [
                { label: 'Tamanho', value: '15.6 polegadas' },
                { label: 'Resolução', value: '1920x1080 Full HD' },
                { label: 'Tipo de painel', value: 'IPS Anti-reflexo' }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'headphone',
    name: 'Fone de Ouvido',
    description: 'Template para fones e equipamentos de áudio',
    category: 'electronics',
    preview: '🎧',
    elements: [
      {
        id: 'headphone-section-1',
        type: 'product-section',
        style: {
          backgroundColor: '#0f172a',
          borderRadius: '12px',
          padding: { top: 32, right: 32, bottom: 32, left: 32 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'CANCELAMENTO DE RUÍDO ATIVO',
          description: 'Tecnologia ANC avançada que bloqueia ruídos externos para uma experiência de áudio imersiva. Ideal para viagens, trabalho e momentos de concentração.',
          imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
          imagePosition: 'right'
        }
      },
      {
        id: 'headphone-specs',
        type: 'specs-section',
        style: {
          backgroundColor: '#ffffff',
          padding: { top: 24, right: 24, bottom: 24, left: 24 },
          margin: { top: 16, right: 0, bottom: 16, left: 0 },
        },
        props: {
          title: 'Especificações Técnicas',
          specs: [
            { 
              category: 'Áudio', 
              items: [
                { label: 'Drivers', value: '40mm dinâmicos' },
                { label: 'Resposta de frequência', value: '20Hz - 20kHz' },
                { label: 'Impedância', value: '32 ohms' },
                { label: 'Cancelamento de ruído', value: 'ANC Híbrido' }
              ]
            },
            { 
              category: 'Conectividade', 
              items: [
                { label: 'Bluetooth', value: '5.3' },
                { label: 'Codecs', value: 'SBC, AAC, LDAC' },
                { label: 'Autonomia', value: '30h com ANC' }
              ]
            }
          ]
        }
      }
    ]
  }
];

export function applyTemplate(template: ProductTemplate): PageElement[] {
  return template.elements.map(element => ({
    ...element,
    id: generateElementId() // Gera novos IDs para evitar conflitos
  }));
}
