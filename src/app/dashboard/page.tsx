'use client';

import { useState, useEffect } from 'react';
import { getBalance, getUserSession, updateUserAccount, updateUserName } from '../actions';
import Image from 'next/image';

const getBankLogo = (bankName: string) => {
  if (!bankName) return '/logos/logo.svg';
  switch (bankName.toLowerCase()) {
    case 'bca': return '/logos/bca-2.png';
    case 'bni': return '/logos/bni.png';
    case 'bri': return '/logos/bri.webp';
    case 'bsi': return '/logos/bsi.png';
    case 'bank danamon': return '/logos/danamon.svg';
    case 'bank mandiri': return '/logos/mandiri.png';
    case 'bank permata': return '/logos/permata.png';
    case 'ocbc': return '/logos/ocbc.png';
    default: return '/logos/logo.svg';
  }
};

export default function CheckBalancePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [accountNo, setAccountNo] = useState('');
  const [bankName, setBankName] = useState('');

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [newAccountNo, setNewAccountNo] = useState('');
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);

  const [userName, setUserName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  useEffect(() => {
    getBalance().then(setBalance);
    getUserSession().then(session => {
      if (session) {
        setAccountNo(session.account_number);
        setUserName(session.name);
        setNewUserName(session.name);
      }
    });
    setBankName(localStorage.getItem('selectedBank') || 'Tidak Diketahui');
  }, []);

  const handleNameUpdate = async () => {
    if (newUserName.trim() === userName || !newUserName.trim()) {
      setIsEditingName(false);
      return;
    }
    setIsUpdatingName(true);
    const res = await updateUserName(newUserName);
    if (res.success) {
      setUserName(newUserName);
    } else {
      alert(res.error);
      setNewUserName(userName);
    }
    setIsUpdatingName(false);
    setIsEditingName(false);
  };

  const handleAccountUpdate = async () => {
    if (newAccountNo.trim() === accountNo || !newAccountNo.trim()) {
      setIsEditingAccount(false);
      return;
    }
    setIsUpdatingAccount(true);
    const res = await updateUserAccount(newAccountNo);
    if (res.success) {
      setAccountNo(newAccountNo);
    } else {
      alert(res.error);
      setNewAccountNo(accountNo);
    }
    setIsUpdatingAccount(false);
    setIsEditingAccount(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="glass-card rounded-3xl p-6 md:p-10 w-full max-w-xl relative overflow-hidden group">
        <div className="text-center relative z-10 mb-8 md:mb-10">
          <h2 className="text-xs md:text-sm uppercase tracking-widest text-slate-400 font-medium mb-2">Total Saldo</h2>
          <div className="text-2xl md:text-4xl font-bold tracking-tight drop-shadow-md text-white">
            <span className="text-emerald-400 mr-2">Rp</span>
            {balance !== null ? balance.toLocaleString('id-ID') : '...'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 md:p-6 mb-8 border border-slate-700 shadow-xl relative z-10 overflow-hidden">
          <div className="absolute -right-4 -top-4 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none z-0"></div>
          <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10">
            <div className="h-8 w-24 md:h-10 md:w-32 flex items-center justify-start shrink-0">
              <Image src={getBankLogo(bankName)} alt={bankName || 'Bank'} width={128} height={40} className="object-contain w-full h-full object-left drop-shadow-md" />
            </div>
            <div className="flex flex-col items-end shrink-0 ml-2">
              <span className="text-[10px] md:text-sm font-semibold tracking-widest text-slate-400 opacity-80 mb-1">DEBIT</span>
              <div className="h-10 w-32 md:h-16 md:w-48">
                <Image src="/logos/gateway.png" alt="Payment Gateway" width={192} height={64} className="object-contain w-full h-full object-right drop-shadow-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <div>
                <div className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest mb-1 opacity-80 whitespace-nowrap">Nama Bank</div>
                <div className="font-semibold text-sm md:text-lg text-white tracking-wide truncate">{bankName || '...'}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest mb-1 opacity-80 whitespace-nowrap">Nomor Rekening</div>
                
                {isEditingAccount ? (
                  <div className="flex items-center justify-end mt-1">
                    <input 
                      type="text" 
                      value={newAccountNo}
                      onChange={(e) => setNewAccountNo(e.target.value)}
                      disabled={isUpdatingAccount}
                      autoFocus
                      onBlur={handleAccountUpdate}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAccountUpdate();
                        if (e.key === 'Escape') {
                          setNewAccountNo(accountNo);
                          setIsEditingAccount(false);
                        }
                      }}
                      className="bg-slate-900 border border-emerald-500/50 rounded px-2 py-1 text-white font-mono text-base tracking-widest w-full max-w-[120px] outline-none text-right"
                    />
                  </div>
                ) : (
                  <div className="group flex items-center justify-end space-x-1 md:space-x-2 cursor-pointer mt-1" onClick={() => { setNewAccountNo(accountNo); setIsEditingAccount(true); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    <div className="font-mono text-xs md:text-lg text-white tracking-widest leading-none truncate">{accountNo || '...'}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <div className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest mb-1 opacity-80">Nama Pemilik</div>
              {isEditingName ? (
                <div className="flex items-center mt-1">
                  <input 
                    type="text" 
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    disabled={isUpdatingName}
                    autoFocus
                    onBlur={handleNameUpdate}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameUpdate();
                      if (e.key === 'Escape') {
                        setNewUserName(userName);
                        setIsEditingName(false);
                      }
                    }}
                    className="bg-slate-900 border border-emerald-500/50 rounded px-2 py-1 text-white font-semibold tracking-wide w-full max-w-[200px] outline-none"
                  />
                </div>
              ) : (
                <div className="group flex items-center space-x-1 md:space-x-2 cursor-pointer mt-1 w-fit" onClick={() => { setNewUserName(userName); setIsEditingName(true); }}>
                  <div className="font-semibold text-sm md:text-lg text-white tracking-wide uppercase leading-none truncate">{userName || '...'}</div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
