import React, { useState } from 'react';
import { Category, Song, TabType } from '../types';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Download,
  FolderTree,
  Library,
  MoreVertical,
  Music,
  Plus,
  Play,
  Terminal,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { sqlDb } from '../services/sqlDb';

interface AdminDashboardProps {
  songs: Song[];
  categories: Category[];
  onOpenAddSong: () => void;
  onEditSong: (song: Song) => void;
  onSelectSong: (song: Song) => void;
  onTabChange: (tab: TabType) => void;
  onUpdateSongStatus: (songId: string, status: 'Approved' | 'Pending' | 'Draft') => void;
  onDeleteSong: (songId: string) => void;
  onOpenSqlModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  songs,
  categories,
  onOpenAddSong,
  onEditSong,
  onSelectSong,
  onTabChange,
  onUpdateSongStatus,
  onDeleteSong,
  onOpenSqlModal,
}) => {
  const [selectedSubMenu, setSelectedSubMenu] = useState<string | null>(null);
  const [sqlQueryInput, setSqlQueryInput] = useState<string>(
    "SELECT * FROM songs WHERE language = 'Hindi'"
  );
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: (string | number | boolean)[][];
    error?: string;
  } | null>(null);

  const pendingSubmissions = songs.filter((s) => s.status === 'Pending');
  const approvedSubmissions = songs.filter((s) => s.status === 'Approved');

  const handleRunQuery = () => {
    const res = sqlDb.executeSimulatedQuery(sqlQueryInput);
    setQueryResult(res);
  };

  const handleDownloadSql = () => {
    const dump = sqlDb.generateSqlDump();
    const blob = new Blob([dump], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `el_roi_tunes_database_export_${new Date().toISOString().split('T')[0]}.sql`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="admin-dashboard-view" className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header Section (matching Image 7.png) */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1b1b] tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-sm text-[#5d5f5f] mt-1">
            Manage your audio media ecosystem & SQL catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-admin-manage-categories"
            onClick={() => onTabChange('categories')}
            className="bg-white text-[#3e5219] border border-[#3e5219] px-5 py-2.5 rounded-xl hover:bg-[#3e5219]/10 active:translate-y-0.5 transition-all text-xs font-bold shadow-xs flex items-center gap-2"
          >
            <FolderTree className="w-4 h-4" />
            <span>Manage Categories</span>
          </button>

          <button
            id="btn-admin-add-song"
            onClick={onOpenAddSong}
            className="bg-[#3e5219] text-white px-5 py-2.5 rounded-xl hover:bg-[#2c3c0f] active:translate-y-0.5 transition-all text-xs font-bold shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Song</span>
          </button>
        </div>
      </section>

      {/* Stats Bento Grid (matching Image 7.png) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stat Card 1: Total Songs */}
        <div className="bg-white rounded-2xl soft-card border border-[#e5e7eb] p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#3e5219]/5 rounded-full blur-xl group-hover:bg-[#3e5219]/10 transition-colors duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-bold text-[#5d5f5f] uppercase tracking-wider">
              TOTAL SONGS
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#3e5219]/10 flex items-center justify-center text-[#3e5219]">
              <Library className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1b1b]">
              {songs.length + 1236}
            </p>
            <p className="text-xs text-[#556b2f] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12 this week
            </p>
          </div>
        </div>

        {/* Stat Card 2: Total Categories */}
        <div className="bg-white rounded-2xl soft-card border border-[#e5e7eb] p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#3e5219]/5 rounded-full blur-xl group-hover:bg-[#3e5219]/10 transition-colors duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-bold text-[#5d5f5f] uppercase tracking-wider">
              TOTAL CATEGORIES
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#3e5219]/10 flex items-center justify-center text-[#3e5219]">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1b1b]">
              {categories.length + 18}
            </p>
            <p className="text-xs text-[#5d5f5f] mt-1">Organized taxonomy</p>
          </div>
        </div>

        {/* Stat Card 3: Active Users */}
        <div className="bg-white rounded-2xl soft-card border border-[#e5e7eb] p-6 flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#3e5219]/5 rounded-full blur-2xl group-hover:bg-[#3e5219]/10 transition-colors duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <span className="text-xs font-bold text-[#5d5f5f] uppercase tracking-wider">
              ACTIVE USERS
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#3e5219]/10 flex items-center justify-center text-[#3e5219]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1b1b]">8,932</p>
            <p className="text-xs text-[#556b2f] font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +154 this month
            </p>
          </div>
        </div>
      </section>

      {/* Recent Submissions List (matching Image 7.png) */}
      <section className="bg-white rounded-2xl soft-card border border-[#e5e7eb] overflow-hidden">
        <div className="p-6 border-b border-[#e5e2e1] flex justify-between items-center">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1c1b1b]">
              Recent Submissions & Queue
            </h3>
            <p className="text-xs text-[#5d5f5f]">
              Review community hymn lyrics and chord contributions
            </p>
          </div>
          <span className="bg-[#3e5219]/10 text-[#3e5219] font-bold text-xs px-3 py-1 rounded-full">
            {pendingSubmissions.length} Pending
          </span>
        </div>

        <div className="divide-y divide-[#e5e2e1]">
          {songs.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-[#f6f3f2]/80 transition-colors flex items-center gap-4 group relative"
            >
              <div
                onClick={() => onSelectSong(item)}
                className="w-12 h-12 rounded-xl bg-[#f0eded] flex items-center justify-center shrink-0 group-hover:bg-[#3e5219]/10 transition-colors cursor-pointer"
              >
                <Music className="w-5 h-5 text-[#5d5f5f] group-hover:text-[#3e5219]" />
              </div>

              <div
                onClick={() => onSelectSong(item)}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <p className="text-[#1c1b1b] font-serif font-semibold text-base truncate group-hover:text-[#3e5219]">
                  {item.title}
                </p>
                <p className="text-[#5d5f5f] text-xs truncate">
                  Uploaded by {item.uploadedBy} • {item.language}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    item.status === 'Pending'
                      ? 'bg-[#3e5219]/10 text-[#3e5219]'
                      : item.status === 'Approved'
                      ? 'bg-[#e5e2e1] text-[#5d5f5f]'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.status}
                </span>
                <p className="text-[#75796b] text-[11px] mt-0.5">{item.createdAt}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {item.status === 'Pending' && (
                  <button
                    onClick={() => onUpdateSongStatus(item.id, 'Approved')}
                    title="Approve Song"
                    className="p-2 text-[#3e5219] hover:bg-[#3e5219]/10 rounded-lg transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() =>
                    setSelectedSubMenu(selectedSubMenu === item.id ? null : item.id)
                  }
                  className="text-[#5d5f5f] hover:text-[#1c1b1b] p-2 rounded-lg hover:bg-[#e5e2e1] transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Popup action menu */}
              {selectedSubMenu === item.id && (
                <div className="absolute right-4 top-14 z-30 bg-white border border-[#e5e2e1] rounded-xl shadow-xl p-1.5 w-44 space-y-1">
                  <button
                    onClick={() => {
                      setSelectedSubMenu(null);
                      onSelectSong(item);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1c1b1b] hover:bg-[#f0eded] rounded-lg font-medium"
                  >
                    Preview in Reader
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubMenu(null);
                      onEditSong(item);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1c1b1b] hover:bg-[#f0eded] rounded-lg font-medium"
                  >
                    Edit Song Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubMenu(null);
                      onUpdateSongStatus(
                        item.id,
                        item.status === 'Approved' ? 'Pending' : 'Approved'
                      );
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1c1b1b] hover:bg-[#f0eded] rounded-lg font-medium"
                  >
                    Set to {item.status === 'Approved' ? 'Pending' : 'Approved'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubMenu(null);
                      if (confirm(`Delete "${item.title}"?`)) onDeleteSong(item.id);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    Delete Song
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SQL Database Engine & DDL Terminal (Satisfying: "Which can be very compatible with sql database for storing lyrics, and all data") */}
      <section className="bg-white rounded-2xl soft-card border border-[#e5e7eb] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e2e1] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3e5219] text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1c1b1b]">
                SQL Database Explorer & Schema
              </h3>
              <p className="text-xs text-[#5d5f5f]">
                Relational structure with PostgreSQL / SQLite table compatibility
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSqlModal}
              className="px-3.5 py-2 rounded-xl bg-[#f0eded] hover:bg-[#e5e2e1] text-[#1c1b1b] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>View Full DDL</span>
            </button>

            <button
              onClick={handleDownloadSql}
              className="px-3.5 py-2 rounded-xl bg-[#3e5219] hover:bg-[#2c3c0f] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .sql Backup</span>
            </button>
          </div>
        </div>

        {/* Live SQL Query Tester */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#1c1b1b] flex items-center justify-between">
            <span>Simulate SQL Query:</span>
            <span className="text-[11px] text-[#75796b]">e.g. SELECT * FROM songs WHERE language = 'Hindi'</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sqlQueryInput}
              onChange={(e) => setSqlQueryInput(e.target.value)}
              className="flex-1 bg-[#18181b] text-emerald-400 font-mono text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#3e5219]"
            />
            <button
              onClick={handleRunQuery}
              className="px-4 py-2.5 bg-[#3e5219] text-white rounded-xl text-xs font-bold hover:bg-[#2c3c0f] transition-all"
            >
              Execute
            </button>
          </div>
        </div>

        {/* Query Result Table */}
        {queryResult && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-[#e5e2e1] bg-[#fcf9f8] p-3 text-xs">
            {queryResult.error ? (
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <AlertCircle className="w-4 h-4" />
                <span>{queryResult.error}</span>
              </div>
            ) : (
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-[#e5e2e1] text-[#3e5219]">
                    {queryResult.columns.map((col, i) => (
                      <th key={i} className="py-1 px-2 font-bold uppercase text-[10px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e2e1]/60">
                  {queryResult.rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-white transition-colors">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="py-1.5 px-2 text-[#1c1b1b]">
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
