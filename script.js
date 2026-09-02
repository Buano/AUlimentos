// =========================
// CARRINHO
// =========================

// Recupera o carrinho salvo no navegador
let carrinho = JSON.parse(
    localStorage.getItem("aulimentos-carrinho")
) || [];


// =========================
// IR PARA PRODUTOS
// =========================

function verProdutos() {

    document
        .getElementById("produtos")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// =========================
// ADICIONAR PRODUTO
// =========================

function adicionarCarrinho(nome, preco) {

    const produtoExistente = carrinho.find(
        produto => produto.nome === nome
    );


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            nome: nome,

            preco: preco,

            quantidade: 1

        });

    }


    salvarCarrinho();

    atualizarCarrinho();

    abrirCarrinho();

}


// =========================
// AUMENTAR QUANTIDADE
// =========================

function aumentarQuantidade(index) {

    carrinho[index].quantidade++;

    salvarCarrinho();

    atualizarCarrinho();

}


// =========================
// DIMINUIR QUANTIDADE
// =========================

function diminuirQuantidade(index) {

    carrinho[index].quantidade--;


    if (carrinho[index].quantidade <= 0) {

        carrinho.splice(index, 1);

    }


    salvarCarrinho();

    atualizarCarrinho();

}


// =========================
// REMOVER PRODUTO
// =========================

function removerProduto(index) {

    carrinho.splice(index, 1);

    salvarCarrinho();

    atualizarCarrinho();

}


// =========================
// ATUALIZAR CARRINHO
// =========================

function atualizarCarrinho() {

    const lista =
        document.getElementById("lista-carrinho");

    const contador =
        document.getElementById("contador-carrinho");

    const totalElemento =
        document.getElementById("total-carrinho");


    lista.innerHTML = "";


    // Carrinho vazio

    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio. 🐾
            </p>
        `;

        contador.textContent = "0";

        totalElemento.textContent = "R$ 0,00";

        return;
    }


    let total = 0;

    let quantidadeTotal = 0;


    // Criar os itens

    carrinho.forEach(
        (produto, index) => {

            total +=
                produto.preco *
                produto.quantidade;

            quantidadeTotal +=
                produto.quantidade;


            const item =
                document.createElement("div");

            item.className =
                "item-carrinho";


            item.innerHTML = `

                <div class="item-info">

                    <h3>
                        🐾 ${produto.nome}
                    </h3>

                    <span class="item-preco">
                        R$ ${produto.preco
                            .toFixed(2)
                            .replace(".", ",")}
                    </span>

                </div>


                <div class="quantidade">

                    <button
                        onclick="diminuirQuantidade(${index})">
                        −
                    </button>


                    <span>
                        ${produto.quantidade}
                    </span>


                    <button
                        onclick="aumentarQuantidade(${index})">
                        +
                    </button>


                    <button
                        class="remover"
                        onclick="removerProduto(${index})">

                        🗑️ Remover

                    </button>

                </div>

            `;


            lista.appendChild(item);

        }
    );


    // Atualizar contador

    contador.textContent =
        quantidadeTotal;


    // Atualizar total

    totalElemento.textContent =
        "R$ " +
        total
            .toFixed(2)
            .replace(".", ",");

}


// =========================
// ABRIR CARRINHO
// =========================

function abrirCarrinho() {

    document
        .getElementById("carrinho")
        .classList
        .add("aberto");

}


// =========================
// FECHAR CARRINHO
// =========================

function fecharCarrinho() {

    document
        .getElementById("carrinho")
        .classList
        .remove("aberto");

}


// =========================
// SALVAR NO NAVEGADOR
// =========================

function salvarCarrinho() {

    localStorage.setItem(
        "aulimentos-carrinho",
        JSON.stringify(carrinho)
    );

}


// =========================
// FINALIZAR COMPRA
// =========================

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio! 🐾"
        );

        return;
    }


    alert(
        "Compra realizada com sucesso! 💜🐾"
    );


    carrinho = [];

    salvarCarrinho();

    atualizarCarrinho();

    fecharCarrinho();

}


// =========================
// INICIAR
// =========================

atualizarCarrinho();


// =========================
// SERVICE WORKER
// =========================

if ("serviceWorker" in navigator) {

    navigator.serviceWorker
        .register("service-worker.js")

        .then(() => {

            console.log(
                "Service Worker registrado com sucesso!"
            );

        })

        .catch((erro) => {

            console.error(
                "Erro ao registrar o Service Worker:",
                erro
            );

        });

}