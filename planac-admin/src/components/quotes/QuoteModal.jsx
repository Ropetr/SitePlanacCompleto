import { useState } from 'react';
import axios from 'axios';
import { X, Save, Mail, Phone, Building2, Package, MessageSquare, Calendar, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function QuoteModal({ quote, onClose }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(quote?.status || 'PENDENTE');
  const [observacoes_internas, setObservacoesInternas] = useState(quote?.observacoes_internas || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API_URL}/api/admin/quotes/${quote.id}`, {
        status,
        observacoes_internas
      });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar orçamento');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDENTE: 'Pendente',
      EM_ANALISE: 'Em Análise',
      RESPONDIDO: 'Respondido',
      ARQUIVADO: 'Arquivado'
    };
    return labels[status] || 'Pendente';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalhes do Orçamento
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Cliente Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações do Cliente</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {quote.nome}
                </div>
              </div>

              {quote.empresa && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    {quote.empresa}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <a
                  href={`mailto:${quote.email}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Mail className="w-4 h-4" />
                  {quote.email}
                </a>
              </div>

              {quote.telefone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <a
                    href={`tel:${quote.telefone}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Phone className="w-4 h-4" />
                    {quote.telefone}
                  </a>
                </div>
              )}

              {quote.cidade && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {quote.cidade}{quote.estado && ` - ${quote.estado}`}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data da Solicitação
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(quote.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes do Orçamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Detalhes da Solicitação</h3>

            {quote.produto_interesse && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produto/Serviço de Interesse
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Package className="w-4 h-4 text-gray-400" />
                  {quote.produto_interesse}
                </div>
              </div>
            )}

            {quote.mensagem && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem do Cliente
                </label>
                <div className="flex gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-900 whitespace-pre-wrap">{quote.mensagem}</p>
                </div>
              </div>
            )}

            {quote.detalhes_projeto && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detalhes do Projeto
                </label>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
                  {quote.detalhes_projeto}
                </p>
              </div>
            )}

            {quote.prazo_desejado && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo Desejado
                </label>
                <div className="text-gray-900">{quote.prazo_desejado}</div>
              </div>
            )}

            {quote.orcamento_estimado && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orçamento Estimado
                </label>
                <div className="text-gray-900">{quote.orcamento_estimado}</div>
              </div>
            )}
          </div>

          {/* Status e Observações Internas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Gestão Interna</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status do Orçamento *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="RESPONDIDO">Respondido</option>
                <option value="ARQUIVADO">Arquivado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações Internas
              </label>
              <textarea
                value={observacoes_internas}
                onChange={(e) => setObservacoesInternas(e.target.value)}
                rows="4"
                placeholder="Notas internas sobre este orçamento (não visível para o cliente)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Estas observações são apenas para uso interno e não serão compartilhadas com o cliente.
              </p>
            </div>
          </div>

          {/* Metadados */}
          {(quote.ip_address || quote.user_agent) && (
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700">Informações Técnicas</h4>
              {quote.ip_address && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">IP:</span> {quote.ip_address}
                </div>
              )}
              {quote.user_agent && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">User Agent:</span> {quote.user_agent}
                </div>
              )}
            </div>
          )}
        </div>

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
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
