json_usuarios = [];
json_comentarios = [];
json_postagens = [];


async function carregar_json() {
    json_usuarios = JSON.parse(localStorage.getItem("usuarios"));
    
    if (json_usuarios == null) {
        json_usuarios = JSON.parse("[]");
    } else {
        console.log("Usuários carregados do localStorage ", json_usuarios);
    }


    json_comentarios = JSON.parse(localStorage.getItem("comentarios"))

    if (json_comentarios == null) {
        json_comentarios = JSON.parse("[]");
    } else {
        console.log("Comentários carregados do localStorage ", json_comentarios);
    }


    json_postagens = JSON.parse(localStorage.getItem("postagens"))

    if (json_postagens == null) {
        // Lê o arquivo json
        json_postagens = JSON.parse('[]');
    } else {
        console.log("Comentários carregados do localStorage ", json_postagens);
    }

}

async function adicionar_no_json(json_alvo, nome_local_storage, novo_json) {
    json_alvo.push(novo_json);
    console.log("Stringify: ", JSON.stringify(json_alvo));
    localStorage.setItem(nome_local_storage, JSON.stringify(json_alvo))
    
    console.log("Adicionado ", novo_json, " ao item do localStorage ", nome_local_storage);
}

async function verificar_credenciais(usuario_testar, senha_testar) {

    await carregar_json();

    // Verifica se já não existe um usuário com mesmo nome
    if (json_usuarios.length > 0)
        for (const usuario_teste of json_usuarios) {
            if (usuario_teste.nome === usuario_testar) {
                if ( usuario_teste.senha === senha_testar) {
                    console.log("Credenciais verificadas!");
                    return true;
                }
            }
        }
    
    alert("Erro ao verificar as credenciais! ")
    return false;
    
}

async function fazer_login() {

    /*usuario = input("Digite o usuário: ");
    senha = input("Digite a senha: ");*/
    usuario = prompt("Digite o seu username: ", "Digite aqui... ");
    senha = prompt("Digite a sua senha: ", "Digite aqui... ");

    if (await verificar_credenciais(usuario, senha)) {
        localStorage.setItem("login",JSON.stringify(
            {
                "usuario": usuario,
                "senha": senha
            }
        ));
        alert("Login realizado com sucesso! ");
        location.reload();
    }
}

async function fazer_login_usuario_senha(usuario, senha) {

    if (await verificar_credenciais(usuario, senha)) {
        localStorage.setItem("login",JSON.stringify(
            {
                "usuario": usuario,
                "senha": senha
            }
        ));
        alert("Login realizado com sucesso! ");
        location.reload();
    }
}

async function fazer_logout() {
    localStorage.setItem("login", "");
    alert("Logout realizado com sucesso! ");
    location.reload();
}

async function comentar(id_postagem) {

    await carregar_json();

    try {
        json_login = JSON.parse(localStorage.getItem("login"));
    } catch (erro) {
        alert("Houve um problema com suas credenciais. Faça login! ");
        return -1;
    }

    let autor = json_login.usuario;
    let senha = json_login.senha;
    let corpo = document.getElementById("textarea-comentario-id-" + id_postagem).value;

    if (autor.length == 0) {
        alert("Digite o nome do autor! ");
        return -1;
    } 
    
    if (corpo.length == 0) {
        alert("Digite o comentario! ");
        return -1;
    } 
    
    if (corpo.length < 10) {
        alert("Digite um comentário mais longo! ");
        return -1;
    } 
    
    if (corpo.length > 500) {
        alert("Digite um comentário mais curto! ");
        return -1;
    } 
    

    // Verifica se já não existe um usuário com mesmo nome
    for (const usuario_teste of json_usuarios) {
        if (usuario_teste.nome == autor) {
            
            // Verifica se a senha está correta
            if (usuario_teste.senha == senha) {
            
                adicionar_no_json(
                    json_comentarios,
                    "comentarios",
                    {
                        "id_postagem": id_postagem,
                        "autor": autor,
                        "corpo": corpo
                    }
                )

                alert("Comentado com sucesso! ");
                location.reload();
                return 1;

            } else {
                alert("Senha incorreta! ");
                return -1;
            }
            
        }
    }

    alert("Não existe um usuário com este nome! ");
    return -1;

}

