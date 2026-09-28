'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout, updateUserName } from '@/app/actions';

export default function Sidebar({ user }: { user: { name: string, account_number: string } }) {
  const pathname = usePathname();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleNameUpdate = async () => {
    if (newName.trim() === user.name) {
      setIsEditingName(false);
      return;
    }
    setIsUpdating(true);
    await updateUserName(newName);
    setIsUpdating(false);
    setIsEditingName(false);
  };

  const menu = [
    { name: 'Check Balance', path: '/dashboard', icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /> },
    { name: 'Transfer', path: '/dashboard/transfer', icon: <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4 9 20" /> },
    { name: 'Remittance', path: '/dashboard/remittance', icon: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></> },
  ];

  return (
    <aside className="fixed bottom-0 left-0 w-full md:relative md:w-72 border-t md:border-t-0 md:border-r border-slate-800/50 bg-slate-900/95 md:bg-slate-900/50 backdrop-blur-xl flex flex-row md:flex-col p-2 md:p-6 h-auto md:h-full z-50">
      <div className="hidden md:block mb-10">
        <div className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">Connected User</div>
        {isEditingName ? (
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isUpdating}
              autoFocus
              onBlur={handleNameUpdate}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleNameUpdate();
                if (e.key === 'Escape') {
                  setNewName(user.name);
                  setIsEditingName(false);
                }
              }}
              className="bg-slate-800 border border-emerald-500/50 rounded-lg px-2 py-1 text-white font-bold w-full outline-none"
            />
          </div>
        ) : (
          <div className="group flex items-center space-x-2 cursor-pointer" onClick={() => setIsEditingName(true)}>
            <div className="text-xl font-bold tracking-tight text-white">{user.name}</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
          </div>
        )}
        <div className="text-slate-500 text-sm mt-1">{user.account_number}</div>
      </div>

      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start items-center md:items-stretch space-x-1 md:space-x-0 md:space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex flex-col md:flex-row items-center justify-center md:justify-start md:space-x-3 p-2 md:px-4 md:py-3 rounded-xl transition-all duration-200 w-full ${
                isActive 
                  ? 'text-blue-400 md:bg-blue-600/10 md:border border-blue-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1 md:mb-0">
                {item.icon}
              </svg>
              <span className="text-[10px] md:text-base font-medium">{item.name}</span>
            </Link>
          );
        })}
      
        {/* Mobile Logout Button */}
        <button 
          onClick={() => logout()}
          className="md:hidden flex flex-col items-center justify-center p-2 rounded-xl text-red-400 hover:text-red-300 w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          <span className="text-[10px] font-medium">Exit</span>
        </button>
      </nav>

      <div className="hidden md:flex mt-auto flex-col space-y-2">
        <Link 
          href="/"
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-transparent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
          <span className="font-medium">Switch Bank</span>
        </Link>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          <span className="font-medium">Exit (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
