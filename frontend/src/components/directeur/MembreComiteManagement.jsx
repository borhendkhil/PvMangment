import React, { useEffect, useState } from 'react';
import axios from '../../lib/httpClient';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import Toaster from '../common/Toaster';
import '../../styles/membrecomite.css';
import API_CONFIG from '../../config/api';

const MembreComiteManagement = ({ idComite, onClose, embedded = false, onMembersChange }) => {
  const [membres, setMembres] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [toaster, setToaster] = useState({ show: false, message: '', type: 'success' });

  const [formData, setFormData] = useState({
    employeId: '',
    roleComiteId: '',
  });

  useEffect(() => {
    if (idComite) {
      fetchMembres();
      fetchEmployes();
      fetchRoles();
    }
  }, [idComite]);

  const showToast = (message, type = 'success') => {
    setToaster({ show: true, message, type });
    setTimeout(() => setToaster({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchMembres = async () => {
    try {
      const response = await axios.get(API_CONFIG.COMITE_MEMBERS);
      setMembres((response.data || []).filter((member) => String(member.comiteId) === String(idComite)));
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      showToast('Erreur lors du chargement des membres', 'error');
      setMembres([]);
    }
  };

  const fetchEmployes = async () => {
    try {
      const response = await axios.get(API_CONFIG.ADMIN.EMPLOYES);
      setEmployes(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
      showToast('Erreur lors du chargement des employés', 'error');
      setEmployes([]);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(API_CONFIG.COMITE_ROLES);
      setRoles(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
      showToast('Erreur lors du chargement des rôles', 'error');
      setRoles([]);
    }
  };

  const handleAddMembre = async (e) => {
    e.preventDefault();

    if (!formData.employeId) {
      showToast('Veuillez sélectionner un employé', 'error');
      return;
    }

    try {
      setLoading(true);
      await axios.post(API_CONFIG.COMITE_MEMBERS, {
        comiteId: parseInt(idComite),
        employeId: parseInt(formData.employeId),
        roleComiteId: formData.roleComiteId ? parseInt(formData.roleComiteId) : null,
      });

      showToast('Membre ajouté avec succès', 'success');
      resetForm();
      await fetchMembres();
      onMembersChange?.();
    } catch (error) {
      console.error("Erreur lors de l'ajout du membre:", error);
      const errorMsg = error.response?.data?.message || "Erreur lors de l'ajout du membre";
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMembre = async (employeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_CONFIG.COMITE_MEMBERS}/${idComite}/${employeId}`);
      showToast('Membre supprimé avec succès', 'success');
      await fetchMembres();
      onMembersChange?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMembre = async (membre) => {
    try {
      setLoading(true);
      await axios.patch(`${API_CONFIG.COMITE_MEMBERS}/${idComite}/${membre.employeId}`, {
        roleComiteId: membre.roleComiteId ? parseInt(membre.roleComiteId) : (membre.roleComite?.id ? parseInt(membre.roleComite.id) : null),
      });

      showToast('Membre modifié avec succès', 'success');
      setEditingKey(null);
      await fetchMembres();
      onMembersChange?.();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de la modification';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ employeId: '', roleComiteId: '' });
    setShowForm(false);
    setEditingKey(null);
  };

  const getEmployeName = (employeId) => {
    const emp = employes.find((item) => String(item.id) === String(employeId));
    return emp ? `${emp.prenom} ${emp.nom}` : employeId;
  };

  return (
    <div
      className={`membre-comite-container${embedded ? ' membre-comite-embedded' : ''}`}
      dir="rtl"
      style={embedded ? embeddedWrapperStyle : undefined}
    >
      {toaster.show && (
        <Toaster
          message={toaster.message}
          type={toaster.type}
          onClose={() => setToaster({ ...toaster, show: false })}
        />
      )}

      {!embedded && (
        <div className="membre-header">
          <h2>Gestion des Membres du Comité</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
      )}

      <div className="membre-content" style={embedded ? embeddedContentStyle : undefined}>
        <div className="add-membre-section">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
              disabled={loading}
            >
              <Plus size={18} /> Ajouter un Membre
            </button>
          ) : (
            <form onSubmit={handleAddMembre} className="membre-form">
              <div className="form-group">
                <label>Employé *</label>
                <select
                  value={formData.employeId}
                  onChange={(e) => setFormData({ ...formData, employeId: e.target.value })}
                  disabled={loading}
                  required
                >
                  <option value="">-- Sélectionner un employé --</option>
                  {employes.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.prenom} {emp.nom} ({emp.matricule || 'sans matricule'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rôle dans le Comité</label>
                <select
                  value={formData.roleComiteId}
                  onChange={(e) => setFormData({ ...formData, roleComiteId: e.target.value })}
                  disabled={loading}
                >
                  <option value="">-- Sélectionner un rôle --</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.labelAr || role.label_ar || role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  <Check size={18} /> Ajouter
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  <X size={18} /> Annuler
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="membres-list-section">
          <h3>Membres du comité ({membres.length})</h3>

          {membres.length === 0 ? (
            <p className="empty-message">Aucun membre dans ce comité</p>
          ) : (
            <div className="membres-table">
              <table>
                <thead>
                  <tr>
                    <th>Employé</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {membres.map((membre) => (
                    <tr key={`${membre.comiteId}-${membre.employeId}`} className={editingKey === membre.employeId ? 'editing' : ''}>
                      <td>
                        <strong>{getEmployeName(membre.employeId)}</strong>
                        <br />
                        <small>{membre.employeId}</small>
                      </td>
                      <td>
                        {editingKey === membre.employeId ? (
                          <select
                            value={membre.roleComiteId || ''}
                            onChange={(e) => {
                              setMembres((current) =>
                                current.map((item) =>
                                  item.employeId === membre.employeId
                                  ? { ...item, roleComiteId: e.target.value }
                                    : item,
                                ),
                              );
                            }}
                            className="edit-input"
                          >
                            <option value="">Sélectionner</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.labelAr || role.label_ar || role.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          roles.find((role) => String(role.id) === String(membre.roleComiteId || membre.roleComite?.id))?.labelAr ||
                          roles.find((role) => String(role.id) === String(membre.roleComiteId || membre.roleComite?.id))?.label_ar ||
                          roles.find((role) => String(role.id) === String(membre.roleComiteId || membre.roleComite?.id))?.name ||
                          '-'
                        )}
                      </td>
                      <td className="actions-cell">
                        {editingKey === membre.employeId ? (
                          <>
                            <button
                              onClick={() => handleEditMembre(membre)}
                              className="btn-action btn-save"
                              disabled={loading}
                              title="Enregistrer"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="btn-action btn-cancel"
                              disabled={loading}
                              title="Annuler"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingKey(membre.employeId)}
                              className="btn-action btn-edit"
                              disabled={loading}
                              title="Modifier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMembre(membre.employeId)}
                              className="btn-action btn-delete"
                              disabled={loading}
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembreComiteManagement;

const embeddedWrapperStyle = {
  position: 'static',
  inset: 'auto',
  background: 'transparent',
  display: 'block',
  justifyContent: 'initial',
  alignItems: 'initial',
  zIndex: 'auto',
  overflow: 'visible',
  padding: 0,
};

const embeddedContentStyle = {
  maxWidth: '100%',
  width: '100%',
  maxHeight: 'none',
  boxShadow: 'none',
};
