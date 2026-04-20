import React from 'react';

function ApiKeyModal({ modalKeyInput, setModalKeyInput, onSave }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Enter Gemini API Key</h3>
        <input
          type="password"
          value={modalKeyInput}
          onChange={(e) => setModalKeyInput(e.target.value)}
          placeholder="Paste API Key here"
          className="modal-input"
        />
        <div className="modal-actions">
          <button onClick={() => onSave(modalKeyInput)} className="modal-btn save">Save</button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
