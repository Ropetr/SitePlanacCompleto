import { useState, useRef } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function ImageGallery({ value = [], onChange, label = 'Galeria de Imagens', className = '' }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(Array.isArray(value) ? value : []);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        // Validar tipo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          alert(`Arquivo ${file.name} não permitido. Use: JPG, PNG, WebP ou GIF`);
          continue;
        }

        // Validar tamanho (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`Arquivo ${file.name} muito grande. Máximo: 10MB`);
          continue;
        }

        // Upload
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/api/admin/media/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          uploadedUrls.push(response.data.data.url);
        }
      }

      // Adicionar novas URLs à galeria
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onChange(newImages);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange(newImages);
  };

  const handleAddUrl = () => {
    const url = prompt('Digite a URL da imagem:');
    if (url && url.trim()) {
      const newImages = [...images, url.trim()];
      setImages(newImages);
      onChange(newImages);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Grid de imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Imagem ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex gap-2">
        {/* Upload de arquivos */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            multiple
            className="hidden"
            disabled={uploading}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Fazer Upload
              </>
            )}
          </button>
        </div>

        {/* Adicionar URL manual */}
        <button
          type="button"
          onClick={handleAddUrl}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Plus className="w-5 h-5" />
          Adicionar URL
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Selecione múltiplas imagens. JPG, PNG, WebP ou GIF. Máximo 10MB cada.
      </p>

      {/* Contador */}
      <p className="text-sm text-gray-600 mt-2">
        {images.length} {images.length === 1 ? 'imagem' : 'imagens'} na galeria
      </p>
    </div>
  );
}