async function excluir_postagem(id_postagem) {
    await carregar_json();

    // Excluindo todos os comentários relacionados a postagem
    let contador = 0;

    while (contador < json_comentarios.length) {
        if (json_comentarios[contador].id_postagem == id_postagem) {
            json_comentarios.pop(contador);
        } else {
            contador += 1;
        }
    }


    localStorage.setItem("comentarios", JSON.stringify(json_comentarios));


    contador = 0;

    for (const postagem of json_postagens) {

        if (postagem.id == id_postagem) {
            json_postagens.pop(contador);
            localStorage.setItem("postagens", JSON.stringify(json_postagens));
            alert("Postagem excluida com sucesso! ");
            location.reload();
        } else {
            contador += 1;

        }

    }



}

async function ler_e_carregar_comentarios_de_postagem_por_id(id_postagem_carregar, div_para_carregar) {
    /* O parãmetro "usuário" determina de qual usuário as postagens serão carregadas
    Caso seja -1, serão carregadas as postagens de todos os usuários. */

    await carregar_json();

    json_comentarios.forEach((comentario, contador) => {

        if (comentario.id_postagem == id_postagem_carregar) {
            // adciona o autor do comentário
            const novoAutorComentario = document.createElement('a');
            novoAutorComentario.textContent = "Por " + comentario.autor;
            novoAutorComentario.classList.add('autor-comentario');
            div_para_carregar.appendChild(novoAutorComentario);
            novoAutorComentario.setAttribute("href", "usuario.html?usuario=" + comentario.autor);

            // adciona o corpo do comentário
            const novoCorpoComentario = document.createElement('p');
            novoCorpoComentario.textContent = comentario.corpo;
            novoCorpoComentario.classList.add('corpo-comentario');
            div_para_carregar.appendChild(novoCorpoComentario);

            const novaLinhaSeparadora = document.createElement('hr');
            div_para_carregar.appendChild(novaLinhaSeparadora);
        }

    });

}

async function carregar_descricao(nome_usuario) {

    await carregar_json();

    // Percorre toda a lista de usuários até encontrar o qual o nome bate
    for (const usuario_teste of json_usuarios) {

        if (usuario_teste.nome == nome_usuario) {
            if (usuario_teste.descricao.length > 0) {
                document.getElementById("descricao-do-usuario").innerText = usuario_teste.descricao;
            } else {
                document.getElementById("descricao-do-usuario").innerText = "Essse usuário não adicionou uma descrição. ";
            }
            break;
        }

    }

}

async function ler_e_carregar_postagens(usuario) {
    /* O parãmetro "usuário" determina de qual usuário as postagens serão carregadas
    Caso seja -1, serão carregadas as postagens de todos os usuários. */

    await carregar_json();

    const container = document.getElementById('div-postagens');

    contador_carregadas = 0;

    json_postagens.forEach((postagem, contador) => {

        if ((usuario === -1) || (usuario == postagem.autor)) {
            
            ler_e_carregar_postagem_por_id(postagem.id);
            contador_carregadas += 1;

        }

    });

    if (contador_carregadas == 0) {
        const novoParagrafo = document.createElement('p');
        novoParagrafo.textContent = "Este usuário não postou nada. ";
        novoParagrafo.classList.add('titulo-postagem');
        container.appendChild(novoParagrafo);
    }

}

async function ler_e_carregar_postagens_resumidas(usuario) {
    /* O parãmetro "usuário" determina de qual usuário as postagens serão carregadas
    Caso seja -1, serão carregadas as postagens de todos os usuários. */

    await carregar_json();

    const container = document.getElementById('div-postagens');

    let contador_postagens = 0;

    for (const postagem of json_postagens) {

        console.log('Testando postagem do usuuário ', postagem.autor);

        if ((usuario == -1) || (usuario == postagem.autor)) {

            contador_postagens += 1;

            // adciona o título da postagem
            const novoTitulo = document.createElement('h1');
            novoTitulo.textContent = postagem.titulo;
            novoTitulo.classList.add('titulo-postagem');
            container.appendChild(novoTitulo);

            // adciona o autor da postagem
            const novoNomeAutor = document.createElement('a');
            novoNomeAutor.textContent = 'por ' + postagem.autor;
            novoNomeAutor.classList.add('autor-postagem');
            container.appendChild(novoNomeAutor);
            novoNomeAutor.setAttribute("href", "usuario.html?usuario=" + postagem.autor);

            // adciona a data da postagem
            const novoData = document.createElement('span');
            novoData.textContent = 'postado em ' + postagem.data;
            novoData.classList.add('data-postagem');
            container.appendChild(novoData);

            // adiciona o corpo da postagem
            const novoCorpo = document.createElement('p');
            novoCorpo.textContent = postagem.corpo.slice(0, 100) + '...';
            novoCorpo.classList.add('titulo-postagem');
            container.appendChild(novoCorpo);

             // adciona o botão de ler a postagem completa da postagem
            const novoLinkPostagemCompleta = document.createElement('a');
            novoLinkPostagemCompleta.textContent = 'Clique para ler a postagem completa!';
            novoLinkPostagemCompleta.classList.add('link-postagem');
            container.appendChild(novoLinkPostagemCompleta);
            novoLinkPostagemCompleta.setAttribute("href", "postagem.html?postagem=" + postagem.id);
            
            const novaLinhaSeparadora = document.createElement('hr');
            container.appendChild(novaLinhaSeparadora);



        }

    }

    if (contador_postagens == 0) {
        // adciona o título de nenhuma postagem encontrada
        const novoTitulo = document.createElement('h1');
        novoTitulo.textContent = 'Nenhuma postagem foi encontrada! ';
        novoTitulo.classList.add('titulo-postagem');
        container.appendChild(novoTitulo);
    }


}

