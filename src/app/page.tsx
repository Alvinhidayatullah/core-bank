'use client';

import { useState, useEffect } from 'react';
import { login, getBanks, getUserSession } from './actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const getBankLogo = (bankName: string) => {
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

export default function LoginPage() {
  const [account, setAccount] = useState('admin');
  const [password, setPassword] = useState('bank');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [banks, setBanks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    getUserSession().then(session => {
      if (session) {
        setSuccess(true);
      }
    });
  }, []);

  useEffect(() => {
    if (success) {
      getBanks().then(setBanks);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('account', account);
    formData.append('password', password);

    const res = await login(formData);
    
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Failed to login');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>

        <div className="z-10 w-full max-w-4xl flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-light text-emerald-400">Login corebanking successful!</h1>
            <p className="text-slate-400 text-lg">System connected to external banking networks.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {banks.map((bank) => (
              <button 
                key={bank.id} 
                onClick={() => {
                  localStorage.setItem('selectedBank', bank.name);
                  router.push('/dashboard');
                }}
                className="w-full glass p-6 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:-translate-y-1 hover:shadow-xl hover:bg-slate-800/60 transition-all duration-300 border border-slate-700/50 hover:border-slate-600 group cursor-pointer"
              >
                <div className="h-14 w-32 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Image src={getBankLogo(bank.name)} alt={bank.name} width={128} height={56} className="object-contain w-full h-full drop-shadow-md" />
                </div>
                <span className="font-medium text-slate-200">{bank.name}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-8 px-8 py-3 glass-button-emerald rounded-full font-semibold flex items-center space-x-2 group"
          >
            <span>Enter Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
      
      <div className="glass-card w-full max-w-md p-8 rounded-3xl z-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 mb-4 overflow-hidden p-2 shadow-lg">
             <Image src="/logos/bi-2.png" alt="Bank Indonesia" width={64} height={64} className="object-contain w-full h-full" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">CoreBanking Portal</h1>
          <p className="text-slate-400 text-sm mt-2">Enter your credentials to access the system</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium pl-1">Account Number</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              <input 
                type="text" 
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-sm"
                placeholder="Enter your account"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300 font-medium pl-1">Password</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full glass-button py-3 rounded-xl font-medium mt-4 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <span>Login to System</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
