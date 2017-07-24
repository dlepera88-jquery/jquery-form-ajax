# Plugin jQuery Form Ajax
Realizar o submit de um formulário via AJAX (jQuery).

## Pré-requisitos
Esse plugin necessita do jQuery (https://jquery.com/).

## Funcionalidades
* Submit do formulário via AJAX
* Envio de arquivos para upload via AJAX
* Validação adicional de campos
* Submit alternativo do formulário
* Simulação do antigo evento beforesubmit

## Opções
### validar_invisiveis
boolean default false

Define se o plugin deve permitir a validação dos controles do formulário que não sejam visíveis. Quando false, desativa os campos invisíveis para evitar a validação.

**ATENÇÃO**: essa funcionalidade é incluída no evento click do botão submit. Caso o formulário não tenha um botão submit, essa configuração não funcionará.

```
$('#meu-form').formAjax({validar_invisiveis:true});

$('#meu-form').formAjax({validar_invisiveis:false});
```

### func_antes
function default null

Função a ser executada antes do submit do form. Ela simula o comportamento do antigo evento beforesubmit. Se ela retornar false, interrompe o submit do formulário.

```
$('#meu-form').formAjax({
    func_antes: function () {
        return confirm('Tem certeza que deseja enviar essas informações?');
    }
});
```

### func_depois
function default null

Função a ser executada após o submit do formulário. Recebe como parâmetro o retorno do submit, possibilitando o tratamento e exibição do retorno. Não precisa retornar nada.

```
$('#meu-form').formAjax({
    func_depois: function (retorno) {
        alert(retorno);
    }
});
```

## Exemplos
### Realizando um submit alternativo do formulário

Esse plugin permite que as informações sejam submetidas para diferentes actions com diferentes configurações. Essa funcionalidade simula a especificação do HTML5 para buttons mas que funciona apenas em navegadores muito recentes e não foi completamente imlementada ainda:
https://www.w3schools.com/tags/att_button_formaction.asp

```
<form id="meu-form" action="pagina1.php" method="post">
    <input type="text" name="infos required"/>

    <button type="submit">Envio padrão</button>
    <button type="button" id="btn-alternativo">Envio alternativo</button>
</form>

<script>
//<![CDATA[
// Aqui eu configuro o formulário para usar o plugin
$('#meu-form').formAjax();

// Agora eu configuro o botão 'Envio alternativo' para alterar o submit do form
$('#btn-alternativo').on('click', function () {
    #('#meu-form').formAjax('submit-alternativo', {
        acao: 'pagina2.php'
    });
});
//]]>
</script>
```

### Incluindo validação adicional em um determinado campo
Para incluir uma validação adicional em um determinado campo, deve-se utilizar o parâmetro data-vld-func em conjunto com data-vld-msg, onde:

**data-vld-func** deve receber o nome da função a ser utilizada para a validação. Essa função deve retornar um valor booleano e sempre receberá o valor do campo como parâmetro.

**data-vld-msg** deve receber a mensagem que deve ser exibida ao usuário caso o campo não passe na validação.

No exemplo abaixo, valido se o campo foi preenchido com um número par:

```
<form id="meu-form" action="pagina1.php" method="post">
    <input type="number" name="numero_par" min="0" max="100" data-vld-func="validaNumeroPar" data-vld-msg="O número digitado não é um número par."/>

    <button type="submit">Enviar form</button>
</form>

<script>
//<![CDATA[
// Primeiro eu configuro o meu formulário para utilizar o plugin
$('#meu-form').formAjax();

// Essa é a função que vai validar se o número é par. Lembrando que ela deve retornar um valor booleano
function validaNumeroPar(numero) {
    return numero % 2 === 0;
}
//]]>
</script>
```

## Desenvolvedor
Diego Lepera

dlepera88@gmail.com

http://diegolepera.xyz/
