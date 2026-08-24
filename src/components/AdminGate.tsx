import React, { useState } from 'react';
import { LockKeyhole, X } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminGateProps { onClose: () => void; onSuccess: () => void; }

export const AdminGate: React.FC<AdminGateProps> = ({ onClose, onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (passcode === '7770') { onSuccess(); return; }
    setError(true); setPasscode('');
  };
  return <div className="fixed inset-0 z-[70] bg-[#17241a]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
    <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#fbfaf7] p-6 sm:p-8 shadow-2xl">
      <div className="flex items-start justify-between"><div><div className="w-12 h-12 rounded-2xl bg-[#29402a] text-white flex items-center justify-center"><LockKeyhole className="w-6 h-6" /></div><h2 className="font-serif text-2xl text-[#29402a] mt-5">Admin access</h2><p className="text-sm text-[#718073] mt-1">Enter the admin passcode to manage your songbook.</p></div><button onClick={onClose} aria-label="Close" className="p-2 rounded-full hover:bg-[#e8eee1]"><X className="w-5 h-5" /></button></div>
      <form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-semibold text-[#29402a]" htmlFor="admin-passcode">Passcode</label><input id="admin-passcode" type="password" inputMode="numeric" autoFocus maxLength={4} value={passcode} onChange={(event) => { setPasscode(event.target.value.replace(/\D/g, '')); setError(false); }} placeholder="••••" className="w-full rounded-2xl border border-[#d9ded4] bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] text-[#29402a] outline-none focus:border-[#557b55] focus:ring-4 focus:ring-[#557b55]/10" />{error && <p className="text-sm text-[#ad473d]">That passcode is not correct.</p>}<button type="submit" className="w-full rounded-2xl bg-[#29402a] py-4 text-sm font-semibold text-white hover:bg-[#203322]">Open admin panel</button></form>
    </motion.div>
  </div>;
};
