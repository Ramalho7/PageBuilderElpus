import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, X } from "lucide-react";
import { PageElement } from '@/lib/page-builder-types';
import { exportPageToHTML } from '@/lib/page-builder-utils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: PageElement[];
  pageTitle: string;
}

export function ExportModal({ isOpen, onClose, elements, pageTitle }: ExportModalProps) {
  const [filename, setFilename] = useState('produto-page.html');
  const [includeInlineCSS, setIncludeInlineCSS] = useState(true);
  const [minifyCode, setMinifyCode] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);

  const handleExport = () => {
    try {
      const htmlContent = exportPageToHTML(elements, pageTitle);
      
      // Create and download file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onClose();
    } catch (error) {
      console.error('Erro ao exportar HTML:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Exportar Página HTML
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="filename" className="text-sm font-medium text-gray-700">
              Nome do Arquivo
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Opções de Exportação
            </Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inline-css"
                  checked={includeInlineCSS}
                  onCheckedChange={setIncludeInlineCSS}
                />
                <Label htmlFor="inline-css" className="text-sm text-gray-700">
                  Incluir CSS inline
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="minify"
                  checked={minifyCode}
                  onCheckedChange={setMinifyCode}
                />
                <Label htmlFor="minify" className="text-sm text-gray-700">
                  Minificar código
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comments"
                  checked={includeComments}
                  onCheckedChange={setIncludeComments}
                />
                <Label htmlFor="comments" className="text-sm text-gray-700">
                  Incluir comentários
                </Label>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Prévia do arquivo:</h4>
            <p className="text-sm text-gray-600">
              {elements.length} elemento(s) serão exportados
            </p>
            <p className="text-xs text-gray-500 mt-1">
              O arquivo HTML será gerado com estilos incorporados e será totalmente independente.
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleExport} className="flex-1">
            <Download size={16} className="mr-2" />
            Baixar HTML
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
