import React, { useState, useEffect } from 'react';
import { useCouponContext } from '../context/CouponContext';
import * as AutoDetectionService from '../services/AutoDetectionService';
import { AutoDetectionSettings as AutoDetectionSettingsType } from '../types';

interface AutoDetectionSettingsProps {
  onClose: () => void;
}

const AutoDetectionSettings: React.FC<AutoDetectionSettingsProps> = ({ onClose }) => {
  const { enableAutoDetection, isAutoDetectionEnabled } = useCouponContext();
  const [settings, setSettings] = useState<AutoDetectionSettingsType>({
    enabled: false,
    sensitivity: 'medium',
    blacklistedDomains: [],
    trustedDomains: []
  });
  const [newDomain, setNewDomain] = useState('');
  const [domainType, setDomainType] = useState<'trusted' | 'blacklisted'>('trusted');

  useEffect(() => {
    const currentSettings = AutoDetectionService.getAutoDetectionSettings();
    setSettings(currentSettings);
  }, []);

  const handleToggleAutoDetection = () => {
    const newEnabled = !settings.enabled;
    const newSettings = { ...settings, enabled: newEnabled };
    setSettings(newSettings);
    enableAutoDetection(newEnabled);
    AutoDetectionService.updateAutoDetectionSettings(newSettings);
  };

  const handleSensitivityChange = (sensitivity: 'low' | 'medium' | 'high') => {
    const newSettings = { ...settings, sensitivity };
    setSettings(newSettings);
    AutoDetectionService.updateAutoDetectionSettings(newSettings);
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    
    const domain = newDomain.trim().toLowerCase();
    const newSettings = { ...settings };
    
    if (domainType === 'trusted') {
      if (!newSettings.trustedDomains.includes(domain)) {
        newSettings.trustedDomains = [...newSettings.trustedDomains, domain];
      }
    } else {
      if (!newSettings.blacklistedDomains.includes(domain)) {
        newSettings.blacklistedDomains = [...newSettings.blacklistedDomains, domain];
      }
    }
    
    setSettings(newSettings);
    AutoDetectionService.updateAutoDetectionSettings(newSettings);
    setNewDomain('');
  };

  const handleRemoveDomain = (domain: string, type: 'trusted' | 'blacklisted') => {
    const newSettings = { ...settings };
    
    if (type === 'trusted') {
      newSettings.trustedDomains = newSettings.trustedDomains.filter(d => d !== domain);
    } else {
      newSettings.blacklistedDomains = newSettings.blacklistedDomains.filter(d => d !== domain);
    }
    
    setSettings(newSettings);
    AutoDetectionService.updateAutoDetectionSettings(newSettings);
  };

  const testAutoDetection = () => {
    const testUrls = [
      'https://amazon.com/deals',
      'https://walmart.com/special-offers',
      'https://target.com/promotions'
    ];
    
    testUrls.forEach(url => {
      const detected = AutoDetectionService.simulatePageScan(url);
      if (detected.length > 0) {
        console.log(`Detected coupons from ${url}:`, detected);
      }
    });
    
    alert('Auto-detection test completed. Check console for results.');
  };

  return (
    <div className="add-form-overlay">
      <div className="auto-detection-settings">
        <div className="settings-header">
          <h2>Auto-Detection Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="settings-content">
          <div className="setting-section">
            <div className="setting-item">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={handleToggleAutoDetection}
                />
                <span className="toggle-text">
                  Enable Automatic Coupon Detection
                </span>
              </label>
              <p className="setting-description">
                Automatically scan websites and apps for coupon codes while browsing
              </p>
            </div>
          </div>

          {settings.enabled && (
            <>
              <div className="setting-section">
                <h3>Detection Sensitivity</h3>
                <div className="sensitivity-options">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <label key={level} className="radio-label">
                      <input
                        type="radio"
                        name="sensitivity"
                        value={level}
                        checked={settings.sensitivity === level}
                        onChange={() => handleSensitivityChange(level)}
                      />
                      <span className="radio-text">
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="setting-description">
                  Higher sensitivity detects more coupons but may include false positives
                </p>
              </div>

              <div className="setting-section">
                <h3>Trusted Domains</h3>
                <div className="domain-list">
                  {settings.trustedDomains.map((domain) => (
                    <div key={domain} className="domain-item trusted">
                      <span>{domain}</span>
                      <button onClick={() => handleRemoveDomain(domain, 'trusted')}>
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="add-domain">
                  <select 
                    value={domainType} 
                    onChange={(e) => setDomainType(e.target.value as 'trusted' | 'blacklisted')}
                    className="domain-type-select"
                  >
                    <option value="trusted">Trusted</option>
                    <option value="blacklisted">Blacklisted</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter domain (e.g., amazon.com)"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                  />
                  <button onClick={handleAddDomain}>Add</button>
                </div>
              </div>

              {settings.blacklistedDomains.length > 0 && (
                <div className="setting-section">
                  <h3>Blacklisted Domains</h3>
                  <div className="domain-list">
                    {settings.blacklistedDomains.map((domain) => (
                      <div key={domain} className="domain-item blacklisted">
                        <span>{domain}</span>
                        <button onClick={() => handleRemoveDomain(domain, 'blacklisted')}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="setting-section">
                <button className="test-button" onClick={testAutoDetection}>
                  <i className="fas fa-play"></i>
                  Test Auto-Detection
                </button>
                <p className="setting-description">
                  Test the auto-detection system with sample websites
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoDetectionSettings;