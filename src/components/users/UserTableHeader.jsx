const UserTableHeader = () => {
  const headers = [
    { label: 'Utilisateur', className: 'px-6 py-5' },
    { label: 'Identifiant', className: 'px-6 py-5' },
    { label: 'Contact', className: 'px-6 py-5' },
    { label: 'Rôle & Type', className: 'px-6 py-5' },
    { label: 'Statut', className: 'px-6 py-5' },
    { label: 'Actions', className: 'px-6 py-5 text-right' },
  ];

  return (
    <thead className="bg-[#F9FAFB] border-b border-gray-100">
      <tr>
        {headers.map((header) => (
          <th 
            key={header.label} 
            className={`${header.className} text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.05em]`}
          >
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default UserTableHeader;
