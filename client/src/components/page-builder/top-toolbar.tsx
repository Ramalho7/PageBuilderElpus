import { Button } from "@/components/ui/button";
import { Box, Eye, Smartphone, Download } from "lucide-react";

interface TopToolbarProps {
  pageTitle: string;
  onExport: () => void;
  onPreview: () => void;
  onResponsiveToggle: () => void;
}

export function TopToolbar({ 
  pageTitle, 
  onExport, 
  onPreview, 
  onResponsiveToggle 
}: TopToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Box className="text-white text-sm" size={16} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Descrição de Produto</h1>
        </div>
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
          <span>{pageTitle}</span>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span>Salvo automaticamente</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreview}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Eye size={16} />
          <span className="hidden sm:inline">Preview</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onResponsiveToggle}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Smartphone size={16} />
          <span className="hidden sm:inline">Responsivo</span>
        </Button>
        
        <div className="w-px h-6 bg-gray-300"></div>
        
        <Button
          onClick={onExport}
          className="flex items-center space-x-2 bg-primary text-white hover:bg-blue-700"
        >
          <Download size={16} />
          <span>Exportar HTML</span>
        </Button>
      </div>
    </div>
  );
}
