import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Folder,
  Box,
  MessageSquare,
  CheckSquare,
  Clock,
  Settings,
  HelpCircle,
  Activity,
  ShieldCheck,
  History
} from "lucide-react";

export const NAVIGATION_MAIN = [
  { id: 'dashboard', name: "Tableau de bord", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { id: 'users', name: "Utilisateurs", href: "/users", icon: <Users size={20} /> },
  { id: 'roles', name: "Rôles & Permissions", href: "/roles-permissions", icon: <ShieldCheck size={20} /> },
  { id: 'history', name: "Historique", href: "/historique", icon: <Activity size={20} /> },
  { id: 'subscriptions', name: "Souscriptions", href: "/subscriptions", icon: <CreditCard size={20} /> },
  { id: 'folders', name: "Dossiers", href: "/dossiers", icon: <Folder size={20} /> },
  { id: 'stock', name: "Stock", href: "/stock", icon: <Box size={20} /> },
  { id: 'communication', name: "Communication", href: "/communication", icon: <MessageSquare size={20} /> },
  { id: 'tasks', name: "Tâches", href: "/tasks", icon: <CheckSquare size={20} /> },
  { id: 'time', name: "Temps", href: "/time", icon: <Clock size={20} /> },
];

export const NAVIGATION_FOOTER = [
  { id: 'help', name: "Aide", href: "/help", icon: <HelpCircle size={20} /> },
  { id: 'settings', name: "Paramètres", href: "/settings", icon: <Settings size={20} /> },
];
