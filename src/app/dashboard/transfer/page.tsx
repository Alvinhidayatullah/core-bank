'use client';

import { useState, useEffect } from 'react';
import { transferFunds, getUserSession } from '@/app/actions';
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

export default function TransferPage() {
  const [destination, setDestination] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [amount, setAmount] = useState('');
  const [adminFeeInput, setAdminFeeInput] = useState('');
  const [sourceBank, setSourceBank] = useState('');
  const [destinationBank, setDestinationBank] = useState('BCA');
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string, destination?: string, destinationName?: string, amount?: number, adminFee?: number, total?: number, newBalance?: number, sourceBank?: string, destinationBank?: string, refNo?: string, date?: string, senderName?: string, senderAccount?: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderAccount, setSenderAccount] = useState('');

  useEffect(() => {
    setSourceBank(localStorage.getItem('selectedBank') || 'Unknown Bank');
    getUserSession().then(s => {
      if (s) {
        setSenderName(s.name);
        setSenderAccount(s.account_number);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const numericAmount = Number(amount.replace(/\D/g, ''));
    const fee = Number(adminFeeInput.replace(/\D/g, '')) || 0;
    const totalAmount = numericAmount + fee;

    const formData = new FormData();
    formData.append('destination', destination);
    formData.append('amount', totalAmount.toString());

    const res = await transferFunds(formData);
    
    if (res.success) {
      setStatus({ 
        type: 'success', 
        message: 'TRANSFER SUCCESSFUL',
        destination: destination,
        destinationName: destinationName,
        amount: numericAmount,
        adminFee: fee,
        total: totalAmount,
        newBalance: res.newBalance,
        sourceBank: sourceBank,
        destinationBank: destinationBank,
        refNo: 'TRF-' + Math.random().toString().slice(2, 10),
        date: new Date().toLocaleString('id-ID'),
        senderName: senderName,
        senderAccount: senderAccount
      });
      setDestination('');
      setDestinationName('');
      setAmount('');
      setAdminFeeInput('');
    } else {
      setStatus({ type: 'error', message: res.error || 'Transfer failed' });
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col pt-12 max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-white mb-2">Transfer Funds</h1>
        <p className="text-slate-400">Send money securely to any domestic bank account.</p>
      </div>

      <div className="glass-card rounded-3xl p-8">
        {status?.type === 'success' ? (
          <div className="mt-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center h-14 w-40 mx-auto mb-6">
                <Image src={getBankLogo(status.sourceBank || '')} alt={status.sourceBank || 'Bank'} width={160} height={56} className="object-contain object-center w-full h-full drop-shadow-md" />
              </div>
              <h2 className="text-xl font-semibold text-white tracking-wide flex items-center justify-center gap-3">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                {status.message}
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Ref No.</div>
                  <div className="text-slate-300 font-mono text-sm">{status.refNo}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">Date</div>
                  <div className="text-slate-300 text-sm">{status.date}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">Sender Details</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Name</div>
                        <div className="font-medium text-white text-sm">{status.senderName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Account</div>
                        <div className="font-mono text-slate-300 text-sm">{status.senderAccount}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Bank</div>
                        <div className="font-medium text-white text-sm">{status.sourceBank}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium mb-3">Beneficiary Details</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Name</div>
                        <div className="font-medium text-white text-sm">{status.destinationName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Account</div>
                        <div className="font-mono text-slate-300 text-sm">{status.destination}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-0.5">Bank</div>
                        <div className="font-medium text-white text-sm">{status.destinationBank}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center mb-3 text-sm">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-white font-mono">IDR {status.amount?.toLocaleString('id-ID')}</span>
                </div>
                {status.adminFee ? (
                  <div className="flex justify-between items-center mb-4 text-sm pb-4 border-b border-slate-800">
                    <span className="text-slate-400">Admin Fee</span>
                    <span className="text-white font-mono">IDR {status.adminFee.toLocaleString('id-ID')}</span>
                  </div>
                ) : (
                  <div className="mb-4 pb-4 border-b border-slate-800"></div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Total</span>
                  <span className="text-white font-semibold text-lg font-mono">IDR {status.total?.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center relative z-10">
              <button 
                onClick={() => setStatus(null)}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium hover:underline underline-offset-4 transition-all"
              >
                Make another transfer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium pl-1">Destination Bank</label>
                <select 
                  value={destinationBank}
                  onChange={(e) => setDestinationBank(e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-sm appearance-none"
                >
                  <option value="BCA">BCA</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="BRI">BRI</option>
                  <option value="BNI">BNI</option>
                  <option value="BSI">BSI</option>
                  <option value="OCBC">OCBC</option>
                  <option value="Bank Permata">Bank Permata</option>
                  <option value="Bank Danamon">Bank Danamon</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium pl-1">Destination Account</label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full glass-input rounded-xl py-3 px-4 text-sm font-mono tracking-wider"
                  placeholder="e.g. 84439201"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300 font-medium pl-1">Recipient Name</label>
              <input 
                type="text" 
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                className="w-full glass-input rounded-xl py-3 px-4 text-sm font-medium tracking-wide"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium pl-1">Amount (IDR)</label>
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

              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium pl-1">Admin Fee (IDR) <span className="text-slate-500 font-normal">- Optional</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">Rp</span>
                  <input 
                    type="text" 
                    value={adminFeeInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setAdminFeeInput(val ? Number(val).toLocaleString('id-ID') : '');
                    }}
                    className="w-full glass-input rounded-xl py-3 pl-12 pr-4 text-lg font-medium"
                    placeholder="0"
                  />
                </div>
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
                <span>Proceed Transfer</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
