document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(loginForm));
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        window.location = 'dashboard.html';
      } else {
        alert('Falha no login');
      }
    });
  }

  const resumo = document.getElementById('resumo');
  if (resumo) {
    fetch('/dashboard').then(r => r.json()).then(d => {
      resumo.textContent = `Vendas: R$ ${d.totalVendas} - Pedidos: ${d.pedidos}`;
    });
  }

  const modoBtn = document.getElementById('modoAtendimento');
  if (modoBtn) {
    let usarIA = true;
    modoBtn.addEventListener('click', () => {
      usarIA = !usarIA;
      modoBtn.textContent = usarIA ? 'Alternar IA/Humano' : 'Alternar Humano/IA';
    });

    const chat = document.getElementById('chat');
    chat.addEventListener('click', async () => {
      if (usarIA) {
        const resp = await fetch('/ia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pergunta: 'Ola' })
        });
        const data = await resp.json();
        alert(data.resposta);
      } else {
        alert('Um atendente irá responder.');
      }
    });
  }
});
