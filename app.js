async function cadastrar(){
    const email = iptEmail.value
    const nome = iptNome.value
    const senha = iptSenha.value
    const confirmarSenha = iptConfirmarSenha.value

    if (senha != confirmarSenha){
        console.log("Senhas diferentes")
    }
    else if (!email.includes("@")){
        console.log("E-mail inválido")
    }
    else if (nome == "" || nome == null){
        console.log("Nome inválido")
    }
    else {
        const resposta = await fetch("http://localhost:3000/usuarios",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        email: email,
                        nome: nome,
                        senha: senha
                    }
                )
            }

        )
    }
    
}