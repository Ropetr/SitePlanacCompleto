import { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Save, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '../components/common/ImageUpload';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({
    // Informações Gerais
    site_name: '',
    site_slogan: '',
    logo_url: '',

    // Contato
    telefone_principal: '',
    telefone_fixo: '',
    email_contato: '',
    endereco: '',

    // Redes Sociais
    instagram_url: '',
    facebook_url: '',
    maps_url: '',

    // Outros
    horario_funcionamento: '',
    texto_rodape: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/settings`);

      if (response.data.success) {
        const settingsData = response.data.data;
        setSettings(settingsData);

        // Preencher formData com valores do banco
        setFormData({
          site_name: settingsData.site_name || '',
          site_slogan: settingsData.site_slogan || '',
          logo_url: settingsData.logo_url || '',
          telefone_principal: settingsData.telefone_principal || '',
          telefone_fixo: settingsData.telefone_fixo || '',
          email_contato: settingsData.email_contato || '',
          endereco: settingsData.endereco || '',
          instagram_url: settingsData.instagram_url || '',
          facebook_url: settingsData.facebook_url || '',
          maps_url: settingsData.maps_url || '',
          horario_funcionamento: settingsData.horario_funcionamento || '',
          texto_rodape: settingsData.texto_rodape || ''
        });
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      alert('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Atualizar cada configuração individualmente
      const updates = Object.entries(formData).map(([chave, valor]) => {
        return axios.put(`${API_URL}/api/admin/settings/${chave}`, { valor });
      });

      await Promise.all(updates);

      alert('✅ Configurações salvas com sucesso!');
      fetchSettings(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('❌ Erro ao salvar configurações: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <SettingsIcon className="w-8 h-8" />
              Configurações do Site
            </h1>
            <p className="text-gray-600 mt-1">Gerencie as configurações globais do seu site</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Informações Gerais */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Informações Gerais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Site
              </label>
              <input
                type="text"
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Planac Distribuidora"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slogan
              </label>
              <input
                type="text"
                name="site_slogan"
                value={formData.site_slogan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Forros e Divisórias"
              />
            </div>

            <div className="md:col-span-2">
              <ImageUpload
                label="Logo do Site"
                imageType="logo"
                value={formData.logo_url}
                onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Recomendado: PNG com fundo transparente. Será otimizado automaticamente para web.
              </p>
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Informações de Contato
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Principal
              </label>
              <input
                type="text"
                name="telefone_principal"
                value={formData.telefone_principal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: (43) 98418-2582"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone Fixo
              </label>
              <input
                type="text"
                name="telefone_fixo"
                value={formData.telefone_fixo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: (43) 3028-5316"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail de Contato
              </label>
              <input
                type="email"
                name="email_contato"
                value={formData.email_contato}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: contato@planacdivisorias.com.br"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço Completo
              </label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Av. Abelio Benatti, 4912 - Jardim do Sol - Londrina-PR"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horário de Funcionamento
              </label>
              <textarea
                name="horario_funcionamento"
                value={formData.horario_funcionamento}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Segunda a Sexta: 8h às 17h&#10;Sábado: 8h às 12h"
              />
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Redes Sociais
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: https://www.instagram.com/planacdistribuidora/"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: https://www.facebook.com/planacdistribuidora/"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Maps URL
              </label>
              <input
                type="url"
                name="maps_url"
                value={formData.maps_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: https://maps.app.goo.gl/w3o1SpMrhzDG3CPaA"
              />
            </div>
          </div>
        </div>

        {/* Outros */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Outros
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto do Rodapé (Copyright)
              </label>
              <input
                type="text"
                name="texto_rodape"
                value={formData.texto_rodape}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: © 2025 Planac Distribuidora. Todos os direitos reservados."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 bg-white rounded-lg shadow p-6">
          <button
            type="button"
            onClick={fetchSettings}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
}
