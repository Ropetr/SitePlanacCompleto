import { useState } from 'react';
import axios from 'axios';
import { X, Save, Mail, Phone, MessageSquare, Calendar, Tag } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function ContactModal({ contact, onClose }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(contact?.status || 'PENDENTE');
  const [observacoes_internas, setObservacoesInternas] = useState(contact?.observacoes_internas || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API_URL}/api/admin/contacts/${contact.id}`, {
        status,
        observacoes_internas
      });
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar contato');
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

  const getTipoLabel = (tipo) => {
    const tipos = {
      DUVIDA: 'Dúvida',
      SUGESTAO: 'Sugestão',
      RECLAMACAO: 'Reclamação',
      ELOGIO: 'Elogio',
      OUTROS: 'Outros'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Detalhes do Contato
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
          {/* Informações do Remetente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações do Remetente</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <div className="text-gray-900">{contact.nome}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </a>
              </div>

              {contact.telefone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <a
                    href={`tel:${contact.telefone}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Phone className="w-4 h-4" />
                    {contact.telefone}
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data do Contato
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(contact.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          </div>

          {/* Detalhes da Mensagem */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Detalhes da Mensagem</h3>

            {contact.tipo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Contato
                </label>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getTipoLabel(contact.tipo)}
                  </span>
                </div>
              </div>
            )}

            {contact.assunto && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <div className="text-gray-900 font-medium">{contact.assunto}</div>
              </div>
            )}

            {contact.mensagem && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <div className="flex gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg flex-1">
                    {contact.mensagem}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Status e Observações Internas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Gestão Interna</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status do Contato *
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
                placeholder="Notas internas sobre este contato (não visível para o cliente)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Estas observações são apenas para uso interno e não serão compartilhadas.
              </p>
            </div>
          </div>

          {/* Metadados */}
          {(contact.ip_address || contact.user_agent) && (
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700">Informações Técnicas</h4>
              {contact.ip_address && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">IP:</span> {contact.ip_address}
                </div>
              )}
              {contact.user_agent && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">User Agent:</span> {contact.user_agent}
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
