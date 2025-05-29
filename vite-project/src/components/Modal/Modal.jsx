import React from "react";
import "./Modal.css";
function Modal({ show, onClose , children, titulo }) {
  return (
    <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{titulo}</h4>
            <button type="button" className="btn-close" onClick={onClose}>
                
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
