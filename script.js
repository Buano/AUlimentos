// =========================
// SUPABASE
// =========================

const SUPABASE_URL = 'https://sovoczjkonqgufsuthuh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_4Vcdx2YcTOJdj89NI_ip8A_uKSzZcCt';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// =========================
// CARRINHO
// =========================

let carrinho = JSON.parse(
    localStorage.getItem("aulimentos-carrinho")
) || [];

function verProdutos() {
    document.getElementById("produtos").scrollIntoView({ behavior: "smooth" });
}

function adicionarCarrinho(nome, preco) {
    const produtoExistente = carrinho.find(produto => produto.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({ nome, preco, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarCarrinho();
    abrirCarrinho();
}

function aumentarQuantidade(index) {
    carrinho[index].quantidade++;
    salvarCarrinho();
    atualizarCarrinho();
}

function diminuirQuantidade(index) {
    carrinho[index].quantidade--;
    if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}

function removerProduto(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("lista-carrinho");
    const contador = document.getElementById("contador-carrinho");
    const totalElemento = document.getElementById("total-carrinho");

    lista.innerHTML = "";

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio. 🐾</p>';
        contador.textContent = "0";
        totalElemento.textContent = "R$ 0,00";
        return;
    }

    let total = 0;
    let quantidadeTotal = 0;

    carrinho.forEach((produto, index) => {
        total += produto.preco * produto.quantidade;
        quantidadeTotal += produto.quantidade;

        const item = document.createElement("div");
        item.className = "item-carrinho";
        item.innerHTML = `
            <div class="item-info">
                <h3>🐾 ${produto.nome}</h3>
                <span class="item-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="quantidade">
                <button onclick="diminuirQuantidade(${index})">−</button>
                <span>${produto.quantidade}</span>
                <button onclick="aumentarQuantidade(${index})">+</button>
                <button class="remover" onclick="removerProduto(${index})">🗑️ Remover</button>
            </div>`;
        lista.appendChild(item);
    });

    contador.textContent = quantidadeTotal;
    totalElemento.textContent = "R$ " + total.toFixed(2).replace('.', ',');
}

function abrirCarrinho() {
    document.getElementById("carrinho").classList.add("aberto");
}

function fecharCarrinho() {
    document.getElementById("carrinho").classList.remove("aberto");
}

function salvarCarrinho() {
    localStorage.setItem("aulimentos-carrinho", JSON.stringify(carrinho));
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! 🐾");
        return;
    }

    alert("Compra realizada com sucesso! 💜🐾");
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharCarrinho();
}

// =========================
// CONTA DO CLIENTE
// =========================

function abrirConta() {
    document.getElementById('conta-modal').classList.add('aberto');
    atualizarTelaConta();
}

function fecharConta() {
    document.getElementById('conta-modal').classList.remove('aberto');
}

function mostrarCadastro() {
    document.getElementById('conta-login-view').style.display = 'block';
    document.getElementById('conta-entrar-view').style.display = 'none';
    document.getElementById('conta-logada-view').style.display = 'none';
}

function mostrarLogin() {
    document.getElementById('conta-login-view').style.display = 'none';
    document.getElementById('conta-entrar-view').style.display = 'block';
    document.getElementById('conta-logada-view').style.display = 'none';
}

function mostrarContaLogada(user) {
    document.getElementById('conta-login-view').style.display = 'none';
    document.getElementById('conta-entrar-view').style.display = 'none';
    document.getElementById('conta-logada-view').style.display = 'block';
    document.getElementById('email-conta').textContent = user.email || '';
    document.getElementById('boas-vindas-conta').textContent =
        `Olá! Sua conta está conectada. 🐾`;
}

async function atualizarTelaConta() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const botao = document.getElementById('botao-conta');

    if (user) {
        mostrarContaLogada(user);
        botao.textContent = '👤 Minha conta';
    } else {
        mostrarCadastro();
        botao.textContent = '👤 Criar conta';
    }
}

function limparErrosCadastro() {
    document.querySelectorAll('.erro-campo').forEach(el => el.textContent = '');
    document.querySelectorAll('#form-cadastro input').forEach(input => input.classList.remove('campo-invalido'));
}

function mostrarErroCampo(id, mensagem) {
    const input = document.getElementById(id);
    const erro = document.getElementById(`erro-${id}`);
    if (input) input.classList.add('campo-invalido');
    if (erro) erro.textContent = mensagem;
}

