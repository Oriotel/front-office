const UserTableHeader = () => {
  const headers = [
    { label: 'Photo', className: 'px-6 py-5' },
    { label: 'Nom & Prénom', className: 'px-6 py-5' },
    { label: 'Identifiant', className: 'px-6 py-5' },
    { label: 'Email', className: 'px-6 py-5' },
    { label: 'Téléphone', className: 'px-6 py-5' },
    { label: 'CIN / ID', className: 'px-6 py-5' },
    { label: 'Rôle', className: 'px-6 py-5' },
    { label: 'Date Naiss.', className: 'px-6 py-5' },
    { label: 'Création', className: 'px-6 py-5' },
    { label: 'Statut', className: 'px-6 py-5' },
    { label: 'Actions', className: 'px-6 py-5 text-right' },
  ];

  return (
    <thead className="bg-[#F9FAFB] border-b border-gray-100">
      <tr>
        {headers.map((header) => (
          <th 
            key={header.label} 
            className={`${header.className} text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.05em] whitespace-nowrap`}
          >
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default UserTableHeader;
