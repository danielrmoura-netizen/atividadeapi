async function calcularFrete() {

const cepInput = document.getElementById('cepInput').value.replace(/\D/g, '');
const resultBox = document.getElementById('resultado');
const loader = document.getElementById('loading');

if (cepInput.length !== 8) {
alert("Por favor, digite um CEP válido com 8 números.");
return;
}

resultBox.style.display = 'none';
loader.style.display = 'block';

try {

const response = await fetch(`https://viacep.com.br/ws/${cepInput}/json/`);
const data = await response.json();

loader.style.display = 'none';

if (data.erro) {
alert("CEP não encontrado na base de dados!");
return;
}

const regra = definirPrecoPorRegiao(cepInput, data.uf);

const textoValor = regra.valor === 0
? "GRÁTIS"
: `R$ ${regra.valor.toFixed(2).replace('.', ',')}`;

resultBox.style.display = 'block';

resultBox.innerHTML = `
<div class="location-info">📍 ${data.logradouro}, ${data.bairro}</div>
<div class="location-info">${data.localidade} - ${data.uf}</div>
<br>
<span class="region-badge">${regra.nomeRegiao}</span>
<div class="frete-price">
<span class="frete-label">Valor do envio:</span>
<span>${textoValor}</span>
</div>
<p style="margin-top:15px; font-size:0.8rem; color:#94a3b8">
Prazo estimado: ${regra.prazo}
</p>
`;

} catch (error) {

loader.style.display = 'none';
alert("Erro de conexão. Tente novamente.");
console.error(error);

}

}

function definirPrecoPorRegiao(cepString, uf) {

const cep = parseInt(cepString.substring(0,5));

if (cep >= 13800 && cep <= 13899) {
return { valor:0, nomeRegiao:"Mogi das Cruzes (Local)", prazo:"1 dia útil" };
}

if (cep >= 1000 && cep <= 9999) {
return { valor:15.00, nomeRegiao:"São Paulo - Capital/RM", prazo:"2 dias úteis" };
}

if (cep >= 11000 && cep <= 11999) {
return { valor:22.00, nomeRegiao:"Litoral Paulista", prazo:"3 dias úteis" };
}

if (uf === 'SP') {
return { valor:25.00, nomeRegiao:"Interior de SP", prazo:"3 a 4 dias úteis" };
}

if (uf === 'RJ' || uf === 'ES') {
return { valor:35.00, nomeRegiao:"Sudeste (RJ/ES)", prazo:"5 dias úteis" };
}

if (uf === 'MG') {
return { valor:30.00, nomeRegiao:"Minas Gerais", prazo:"4 dias úteis" };
}

if (['PR','SC','RS'].includes(uf)) {
return { valor:45.00, nomeRegiao:"Região Sul", prazo:"6 dias úteis" };
}

if (['BA','SE','AL','PE','PB','RN','CE','PI','MA','AM','RR','AP','PA','TO','RO','AC'].includes(uf)) {
return { valor:65.00, nomeRegiao:"Norte / Nordeste", prazo:"8 a 12 dias úteis" };
}

return { valor:50.00, nomeRegiao:"Centro-Oeste", prazo:"6 a 8 dias úteis" };

}

document.getElementById('cepInput').addEventListener('input', function(e){

let v = e.target.value.replace(/\D/g,"");

if (v.length > 5)
v = v.replace(/^(\d{5})(\d)/,"$1-$2");

e.target.value = v;

});