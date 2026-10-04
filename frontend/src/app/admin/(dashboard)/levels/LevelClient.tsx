"use client";
import { useState } from "react";
import { deleteLevel, saveLevel } from "./actions";

export default function LevelClient({ levels }: { levels: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const openModal = (level: any = null) => {
    if (level) {
      setFormData({
        id: level.id,
        levelNumber: level.levelNumber,
        title: level.title,
        description: level.description,
        category: level.category,
        difficulty: level.difficulty,
        points: level.points,
        answerMatchingMode: level.answerMatchingMode,
        answer: level.answers && level.answers.length > 0 ? level.answers[0].answer : ""
      });
    } else {
      setFormData({
        levelNumber: levels.length + 1,
        title: "",
        description: "",
        category: "Cryptography",
        difficulty: "Medium",
        points: 10,
        answerMatchingMode: "EXACT",
        answer: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveLevel(formData);
      setIsModalOpen(false);
    } catch (err) {
      alert("Error saving level. Make sure Level Number is unique.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, num: number) => {
    if (!confirm(`Are you sure you want to delete Level ${num}? This deletes all related answers and hints.`)) return;
    try {
      await deleteLevel(id);
    } catch (err) {
      alert("Error deleting level.");
    }
  };

  return (
    <div className="p-4 md:p-8 pt-8 md:pt-12 relative font-mono">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 pb-2 relative">
        
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white tracking-[0.2em] uppercase drop-shadow-md">
            MANAGE LEVELS
          </h1>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">
            Configure Challenges & Validation
          </p>
        </div>
        <button onClick={() => openModal()} className="px-5 py-2.5 bg-[#0a0e17] border border-cyan-500/50 hover:bg-cyan-500 text-cyan-500 hover:text-black font-bold tracking-[0.2em] uppercase text-[10px] transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          + ADD NEW LEVEL
        </button>
      </div>

      <div className="bg-[#0a0e17] border border-cyan-900/50 rounded-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#020305] border-b border-cyan-900/30 text-cyan-500 text-[10px] tracking-widest uppercase">
            <tr>
              <th className="p-4">Level</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Pts</th>
              <th className="p-4">Answer Mode</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {levels.map((level: any) => (
              <tr key={level.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-400">#{level.levelNumber}</td>
                <td className="p-4 text-white font-bold">{level.title}</td>
                <td className="p-4 text-cyan-400">{level.category}</td>
                <td className="p-4 text-amber-400">{level.points}</td>
                <td className="p-4 text-violet-400 text-xs">{level.answerMatchingMode}</td>
                <td className="p-4 text-right space-x-3">
                  <button onClick={() => openModal(level)} className="text-gray-500 hover:text-cyan-400 text-xs tracking-widest uppercase">EDIT</button>
                  <button onClick={() => handleDelete(level.id, level.levelNumber)} className="text-gray-500 hover:text-red-400 text-xs tracking-widest uppercase">DEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0e17] border border-cyan-500/50 p-6 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <h2 className="text-xl text-cyan-400 font-bold tracking-widest uppercase mb-6 border-b border-cyan-900/30 pb-4">
              {formData.id ? 'Edit Level' : 'Create New Level'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest mb-1">LEVEL NUMBER</label>
                  <input type="number" required value={formData.levelNumber} onChange={e => setFormData({...formData, levelNumber: e.target.value})} className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest mb-1">POINTS</label>
                  <input type="number" required value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 text-xs tracking-widest mb-1">TITLE</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-cyan-500 outline-none" />
              </div>

              <div>
                <label className="block text-gray-400 text-xs tracking-widest mb-1">DESCRIPTION (Markdown Supported)</label>
                <textarea required rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-cyan-500 outline-none font-mono text-xs"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest mb-1">CATEGORY</label>
                  <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-cyan-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest mb-1">DIFFICULTY</label>
                  <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-cyan-500 outline-none">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                    <option>Extreme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest mb-1">ACCEPTED ANSWER</label>
                  <input type="text" required value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-cyan-500 outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs tracking-widest mb-1">MATCHING MODE</label>
                  <select value={formData.answerMatchingMode} onChange={e => setFormData({...formData, answerMatchingMode: e.target.value})} className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-cyan-500 outline-none">
                    <option value="EXACT">Strict Exact Match</option>
                    <option value="CASE_INSENSITIVE">Case Insensitive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-cyan-900/30 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 tracking-widest uppercase text-xs transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold tracking-widest uppercase text-xs transition-colors disabled:opacity-50">
                  {loading ? "Saving..." : "Save Protocol"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