function validarCadastro() {
    limparErrosCadastro();
    const nome = document.getElementById('cad-nome').value.trim();
    const email = document.getElementById('cad-email').value.trim().toLowerCase();
    const telefone = document.getElementById('cad-telefone').value.trim();
    const cidade = document.getElementById('cad-cidade').value.trim();
    const senha = document.getElementById('cad-senha').value;
    const confirmacao = document.getElementById('cad-senha-confirmacao').value;
    let valido = true;

    if (!nome) {
        mostrarErroCampo('cad-nome', 'Informe seu nome completo.'); valido = false;
    } else if (nome.length < 3 || !/[A-Za-zÀ-ÿ]/.test(nome)) {
        mostrarErroCampo('cad-nome', 'Digite um nome válido, com pelo menos 3 caracteres.'); valido = false;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email) {
        mostrarErroCampo('cad-email', 'Informe seu e-mail.'); valido = false;
    } else if (!emailValido.test(email)) {
        mostrarErroCampo('cad-email', 'Digite um e-mail válido. Ex.: nome@gmail.com'); valido = false;
    }

    if (telefone) {
        const numeros = telefone.replace(/\D/g, '');
        if (numeros.length < 10 || numeros.length > 11) {
            mostrarErroCampo('cad-telefone', 'Telefone inválido. Use 10 ou 11 números. Ex.: (11) 99999-9999'); valido = false;
        }
    }

    if (!cidade) {
        mostrarErroCampo('cad-cidade', 'Informe sua cidade.'); valido = false;
    } else if (cidade.length < 2) {
        mostrarErroCampo('cad-cidade', 'Digite o nome da cidade corretamente.'); valido = false;
    }

    if (!senha) {
        mostrarErroCampo('cad-senha', 'Crie uma senha.'); valido = false;
    } else if (senha.length < 6) {
        mostrarErroCampo('cad-senha', 'A senha precisa ter pelo menos 6 caracteres.'); valido = false;
    }

    if (!confirmacao) {
        mostrarErroCampo('cad-senha-confirmacao', 'Confirme sua senha.'); valido = false;
    } else if (senha !== confirmacao) {
        mostrarErroCampo('cad-senha-confirmacao', 'As senhas não são iguais. Digite a mesma senha nos dois campos.'); valido = false;
    }

    return valido;
}

function mensagemErroCadastro(mensagem) {
    const texto = String(mensagem || '').toLowerCase();

    if (texto.includes('invalid api key') || texto.includes('apikey') || texto.includes('api key')) {
        return 'Erro de configuração: a chave pública do Supabase não foi aceita.';
    }
    if (texto.includes('email address') && texto.includes('invalid')) {
        return 'E-mail inválido. Use um formato como nome@gmail.com.';
    }
    if (texto.includes('rate limit') || texto.includes('too many requests') || texto.includes('429')) {
        return 'O Supabase bloqueou temporariamente novas tentativas por excesso de cadastros. Aguarde alguns minutos e tente novamente apenas uma vez.';
    }
    if (texto.includes('password') && (texto.includes('weak') || texto.includes('short') || texto.includes('at least'))) {
        return 'Senha inválida. Use pelo menos 6 caracteres.';
    }
    if (texto.includes('failed to fetch') || texto.includes('network') || texto.includes('fetch')) {
        return 'Não foi possível conectar ao Supabase. Verifique sua internet e tente novamente.';
    }
    if (texto.includes('database') || texto.includes('relation') || texto.includes('permission') || texto.includes('row-level')) {
        return 'A conta foi criada, mas houve um problema ao salvar seus dados no banco. Verifique as regras da tabela cadastros no Supabase.';
    }
    return `Não foi possível criar a conta: ${mensagem || 'erro desconhecido'}.`;
}

let cadastroEmAndamento = false;
let ultimoCadastro = 0;

async function cadastrarConta(event) {
    event.preventDefault();

    // Evita duplo clique, duplo submit ou envio repetido do mesmo formulário.
    if (cadastroEmAndamento) return;
    if (Date.now() - ultimoCadastro < 15000) {
        const mensagem = document.getElementById('mensagem-conta');
        mensagem.className = 'mensagem-conta erro';
        mensagem.textContent = 'Aguarde alguns segundos antes de tentar novamente.';
        return;
    }

    const mensagem = document.getElementById('mensagem-conta');
    const botao = document.querySelector('#form-cadastro button[type="submit"]');
    mensagem.className = 'mensagem-conta';
    mensagem.textContent = '';

    if (!validarCadastro()) {
        mensagem.classList.add('erro');
        mensagem.textContent = 'Confira os campos destacados em vermelho e corrija as informações indicadas.';
        const primeiroErro = document.querySelector('.campo-invalido');
        if (primeiroErro) primeiroErro.focus();
        return;
    }

    const nome = document.getElementById('cad-nome').value.trim();
    const email = document.getElementById('cad-email').value.trim().toLowerCase();
    const telefone = document.getElementById('cad-telefone').value.trim();
    const cidade = document.getElementById('cad-cidade').value.trim();
    const senha = document.getElementById('cad-senha').value;

    cadastroEmAndamento = true;
    ultimoCadastro = Date.now();
    if (botao) {
        botao.disabled = true;
        botao.textContent = 'Criando conta...';
    }

    mensagem.textContent = 'Criando sua conta...';
    mensagem.classList.add('info');

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password: senha,
            options: { data: { nome, telefone, cidade } }
        });

        if (error) {
            console.error('Erro do Supabase Auth:', error);
            mensagem.className = 'mensagem-conta erro';
            mensagem.textContent = mensagemErroCadastro(error.message);
            return;
        }

        // O Supabase pode não retornar erro quando o e-mail já existe.
        // Nessa situação, identities vem vazio e não devemos inserir outro cadastro.
        if (!data || !data.user) {
            mensagem.className = 'mensagem-conta erro';
            mensagem.textContent = 'O Supabase não retornou um usuário. Tente novamente mais tarde.';
            return;
        }

        if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
            mensagem.className = 'mensagem-conta erro';
            mensagem.textContent = 'Este e-mail já possui uma conta. Clique em “Entrar” para acessar sua conta.';
            return;
        }

        // Salva os dados do cliente na tabela cadastros.
        const { error: cadastroError } = await supabaseClient
            .from('cadastros')
            .insert([{ nome, email, telefone: telefone || null, cidade: cidade || null }]);

        if (cadastroError) {
            console.error('Erro ao salvar na tabela cadastros:', cadastroError);
            const erroBanco = cadastroError.message || '';
            const erroBancoLower = erroBanco.toLowerCase();

            if (erroBancoLower.includes('duplicate') || erroBancoLower.includes('unique')) {
                // O Auth já foi criado; não tratamos isso como falha da conta.
                mensagem.className = 'mensagem-conta sucesso';
                mensagem.textContent = 'Sua conta já foi criada! Os dados desse e-mail já estavam cadastrados no banco.';
            } else {
                mensagem.className = 'mensagem-conta erro';
                mensagem.textContent = 'A conta foi criada no Auth, mas os dados não foram salvos na tabela cadastros. Verifique as Policies de INSERT do Supabase.';
                return;
            }
        } else {
            mensagem.className = 'mensagem-conta sucesso';
            if (data.session) {
                mensagem.textContent = 'Conta criada com sucesso! Você já está conectado. 🐾';
            } else {
                mensagem.textContent = 'Conta criada com sucesso! Confira seu e-mail para confirmar a conta e depois clique em “Entrar”. 📧';
            }
        }

        document.getElementById('form-cadastro').reset();
        limparErrosCadastro();

        if (data.session) {
            setTimeout(() => atualizarTelaConta(), 900);
        }
    } catch (erro) {
        console.error('Erro inesperado no cadastro:', erro);
        mensagem.className = 'mensagem-conta erro';
        mensagem.textContent = mensagemErroCadastro(erro?.message || erro);
    } finally {
        cadastroEmAndamento = false;
        if (botao) {
            botao.disabled = false;
            botao.textContent = 'Criar minha conta';
        }
    }
}

async function entrarConta(event) {
    event.preventDefault();

    const mensagem = document.getElementById('mensagem-login');
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const senha = document.getElementById('login-senha').value;

    mensagem.textContent = 'Entrando...';

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        mensagem.textContent = traduzirErroAuth(error.message);
        return;
    }

    mensagem.textContent = 'Login realizado com sucesso!';
    document.getElementById('form-login').reset();
    mostrarContaLogada(data.user);
    document.getElementById('botao-conta').textContent = '👤 Minha conta';
}

async function sairDaConta() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert('Não foi possível sair da conta. Tente novamente.');
        return;
    }

    mostrarCadastro();
    document.getElementById('botao-conta').textContent = '👤 Criar conta';
}

function traduzirErroAuth(mensagem) {
    const texto = mensagem.toLowerCase();

    if (texto.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
    if (texto.includes('user already registered')) return 'Este e-mail já possui uma conta.';
    if (texto.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.';
    if (texto.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';

    return 'Não foi possível concluir a operação. Verifique os dados e tente novamente.';
}

supabaseClient.auth.onAuthStateChange((_event, session) => {
    const botao = document.getElementById('botao-conta');
    if (!botao) return;
    botao.textContent = session ? '👤 Minha conta' : '👤 Criar conta';
});

// =========================
// INICIAR
// =========================

atualizarCarrinho();
atualizarTelaConta();

// =========================
// SERVICE WORKER
// =========================

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("Service Worker registrado com sucesso!"))
        .catch((erro) => console.error("Erro ao registrar o Service Worker:", erro));
}
