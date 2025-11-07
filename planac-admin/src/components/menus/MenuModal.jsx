import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function MenuModal({ menu, menus, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    descricao: '',
    icone: '',
    menuPaiId: '',
    ordem: 0,
    ativo: 1
  });

  useEffect(() => {
    if (menu) {
      setFormData({
        nome: menu.nome || '',
        slug: menu.slug || '',
        descricao: menu.descricao || '',
        icone: menu.icone || '',
        menuPaiId: menu.menu_pai_id || '',
        ordem: menu.ordem || 0,
        ativo: menu.ativo || 1
      });
    }
  }, [menu]);

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
      if (menu) {
        // Editar
        await axios.put(`${API_URL}/api/admin/menus/${menu.id}`, formData);
      } else {
        // Criar
        await axios.post(`${API_URL}/api/admin/menus`, formData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar menu:', error);
      alert(error.response?.data?.error || 'Erro ao salvar menu');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar menus disponíveis para menu pai (não pode ser ele mesmo ou suas filhas)
  const availableParentMenus = menus.filter(m => {
    if (menu && m.id === menu.id) return false;
    if (menu && m.menu_pai_id === menu.id) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {menu ? 'Editar Menu' : 'Novo Menu'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Menu *
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
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Pai
              </label>
              <select
                name="menuPaiId"
                value={formData.menuPaiId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Nenhum (Menu raiz)</option>
                {availableParentMenus
                  .filter(m => !m.menu_pai_id) // Apenas menus raiz
                  .map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Deixe vazio para criar um menu principal
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ícone (Emoji)
              </label>
              <input
                type="text"
                name="icone"
                value={formData.icone}
                onChange={handleChange}
                placeholder="🏗️"
                maxLength="2"
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
                name="ativo"
                checked={formData.ativo === 1}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Menu Ativo
              </label>
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
            {loading ? 'Salvando...' : 'Salvar Menu'}
          </button>
        </div>
      </div>
    </div>
  );
}
