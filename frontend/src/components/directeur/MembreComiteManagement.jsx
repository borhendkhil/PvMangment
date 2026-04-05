import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react';
import Toaster from '../common/Toaster';
import '../../styles/membrecomite.css';

const MembreComiteManagement = ({ idComite, onClose }) => {
    const API_BASE = 'http://localhost:9091/api';
    
    // État du utilisateur - récupéré du localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const idDirec = currentUser.direction?.idDirec || parseInt(localStorage.getItem('userDirectionId'));
    
    // États
    const [membres, setMembres] = useState([]);
    const [employes, setEmployes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toaster, setToaster] = useState({ show: false, message: '', type: 'success' });
    
    const [formData, setFormData] = useState({
        matMembre: '',
        grade: '',
        roleComite: ''
    });

    // Charger les membres du comité et employés disponibles
    useEffect(() => {
        if (idComite && idDirec) {
            fetchMembres();
            fetchEmployesDisponibles();
        }
    }, [idComite, idDirec]);

    const showToast = (message, type = 'success') => {
        setToaster({ show: true, message, type });
        setTimeout(() => setToaster({ show: false, message: '', type: 'success' }), 3000);
    };

    const fetchMembres = async () => {
        try {
            const response = await axios.get(`${API_BASE}/membres-comite/comite/${idComite}`);
            setMembres(response.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des membres:', error);
            showToast('Erreur lors du chargement des membres', 'error');
        }
    };

    const fetchEmployesDisponibles = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE}/membres-comite/comite/${idComite}/employes-disponibles/${idDirec}`
            );
            setEmployes(response.data || []);
        } catch (error) {
            console.error('Erreur lors du chargement des employés disponibles:', error);
            showToast('Erreur lors du chargement des employés', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMembre = async (e) => {
        e.preventDefault();
        
        if (!formData.matMembre) {
            showToast('Veuillez sélectionner un employé', 'error');
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${API_BASE}/membres-comite/comite/${idComite}`, {
                matMembre: formData.matMembre,
                grade: formData.grade || '',
                roleComite: formData.roleComite || '',
                idDirec: idDirec
            });

            showToast('Membre ajouté avec succès', 'success');
            resetForm();
            await fetchMembres();
            await fetchEmployesDisponibles();
        } catch (error) {
            console.error('Erreur lors de l\'ajout du membre:', error);
            const errorMsg = error.response?.data?.error || 'Erreur lors de l\'ajout du membre';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMembre = async (matMembre) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre?')) {
            return;
        }

        try {
            setLoading(true);
            await axios.delete(
                `${API_BASE}/membres-comite/comite/${idComite}/membre/${matMembre}`
            );

            showToast('Membre supprimé avec succès', 'success');
            await fetchMembres();
            await fetchEmployesDisponibles();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            const errorMsg = error.response?.data?.error || 'Erreur lors de la suppression';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditMembre = async (membre) => {
        if (!membre.grade || !membre.roleComite) {
            showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        try {
            setLoading(true);
            await axios.put(
                `${API_BASE}/membres-comite/comite/${idComite}/membre/${membre.matMembre}`,
                {
                    grade: membre.grade,
                    roleComite: membre.roleComite
                }
            );

            showToast('Membre modifié avec succès', 'success');
            setEditingId(null);
            await fetchMembres();
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            const errorMsg = error.response?.data?.error || 'Erreur lors de la modification';
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateMembreField = (matMembre, field, value) => {
        setMembres(membres.map(m =>
            m.matMembre === matMembre ? { ...m, [field]: value } : m
        ));
    };

    const resetForm = () => {
        setFormData({ matMembre: '', grade: '', roleComite: '' });
        setShowForm(false);
        setEditingId(null);
    };

    const getEmployeName = (matMembre) => {
        const emp = employes.find(e => e.matMembre === matMembre);
        return emp ? `${emp.prenom} ${emp.nom}` : matMembre;
    };

    // Filtrer les membres de la direction actuelle
    const membresDirec = membres.filter(m => m.idDirec === idDirec);

    return (
        <div className="membre-comite-container" dir="rtl">
            {toaster.show && (
                <Toaster 
                    message={toaster.message} 
                    type={toaster.type}
                    onClose={() => setToaster({ ...toaster, show: false })}
                />
            )}

            <div className="membre-header">
                <h2>Gestion des Membres du Comité</h2>
                <button onClick={onClose} className="btn-close">✕</button>
            </div>

            <div className="membre-content">
                {/* Section Ajouter un Membre */}
                <div className="add-membre-section">
                    {!showForm ? (
                        <button 
                            onClick={() => setShowForm(true)}
                            className="btn btn-primary"
                            disabled={loading || employes.length === 0}
                        >
                            <Plus size={18} /> Ajouter un Membre
                        </button>
                    ) : (
                        <form onSubmit={handleAddMembre} className="membre-form">
                            <div className="form-group">
                                <label>Employé *</label>
                                <select
                                    value={formData.matMembre}
                                    onChange={(e) => setFormData({...formData, matMembre: e.target.value})}
                                    disabled={loading}
                                    required
                                >
                                    <option value="">-- Sélectionner un employé --</option>
                                    {employes.map(emp => (
                                        <option key={emp.matMembre} value={emp.matMembre}>
                                            {emp.prenom} {emp.nom} ({emp.matMembre})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Grade</label>
                                <input
                                    type="text"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                    placeholder="Ex: Directeur, Chef de service"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Rôle dans le Comité</label>
                                <select
                                    value={formData.roleComite}
                                    onChange={(e) => setFormData({...formData, roleComite: e.target.value})}
                                    disabled={loading}
                                >
                                    <option value="">-- Sélectionner un rôle --</option>
                                    <option value="Président">Président</option>
                                    <option value="Vice-Président">Vice-Président</option>
                                    <option value="Secrétaire">Secrétaire</option>
                                    <option value="Rapporteur">Rapporteur</option>
                                    <option value="Membre">Membre</option>
                                </select>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="btn btn-success"
                                    disabled={loading}
                                >
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

                {/* Section Liste des Membres */}
                <div className="membres-list-section">
                    <h3>Membres de votre Direction ({membresDirec.length})</h3>
                    
                    {membresDirec.length === 0 ? (
                        <p className="empty-message">Aucun membre de votre direction dans ce comité</p>
                    ) : (
                        <div className="membres-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Employé</th>
                                        <th>Grade</th>
                                        <th>Rôle</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {membresDirec.map(membre => (
                                        <tr key={membre.matMembre} className={editingId === membre.matMembre ? 'editing' : ''}>
                                            <td>
                                                <strong>{membre.lib}</strong>
                                                <br />
                                                <small>{membre.matMembre}</small>
                                            </td>
                                            <td>
                                                {editingId === membre.matMembre ? (
                                                    <input
                                                        type="text"
                                                        value={membre.grade || ''}
                                                        onChange={(e) => updateMembreField(membre.matMembre, 'grade', e.target.value)}
                                                        className="edit-input"
                                                    />
                                                ) : (
                                                    membre.grade || '-'
                                                )}
                                            </td>
                                            <td>
                                                {editingId === membre.matMembre ? (
                                                    <select
                                                        value={membre.roleComite || ''}
                                                        onChange={(e) => updateMembreField(membre.matMembre, 'roleComite', e.target.value)}
                                                        className="edit-input"
                                                    >
                                                        <option value="">Sélectionner</option>
                                                        <option value="Président">Président</option>
                                                        <option value="Vice-Président">Vice-Président</option>
                                                        <option value="Secrétaire">Secrétaire</option>
                                                        <option value="Rapporteur">Rapporteur</option>
                                                        <option value="Membre">Membre</option>
                                                    </select>
                                                ) : (
                                                    membre.roleComite || '-'
                                                )}
                                            </td>
                                            <td className="actions-cell">
                                                {editingId === membre.matMembre ? (
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
                                                            onClick={() => setEditingId(null)}
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
                                                            onClick={() => setEditingId(membre.matMembre)}
                                                            className="btn-action btn-edit"
                                                            disabled={loading}
                                                            title="Modifier"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMembre(membre.matMembre)}
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

                {/* Afficher tous les membres si demandé */}
                {membres.length > membresDirec.length && (
                    <div className="all-membres-section">
                        <h4>Autres Membres du Comité ({membres.length - membresDirec.length})</h4>
                        <div className="autres-membres-list">
                            {membres.filter(m => m.idDirec !== idDirec).map(membre => (
                                <div key={membre.matMembre} className="autre-membre-card">
                                    <strong>{membre.lib}</strong>
                                    <div className="membre-info">
                                        <span>{membre.grade || '-'}</span> | 
                                        <span> {membre.roleComite || '-'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MembreComiteManagement;
