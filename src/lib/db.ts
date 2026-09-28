import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export interface User {
  account_number: string;
  name: string;
  password?: string;
  balance: number;
}

// In-memory cache fallback for Vercel serverless environment
let memoryDb: { users: User[], banks: { id: string, name: string, url: string }[] } | null = null;

const loadDb = () => {
  if (memoryDb) return memoryDb;
  try {
    const fileContents = fs.readFileSync(dbPath, 'utf8');
    memoryDb = JSON.parse(fileContents);
  } catch {
    // Fallback if fs fails on Vercel
    memoryDb = {
      users: [
        { account_number: "admin", name: "boy", password: "bank", balance: 2824335 }
      ],
      banks: [
        { id: "bca", name: "BCA", url: "https://www.bca.co.id" },
        { id: "mandiri", name: "Bank Mandiri", url: "https://bankmandiri.co.id" },
        { id: "bri", name: "BRI", url: "https://bri.co.id" },
        { id: "bni", name: "BNI", url: "https://www.bni.co.id" },
        { id: "bsi", name: "BSI", url: "https://www.bankbsi.co.id" },
        { id: "ocbc", name: "OCBC", url: "https://www.ocbc.id" },
        { id: "permata", name: "Bank Permata", url: "https://www.permatabank.com" },
        { id: "danamon", name: "Bank Danamon", url: "https://www.danamon.co.id" }
      ]
    };
  }
  return memoryDb!;
};

const saveDb = (db: { users: User[], banks: { id: string, name: string, url: string }[] }) => {
  memoryDb = db; // Always save to memory
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch {
    // Ignore write errors on Vercel Serverless (read-only file system)
  }
};

export const getDb = () => {
  return loadDb();
};

export const updateBalance = (accountNumber: string, amount: number, type: 'transfer' | 'remittance' | 'deposit') => {
  const db = getDb();
  const userIndex = db.users.findIndex((u: User) => u.account_number === accountNumber);
  
  if (userIndex !== -1) {
    if (type === 'deposit') {
      db.users[userIndex].balance += amount;
    } else {
      db.users[userIndex].balance -= amount;
    }
    saveDb(db);
    return db.users[userIndex];
  }
  return null;
};

export const updateUserNameDb = (accountNumber: string, newName: string) => {
  const db = getDb();
  const userIndex = db.users.findIndex((u: User) => u.account_number === accountNumber);
  
  if (userIndex !== -1) {
    db.users[userIndex].name = newName;
    saveDb(db);
    return db.users[userIndex];
  }
  return null;
};

export const updateUserAccountDb = (oldAccountNumber: string, newAccountNumber: string) => {
  const db = getDb();
  
  // Check if new account number already exists
  if (db.users.some((u: User) => u.account_number === newAccountNumber)) {
    return { error: 'Account number already exists' };
  }
  
  const userIndex = db.users.findIndex((u: User) => u.account_number === oldAccountNumber);
  
  if (userIndex !== -1) {
    db.users[userIndex].account_number = newAccountNumber;
    saveDb(db);
    return { user: db.users[userIndex] };
  }
  return { error: 'User not found' };
};
