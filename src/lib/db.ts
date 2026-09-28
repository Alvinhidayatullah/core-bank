import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export interface User {
  account_number: string;
  name: string;
  password?: string;
  balance: number;
}

export const getDb = () => {
  const fileContents = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(fileContents);
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
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return db.users[userIndex];
  }
  return null;
};

export const updateUserNameDb = (accountNumber: string, newName: string) => {
  const db = getDb();
  const userIndex = db.users.findIndex((u: User) => u.account_number === accountNumber);
  
  if (userIndex !== -1) {
    db.users[userIndex].name = newName;
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
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
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    return { user: db.users[userIndex] };
  }
  return { error: 'User not found' };
};
