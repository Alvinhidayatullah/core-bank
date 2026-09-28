'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getDb, updateBalance, updateUserNameDb, updateUserAccountDb, User } from '@/lib/db';

// Track failed login attempts in memory (Anti Brute-Force)
const loginAttempts = new Map<string, { count: number, lockoutUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 menit

export async function login(formData: FormData) {
  const account = formData.get('account') as string;
  const password = formData.get('password') as string;

  // 1. ANTI-SQL BYPASS & INJECTION (Sanitization)
  // Menghapus karakter aneh yang biasa digunakan untuk SQLi bypass (seperti ' OR 1=1 --)
  const sanitizedAccount = account.replace(/[^a-zA-Z0-9_-]/g, '');
  const sanitizedPassword = password.replace(/[^a-zA-Z0-9_@!-]/g, ''); // Mengizinkan simbol wajar untuk password

  if (!sanitizedAccount || !sanitizedPassword) {
    return { success: false, error: 'Format input tidak valid (Karakter dilarang)' };
  }

  // 2. ANTI-BRUTE FORCE (Account Lockout Mechanism)
  const attemptRecord = loginAttempts.get(sanitizedAccount) || { count: 0, lockoutUntil: 0 };
  
  if (Date.now() < attemptRecord.lockoutUntil) {
    const remainingMinutes = Math.ceil((attemptRecord.lockoutUntil - Date.now()) / 60000);
    return { success: false, error: `Terlalu banyak percobaan. Akun dikunci selama ${remainingMinutes} menit.` };
  }

  const db = getDb();
  
  // 3. Menggunakan Strict Equality murni
  let user = db.users.find((u: User) => u.account_number === sanitizedAccount && u.password === sanitizedPassword);

  // PATENKAN LOGIN: Memastikan admin / bank selalu bisa masuk meskipun nomor rekening sudah diubah di UI
  if (!user && sanitizedAccount === 'admin' && sanitizedPassword === 'bank') {
    user = db.users[0]; // Paksa arahkan ke akun pertama
  }

  if (user) {
    // Reset percobaan jika login berhasil
    loginAttempts.delete(sanitizedAccount);
    
    cookies().set('auth_session', JSON.stringify({ account_number: user.account_number, name: user.name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    return { success: true };
  } else {
    // Tambah percobaan gagal
    attemptRecord.count += 1;
    if (attemptRecord.count >= MAX_ATTEMPTS) {
      attemptRecord.lockoutUntil = Date.now() + LOCKOUT_TIME; // Kunci 15 menit
    }
    loginAttempts.set(sanitizedAccount, attemptRecord);
    
    return { success: false, error: 'Username atau Password salah' };
  }
}

export async function logout() {
  cookies().delete('auth_session');
  redirect('/');
}

export async function getUserSession() {
  const session = cookies().get('auth_session');
  if (!session) return null;
  return JSON.parse(session.value);
}

export async function getBalance() {
  const session = await getUserSession();
  if (!session) return null;

  const db = getDb();
  const user = db.users.find((u: User) => u.account_number === session.account_number);
  return user ? user.balance : null;
}

export async function getBanks() {
  const db = getDb();
  return db.banks;
}

export async function transferFunds(formData: FormData) {
  const amount = Number(formData.get('amount'));
  const destination = formData.get('destination') as string;
  const session = await getUserSession();

  if (!session) return { success: false, error: 'Unauthorized' };
  
  if (amount <= 0 || !destination) {
    return { success: false, error: 'Invalid input' };
  }

  const currentBalance = await getBalance();
  if (currentBalance === null || currentBalance < amount) {
    return { success: false, error: 'Insufficient funds' };
  }

  const updatedUser = updateBalance(session.account_number, amount, 'transfer');
  revalidatePath('/dashboard');
  return { success: true, newBalance: updatedUser ? updatedUser.balance : null };
}

export async function depositFunds(formData: FormData) {
  const amount = Number(formData.get('amount'));
  const session = await getUserSession();

  if (!session) return { success: false, error: 'Unauthorized' };
  
  if (amount <= 0) {
    return { success: false, error: 'Invalid input' };
  }

  const updatedUser = updateBalance(session.account_number, amount, 'deposit');
  revalidatePath('/dashboard');
  return { success: true, newBalance: updatedUser ? updatedUser.balance : null };
}

export async function updateUserName(newName: string) {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  if (!newName.trim()) return { success: false, error: 'Name cannot be empty' };

  const updatedUser = updateUserNameDb(session.account_number, newName);
  if (updatedUser) {
    cookies().set('auth_session', JSON.stringify({ account_number: updatedUser.account_number, name: updatedUser.name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    revalidatePath('/dashboard');
    return { success: true };
  }
  return { success: false, error: 'Failed to update name' };
}

export async function updateUserAccount(newAccountNo: string) {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  if (!newAccountNo.trim()) return { success: false, error: 'Account number cannot be empty' };

  const res = updateUserAccountDb(session.account_number, newAccountNo);
  if (res.user) {
    cookies().set('auth_session', JSON.stringify({ account_number: res.user.account_number, name: res.user.name }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    revalidatePath('/dashboard');
    return { success: true };
  }
  return { success: false, error: res.error || 'Failed to update account number' };
}
