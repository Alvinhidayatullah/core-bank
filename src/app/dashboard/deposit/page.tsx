'use client';

import { useState } from 'react';
import { depositFunds } from '@/app/actions';
import Image from 'next/image';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string, newBalance?: number} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('amount', amount.replace(/\D/g, ''));

    const res = await depositFunds(formData);
    
    if (res.success) {
      setStatus({ 
        type: 'success', 
        message: 'DEPOSIT SUCCESSFUL',
        newBalance: res.newBalance ?? undefined
      });

    } else {
      setStatus({ type: 'error', message: res.error || 'Deposit failed' });
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col pt-12 max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Deposit Funds</h1>
        <p className="text-slate-400">Add funds to your core banking account balance.</p>
      </div>

      <div className="glass-card rounded-3xl p-8">
        {status?.type === 'success' ? (
          <div className="mt-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center h-14 w-40 mx-auto mb-6">
                <Image src="/logos/bi-2.png" alt="Bank Logo" width={128} height={40} className="object-contain w-full h-full drop-shadow-md" />
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h2 className="text-xl font-bold tracking-widest text-emerald-400">{status.message}</h2>
              </div>
            </div>

            <div className="space-y-6">
              <div className="pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800 text-sm">
                  <span className="text-slate-400">Transaction Type</span>
                  <span className="text-white font-medium">Cash Deposit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Total Deposited</span>
                  <span className="text-emerald-400 font-semibold text-lg font-mono">+ IDR {Number(amount.replace(/\D/g, '') || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <button 
                onClick={() => { setStatus(null); setAmount(''); }}
                className="w-full glass-button py-4 rounded-xl font-medium flex items-center justify-center space-x-2 text-lg"
              >
                <span>Make Another Deposit</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium pl-1">Amount to Deposit (IDR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                <input 
                  type="text" 
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAmount(val ? Number(val).toLocaleString('id-ID') : '');
                  }}
                  className="w-full glass-input rounded-xl py-3 pl-12 pr-4 text-lg font-medium"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {status && status.type === 'error' && (
              <div className="p-4 rounded-xl text-sm flex items-start space-x-3 bg-red-500/10 border border-red-500/20 text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <span>{status.message}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full glass-button py-4 rounded-xl font-medium mt-4 flex items-center justify-center space-x-2 text-lg"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <span>Proceed Deposit</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