async function ler_e_carregar_postagem_por_id(id_postagem) {
    /* O parãmetro "usuário" determina de qual usuário as postagens serão carregadas
    Caso seja -1, serão carregadas as postagens de todos os usuários. */

    await carregar_json();
    
    postagem = -1;

    for (const postagem_teste of json_postagens) {
        console.log("Postagem sendo testada: ", postagem_teste);
        if (postagem_teste.id == id_postagem) {
            postagem = postagem_teste;
            console.log("Postagem com o ID determinado encontrada! ");
            break;
        }
    }

    if (postagem == -1) {
        return -1;
    }

    container = document.getElementById('div-postagens');

    // adciona o título da postagem
    const novaDiv = document.createElement('div');
    novaDiv.classList.add('div-separadora-postagem');
    novaDiv.setAttribute("id", "div-separadora-postagem-" + postagem.id)
    container.appendChild(novaDiv);

    container = document.getElementById("div-separadora-postagem-" + postagem.id);

    // adciona o título da postagem
    const novoTitulo = document.createElement('h1');
    novoTitulo.textContent = postagem.titulo;
    novoTitulo.classList.add('titulo-postagem');
    container.appendChild(novoTitulo);

    // adciona o autor da postagem
    const novoNomeAutor = document.createElement('a');
    novoNomeAutor.textContent = 'por ' + postagem.autor;
    novoNomeAutor.classList.add('autor-postagem');
    container.appendChild(novoNomeAutor);
    novoNomeAutor.setAttribute("href", "usuario.html?usuario=" + postagem.autor);


    // adciona a data da postagem
    const novoData = document.createElement('span');
    novoData.textContent = 'postado em ' + postagem.data;
    novoData.classList.add('data-postagem');
    container.appendChild(novoData);

    // adiciona o corpo da postagem
    const novoCorpo = document.createElement('p');
    novoCorpo.textContent = postagem.corpo;
    novoCorpo.classList.add('titulo-postagem');
    container.appendChild(novoCorpo);

        // adiciona os comentários
    const novaDivComentarios = document.createElement('div');
    novaDivComentarios.classList.add('div-comentarios');

    // adciona o autor da postagem
    const novoTituloComentarios = document.createElement('h2');
    novoTituloComentarios.textContent = "Comentários: ";
    novoTituloComentarios.classList.add('titulo-comentarios');
    container.appendChild(novoTituloComentarios);

    ler_e_carregar_comentarios_de_postagem_por_id(postagem.id, novaDivComentarios)

    container.appendChild(novaDivComentarios);

    if (localStorage.getItem("login").length > 1) {

        // adiciona a text area para comentar
        const novaTextAreaComentario = document.createElement('textarea');
        novaTextAreaComentario.setAttribute("placeholder", "Digite o seu comentário aqui! ");
        novaTextAreaComentario.setAttribute("id", "textarea-comentario-id-" + postagem.id);
        novaTextAreaComentario.classList.add('textarea-comentario');
        container.appendChild(novaTextAreaComentario);

        /*
        // adiciona o input para o nome do usuário
        const novoInputNomeComentario = document.createElement('input');
        novoInputNomeComentario.setAttribute("type", "text");
        novoInputNomeComentario.setAttribute("id", "input-comentario-id-" + postagem.id);
        novoInputNomeComentario.setAttribute("placeholder", "Digite o seu nome aqui! ");
        novoInputNomeComentario.classList.add('input-comentario');
        container.appendChild(novoInputNomeComentario);

        // adiciona o input para a senha do usuário
        const novoInputSenhaComentario = document.createElement('input');
        novoInputSenhaComentario.setAttribute("type", "password");
        novoInputSenhaComentario.setAttribute("placeholder", "Digite a senha! ");
        novoInputSenhaComentario.setAttribute("id", "input-senha-comentario-id-" + postagem.id);
        novoInputSenhaComentario.classList.add('input-senha-comentario');
        container.appendChild(novoInputSenhaComentario);
        */

        const novoBotaoComentario = document.createElement('button');
        novoBotaoComentario.textContent = "Comentar! ";
        novoBotaoComentario.setAttribute("id", "botao-comentario-id-" + postagem.id);    // Cria um id unico pra cada botão
        novoBotaoComentario.setAttribute("onclick", "comentar(" + postagem.id + ");");
        novoBotaoComentario.classList.add('botao-comentario');
        container.appendChild(novoBotaoComentario);

        try {
            json_login = JSON.parse(localStorage.getItem("login"))

             if (json_login.usuario == postagem.autor) {
                const novoBotaoExcluirPostagem = document.createElement('button');
                novoBotaoExcluirPostagem.textContent = "Excluir essa postagem ";
                novoBotaoExcluirPostagem.setAttribute("id", "botao-excluir-postagem-id-" + postagem.id);    // Cria um id unico pra cada botão
                novoBotaoExcluirPostagem.setAttribute("onclick", "excluir_postagem(" + postagem.id + ");");
                novoBotaoExcluirPostagem.classList.add('botao-excluir-postagem');
                container.appendChild(novoBotaoExcluirPostagem);
             }
                
        } catch (erro) {
            
        }

       
    
    } else {
        const novoFacaLoginComentarios = document.createElement('h2');
        novoFacaLoginComentarios.textContent = "Faça login para comentar! ";
        novoFacaLoginComentarios.classList.add('faca-login-comentarios');
        container.appendChild(novoFacaLoginComentarios);
    }


    const novaLinhaSeparadora = document.createElement('hr');
    container.appendChild(novaLinhaSeparadora);





}

async function postar() {
    await carregar_json();

    let titulo_postar = document.getElementById('titulo-nova-postagem').value;
    let corpo_postar = document.getElementById('corpo-nova-postagem').value;

    try {
        json_login = JSON.parse(localStorage.getItem("login"));
    } catch (erro) {
        alert("Houve um problema com suas credenciais. Faça login! ");
        return -1;
    }
        
    let usuario_postar = json_login.usuario;
    let senha_postar = json_login.senha;


    if (titulo_postar.length < 10) {
        alert("O título deve ser mais longo! ");
        return -1;
    }

    if (corpo_postar.length < 50) {
        alert("O corpo deve ser mais longo! ");
        return -1;
    }

    if (verificar_credenciais(usuario_postar, senha_postar)) {

        adicionar_no_json(json_postagens, "postagens", 
            {
            "titulo": titulo_postar,
            "corpo": corpo_postar,
            "autor": usuario_postar,
            "data": new Date().toLocaleString('pt-BR'),
            "id": json_postagens.length
            }
        );


        alert("Postagem realizada com sucesso! ");
        window.location.href = '../index.html';
        return -1;


    } else {
        alert("Erro nas credenciais! ");
    }

    return -1;

    
}

async function cadastrar() {

    await carregar_json();

    console.log(json_usuarios);
    console.log(json_usuarios.length);

    let descricao_cadastro = document.getElementById('descricao-cadastro').value;
    let nome_cadastro = document.getElementById('nome-cadastro').value;
    let senha_cadastro = document.getElementById('senha-cadastro').value;

    // Verifica se já não existe um usuário com mesmo nome
    for (const usuario_teste of json_usuarios) {
        if (usuario_teste.nome == nome_cadastro) {
            alert("Já existe um usuário com este nome! ");
            return -1;
        }
    }

    if (senha_cadastro.length < 6) {
        alert("Digite uma senha com 6 caracteres ou mais! ");
        return -1;
    }

    await adicionar_no_json(json_usuarios, "usuarios", 
        {
        "nome": nome_cadastro,
        "descricao": descricao_cadastro,
        "senha": senha_cadastro
        }
    );

    alert("Cadastro realizado com sucesso! ");
    window.location.href = "../index.html";
}




 if (localStorage.getItem("login").length > 0) {
    console.log("Temos um usuário logado! ");

    document.getElementById("logado-como").innerText = "Logado como " + JSON.parse(localStorage.getItem("login")).usuario;
     document.getElementById("logado-como").href = "usuario.html?usuario=" + JSON.parse(localStorage.getItem("login")).usuario;


    document.getElementById("botao-fazer-login").hidden = true;
    document.getElementById("link-criar-conta").style.display = 'none';
} else {
    document.getElementById("botao-fazer-logout").hidden = true;
}