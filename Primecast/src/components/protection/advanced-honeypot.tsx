"use client";

import { useState, useEffect } from 'react';

interface HoneypotState {
  isTriggered: boolean;
  triggeredFields: string[];
}

export function AdvancedHoneypot({ onTrapTriggered }: { onTrapTriggered: (fields: string[]) => void }) {
  const [trapValues, setTrapValues] = useState({
    website: '',
    company: '',
    phone2: '',
    email2: '',
    address: '',
    city: '',
    country: '',
    zipcode: '',
    fax: '',
    comments: '',
    newsletter: false,
    terms: false
  });

  const [honeypotState, setHoneypotState] = useState<HoneypotState>({
    isTriggered: false,
    triggeredFields: []
  });

  useEffect(() => {
    // Check if any honeypot field is filled
    const triggeredFields = Object.entries(trapValues)
      .filter(([key, value]) => {
        if (typeof value === 'boolean') return value === true;
        return String(value).length > 0;
      })
      .map(([key]) => key);

    if (triggeredFields.length > 0 && !honeypotState.isTriggered) {
      setHoneypotState({
        isTriggered: true,
        triggeredFields
      });
      onTrapTriggered(triggeredFields);
    }
  }, [trapValues, honeypotState.isTriggered, onTrapTriggered]);

  const handleChange = (field: string, value: string | boolean) => {
    setTrapValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {/* CSS-only invisible fields */}
      <style jsx>{`
        .honeypot-field {
          position: absolute !important;
          left: -9999px !important;
          opacity: 0 !important;
          pointer-events: none !important;
          tab-index: -1 !important;
        }
        
        .honeypot-visible {
          position: absolute !important;
          top: -9999px !important;
          left: -9999px !important;
          visibility: hidden !important;
          display: none !important;
        }
      `}</style>

      {/* Multiple honeypot fields with different hiding techniques */}
      
      {/* Technique 1: CSS positioning */}
      <div className="honeypot-field">
        <label htmlFor="website">Website URL (leave empty)</label>
        <input
          id="website"
          type="url"
          name="website"
          placeholder="https://yourwebsite.com"
          value={trapValues.website}
          onChange={(e) => handleChange('website', e.target.value)}
          tabIndex={-1}
          autoComplete="nope"
        />
      </div>

      {/* Technique 2: Invisible but accessible to screen readers */}
      <div style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="company">Company Name</label>
        <input
          id="company"
          type="text"
          name="company"
          placeholder="Your company"
          value={trapValues.company}
          onChange={(e) => handleChange('company', e.target.value)}
          tabIndex={-1}
          autoComplete="organization"
        />
      </div>

      {/* Technique 3: Zero opacity */}
      <div style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}>
        <input
          type="tel"
          name="phone2"
          placeholder="Secondary phone number"
          value={trapValues.phone2}
          onChange={(e) => handleChange('phone2', e.target.value)}
          tabIndex={-1}
          autoComplete="tel"
        />
      </div>

      {/* Technique 4: Display none with timing */}
      <div style={{ display: 'none' }}>
        <input
          type="email"
          name="email2"
          placeholder="Backup email address"
          value={trapValues.email2}
          onChange={(e) => handleChange('email2', e.target.value)}
          tabIndex={-1}
          autoComplete="email"
        />
      </div>

      {/* Technique 5: Hidden attribute */}
      <div hidden>
        <input
          type="text"
          name="address"
          placeholder="Street address"
          value={trapValues.address}
          onChange={(e) => handleChange('address', e.target.value)}
          tabIndex={-1}
          autoComplete="street-address"
        />
      </div>

      {/* Technique 6: Height and width zero */}
      <div style={{ height: 0, width: 0, overflow: 'hidden' }}>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={trapValues.city}
          onChange={(e) => handleChange('city', e.target.value)}
          tabIndex={-1}
          autoComplete="address-level2"
        />
      </div>

      {/* Technique 7: Visibility hidden */}
      <div style={{ visibility: 'hidden', position: 'absolute' }}>
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={trapValues.country}
          onChange={(e) => handleChange('country', e.target.value)}
          tabIndex={-1}
          autoComplete="country-name"
        />
      </div>

      {/* Technique 8: Transparent color */}
      <div style={{ color: 'transparent', background: 'transparent', position: 'absolute', left: '-9999px' }}>
        <input
          type="text"
          name="zipcode"
          placeholder="ZIP/Postal Code"
          value={trapValues.zipcode}
          onChange={(e) => handleChange('zipcode', e.target.value)}
          tabIndex={-1}
          autoComplete="postal-code"
          style={{ color: 'transparent', background: 'transparent', border: 'none' }}
        />
      </div>

      {/* Technique 9: Fake required field that looks real but is hidden */}
      <div className="honeypot-visible">
        <label htmlFor="fax">Fax Number *</label>
        <input
          id="fax"
          type="tel"
          name="fax"
          placeholder="Required: Enter your fax number"
          value={trapValues.fax}
          onChange={(e) => handleChange('fax', e.target.value)}
          tabIndex={-1}
          required
        />
      </div>

      {/* Technique 10: Text area for longer form bots */}
      <div style={{ position: 'absolute', top: '-9999px' }}>
        <label htmlFor="comments">Additional Comments</label>
        <textarea
          id="comments"
          name="comments"
          placeholder="Any additional information..."
          value={trapValues.comments}
          onChange={(e) => handleChange('comments', e.target.value)}
          tabIndex={-1}
          rows={3}
        />
      </div>

      {/* Technique 11: Checkbox traps */}
      <div style={{ display: 'none' }}>
        <label>
          <input
            type="checkbox"
            name="newsletter"
            checked={trapValues.newsletter}
            onChange={(e) => handleChange('newsletter', e.target.checked)}
            tabIndex={-1}
          />
          Subscribe to newsletter
        </label>
      </div>

      <div className="honeypot-field">
        <label>
          <input
            type="checkbox"
            name="terms"
            checked={trapValues.terms}
            onChange={(e) => handleChange('terms', e.target.checked)}
            tabIndex={-1}
          />
          I agree to terms and conditions
        </label>
      </div>

      {/* Time-based honeypot - field that appears after delay */}
      <TimeBasedHoneypot onFilled={(value) => handleChange('delayed_field', value)} />
    </>
  );
}

