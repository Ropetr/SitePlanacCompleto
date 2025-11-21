import { useState, useRef } from 'react';
import { Upload, X, Loader2, Monitor, Smartphone, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function ImageUpload({
  value,
  onChange,
  label = 'Imagem',
  className = '',
  // Novos props para suportar versões responsivas
  onDataChange, // Callback que recebe { desktop_url, mobile_url, width, height }
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [imageData, setImageData] = useState({
    desktop_url: value || '',
    mobile_url: value || '',
    width_original: 0,
    height_original: 0,
  });
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use: JPG, PNG, WebP ou GIF');
      return;
    }

    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo: 10MB');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload (usa /replace se já existir imagem, /upload se for nova)
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Se já existe uma imagem, enviar URLs antigas para serem deletadas
      const oldDesktopUrl = imageData.desktop_url || value;
      const oldMobileUrl = imageData.mobile_url;
      const endpoint = oldDesktopUrl ? '/api/admin/media/replace' : '/api/admin/media/upload';

      if (oldDesktopUrl) {
        formData.append('oldUrl', oldDesktopUrl);
      }
      if (oldMobileUrl && oldMobileUrl !== oldDesktopUrl) {
        formData.append('oldMobileUrl', oldMobileUrl);
      }

      const response = await axios.post(`${API_URL}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const data = response.data.data;

        // Atualizar estado local
        const newImageData = {
          desktop_url: data.desktop_url || data.url,
          mobile_url: data.mobile_url || data.url,
          width_original: data.width_original || 0,
          height_original: data.height_original || 0,
        };

        setImageData(newImageData);
        setPreview(newImageData.desktop_url);

        // Compatibilidade: onChange mantém comportamento antigo (URL principal)
        onChange(newImageData.desktop_url);

        // Novo callback para dados completos
        if (onDataChange) {
          onDataChange(newImageData);
        }

        // Log de sucesso
        console.log(`✅ Imagem otimizada: ${newImageData.width_original}x${newImageData.height_original}px`);
        console.log(`   Desktop: ${newImageData.desktop_url}`);
        console.log(`   Mobile: ${newImageData.mobile_url}`);
        console.log(`   Conversão: ${data.converted ? 'WebP ✓' : 'Original'}`);

        if (data.oldFilesDeleted > 0) {
          console.log(`   Arquivos antigos deletados: ${data.oldFilesDeleted}`);
        }
      } else {
        alert('Erro ao fazer upload da imagem');
        setPreview(value || '');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert(error.response?.data?.error || 'Erro ao fazer upload da imagem');
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
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
                {preview ? 'Trocar Imagem' : 'Selecionar Imagem'}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG, WebP ou GIF. Máximo 10MB.
            <br />
            <span className="text-green-600 font-semibold">
              ✓ Converte automaticamente para WebP otimizado
            </span>
            <br />
            <span className="text-blue-600 text-[11px]">
              Gera versões Desktop (máx 1920px) e Mobile (máx 720px) mantendo proporção
            </span>
          </p>

          {/* Info sobre versões geradas */}
          {imageData.width_original > 0 && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">
                📊 Dimensões originais: {imageData.width_original}x{imageData.height_original}px
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Monitor className="w-3 h-3" />
                  <span>Desktop (≤1920px)</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Smartphone className="w-3 h-3" />
                  <span>Mobile (≤720px)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* URL manual input */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            Ou insira a URL da imagem:
          </label>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              setPreview(e.target.value);
            }}
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );
}
