import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, Upload } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function ProductModal({ product, onClose }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    subtitulo: '',
    descricao_curta: '',
    descricao_completa: '',
    imagem_banner: '',
    categoryId: '',
    status: 'RASCUNHO',
    destaque: 0,
    ordem: 0,
    caracteristicas: '',
    vantagens: '',
    aplicacoes: '',
    especificacoes: '',
    normas_certificacoes: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  useEffect(() => {
    fetchCategories();
    if (product) {
      // Helper para converter array para string com quebras de linha
      const arrayToString = (field) => {
        if (!field) return '';
        if (Array.isArray(field)) return field.join('\n');
        if (typeof field === 'string') return field;
        return '';
      };

      setFormData({
        nome: product.nome || '',
        slug: product.slug || '',
        subtitulo: product.subtitulo || '',
        descricao_curta: product.descricao_curta || '',
        descricao_completa: product.descricao_completa || '',
        imagem_banner: product.imagem_banner || '',
        categoryId: product.categoria_id || '',
        status: product.status || 'RASCUNHO',
        destaque: product.destaque || 0,
        ordem: product.ordem || 0,
        caracteristicas: arrayToString(product.caracteristicas),
        vantagens: arrayToString(product.vantagens),
        aplicacoes: arrayToString(product.aplicacoes),
        especificacoes: product.especificacoes || '',
        normas_certificacoes: arrayToString(product.normas_certificacoes),
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        meta_keywords: product.meta_keywords || ''
      });
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      if (response.data.success) {
        // Flatten hierarchical categories
        const flattenCategories = (cats) => {
          const result = [];
          cats.forEach(cat => {
            result.push(cat);
            if (cat.subcategorias && cat.subcategorias.length > 0) {
              result.push(...flattenCategories(cat.subcategorias));
            }
          });
          return result;
        };
        setCategories(flattenCategories(response.data.data || []));
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const generateSlug = (nome) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNomeChange = (e) => {
    const nome = e.target.value;
    setFormData(prev => ({
      ...prev,
      nome,
      slug: generateSlug(nome)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        // Editar
        await axios.put(`${API_URL}/api/admin/products/${product.id}`, formData);
      } else {
        // Criar
        await axios.post(`${API_URL}/api/admin/products`, formData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert(error.response?.data?.error || 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Editar Página' : 'Nova Página'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informações Básicas</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Página *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleNomeChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo
                </label>
                <input
                  type="text"
                  name="subtitulo"
                  value={formData.subtitulo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um menu</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="RASCUNHO">Rascunho</option>
                  <option value="PUBLICADO">Publicado</option>
                  <option value="ARQUIVADO">Arquivado</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem Banner (URL)
                </label>
                <input
                  type="url"
                  name="imagem_banner"
                  value={formData.imagem_banner}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  pattern="https?://.+\.(jpg|jpeg|png|webp|gif|svg)"
                  title="Digite uma URL válida de imagem (JPG, PNG, WEBP, GIF ou SVG)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.imagem_banner && (
                  <div className="mt-2">
                    <img
                      src={formData.imagem_banner}
                      alt="Preview"
                      className="max-w-xs h-32 object-cover rounded border border-gray-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Curta
                </label>
                <textarea
                  name="descricao_curta"
                  value={formData.descricao_curta}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição Completa
                </label>
                <textarea
                  name="descricao_completa"
                  value={formData.descricao_completa}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem
                </label>
                <input
                  type="number"
                  name="ordem"
                  value={formData.ordem}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="destaque"
                  checked={formData.destaque === 1}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Página em Destaque
                </label>
              </div>
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Detalhes do Produto</h3>
            <p className="text-sm text-gray-600">Cada item em uma linha separada</p>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Características Principais
                </label>
                <textarea
                  name="caracteristicas"
                  value={formData.caracteristicas}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Digite cada característica em uma linha&#10;Exemplo:&#10;100% Impermeável&#10;Alta Resistência&#10;Fácil Limpeza"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vantagens
                </label>
                <textarea
                  name="vantagens"
                  value={formData.vantagens}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Digite cada vantagem em uma linha&#10;Exemplo:&#10;Imunidade à umidade&#10;Resistência química&#10;Durabilidade extrema"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aplicações
                </label>
                <textarea
                  name="aplicacoes"
                  value={formData.aplicacoes}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Digite cada aplicação em uma linha&#10;Exemplo:&#10;Banheiros públicos&#10;Áreas industriais&#10;Hospitais e clínicas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Especificações Técnicas */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Especificações Técnicas</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especificações
                </label>
                <textarea
                  name="especificacoes"
                  value={formData.especificacoes}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Descreva as especificações técnicas do produto"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Normas e Certificações
                </label>
                <textarea
                  name="normas_certificacoes"
                  value={formData.normas_certificacoes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Liste as normas e certificações (uma por linha)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">SEO</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords (separadas por vírgula)
                </label>
                <input
                  type="text"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Página'}
          </button>
        </div>
      </div>
    </div>
  );
}
