import React, { useState } from 'react';
import { SQL_SCHEMA_DDL, sqlDb } from '../services/sqlDb';
import { Check, Copy, Database, Download, FileCode, X } from 'lucide-react';
import { motion } from 'motion/react';

interface SqlSchemaModalProps {
  onClose: () => void;
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'ddl' | 'dump'>('ddl');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const fullDump = sqlDb.generateSqlDump();
  const contentToDisplay = activeTab === 'ddl' ? SQL_SCHEMA_DDL : fullDump;

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToDisplay);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([contentToDisplay], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `el_roi_tunes_${activeTab === 'ddl' ? 'schema' : 'complete_dump'}.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl border border-[#e5e2e1] my-8 space-y-5 flex flex-col max-h-[88vh]"
      >
        <div className="flex items-center justify-between border-b border-[#e5e2e1] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3e5219] text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1c1b1b]">
                SQL Relational Database Schema
              </h3>
              <p className="text-xs text-[#5d5f5f]">
                Fully compatible with PostgreSQL, SQLite, Cloud SQL & MySQL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#5d5f5f] hover:text-[#1c1b1b] hover:bg-[#f0eded]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-between">
          <div className="flex bg-[#e3e3de] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('ddl')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ddl'
                  ? 'bg-[#3e5219] text-white shadow-xs'
                  : 'text-[#5d5f5f] hover:text-[#1c1b1b]'
              }`}
            >
              Schema DDL Tables
            </button>
            <button
              onClick={() => setActiveTab('dump')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dump'
                  ? 'bg-[#3e5219] text-white shadow-xs'
                  : 'text-[#5d5f5f] hover:text-[#1c1b1b]'
              }`}
            >
              Complete SQL Dump (Schema + Inserts)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl border border-[#e5e2e1] text-[#3e5219] hover:bg-[#f0eded] text-xs font-semibold flex items-center gap-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy SQL'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-[#3e5219] hover:bg-[#2c3c0f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .sql</span>
            </button>
          </div>
        </div>

        {/* Code Box */}
        <div className="flex-1 overflow-y-auto bg-[#18181b] text-emerald-400 font-mono text-xs p-4 rounded-2xl border border-gray-800 hide-scrollbar shadow-inner">
          <pre className="whitespace-pre-wrap">{contentToDisplay}</pre>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#3e5219] text-white font-bold text-xs hover:bg-[#2c3c0f]"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
