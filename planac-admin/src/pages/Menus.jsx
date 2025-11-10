import { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderTree, Plus, Edit2, Trash2, Search, ChevronRight, Folder, FileText } from 'lucide-react';
import MenuModal from '../components/menus/MenuModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8787';

export default function Menus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, [search]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/menus`);

      if (response.data.success) {
        let menusList = response.data.data || [];

        // Filtrar por busca se houver
        if (search) {
          menusList = menusList.filter(menu =>
            menu.nome.toLowerCase().includes(search.toLowerCase()) ||
            menu.descricao?.toLowerCase().includes(search.toLowerCase())
          );
        }

        setMenus(menusList);
      }
    } catch (error) {
      console.error('Erro ao buscar menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setShowModal(true);
  };

  const handleDelete = async (menuId) => {
    if (!confirm('Tem certeza que deseja excluir este menu?')) return;

    try {
      await axios.delete(`${API_URL}/api/admin/menus/${menuId}`);
      fetchMenus();
    } catch (error) {
      console.error('Erro ao excluir menu:', error);
      alert(error.response?.data?.error || 'Erro ao excluir menu');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMenu(null);
    fetchMenus();
  };

  // Organizar menus em hierarquia
  const organizeHierarchy = (menus) => {
    const menuMap = {};
    const rootMenus = [];

    // Primeiro, criar um map de todos os menus
    menus.forEach(menu => {
      menuMap[menu.id] = { ...menu, children: [] };
    });

    // Depois, organizar em hierarquia
    menus.forEach(menu => {
      if (menu.menu_pai_id && menuMap[menu.menu_pai_id]) {
        menuMap[menu.menu_pai_id].children.push(menuMap[menu.id]);
      } else {
        rootMenus.push(menuMap[menu.id]);
      }
    });

    return rootMenus;
  };

  const hierarchicalMenus = organizeHierarchy(menus);

  const handleAddSubmenu = (parentMenu) => {
    // Criar um menu com o pai pré-selecionado
    setSelectedMenu({ menu_pai_id: parentMenu.id });
    setShowModal(true);
  };

  const renderMenu = (menu, level = 0) => {
    const indent = level * 40;
    const isSubmenu = level > 0;
    const hasChildren = menu.children && menu.children.length > 0;

    return (
      <div key={menu.id}>
        <div className={`flex items-center hover:bg-gray-50 border-b border-gray-100 ${
          isSubmenu ? 'bg-blue-50/30' : ''
        }`}>
          <div className="flex-1 px-6 py-4" style={{ paddingLeft: `${24 + indent}px` }}>
            <div className="flex items-center gap-3">
              {/* Indicador visual de hierarquia */}
              {isSubmenu ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
              ) : (
                <Folder className="w-5 h-5 text-gray-600" />
              )}

              {menu.icone && (
                <span className="text-xl">{menu.icone}</span>
              )}

              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  isSubmenu ? 'text-gray-700' : 'text-gray-900'
                }`}>
                  {menu.nome}
                  {isSubmenu && (
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      (submenu)
                    </span>
                  )}
                </div>
                {menu.descricao && (
                  <div className="text-xs text-gray-500 mt-1">{menu.descricao}</div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {menu.produtos_count || 0} páginas
          </div>

          <div className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              menu.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {menu.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end gap-2">
              {/* Botão para adicionar submenu (apenas em menus de nível 0) */}
              {!isSubmenu && (
                <button
                  onClick={() => handleAddSubmenu(menu)}
                  className="text-green-600 hover:text-green-900"
                  title="Adicionar Submenu"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleEdit(menu)}
                className="text-blue-600 hover:text-blue-900"
                title="Editar"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(menu.id)}
                className="text-red-600 hover:text-red-900"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Renderizar submenus */}
        {hasChildren && (
          menu.children.map(child => renderMenu(child, level + 1))
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FolderTree className="w-8 h-8" />
              Menus
            </h1>
            <p className="text-gray-600 mt-1">Organize as páginas em menus e submenus</p>
          </div>
          <button
            onClick={() => {
              setSelectedMenu(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Novo Menu
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar menus..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Menus Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando menus...</div>
        ) : menus.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FolderTree className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Nenhum menu encontrado</p>
            <p className="text-sm mt-2">Comece adicionando seu primeiro menu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-200 flex">
                <div className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Menu
                </div>
                <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Páginas
                </div>
                <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Status
                </div>
                <div className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Ações
                </div>
              </div>

              {/* Body */}
              <div>
                {hierarchicalMenus.map(menu => renderMenu(menu))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Modal */}
      {showModal && (
        <MenuModal
          menu={selectedMenu}
          menus={menus}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