function TimeBasedHoneypot({ onFilled }: { onFilled: (value: string) => void }) {
  const [showField, setShowField] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    // Show field after 10 seconds - real users won't see it, bots might fill it
    const timer = setTimeout(() => {
      setShowField(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (value.length > 0) {
      onFilled(value);
    }
  }, [value, onFilled]);

  if (!showField) return null;

  return (
    <div style={{ position: 'absolute', left: '-9999px' }}>
      <input
        type="text"
        name="delayed_verification"
        placeholder="Verification code"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        tabIndex={-1}
      />
    </div>
  );
}

// CSS injection honeypot
export function CSSHoneypot({ onTriggered }: { onTriggered: () => void }) {
  useEffect(() => {
    // Create a CSS rule that only affects bots
    const style = document.createElement('style');
    style.textContent = `
      .css-honeypot {
        display: none !important;
        position: absolute !important;
        left: -10000px !important;
      }
      
      /* This selector targets automation tools */
      input[autocomplete="new-password"]:not([type="password"]) {
        position: absolute !important;
        left: -10000px !important;
      }
    `;
    document.head.appendChild(style);

    // Create a hidden element that bots might interact with
    const honeypotDiv = document.createElement('div');
    honeypotDiv.className = 'css-honeypot';
    honeypotDiv.innerHTML = `
      <input type="text" name="trap" autocomplete="new-password" />
      <button type="button">Click me</button>
    `;
    
    // Monitor for interactions
    const input = honeypotDiv.querySelector('input');
    const button = honeypotDiv.querySelector('button');
    
    const handleInteraction = () => {
      onTriggered();
    };

    if (input) {
      input.addEventListener('focus', handleInteraction);
      input.addEventListener('input', handleInteraction);
    }
    
    if (button) {
      button.addEventListener('click', handleInteraction);
    }

    document.body.appendChild(honeypotDiv);

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(honeypotDiv);
    };
  }, [onTriggered]);

  return null;
}
