import { useState, useEffect } from 'react';
import UserTable from '../components/users/UserTable';
import UserFilters from '../components/users/UserFilters';
import UserDrawer from '../components/users/UserDrawer';
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
    loading: isLoading,
    error,
  } = useUsers();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({ role: '', statut: '', dateCreation: '' });
  };

  const handleDrawerSubmit = async (data) => {
    if (selectedUser) {
      // Debug: log what we're sending
      if (data instanceof FormData) {
        console.log('[Update] User ID:', selectedUser.id, 'Email being sent:', data.get('email'));
      }
      await updateUser(selectedUser.id, data);
    } else {
      await addUser(data);
    }
  };

  return (
    <div className="w-full mx-auto pb-12 space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 animate-in fade-in zoom-in duration-300">
          {error}
        </div>
      )}
      {/* Filters section with staggered entry */}
      <div className="animate-in fade-in slide-in-up duration-500">
        <UserFilters 
          userCount={totalCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onNewUser={handleNewUser}
        />
      </div>
      
      {/* Table section with slightly delayed entry */}
      <div className="animate-in fade-in slide-in-up duration-700 delay-150">
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onView={handleViewUser}
          isLoading={isLoading}
        />
      </div>

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
    </div>
  );
};

export default UsersPage;
