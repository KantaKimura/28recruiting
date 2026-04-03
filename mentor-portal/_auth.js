(function () {
  const SESSION_KEY = 'mentor_auth_ok';

  if (sessionStorage.getItem(SESSION_KEY) === '1') return;

  // Build overlay
  const overlay = document.createElement('div');
  overlay.id = 'auth-overlay';
  overlay.innerHTML = `
    <style>
      #auth-overlay {
        position: fixed; inset: 0; z-index: 9999;
        background: #FAFAFA;
        display: flex; align-items: center; justify-content: center;
        font-family: 'Noto Sans JP', sans-serif;
      }
      #auth-box {
        background: #FFF;
        border: 1.5px solid #E8E8E8;
        border-radius: 16px;
        padding: 2.5rem 2rem;
        width: 320px;
        text-align: center;
        box-shadow: 0 4px 24px rgba(0,0,0,.06);
      }
      #auth-box .badge {
        display: inline-block;
        font-size: .7rem; font-weight: 700; letter-spacing: .2em;
        color: #F07800; border: 1.5px solid rgba(240,120,0,.4);
        padding: .3rem 1.2rem; border-radius: 100px; margin-bottom: 1.2rem;
      }
      #auth-box h2 { font-size: 1.1rem; font-weight: 900; margin-bottom: .4rem; }
      #auth-box p  { font-size: .85rem; color: #999; margin-bottom: 1.6rem; }
      #auth-input {
        width: 100%; padding: .75rem 1rem;
        border: 1.5px solid #E8E8E8; border-radius: 10px;
        font-size: 1rem; font-family: inherit;
        outline: none; margin-bottom: .8rem;
        transition: border-color .2s;
      }
      #auth-input:focus { border-color: #F07800; }
      #auth-btn {
        width: 100%; padding: .75rem;
        background: #F07800; color: #FFF;
        border: none; border-radius: 10px;
        font-size: .95rem; font-weight: 700; font-family: inherit;
        cursor: pointer; transition: opacity .2s;
      }
      #auth-btn:hover { opacity: .85; }
      #auth-error {
        font-size: .82rem; color: #E53935;
        margin-top: .6rem; min-height: 1.2em;
      }
    </style>
    <div id="auth-box">
      <span class="badge">MENTOR PORTAL</span>
      <h2>パスワードを入力</h2>
      <p>このページはメンター限定です</p>
      <input id="auth-input" type="password" placeholder="パスワード" autocomplete="current-password" />
      <button id="auth-btn">入室する</button>
      <div id="auth-error"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = document.getElementById('auth-input');
  const btn   = document.getElementById('auth-btn');
  const err   = document.getElementById('auth-error');

  input.focus();

  async function verify() {
    err.textContent = '';
    btn.disabled = true;
    btn.textContent = '確認中...';

    try {
      const res = await fetch('/api/mentor-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: input.value }),
      });
      const data = await res.json();

      if (data.ok) {
        sessionStorage.setItem(SESSION_KEY, '1');
        overlay.remove();
      } else {
        err.textContent = 'パスワードが違います';
        input.value = '';
        input.focus();
      }
    } catch (e) {
      err.textContent = '通信エラーが発生しました';
    } finally {
      btn.disabled = false;
      btn.textContent = '入室する';
    }
  }

  btn.addEventListener('click', verify);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') verify(); });
})();
