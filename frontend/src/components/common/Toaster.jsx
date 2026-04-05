import React, { useEffect, useState } from 'react';
import '../../styles/admindashboard.css';

let dispatchToast = (message, type = 'info', timeout = 3500) => {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type, timeout } }));
};

export const showToast = (message, type = 'info', timeout = 3500) => dispatchToast(message, type, timeout);

const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      const detail = e.detail || {};
      setToasts((t) => [...t, { id, ...detail }]);
      setTimeout(() => {
        setToasts((t) => t.filter(x => x.id !== id));
      }, detail.timeout || 3500);
    };
    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, []);

  return (
    <div className="toaster-root" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          <div className="toast-message">{t.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
