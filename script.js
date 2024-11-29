async function sendMessage() {
    // Obtem o a mensagem digitada pelo usuario no campo de texto 
    const message = document.getElementById('message').value.trim();  // Email do cliente
    const email = document.getElementById('email').value.trim();    //Mensagem do cliente
    
    if (!email || !message) { //Alerta se houver campos vazios
            alert('Por favor preencha todos os campos');
            return;
    }
    // tenta enviar mensagem para o backend 
    try {
        const response = await fetch('https://maxdeveloper.vercel.app/send-email/', {
        method: 'POST', //Metodo http usado para enviar os dados 
        headers: {
            'Content-Type': 'application/json', //formato dos dados enviados
            },
            body:JSON.stringify({email, message}), // Converte os valores para JSON
        
        });
        //Verifica se o envio foi bem sucedido
        if (response.ok) {
            alert('Mensagem enviada para o email!'); //Alerta de sucesso   
        } else{
            alert('Erro ao enviar mensagem ;( '); // Alerta falha ao enviar mensagem
        }
    } catch (error) {
        alert('Erro ao conectar com servidor') // Alerta se o backend não responde
    }
    
}
