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
  } = useUsers();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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

  const handleDrawerSubmit = (data) => {
    if (selectedUser) {
      updateUser(selectedUser.id, data);
    } else {
      addUser(data);
    }
  };

  return (
    <div className="w-full mx-auto pb-12 space-y-8">
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
