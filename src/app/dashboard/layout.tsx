import Sidebar from '@/components/Sidebar';
import { getUserSession } from '../actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="flex md:flex-row h-screen overflow-hidden bg-slate-950">
      <Sidebar user={session} />
      <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 relative">
        {/* Background Ambient */}
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
        
        {/* Deposit Button */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
          <Link href="/dashboard/deposit" className="w-10 h-10 md:w-12 md:h-12 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md text-slate-300 hover:text-emerald-400 rounded-2xl flex items-center justify-center transition-all border border-slate-700 hover:border-emerald-500/50 shadow-lg group">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <path d="M12 2v20M17 19h-7.5a3.5 3.5 0 0 1 0-7h5a3.5 3.5 0 0 0 0-7H6" />
            </svg>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto h-full flex flex-col pt-4">
          {children}
        </div>
      </main>
    </div>
  );
}
