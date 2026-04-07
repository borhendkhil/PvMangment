import React, { useEffect, useMemo, useState } from 'react';
import { Edit2, Eye, FileText, Filter, LayoutGrid, Plus, Printer, Search, Table2, Trash2 } from 'lucide-react';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import { formatDateDDMMYYYY } from '../../utils/dateFormatter';
import { showToast } from '../common/Toaster';
import DecisionForm from './DecisionForm';
import DecisionViewer, { openDecisionPrintWindow, statusColors } from './DecisionViewer';

const DecisionManagement = () => {
  const [loading, setLoading] = useState(false);
  const [decisions, setDecisions] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [activeDecision, setActiveDecision] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_CONFIG.DIRECTEUR.PROCESS.DECISIONS_FULL);
      setDecisions(res.data || []);
    } catch (error) {
      console.error(error);
      showToast('تعذر تحميل المقررات', 'error');
      setDecisions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDecisions = useMemo(() => {
    const needle = searchTerm.trim().toLowerCase();
    return decisions.filter((decision) => {
      const subjectName = decision.subject?.sujet || decision.sujetNom || decision.subject?.description || '';
      const haystack = `${decision.fichierName || ''} ${subjectName}`.toLowerCase();
      const matchesSearch = !needle || haystack.includes(needle);
      const matchesStatus = !statusFilter || (decision.statut || '').toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [decisions, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: decisions.length,
      active: decisions.filter((decision) => (decision.statut || '').toLowerCase() === 'active').length,
      inactive: decisions.filter((decision) => (decision.statut || '').toLowerCase() !== 'active').length,
    };
  }, [decisions]);

  const refresh = () => {
    setShowForm(false);
    setActiveDecision(null);
    loadData();
  };

  const openCreate = () => {
    setActiveDecision(null);
    setShowForm(true);
  };

  const openEdit = (decision) => {
    setActiveDecision(decision);
    setShowForm(true);
  };

  const openView = (decision) => {
    setActiveDecision(decision);
    setShowViewer(true);
  };

  const deleteDecision = async (decision) => {
    if (!window.confirm(`هل تريد حذف القرار ${decision.fichierName || decision.id || ''}؟`)) return;
    try {
      await axios.delete(API_CONFIG.DIRECTEUR.DELETE_DECISION(decision.id));
      showToast('تم حذف القرار بنجاح', 'success');
      loadData();
    } catch (error) {
      showToast('تعذر حذف القرار', 'error');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
  };

  if (loading) {
    return <div dir="rtl" style={{ color: '#fff', textAlign: 'center', padding: '48px 20px', fontFamily: 'Tajawal, sans-serif' }}>جارٍ تحميل المقررات...</div>;
  }

  return (
    <div dir="rtl" style={{ fontFamily: 'Tajawal, sans-serif', color: '#fff' }}>
      <div style={topCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#b0b0c0', fontSize: '12px' }}>إدارة المقررات</div>
            <h2 style={{ margin: '4px 0 0', fontSize: '28px' }}>المقررات</h2>
          </div>
          <button onClick={openCreate} style={primaryButton}><Plus size={16} /> قرار جديد</button>
        </div>

        <div className="decision-stats-grid" style={statsGrid}>
          <StatCard title="الإجمالي" value={stats.total} icon={<FileText size={22} />} />
          <StatCard title="النشطة" value={stats.active} icon={<FileText size={22} />} />
          <StatCard title="غير النشطة" value={stats.inactive} icon={<FileText size={22} />} />
        </div>
      </div>

      <div style={filtersCard}>
        <div className="decision-filters-grid" style={filtersGrid}>
          <InputField icon={<Search size={16} />} placeholder="البحث بالموضوع أو الملف" value={searchTerm} onChange={setSearchTerm} />
          <SelectField
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: 'كل الحالات' },
              { value: 'active', label: statusColors.active.label },
              { value: 'inactive', label: statusColors.inactive.label },
            ]}
          />
          <button onClick={clearFilters} style={ghostButton}><Filter size={16} /> مسح</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
          <div style={{ color: '#b0b0c0' }}>النتائج: {filteredDecisions.length}</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Toggle active={viewMode === 'grid'} onClick={() => setViewMode('grid')} icon={<LayoutGrid size={16} />} label="بطاقات" />
            <Toggle active={viewMode === 'table'} onClick={() => setViewMode('table')} icon={<Table2 size={16} />} label="جدول" />
          </div>
        </div>
      </div>

      {filteredDecisions.length === 0 ? (
        <div style={emptyState}>لا توجد مقررات.</div>
      ) : viewMode === 'grid' ? (
        <div style={gridStyle}>
          {filteredDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              onView={() => openView(decision)}
              onEdit={() => openEdit(decision)}
              onPrint={() => openDecisionPrintWindow(decision)}
              onDelete={() => deleteDecision(decision)}
            />
          ))}
        </div>
      ) : (
        <div style={tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '840px' }}>
            <thead>
              <tr style={{ background: 'rgba(105,192,226,0.12)' }}>
                <Th>المعرف</Th>
                <Th>الموضوع</Th>
                <Th>الملف</Th>
                <Th>الحالة</Th>
                <Th>تاريخ الإنشاء</Th>
                <Th>الإجراءات</Th>
              </tr>
            </thead>
            <tbody>
              {filteredDecisions.map((decision) => {
                const status = statusColors[(decision.statut || '').toLowerCase()] || statusColors.inactive;
                return (
                  <tr key={decision.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <Td>{decision.id}</Td>
                    <Td>{decision.subject?.sujet || decision.sujetNom || '-'}</Td>
                    <Td>{decision.fichierName || '-'}</Td>
                    <Td><StatusBadge status={status} /></Td>
                    <Td>{formatDateDDMMYYYY(decision.dateCreation || decision.dateUpload)}</Td>
                    <Td>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <ActionButton icon={<Eye size={14} />} label="عرض" onClick={() => openView(decision)} />
                        <ActionButton icon={<Edit2 size={14} />} label="تعديل" onClick={() => openEdit(decision)} />
                        <ActionButton icon={<Printer size={14} />} label="طباعة" onClick={() => openDecisionPrintWindow(decision)} />
                        <ActionButton icon={<Trash2 size={14} />} label="حذف" onClick={() => deleteDecision(decision)} danger />
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DecisionForm isOpen={showForm} decision={activeDecision} onClose={() => setShowForm(false)} onSaved={refresh} />
      <DecisionViewer
        isOpen={showViewer}
        decision={activeDecision}
        onClose={() => {
          setShowViewer(false);
          setActiveDecision(null);
        }}
        onEdit={() => {
          setShowViewer(false);
          setShowForm(true);
        }}
      />

      <style>{`
        @media (max-width: 900px) {
          .decision-stats-grid,
          .decision-filters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

function StatCard({ title, value, icon }) {
  return (
    <div style={statCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#b0b0c0', fontSize: '12px' }}>{title}</div>
          <div style={{ marginTop: '8px', fontSize: '28px', fontWeight: 800 }}>{value}</div>
        </div>
        <div style={statIcon}>{icon}</div>
      </div>
    </div>
  );
}

function DecisionCard({ decision, onView, onEdit, onPrint, onDelete }) {
  const status = statusColors[(decision.statut || '').toLowerCase()] || statusColors.inactive;

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
        <div>
          <div style={numeroBadge}>#{decision.id}</div>
          <h3 style={{ margin: '0 0 8px', fontSize: '20px', lineHeight: 1.6 }}>{decision.fichierName || '-'}</h3>
          <div style={{ color: '#b0b0c0', fontSize: '13px' }}>{decision.subject?.sujet || decision.sujetNom || '-'}</div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginTop: '16px' }}>
        <MiniStat label="تاريخ الإنشاء" value={formatDateDDMMYYYY(decision.dateCreation || decision.dateUpload)} />
        <MiniStat label="File" value={decision.fichierName || '-'} />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
        <ActionButton icon={<Eye size={14} />} label="عرض" onClick={onView} />
        <ActionButton icon={<Edit2 size={14} />} label="تعديل" onClick={onEdit} />
        <ActionButton icon={<Printer size={14} />} label="طباعة" onClick={onPrint} />
        <ActionButton icon={<Trash2 size={14} />} label="حذف" onClick={onDelete} danger />
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={miniStatStyle}>
      <div style={{ color: '#b0b0c0', fontSize: '12px' }}>{label}</div>
      <div style={{ marginTop: '6px', fontWeight: 800, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span style={{ padding: '8px 12px', borderRadius: '999px', background: status.bg, color: status.color, border: `1px solid ${status.color}44`, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {status.label}
    </span>
  );
}

function ActionButton({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: danger ? 'rgba(239,68,68,0.14)' : 'rgba(105,192,226,0.16)',
        color: danger ? '#fca5a5' : '#dff7ff',
        border: `1px solid ${danger ? 'rgba(239,68,68,0.24)' : 'rgba(105,192,226,0.28)'}`,
        borderRadius: '12px',
        padding: '8px 12px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'Tajawal, sans-serif',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function Toggle({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{ ...toggleStyle, background: active ? 'linear-gradient(135deg, #69c0e2 0%, #327e9e 100%)' : 'rgba(255,255,255,0.06)' }}>
      {icon}
      {label}
    </button>
  );
}

function InputField({ icon, placeholder, value, onChange, type = 'text' }) {
  return (
    <div style={{ position: 'relative' }}>
      {icon && <div style={inputIcon}>{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputStyle, padding: icon ? '0 42px 0 14px' : '0 14px' }}
      />
    </div>
  );
}

function SelectField({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      {options.map((option) => (
        <option key={`${option.value}-${option.label}`} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

function Th({ children }) { return <th style={{ padding: '14px 16px', textAlign: 'right', color: '#69c0e2', fontSize: '13px' }}>{children}</th>; }
function Td({ children }) { return <td style={{ padding: '14px 16px', textAlign: 'right', verticalAlign: 'top' }}>{children}</td>; }

const topCard = { background: 'linear-gradient(135deg, rgba(105,192,226,0.18) 0%, rgba(50,126,158,0.14) 100%)', border: '1px solid rgba(105,192,226,0.22)', borderRadius: '22px', padding: '18px', marginBottom: '18px', backdropFilter: 'blur(20px)' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px', marginTop: '18px' };
const filtersCard = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '20px', padding: '16px', marginBottom: '18px', backdropFilter: 'blur(20px)' };
const filtersGrid = { display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '12px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' };
const tableWrap = { overflowX: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '20px', backdropFilter: 'blur(20px)' };
const emptyState = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '20px', padding: '42px 20px', textAlign: 'center', color: '#b0b0c0' };
const cardStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '20px', padding: '16px', backdropFilter: 'blur(20px)', boxShadow: '0 18px 48px rgba(0,0,0,0.2)' };
const statCard = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '18px', padding: '14px', minHeight: '92px' };
const statIcon = { width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(105,192,226,0.18)', border: '1px solid rgba(105,192,226,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#69c0e2' };
const miniStatStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '10px' };
const inputStyle = { width: '100%', height: '48px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '14px', padding: '0 14px', color: '#fff', outline: 'none', fontFamily: 'Tajawal, sans-serif' };
const inputIcon = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#69c0e2' };
const toggleStyle = { color: '#fff', border: '1px solid rgba(105,192,226,0.18)', borderRadius: '14px', padding: '10px 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Tajawal, sans-serif' };
const primaryButton = { background: 'linear-gradient(135deg, #69c0e2 0%, #327e9e 100%)', color: '#fff', border: 'none', padding: '12px 18px', borderRadius: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontFamily: 'Tajawal, sans-serif' };
const ghostButton = { border: '1px solid rgba(105,192,226,0.18)', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '14px', padding: '0 14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', height: '48px', justifyContent: 'center', fontFamily: 'Tajawal, sans-serif' };
const numeroBadge = { display: 'inline-flex', padding: '6px 10px', borderRadius: '999px', background: 'rgba(105,192,226,0.18)', border: '1px solid rgba(105,192,226,0.28)', color: '#dff7ff', marginBottom: '10px', fontWeight: 800 };

export default DecisionManagement;
