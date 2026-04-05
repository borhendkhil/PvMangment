/**
 * Utilitaire de formatage des dates
 * Format: jj/mm/yyyy
 */

export const formatDateDDMMYYYY = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erreur formatage date:', error);
    return '-';
  }
};

export default formatDateDDMMYYYY;
