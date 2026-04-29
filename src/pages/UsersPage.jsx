import { useState } from 'react';
import UserTable from '../components/users/UserTable';
import UserFilters from '../components/users/UserFilters';
import UserDrawer from '../components/users/UserDrawer';
import ConfirmationModal from '../components/users/ConfirmationModal';
import UserDetailsModal from '../components/users/UserDetailsModal';
import { useUsers } from '../hooks/useUsers';

const UsersPage = () => {
  const {
    users,
    totalCount,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    addUser,
    updateUser,
    toggleUserStatus,
  } = useUsers();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleNewUser = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleToggleStatus = (user) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmStatus = () => {
    if (selectedUser) {
      toggleUserStatus(selectedUser.id);
    }
    setIsConfirmOpen(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({ role: '', type: '', statut: '' });
  };

  const handleDrawerSubmit = (data) => {
    if (selectedUser) {
      updateUser(selectedUser.id, data);
    } else {
      addUser(data);
    }
  };

  return (
    <div className="w-full mx-auto animate-in fade-in duration-500 pb-12">
      <UserFilters 
        userCount={totalCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onNewUser={handleNewUser}
      />
      
      <UserTable 
        users={users}
        onEdit={handleEditUser}
        onToggleStatus={handleToggleStatus}
        onView={handleViewUser}
      />

      <UserDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleDrawerSubmit}
        initialData={selectedUser}
      />

      <UserDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        user={selectedUser}
      />

      <ConfirmationModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmStatus}
        title="Changer le statut"
        message={`Voulez-vous vraiment changer le statut de ${selectedUser?.prenom} ${selectedUser?.nom} ?`}
        confirmText="Confirmer le changement"
        type="warning"
      />
    </div>
  );
};

export default UsersPage;
