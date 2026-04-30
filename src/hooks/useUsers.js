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
    statut: 'Suspendu',
    dateCreation: '2024-03-05',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar',
    cin: 'EF345678',
    adresse: 'Marrakech, Maroc',
    dateNaissance: '1985-03-25',
  },
  {
    id: 4,
    identifiant: 'USR004',
    nom: 'Tazi',
    prenom: 'Laila',
    email: 'laila.tazi@oriotel.com',
    telephone: '0660000004',
    role: 'Assistant',
    statut: 'Actif',
    dateCreation: '2024-03-12',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laila',
    cin: 'GH901234',
    adresse: 'Tanger, Maroc',
    dateNaissance: '1992-07-14',
  },
  {
    id: 5,
    identifiant: 'USR005',
    nom: 'Mansouri',
    prenom: 'Youssef',
    email: 'youssef.mans@oriotel.com',
    telephone: '0660000005',
    role: 'Superviseur',
    statut: 'Actif',
    dateCreation: '2024-03-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Youssef',
    cin: 'IJ567890',
    adresse: 'Agadir, Maroc',
    dateNaissance: '1988-11-30',
  },
  {
    id: 6,
    identifiant: 'USR006',
    nom: 'Chraibi',
    prenom: 'Anas',
    email: 'anas.chraibi@oriotel.com',
    telephone: '0660000006',
    role: 'Animateur',
    statut: 'Actif',
    dateCreation: '2024-03-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anas',
    cin: 'KL123456',
    adresse: 'Fès, Maroc',
    dateNaissance: '1994-04-05',
  },
  {
    id: 7,
    identifiant: 'USR007',
    nom: 'Idrissi',
    prenom: 'Meryem',
    email: 'meryem.id@oriotel.com',
    telephone: '0660000007',
    role: 'Assistant',
    statut: 'Inactif',
    dateCreation: '2024-03-22',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meryem',
    cin: 'MN789012',
    adresse: 'Meknès, Maroc',
    dateNaissance: '1996-09-18',
  },
  {
    id: 8,
    identifiant: 'USR008',
    nom: 'Zouhair',
    prenom: 'Hamza',
    email: 'hamza.z@oriotel.com',
    telephone: '0660000008',
    role: 'Administrateur',
    statut: 'Actif',
    dateCreation: '2024-03-25',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hamza',
    cin: 'OP345678',
    adresse: 'Casablanca, Maroc',
    dateNaissance: '1987-01-22',
  },
  {
    id: 9,
    identifiant: 'USR009',
    nom: 'Filali',
    prenom: 'Salma',
    email: 'salma.f@oriotel.com',
    telephone: '0660000009',
    role: 'Superviseur',
    statut: 'Suspendu',
    dateCreation: '2024-03-28',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Salma',
    cin: 'QR901234',
    adresse: 'Rabat, Maroc',
    dateNaissance: '1991-12-08',
  },
  {
    id: 10,
    identifiant: 'USR010',
    nom: 'Sabiri',
    prenom: 'Driss',
    email: 'driss.s@oriotel.com',
    telephone: '0660000010',
    role: 'Animateur',
    statut: 'Actif',
    dateCreation: '2024-03-30',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Driss',
    cin: 'ST567890',
    adresse: 'El Jadida, Maroc',
    dateNaissance: '1989-06-15',
  },
];

export const useUsers = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    statut: '',
    dateCreation: '',
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.identifiant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesStatus = !filters.statut || user.statut === filters.statut;
      const matchesDate = !filters.dateCreation || user.dateCreation === filters.dateCreation;

      return matchesSearch && matchesRole && matchesStatus && matchesDate;
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
