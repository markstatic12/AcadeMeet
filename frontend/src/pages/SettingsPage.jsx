import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

// Toast utilities (scoped to Settings)
function useLocalToast(){
  const [toast, setToast] = useState(null);
  const showToast = (message, type='info')=>{
    setToast({ message, type });
    setTimeout(()=>setToast(null), 2000);
  };
  const Toast = ()=> toast ? (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg border text-sm ${toast.type==='success' ? 'bg-green-600/20 border-green-500 text-green-200' : toast.type==='error' ? 'bg-red-600/20 border-red-500 text-red-200' : 'bg-gray-700/80 border-gray-600 text-gray-100'}`}>{toast.message}</div>
  ) : null;
  return { showToast, Toast };
}

const SettingsPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('profile'); // 'profile' | 'password'
  const [saving, setSaving] = useState(false);
  const { showToast, Toast } = useLocalToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // form state bound to current student
  const [form, setForm] = useState({
    name: '',
    school: '',
    program: '',
    studentId: '',
    phone: '',
    bio: '',
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [student, setStudent] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('student');
    if (stored) {
      const s = JSON.parse(stored);
      setStudent(s);
      setForm({
        name: s.name || '',
        school: s.school || '',
        program: s.program || 'BSIT',
        studentId: s.studentId || '',
        phone: s.phone || '',
        bio: s.bio || '',
      });
      setProfilePreview(s.profilePic || null);
      setCoverPreview(s.coverImage || null);
    }
  }, []);

  return (
    <DashboardLayout>
      <Toast />
      <div className="flex gap-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-300 hover:text-white mb-4"
        >
          <BackIcon className="w-7 h-7 p-1.5 rounded-full bg-indigo-600/80" />
          <span className="text-lg">Back</span>
        </button>
      </div>

      <div className="flex gap-10">
        {/* Left rail */}
        <div className="w-72">
          <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
          <div className="space-y-3">
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${active==='profile' ? 'bg-gray-800/70 border-indigo-600 text-white' : 'bg-[#1f1f1f] border-gray-800 text-gray-300 hover:bg-gray-800/60'}`}
              onClick={() => setActive('profile')}
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-sm">Public Profile</span>
            </button>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${active==='password' ? 'bg-gray-800/70 border-indigo-600 text-white' : 'bg-[#1f1f1f] border-gray-800 text-gray-300 hover:bg-gray-800/60'}`}
              onClick={() => setActive('password')}
            >
              <ShieldIcon className="w-4 h-4" />
              <span className="text-sm">Password Reset</span>
            </button>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-800 text-red-400 hover:bg-gray-800/60"
            >
              <LogoutIcon className="w-4 h-4" />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </div>

        {/* Right content card */}
        <div className="flex-1">
          <div className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6">
            {active === 'profile' ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Public Profile</h3>
                </div>
                <div className="h-px w-full bg-gray-700 my-4" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">University</label>
                      <input value={form.school} onChange={e=>setForm({...form,school:e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Your university" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Program</label>
                      <input value={form.program} onChange={e=>setForm({...form,program:e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Your program" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">School ID</label>
                      <input value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="ID number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                      <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Add a phone number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea rows="4" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Tell us something about yourself..." />
                    </div>
                    <div className="flex gap-3">
                      <button disabled={saving} onClick={()=>{ if(student){ setForm({
                        name: student.name||'', school: student.school||'', program: student.program||'BSIT', studentId: student.studentId||'', phone: student.phone||'', bio: student.bio||''
                      }); setProfilePreview(student.profilePic||null); setCoverPreview(student.coverImage||null);} }} className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">Cancel</button>
                      <button disabled={saving} onClick={async()=>{
                        if(!student) return;
                        try {
                          setSaving(true);
                          const res = await fetch(`http://localhost:8080/api/users/${student.id}`,{
                            method:'PUT', headers:{'Content-Type':'application/json'},
                            body: JSON.stringify({ name: form.name, school: form.school, studentId: form.studentId, bio: form.bio, profilePic: profilePreview || null, coverImage: coverPreview || null })
                          });
                          const data = await res.json();
                          // merge in localStorage; also persist images locally
                          const next = { ...(student||{}), name: form.name, school: form.school, studentId: form.studentId, bio: form.bio, program: form.program, phone: form.phone, profilePic: profilePreview||null, coverImage: coverPreview||null };
                          localStorage.setItem('student', JSON.stringify(next));
                          setStudent(next);
                          showToast(data?.message || 'Profile updated','success');
                        } catch(e){
                          console.error(e);
                          showToast('Failed to update profile','error');
                        } finally{ setSaving(false); }
                      }} className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">{saving? 'Saving...' : 'Save Changes'}</button>
                    </div>
                  </div>

                  {/* Avatar + cover */}
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-300 font-semibold mb-2">Profile Picture</p>
                      {/* Outer wrapper to avoid clipping the edit button by the rounded circle */}
                      <div className="relative w-56 h-56">
                        <div className="absolute inset-4 bg-[#262626] rounded-full overflow-hidden flex items-center justify-center">
                          {profilePreview ? (
                            <img src={profilePreview} alt="profile" className="w-full h-full object-cover" />
                          ) : (
                            <UserCircle className="w-24 h-24 text-gray-500" />
                          )}
                        </div>
                        <button
                          onClick={()=>profileInputRef.current?.click()}
                          title="Edit profile picture"
                          className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg ring-1 ring-white/20 flex items-center justify-center"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{
                          const file = e.target.files?.[0];
                          if(file){ const reader = new FileReader(); reader.onload = ev => setProfilePreview(ev.target.result); reader.readAsDataURL(file);} }} />
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-300 font-semibold mb-2">Cover Image</p>
                      <div className="relative w-full max-w-md h-28 rounded-xl overflow-hidden bg-[#262626]">
                        {coverPreview ? (
                          <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-300" />
                        )}
                        <button onClick={()=>coverInputRef.current?.click()} className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-indigo-600 text-white text-xs flex items-center gap-1">
                          <PencilIcon className="w-3 h-3" /> Edit
                        </button>
                        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{
                          const file = e.target.files?.[0];
                          if(file){ const reader = new FileReader(); reader.onload = ev => setCoverPreview(ev.target.result); reader.readAsDataURL(file);} }} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Password reset
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Password Reset</h3>
                </div>
                <div className="h-px w-full bg-gray-700 my-4" />
                <PasswordResetCard showToast={showToast} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-600/20 text-red-300 flex items-center justify-center border border-red-500/30">
                <WarningIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Log out?</h4>
                <p className="text-sm text-gray-400 mt-1">You’ll need to sign in again to access your account.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setShowLogoutConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-colors">Cancel</button>
              <button onClick={()=>{ localStorage.removeItem('student'); setShowLogoutConfirm(false); navigate('/login'); }} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-colors">Log Out</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

const BackIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const UserCircle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const PencilIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export default SettingsPage;

// Logout Confirmation Modal (inline in component scope)
// Note: this modal markup is rendered inside SettingsPage's JSX below via showLogoutConfirm

const WarningIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86l-8.48 14.7A2 2 0 003.53 22h16.94a2 2 0 001.72-3.44l-8.48-14.7a2 2 0 00-3.42 0z"/>
  </svg>
);

// Sub-component: Password Reset
function PasswordResetCard({ showToast }){
  const [curr, setCurr] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(()=>{
    const s = localStorage.getItem('student');
    if(s){ setStudent(JSON.parse(s)); }
  },[]);

  const reset = ()=>{ setCurr(''); setNext(''); setConfirm(''); };

  const submit = async()=>{
    if(next.length < 6){ showToast('New password must be at least 6 characters','error'); return; }
    if(next !== confirm){ showToast('New password and confirmation do not match','error'); return; }
    if(!student){ showToast('No user','error'); return; }
    try{
      setBusy(true);
      const res = await fetch('http://localhost:8080/api/auth/change-password',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ userId: student.id, currentPassword: curr, newPassword: next })
      });
      const data = await res.json();
      if(!res.ok){
        showToast(data?.error || 'Failed to change password','error');
      }else{
        showToast('Password updated','success');
        reset();
      }
    }catch(e){
      console.error(e);
      showToast('Failed to change password','error');
    }finally{ setBusy(false); }
  };

  return (
    <div className="max-w-2xl">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Current Password <span className="text-red-400">*</span></label>
          <input type="password" value={curr} onChange={e=>setCurr(e.target.value)} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">New Password <span className="text-red-400">*</span></label>
          <input type="password" value={next} onChange={e=>setNext(e.target.value)} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter your new password" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password <span className="text-red-400">*</span></label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Re-enter your new password" />
        </div>
        <div className="flex gap-3 pt-2">
          <button disabled={busy} onClick={reset} className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">Cancel</button>
          <button disabled={busy} onClick={submit} className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">{busy? 'Saving…' : 'Done'}</button>
        </div>
      </div>
    </div>
  );
}
