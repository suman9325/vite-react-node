import React from 'react';
import './confirmDialog.scss';

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onClose,
  confirmText,
  cancelText
}) => {

  return (
    <div className="modal-backdrop">
      <div className="modal" tabindex="-1" role="dialog" style={{ display: open ? 'block' : 'none' }}>
        <div className="modal-dialog mt-12">
          <div className="modal-content">
            <div className="modal-header bg-red">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>{cancelText}</button>
              <button type="button" className="btn btn-primary" onClick={onConfirm}>{confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog;