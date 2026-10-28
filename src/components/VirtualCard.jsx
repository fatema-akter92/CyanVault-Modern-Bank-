import React, { useState } from 'react';
import { 
  CreditCard, 
  Wifi, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCw, 
  ShieldCheck 
} from 'lucide-react';

export const VirtualCard = ({ account = {}, balance = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const cardNumber = '4291 •••• •••• 9014';
  const fullCardNumber = '4291 8849 7019 9014';

  const handleCopyCard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullCardNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="virtual-card-wrapper">
      <div className="virtual-card-header">
        <div className="card-header-label">
          <CreditCard size={17} className="text-cyan" />
          <span>Virtual Platinum Debit</span>
        </div>
        <button
          type="button"
          className="flip-prompt-btn"
          onClick={() => setIsFlipped(!isFlipped)}
          title="Click to flip card"
        >
          <RotateCw size={14} />
          <span>{isFlipped ? 'Show Front' : 'Flip for CVV'}</span>
        </button>
      </div>

      {/* 3D Flip Container */}
      <div 
        className={`card-3d-scene ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-3d-flipper">
          {/* Card Front */}
          <div className="card-face card-face-front">
            {/* Holographic Sheen & Glass highlight */}
            <div className="card-hologram-overlay"></div>

            <div className="card-top-row">
              <div className="card-brand-group">
                <span className="card-brand-name">Cyan<span>Vault</span></span>
                <span className="card-tier-pill">PLATINUM</span>
              </div>
              <div className="card-signals">
                <Wifi size={20} className="contactless-icon" />
              </div>
            </div>

            {/* Smart EMV Chip */}
            <div className="card-chip-container">
              <div className="emv-chip">
                <div className="chip-lines line-1"></div>
                <div className="chip-lines line-2"></div>
                <div className="chip-lines line-3"></div>
              </div>
              <span className="debit-label">DEBIT</span>
            </div>

            {/* Card Number */}
            <div className="card-number-row font-mono">
              <span>{cardNumber}</span>
              <button 
                type="button" 
                className="copy-card-btn" 
                onClick={handleCopyCard}
                title="Copy full 16-digit number"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            {/* Bottom Row: Holder & Expiry */}
            <div className="card-bottom-row">
              <div className="card-holder-info">
                <span className="card-field-label">CARDHOLDER</span>
                <span className="card-field-value">{account.holderName || 'Evelyn Reed'}</span>
              </div>

              <div className="card-expiry-info">
                <span className="card-field-label">EXPIRES</span>
                <span className="card-field-value font-mono">08/30</span>
              </div>

              <div className="card-visa-logo">
                <div className="visa-circle circle-cyan"></div>
                <div className="visa-circle circle-white"></div>
              </div>
            </div>
          </div>

          {/* Card Back */}
          <div className="card-face card-face-back">
            <div className="magnetic-strip"></div>
            
            <div className="card-back-body">
              <div className="signature-cvv-row">
                <div className="signature-panel">
                  <span className="signature-text font-mono">Authorized Signature</span>
                </div>
                <div className="cvv-box">
                  <span className="cvv-label">CVV</span>
                  <span className="cvv-value font-mono">842</span>
                </div>
              </div>

              <div className="card-back-disclaimer">
                This digital simulated card is issued by {account.bankName || 'CyanTrust Bank'}. Use of this card is governed by the Digital Vault Agreement. Not a physical credit facility.
              </div>

              <div className="card-back-footer">
                <span className="font-mono text-xs">24/7 Concierge: +1 (800) 555-CYAN</span>
                <ShieldCheck size={18} className="text-cyan" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
