const SUPABASE_URL = 'https://sovoczjkonqgufsuthuh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4Vcdx2YcTOJdj89NI_ip8A_uKSzZcCt';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const tbody = document.getElementById('clientes');
const busca = document.getElementById('busca');
const statusEl = document.getElementById('status');
const mensagem = document.getElementById('mensagem');
const totalEl = document.getElementById('total');
const cidadesEl = document.getElementById('cidades');
const ultimoEl = document.getElementById('ultimo');
let clientes = [];

function esc(v) {
  return String(v ?? '').replace(/[&<>'"]/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
  }[c]));
}

function formatDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' :
    d.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit', year:'numeric'});
}

function showError(text) {
  mensagem.textContent = text;
  mensagem.hidden = false;
}

function hideError() {
  mensagem.hidden = true;
  mensagem.textContent = '';
}

function render(list) {
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty">Nenhum cliente encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(c => `
    <tr>
      <td>${esc(c.id)}</td>
      <td><strong>${esc(c.nome)}</strong></td>
      <td>${esc(c.email)}</td>
      <td>${esc(c.telefone) || '—'}</td>
      <td>${esc(c.cidade) || '—'}</td>
      <td>${formatDate(c.criado_em)}</td>
    </tr>
  `).join('');
}

function calcularResumo() {
  totalEl.textContent = clientes.length;
  cidadesEl.textContent = new Set(
    clientes.map(c => String(c.cidade || '').trim().toLowerCase()).filter(Boolean)
  ).size;
  ultimoEl.textContent = clientes.length ? formatDate(clientes[0].criado_em) : '—';
}

async function carregar() {
  hideError();
  statusEl.textContent = 'Consultando o Supabase...';
  tbody.innerHTML = '<tr><td colspan="6" class="empty">Carregando clientes...</td></tr>';

  try {
    const { data, error, status } = await db
      .from('cadastros')
      .select('id,nome,email,telefone,cidade,criado_em')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro Supabase:', error);
      statusEl.textContent = 'Erro ao consultar os clientes.';
      showError(
        `Não foi possível ler a tabela "cadastros". ` +
        `Código: ${status || error.code || 'desconhecido'} — ${error.message}`
      );
      tbody.innerHTML = '<tr><td colspan="6" class="empty">Verifique a Policy SELECT da tabela "cadastros".</td></tr>';
      return;
    }

    clientes = Array.isArray(data) ? data : [];
    calcularResumo();
    statusEl.textContent = `${clientes.length} cliente(s) encontrado(s)`;
    render(clientes);

    if (clientes.length === 0) {
      showError('A conexão funcionou, mas a consulta retornou 0 clientes. No SQL Editor, confirme com: SELECT * FROM cadastros;');
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = 'Falha de conexão.';
    showError(`Falha ao conectar ao Supabase: ${err.message || err}`);
    tbody.innerHTML = '<tr><td colspan="6" class="empty">Não foi possível conectar ao Supabase.</td></tr>';
  }
}

busca.addEventListener('input', () => {
  const q = busca.value.trim().toLowerCase();
  render(clientes.filter(c =>
    [c.nome, c.email, c.telefone, c.cidade]
      .some(v => String(v || '').toLowerCase().includes(q))
  ));
});

document.getElementById('btn-atualizar').addEventListener('click', carregar);
carregar();
