import { useState, useMemo, useCallback } from 'react';
import { USER_STATUS } from '../constants/users';

const MOCK_USERS = [
  {
    id: 1,
    identifiant: 'USR001',
    nom: 'Sami',
    prenom: 'Karim',
    email: 'karim.sami@oriotel.com',
    telephone: '0661234567',
    role: 'Administrateur',
    type: 'Interne',
    statut: 'Actif',
    dateCreation: '2024-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim',
    cin: 'AB123456',
    adresse: 'Casablanca, Maroc',
    dateNaissance: '1990-05-20',
  },
  {
    id: 2,
    identifiant: 'USR002',
    nom: 'Alami',
    prenom: 'Sara',
    email: 'sara.alami@external.com',
    telephone: '0667654321',
    role: 'Assistant',
    type: 'Externe',
    statut: 'Inactif',
    dateCreation: '2024-02-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
    cin: 'CD789012',
    adresse: 'Rabat, Maroc',
    dateNaissance: '1995-10-12',
  },
  {
    id: 3,
    identifiant: 'USR003',
    nom: 'Bennani',
    prenom: 'Omar',
    email: 'omar.bennani@oriotel.com',
    telephone: '0660000001',
    role: 'Animateur',
    type: 'Interne',
    statut: 'Suspendu',
    dateCreation: '2024-03-05',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    cin: 'EF345678',
    adresse: 'Marrakech, Maroc',
    dateNaissance: '1985-03-25',
  },
];

export const useUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    type: '',
    statut: '',
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.identifiant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesType = !filters.type || user.type === filters.type;
      const matchesStatus = !filters.statut || user.statut === filters.statut;

      return matchesSearch && matchesRole && matchesType && matchesStatus;
    });
  }, [users, searchQuery, filters]);

  const addUser = useCallback((newUser) => {
    const userWithId = {
      ...newUser,
      id: Date.now(),
      identifiant: `USR00${users.length + 1}`,
      dateCreation: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.prenom}`,
      statut: USER_STATUS.ACTIVE,
    };
    setUsers(prev => [userWithId, ...prev]);
  }, [users.length]);

  const updateUser = useCallback((id, updatedData) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updatedData } : user
    ));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  }, []);

  const toggleUserStatus = useCallback((id) => {
    setUsers(prev => prev.map(user => {
      if (user.id === id) {
        return {
          ...user,
          statut: user.statut === USER_STATUS.ACTIVE ? USER_STATUS.INACTIVE : USER_STATUS.ACTIVE
        };
      }
      return user;
    }));
  }, []);

  return {
    users: filteredUsers,
    totalCount: users.length,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  };
};
