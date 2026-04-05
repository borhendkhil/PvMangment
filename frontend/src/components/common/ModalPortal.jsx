import React from 'react'
import ReactDOM from 'react-dom'

const ModalPortal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose} dir="rtl">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  )
}

export default ModalPortal
