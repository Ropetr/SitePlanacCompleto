import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import ContactModal from '../components/contacts/ContactModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchContacts();
  }, [page, statusFilter, search]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search })
      };

      const response = await axios.get(`${API_URL}/api/admin/contacts`, { params });

      if (response.data.success) {
        setContacts(response.data.contacts);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
    fetchContacts();
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDENTE: 'bg-yellow-100 text-yellow-800',
      EM_ANALISE: 'bg-blue-100 text-blue-800',
      RESPONDIDO: 'bg-green-100 text-green-800',
      ARQUIVADO: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || styles.PENDENTE;
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDENTE: <Clock className="w-4 h-4" />,
      EM_ANALISE: <MessageCircle className="w-4 h-4" />,
      RESPONDIDO: <CheckCircle className="w-4 h-4" />,
      ARQUIVADO: <XCircle className="w-4 h-4" />
    };
    return icons[status] || icons.PENDENTE;
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-8 h-8" />
              Contatos
            </h1>
            <p className="text-gray-600 mt-1">Gerencie as mensagens de contato dos visitantes</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, email, assunto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANALISE">Em Análise</option>
              <option value="RESPONDIDO">Respondido</option>
              <option value="ARQUIVADO">Arquivado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando contatos...</div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Nenhum contato encontrado</p>
            <p className="text-sm mt-2">As mensagens de contato aparecerão aqui</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assunto/Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{contact.nome}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{contact.email}</div>
                        {contact.telefone && (
                          <div className="text-sm text-gray-500">{contact.telefone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {contact.assunto || 'Sem assunto'}
                        </div>
                        {contact.tipo && (
                          <div className="text-xs text-gray-500">{getTipoLabel(contact.tipo)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit ${getStatusBadge(contact.status)}`}>
                          {getStatusIcon(contact.status)}
                          {getStatusLabel(contact.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleView(contact)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Página {page} de {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contact Modal */}
      {showModal && (
        <ContactModal
          contact={selectedContact}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
