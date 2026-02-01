/* Minimal front-end "auth" and form handling for demo purposes.
   This uses localStorage to store users (email, name, passwordHash).
   WARNING: This is only for prototyping/demo. Do NOT use localStorage/this approach for production auth.
*/

const authKey = 'neuronexus_users';
const sessionKey = 'neuronexus_session';

// Simple escaping for UI output
function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

// tiny hash (NOT secure) to avoid storing plain text here for demo
function simpleHash(str){
  let h = 0;
  for (let i=0;i<str.length;i++){
    h = Math.imul(31,h) + str.charCodeAt(i) | 0;
  }
  return String(h >>> 0);
}

const storage = {
  getUsers(){
    try {
      return JSON.parse(localStorage.getItem(authKey) || '[]');
    } catch(e){ return [];}
  },
  saveUsers(users){
    localStorage.setItem(authKey, JSON.stringify(users));
  },
  setSession(user){
    localStorage.setItem(sessionKey, JSON.stringify(user));
  },
  clearSession(){
    localStorage.removeItem(sessionKey);
  },
  getSession(){
    try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch(e){ return null; }
  }
};

// auth helpers
const auth = {
  register({name,email,password}){
    const users = storage.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return {ok:false, error:'Email already registered.'};
    }
    const user = {name, email, passwordHash: simpleHash(password)};
    users.push(user);
    storage.saveUsers(users);
    storage.setSession({name:user.name,email:user.email});
    return {ok:true, user};
  },
  login({email,password,remember}){
    const users = storage.getUsers();
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.passwordHash === simpleHash(password));
    if (!u) return {ok:false, error:'Invalid email or password.'};
    storage.setSession({name:u.name,email:u.email});
    return {ok:true,user:{name:u.name,email:u.email}};
  },
  logout(){
    storage.clearSession();
  },
  isAuthenticated(){
    return !!storage.getSession();
  },
  getCurrentUser(){
    return storage.getSession();
  }
};

// Form helpers
function showError(id,msg){
  const el = document.getElementById(id);
  if (el) el.textContent = msg || '';
}

function wireTogglePasswordButtons(){
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const p = btn.closest('.form-row').querySelector('input[type="password"], input[type="text"]');
      if (!p) return;
      if (p.type === 'password') {
        p.type = 'text';
        btn.textContent = 'Hide';
      } else {
        p.type = 'password';
        btn.textContent = 'Show';
      }
      p.focus();
    });
  });
}

// Signup handling
const signupForm = document.getElementById('signupForm');
if (signupForm){
  wireTogglePasswordButtons();
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showError('nameError','');
    showError('emailError','');
    showError('passwordError','');
    showError('confirmPasswordError','');
    showError('signupFormError','');

    const name = signupForm.fullName.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value;
    const confirm = signupForm.confirmPassword.value;

    let valid = true;
    if (!name){ showError('nameError','Please enter your name.'); valid=false; }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)){ showError('emailError','Please enter a valid email.'); valid=false; }
    if (password.length < 8 || !/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)){
      showError('passwordError','Password must be at least 8 characters and include letters and numbers.');
      valid=false;
    }
    if (password !== confirm){ showError('confirmPasswordError','Passwords do not match.'); valid=false; }

    if (!valid) return;

    const res = auth.register({name,email,password});
    if (!res.ok){
      showError('signupFormError', res.error || 'Registration failed.');
      return;
    }
    // Redirect to dashboard after signup
    window.location.href = 'dashboard.html';
  });
}

// Login handling
const loginForm = document.getElementById('loginForm');
if (loginForm){
  wireTogglePasswordButtons();
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showError('loginEmailError','');
    showError('loginPasswordError','');
    showError('loginFormError','');

    const email = loginForm.loginEmail.value.trim();
    const password = loginForm.loginPassword.value;
    const remember = loginForm.rememberMe.checked;

    let valid = true;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)){ showError('loginEmailError','Please enter a valid email.'); valid=false; }
    if (!password){ showError('loginPasswordError','Please enter your password.'); valid=false; }
    if (!valid) return;

    const res = auth.login({email,password,remember});
    if (!res.ok){
      showError('loginFormError', res.error || 'Login failed.');
      return;
    }
    window.location.href = 'dashboard.html';
  });
}

// Small helper available in browser context
window.auth = auth;
window.escapeHtml = escapeHtml;