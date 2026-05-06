// Simulated network delay
const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user data for development
const MOCK_USERS = [
  {
    id: 1,
    nom: 'Oriotel',
    prenom: 'Admin',
    email: 'admin@oriotel.com',
    role: 'Administrateur',
    statut: 'actif',
    dateCreation: '2024-01-15T10:30:00Z',
    avatar: null
  },
  {
    id: 2,
    nom: 'Alami',
    prenom: 'Mohammed',
    email: 'm.alami@oriotel.com',
    role: 'Interne',
    statut: 'actif',
    dateCreation: '2024-02-20T14:45:00Z',
    avatar: null
  },
  {
    id: 3,
    nom: 'Benali',
    prenom: 'Sara',
    email: 's.benali@agence-media.com',
    role: 'Externe',
    statut: 'actif',
    dateCreation: '2024-03-10T09:15:00Z',
    avatar: null
  },
  {
    id: 4,
    nom: 'Tazi',
    prenom: 'Youssef',
    email: 'y.tazi@oriotel.com',
    role: 'Interne',
    statut: 'inactif',
    dateCreation: '2024-03-25T16:20:00Z',
    avatar: null
  },
  {
    id: 5,
    nom: 'Idrissi',
    prenom: 'Leila',
    email: 'l.idrissi@event-plus.ma',
    role: 'Externe',
    statut: 'en_attente',
    dateCreation: '2024-04-05T11:00:00Z',
    avatar: null
  }
];

export const userService = {
  getUsers: async (filters = {}) => {
    await simulateDelay();
    
    let filteredUsers = [...MOCK_USERS];
    
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.nom.toLowerCase().includes(query) || 
        u.prenom.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
      );
    }
    
    if (filters.role) {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }
    
    if (filters.statut) {
      filteredUsers = filteredUsers.filter(u => u.statut === filters.statut);
    }

    return { data: filteredUsers };
  },

  getUser: async (id) => {
    await simulateDelay(400);
    const user = MOCK_USERS.find(u => u.id === parseInt(id));
    if (!user) throw new Error('Utilisateur non trouvé');
    return user;
  },

  createUser: async (userData) => {
    await simulateDelay(1200);
    const newUser = {
      id: Math.floor(Math.random() * 1000) + 10,
      nom: userData instanceof FormData ? userData.get('nom') : userData.nom,
      prenom: userData instanceof FormData ? userData.get('prenom') : userData.prenom,
      email: userData instanceof FormData ? userData.get('email') : userData.email,
      role: userData instanceof FormData ? userData.get('role') : userData.role,
      statut: 'actif',
      dateCreation: new Date().toISOString(),
      avatar: null
    };
    return newUser;
  },

  updateUser: async (id, userData) => {
    await simulateDelay(1000);
    const user = MOCK_USERS.find(u => u.id === parseInt(id));
    if (!user) throw new Error('Utilisateur non trouvé');
    
    const updatedUser = {
      ...user,
      nom: userData instanceof FormData ? (userData.get('nom') || user.nom) : (userData.nom || user.nom),
      prenom: userData instanceof FormData ? (userData.get('prenom') || user.prenom) : (userData.prenom || user.prenom),
      statut: userData instanceof FormData ? (userData.get('statut') || user.statut) : (userData.statut || user.statut),
    };
    
    return updatedUser;
  },

  deleteUser: async (id) => {
    await simulateDelay(500);
    return true;
  }
};

