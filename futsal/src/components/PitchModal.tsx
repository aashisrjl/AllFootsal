import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { createPitch, updatePitch } from '../lib/pitchApi';

export default function PitchModal({ isOpen, onClose, pitch, onSaved }: any) {
  const [formData, setFormData] = useState({
    name: '', pitch_type: '5v5', surface_type: 'Artificial Turf', dimensions: '30m x 20m',
    price_per_hour: '', lighting: true, indoor: true, is_active: true
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (pitch) {
      setFormData({
        name: pitch.name || '', pitch_type: pitch.pitch_type || '5v5',
        surface_type: pitch.surface || pitch.surface_type || 'Artificial Turf',
        dimensions: pitch.size || pitch.dimensions || '30m x 20m',
        price_per_hour: pitch.pricePerHour || pitch.price_per_hour || '',
        lighting: pitch.lighting !== false, indoor: pitch.indoor !== false,
        is_active: pitch.isActive !== false
      });
    } else {
      setFormData({
        name: '', pitch_type: '5v5', surface_type: 'Artificial Turf', dimensions: '30m x 20m',
        price_per_hour: '', lighting: true, indoor: true, is_active: true
      });
    }
  }, [pitch, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...formData, price_per_hour: Number(formData.price_per_hour), is_active: formData.is_active ? 1 : 0, lighting: formData.lighting ? 1 : 0, indoor: formData.indoor ? 1 : 0 };
      if (pitch && pitch.id) {
        await updatePitch(pitch.id, payload);
      } else {
        await createPitch(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save pitch');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-app-surface-solid border border-app-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-app-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-app-heading">{pitch ? 'Edit Pitch' : 'Add New Pitch'}</h2>
          <button onClick={onClose} className="p-2 text-app-muted hover:text-white rounded-lg hover:bg-app-surface-solid transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1">
          <form id="pitch-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-app-muted mb-1.5 uppercase tracking-wide">Pitch Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800 border border-app-border-subtle text-white rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none" placeholder="e.g. Pitch A" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-app-muted mb-1.5 uppercase tracking-wide">Type</label>
                <input required type="text" value={formData.pitch_type} onChange={e => setFormData({...formData, pitch_type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800 border border-app-border-subtle text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-muted mb-1.5 uppercase tracking-wide">Price/Hour ($)</label>
                <input required type="number" step="0.01" value={formData.price_per_hour} onChange={e => setFormData({...formData, price_per_hour: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800 border border-app-border-subtle text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-app-muted mb-1.5 uppercase tracking-wide">Surface</label>
                <input required type="text" value={formData.surface_type} onChange={e => setFormData({...formData, surface_type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800 border border-app-border-subtle text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-app-muted mb-1.5 uppercase tracking-wide">Dimensions</label>
                <input required type="text" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} className="w-full px-4 py-2.5 bg-slate-800 border border-app-border-subtle text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={formData.lighting} onChange={e => setFormData({...formData, lighting: e.target.checked})} className="rounded bg-slate-800 border-app-border-subtle text-emerald-500 focus:ring-emerald-500/50" />
                <span className="text-sm font-medium text-slate-300">Lighting</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={formData.indoor} onChange={e => setFormData({...formData, indoor: e.target.checked})} className="rounded bg-slate-800 border-app-border-subtle text-emerald-500 focus:ring-emerald-500/50" />
                <span className="text-sm font-medium text-slate-300">Indoor</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="rounded bg-slate-800 border-app-border-subtle text-emerald-500 focus:ring-emerald-500/50" />
                <span className="text-sm font-medium text-slate-300">Active</span>
              </label>
            </div>
          </form>
        </div>
        
        <div className="p-5 border-t border-app-border flex justify-end gap-3 bg-slate-900/50">
           <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-app-muted hover:text-white transition-colors">Cancel</button>
           <button form="pitch-form" disabled={saving} className="flex items-center px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:-translate-y-0.5">
             <Check className="w-4 h-4 mr-1.5" />
             {saving ? 'Saving...' : 'Save Pitch'}
           </button>
        </div>
      </div>
    </div>
  );
}
