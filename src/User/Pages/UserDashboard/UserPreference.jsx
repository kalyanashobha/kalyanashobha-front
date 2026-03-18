import React, { useState, useEffect } from 'react';
import Navbar from "../../Components/Navbar.jsx"; 
import toast, { Toaster } from 'react-hot-toast';
import './UserPreference.css';

const UserPreference = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [masterCommunities, setMasterCommunities] = useState([]); 
  const [availableSubCommunities, setAvailableSubCommunities] = useState([]);

  const [dynamicOptions, setDynamicOptions] = useState({
    Moonsign: [], Star: [], Pada: [], MotherTongue: [], Complexion: [],
    Education: [], Designation: [], MaritalStatus: [], State: [], City: [], Diet: [], Income: [], Country: []
  });

  const [preferences, setPreferences] = useState({
    minAge: '', maxAge: '', minHeight: '', maxHeight: '', 
    education: '', community: '', subCommunity: '', occupation: '', maritalStatus: '',
    country: '', state: '', city: '', diet: '', motherTongue: '', star: '', pada: '', complexion: ''
  });

  const API_BASE_URL = "https://kalyanashobha-back.vercel.app/api/user";
  const PUBLIC_API_BASE = "https://kalyanashobha-back.vercel.app/api/public";

  useEffect(() => {
    const initData = async () => {
      await fetchCommunities();
      await fetchDynamicOptions();
      await fetchExistingPreferences();
      setFetching(false);
    };
    initData();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await fetch(`${PUBLIC_API_BASE}/get-all-communities`);
      const data = await response.json();
      if (data.success) setMasterCommunities(data.data);
    } catch (err) { console.error("Failed to load communities"); }
  };

  const fetchDynamicOptions = async () => {
    const categories = ['Star', 'Pada', 'MotherTongue', 'Complexion', 'Education', 'Designation', 'MaritalStatus', 'State', 'City', 'Diet', 'Country'];
    const newOptions = { ...dynamicOptions };
    
    await Promise.all(categories.map(async (category) => {
      try {
        const res = await fetch(`${PUBLIC_API_BASE}/master-data/${category}`);
        const json = await res.json();
        if (json.success && json.data.length > 0) newOptions[category] = json.data.map(item => item.name);
      } catch (err) {}
    }));
    setDynamicOptions(newOptions);
  };

  const fetchExistingPreferences = async () => {
    const token = localStorage.getItem('token');
    if(!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/preference`, { headers: { 'Authorization': token } });
      const json = await res.json();
      
      if (json.success && json.data) {
        const p = json.data;
        setPreferences({
          minAge: p.minAge || '', maxAge: p.maxAge || '', minHeight: p.minHeight || '', maxHeight: p.maxHeight || '', 
          education: p.education || '', community: p.community || '', subCommunity: p.subCommunity || '', 
          occupation: p.occupation || '', maritalStatus: p.maritalStatus || '', country: p.country || '', 
          state: p.state || '', city: p.city || '', diet: p.diet || '', motherTongue: p.motherTongue || '', 
          star: p.star || '', pada: p.pada || '', complexion: p.complexion || ''
        });

        if (p.community) {
            const commRes = await fetch(`${PUBLIC_API_BASE}/get-all-communities`);
            const commJson = await commRes.json();
            const found = commJson.data.find(c => c.name === p.community);
            if (found) setAvailableSubCommunities(found.subCommunities || []);
        }
      }
    } catch (err) { console.error("Failed to fetch preferences"); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['minAge', 'maxAge', 'minHeight', 'maxHeight'].includes(name)) {
      if (value !== '' && !/^\d+$/.test(value)) return;
    }

    if (name === 'community') {
      const found = masterCommunities.find(c => c.name === value);
      setAvailableSubCommunities(found ? found.subCommunities || [] : []);
      setPreferences(prev => ({ ...prev, community: value, subCommunity: '' }));
    } else {
      setPreferences(prev => ({ ...prev, [name]: value }));
    }
  };

  const savePreferences = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`${API_BASE_URL}/preference`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(preferences)
        });
        
        const data = await res.json();
        if (data.success) {
            toast.success("Partner preferences saved successfully!");
        } else {
            toast.error(data.message || "Failed to save preferences.");
        }
    } catch (err) {
        toast.error("Network error while saving.");
    } finally {
        setLoading(false);
    }
  };

  const renderSkeleton = () => (
    <div className="settings-grid">
      {Array.from({ length: 14 }).map((_, idx) => (
        <div key={idx} className="input-group">
          <div className="loader-skeleton loader-skeleton__label"></div>
          <div className="loader-skeleton loader-skeleton__input"></div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Navbar />
      <Toaster toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />

      <main id="settings-main" className="settings-page">
        <div className="settings-container settings-header">
          <h2 className="settings-title">Partner Preferences</h2>
          <p className="settings-subtitle">Set your requirements to automatically filter matches on your dashboard.</p>
        </div>

        <div className="settings-container">
          <div className="settings-card">
            {fetching ? (
                renderSkeleton()
            ) : (
                <form id="settings-form" onSubmit={savePreferences}>
                    <div className="settings-grid fade-in-anim">
                        
                        <div className="input-group">
                            <label className="input-label">Age Range (Years)</label>
                            <div className="input-flex-group">
                              <input 
                                type="text" 
                                inputMode="numeric"
                                name="minAge" 
                                placeholder="Min" 
                                className="input-field" 
                                value={preferences.minAge} 
                                onChange={handleChange} 
                                autoComplete="nope"
                                spellCheck="false"
                                data-lpignore="true" 
                                data-bwignore="true"
                                data-form-type="other"
                              />
                              <span className="input-range-divider">-</span>
                              <input 
                                type="text" 
                                inputMode="numeric"
                                name="maxAge" 
                                placeholder="Max" 
                                className="input-field" 
                                value={preferences.maxAge} 
                                onChange={handleChange} 
                                autoComplete="nope" 
                                spellCheck="false"
                                data-lpignore="true" 
                                data-bwignore="true"
                                data-form-type="other"
                              />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Height Range (Cm)</label>
                            <div className="input-flex-group">
                              <input 
                                type="text" 
                                inputMode="numeric"
                                name="minHeight" 
                                placeholder="Min" 
                                className="input-field" 
                                value={preferences.minHeight} 
                                onChange={handleChange} 
                                autoComplete="nope" 
                                spellCheck="false"
                                data-lpignore="true" 
                                data-bwignore="true"
                                data-form-type="other"
                              />
                              <span className="input-range-divider">-</span>
                              <input 
                                type="text" 
                                inputMode="numeric"
                                name="maxHeight" 
                                placeholder="Max" 
                                className="input-field" 
                                value={preferences.maxHeight} 
                                onChange={handleChange} 
                                autoComplete="nope" 
                                spellCheck="false"
                                data-lpignore="true" 
                                data-bwignore="true"
                                data-form-type="other"
                              />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label className="input-label">Marital Status</label>
                            <select name="maritalStatus" className="input-field" value={preferences.maritalStatus} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.MaritalStatus.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Education</label>
                            <select name="education" className="input-field" value={preferences.education} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.Education.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Community</label>
                            <select name="community" className="input-field" value={preferences.community} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {masterCommunities.map((c, idx) => (<option key={idx} value={c.name}>{c.name}</option>))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Sub-Community / Caste</label>
                            <select name="subCommunity" className="input-field" value={preferences.subCommunity} onChange={handleChange} disabled={!preferences.community}>
                            <option value="">Doesn't Matter</option>
                            {availableSubCommunities.map((sub, idx) => { 
                                const val = typeof sub === 'string' ? sub : sub.name; 
                                return <option key={idx} value={val}>{val}</option>; 
                            })}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Occupation</label>
                            <select name="occupation" className="input-field" value={preferences.occupation} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.Designation.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Country</label>
                            <select name="country" className="input-field" value={preferences.country} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.Country.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">State</label>
                            <select name="state" className="input-field" value={preferences.state} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.State.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">City</label>
                            <select name="city" className="input-field" value={preferences.city} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.City.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Mother Tongue</label>
                            <select name="motherTongue" className="input-field" value={preferences.motherTongue} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.MotherTongue.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Star (Nakshatram)</label>
                            <select name="star" className="input-field" value={preferences.star} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.Star.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Pada</label>
                            <select name="pada" className="input-field" value={preferences.pada} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.Pada.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Diet</label>
                            <select name="diet" className="input-field" value={preferences.diet} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.Diet.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Complexion</label>
                            <select name="complexion" className="input-field" value={preferences.complexion} onChange={handleChange}>
                            <option value="">Doesn't Matter</option>
                            {dynamicOptions.Complexion.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                    </div>

                    <div className="input-actions">
                        <button type="submit" className="action-btn action-btn--primary" disabled={loading}>
                            {loading ? <span className="action-btn-spinner"></span> : null}
                            {loading ? "Saving Preferences..." : "Save Preferences"}
                        </button>
                    </div>
                </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default UserPreference;
