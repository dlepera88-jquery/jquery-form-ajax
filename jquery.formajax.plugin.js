/** @preserve
 * jquery.formajax.plugin.js
 * @version: v1.17.07
 * @author: Diego Lepera
 *
 * Created by Diego Lepera on 2017-07-20. Please report any bug at
 * https://github.com/dlepera88-jquery/jquery-form-ajax/issues
 *
 * The MIT License (MIT)
 * Copyright (c) 2017 Diego Lepera http://diegolepera.xyz/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

 // Verificar se o jQuery foi inicializado
 if (jQuery === undefined) {
     console.warn('[Plugin $.fn.formAjax] O jQuery ainda não foi inciado.\nPara utilizar esse plugin é necessário inicializar o jQuery antes.');
 } // Fim if

(function ($) {
    /**
     * Objeto que receberá os arquivos que serão enviados para upload
     * @type {Object}
     */
    var upload_arquivos = {};

    var fForm = {
        /**
         * Essa função funciona semelhante ao $.fn.serialize nativo do jQuery,
         * porém, essa adiciona valores 'off' para campos radio e checkbox que
         * não estejam marcados e enviam as infromações. Isso é útil para alterar
         * falgs.
         * @param  {Object.jQuery} $form    Instância jQuery do formulário a ser
         * submetido
         * @return {String}        Retorna uma string serializada com os nomes e
         * valores de todos os campos do formulário no formato URL-encoded
         */
        serialize: function ($form) {
            /**
    		 * Selector dos elementos do formulário
    		 * @type {string}
    		 */
    		var seletor_elementos = 'input:not(:file), select, textarea';

            /**
             * Vetor que receberá as informações do formulário no formato:
             * campo=valor
             * Onde campo é o nome do campo e valor seu respectivo valor
             * @type {Array}
             */
            var campos = [];

            /**
             * Instância jQuery dos elementos contidos no formulário
             * @type {Object.jQuery}
             */
            var $elementos = $.merge($form.find(seletor_elementos), $form.filter(seletor_elementos));

            $elementos.each(function () {
                var $elem = $(this), nome, tipo, valor;

                // Campos desabilitados não precisam ser serializados
    			if (!$elem.prop('disabled')) {
                    nome = $elem.attr('name');

                    if (typeof nome === 'undefined') {
                        return;
                    } // Fim if

                    if ($elem.is('select[multiple]')) {
                        $elem.find('option').each(function () {
                            if ($elem.prop('selected')) {
                                campos.push(nome + '=' + this.value);
                            } // Fim if
                        });
                    } else {
                        tipo = $elem.attr('type');
                        valor = encodeURIComponent($elem.val());

                        switch (tipo) {
                            case 'checkbox':
                                if (valor === 'on') {
                                    valor = $elem.prop('checked') ? 'on' : 'off';
                                } else if (!$elem.prop('checked')) {
                                    return;
                                } // Fim if ... else
                                break;

                            case 'radio':
                                if (!$elem.prop('checked')) {
                                    return;
                                } // Fim if
                                break;
                        } // Fim switch(tipo)

                        campos.push(nome + '=' + valor);
                    } // Fim if ... else
                } // Fim if
            });

            return campos.join('&');
        }, // Fim function serialize


        /**
    	 * Submeter o formulário
    	 * @param {jQuery} $form   Instância jQuery do formulário
    	 * @param {Object} configs Configurações a serem utilizadas no submit do
    	 * formulário
    	 */
        submeter: function ($form, configs) {
            var form_data,
                campos_upload = Object.keys(upload_arquivos),
                qtde_upload = campos_upload.length;

            configs = $.extend(true, {
                /**
                 * Nova ação a ser executada
                 * @type {String}
                 */
                acao: $form.attr('action'),

                /**
                 * Método de envio de dados a ser utilizado
                 * para o submit do formulário
                 * @type {String}
                 */
                metodo: $form.attr('method'),

                /**
                 * Função a ser executada antes o submit, como o evento beforesubmit.
                 * Se ela retornar false, interrompe o submit
                 * @type {Function}
                 */
                func_antes: null,

                /**
                 * Função a ser executada após o submit.
                 * Ela receberá o retorno do submit como parâmetro
                 * @type {Function}
                 */
                func_depois: null
            }, configs);

            // Incluir os arquivos
            if (qtde_upload > 0) {
                form_data = new FormData();
                var chave, qtde_arquivos;

                for (var i = 0; i < qtde_upload; i++) {
                    chave = campos_upload[i];
                    qtde_arquivos = Object.keys(upload_arquivos[chave]).length;

                    if (qtde_arquivos > 1) {
                        for (var a = 0; a < qtde_arquivos; a++) {
                            form_data.append(chave + '[]', upload_arquivos[chave][a]);
                        } // Fim for
                    } else {
                        form_data.append(chave, upload_arquivos[chave][0]);
                    } // Fim if
                } // Fim for

                // Incluir os dados normais
                $.each(fForm.serialize($form).split('&'), function (k, v) {
                    var er = /^([\w\-\[\]]+)=(.+)?$/, dd;

                    if (er.test(v)) {
                        dd = er.exec(v);
                        form_data.append(dd[1], dd[2] || '');
                    } // Fim if
                });
            } // Fim if

            $.ajax({
                url: configs.acao,
                type: configs.metodo,
                data: form_data || fForm.serialize($form),
                cache: false,
                processData: qtde_upload === 0,
                contentType: qtde_upload > 0 ? false : 'application/x-www-form-urlencoded',
                success: function (retorno) {
                    if (typeof configs.func_depois === 'function') {
                        return configs.func_depois.apply(this, arguments);
                    } else {
                        console.warn('[Plugin $.fn.formAjax] Considere utilizar o plugin $.mostrarMsg para melhorar a experiência do usuário ao receber a resposta do submit.');
                        console.log(retorno);
                        
                        return true;
                    } // Fim if ... else
                }
            });
        }, // Fim function submeter,

        /**
         * Alterar a mensagem de validação de acordo com o status de validação e a condição
         * @param {bool}    condicao    Expressão booleana para definir a alteração
         * da mensagem
         * @param {object}  campo       DOM do campo a ser validado
         * @param {string}  mensagem    Mensagem a ser exibida para o caso do
         * campo não ser validado corretamente
         * @returns {*}
         */
        validarCampo: function (condicao, campo, mensagem) {
            return condicao ? campo.setCustomValidity(mensagem)
                : !campo.validity.valid && campo.validationMessage === mensagem ? campo.setCustomValidity('')
                : null;
        } // Fim function Validacao(consicao, campo, mensagem)
    };


    var fObservadores = {
        arquivosUpload: function ($form) {
            var $arquivos = $form.find(':file');

            if ($form.attr('enctype') === 'multipart/form-data' && $arquivos.length > 0) {
                $arquivos.on('change.' + $.fn.formAjax.evt_ns, function (evt) {
                    upload_arquivos[this.name] = evt.target.files;
                });
            } // Fim if
        }, // Fim fucntion arquivosUpload

        /**
         * Alternar a máscara dos campos de de telefone entre 8 e 9 dígitos
         * @return {Void}
         */
        alternarMaskFone: function () {
            $('[data-acao="alterar-mask-telefone"]').on('change.' + $.fn.formAjax.evt_ns, function () {
                var $this = $(this),
                    $campo_fone = $('#' + $this.data('acao-param-telefone'));

                // $campo_fone.removerMascara();
                $campo_fone.mascara($this.prop('checked') ? $campo_fone.data('mask9') : $campo_fone.data('mask8')).trigger('focus');
            });
        }, // Fim function alternarMaskFone

        /**
         * Executar validações adicionais em campos
         * @param  {jQuery} $form Instância jQuery do formulário
         * @return {Void}
         */
        validacoesAdicionais: function ($form) {
            // Realizar a verificação adicional dos campos
			$form.find('[data-vld-func]').off('.' + $.fn.formAjax.evt_ns)
				.on('change.' + $.fn.formAjax.evt_ns +' blur.'+ $.fn.formAjax.evt_ns, function(evt){
					var $this = $(this),
                        _this = evt.target,
                        fnc = window[$this.data('vld-func')],
                        msg = $this.data('vld-msg'),
                        vlr = this.type === 'file' ?
                            { arq: _this.files, exts: $this.data('vld-exts'), max: $this.data('vld-max') }
						: $this.val();

					// Verificar se a função informada existe e se é mesmo uma função
					if(typeof fnc !== 'function'){
						console.error('A função ' + fnc + ' não existe ou não pode ser acessada!');
						return false;
					} // Fim if

					return fForm.validarCampo(vlr !== '' && !fnc(vlr), _this, msg);
				}).trigger('change.' + $.fn.formAjax.evt_ns);
        } // Fim function validacoesAdicionais
    };


    /**
     * Métodos que podem ser chamados pelo plugin
     * @type {Object}
     */
    var metodos = {
        init: function (opcoes) {
            opcoes = $.extend(true, {
                /**
                 * Define se o plugin deve permitir a validação dos controles do
                 * formulário que não sejam visíveis. Quando false, desativa os
                 * campos invisíveis para evitar a validação.
                 * ATENÇÃO: essa funcionalidade é incluída no evento click do
                 * botão submit. Caso o formulário não tenha um botão submit, essa
                 * configuração não funcionará
                 * @type {Boolean}
                 */
                validar_invisiveis: false,

                /**
                 * Função a ser executada antes o submit, como o evento beforesubmit.
                 * Se ela retornar false, interrompe o submit
                 * @type {Function}
                 */
                func_antes: null,

                /**
                 * Função a ser executada após o submit. Ela receberá o retorno do
                 * submit como parâmetro
                 * @type {Null|Function}
                 */
                func_depois: null
            }, opcoes);

            return this.each(function () {
                if (this.tagName !== 'FORM') {
                    console.warn('[Plugin $.fn.formAjax] Esse plugin deve ser inicializado apenas em formulários (<form></form>).');
                    return;
                } // Fim if

                /**
                 * Instância jQuery a ser modificada
                 * @type {Object.jQuery}
                 */
                var $this = $(this);

                // Ativar os observadores (watchers)
                for (var obs in fObservadores) {
                    // fObservadores[obs].apply($this, evt_ns);
                    fObservadores[obs]($this);
                } // Fim for

                // Remover os eventos da configuração anterior para evitar conflitos
                $this.off('.' + $.fn.formAjax.evt_ns)

                // Fazer o submit do form
                .on('submit.' + $.fn.formAjax.evt_ns, { acao: $this.attr('action'), metodo: $this.attr('method'), func_antes: opcoes.func_antes, func_depois: opcoes.func_depois }, function (evt, configs) {
                    // Evitar o submit comum do form
                    evt.stopPropagation();
                    evt.preventDefault();

                    configs = configs || evt.data;

                    /*
                     * Executar a função func_antes, simulando o evento beforesubmit.
                     * Se ela retornar false, o submit será interrompido.
                     */
                    if (typeof configs.func_antes === 'function' && !configs.func_antes.apply()) {
                        return false;
                    } // Fim if

                    fForm.submeter($(this), configs);
                });


                /*
                 * No HTML5 o formulário tenta validar campos que não estejam sendo
                 * mostrados na tela. Como de vez enquando isso é utilizado para
                 * não usar os campos, ao clicar no botão submit do form, eu desativo
                 * a verificação dos campos invisíveis e depois ativo novamente
                 */
                if (!opcoes.validar_invisiveis) {
                    $this.find(':submit').off('.' + $.fn.formAjax.evt_ns)
                        .on('click.' + $.fn.formAjax.evt_ns, function(){
         				var $form = $(this).parents('form'),
                            $invi = $form.find('[required]:not(:visible)');

         				// Desabilitar os campos que não podem ser focalizados
         				$invi.prop('disabled', true);

         				// Executar a validação HTML5
                         if (!$form[0].checkValidity()) {
                             // Reabilitar os campos que não podem ser visualizados
                             $invi.prop('disabled', false);
                         } // Fim if
         			});
                } // Fim if
            });
        }, // Fim function init

        /**
         * Altera o comportamento atual do formulário, atribuindo uma nova ação,
         * metodo e função a ser executada
         * @param  {Object} configs Objeto com as configurações a serem utilizadas
         * para o submit
         * @return {Void}
         */
        'submit-alternativo': function (configs) {
            return this.each(function () {
                $(this).trigger('submit', configs);
            });
        } // Fim function 'submit-alternativo'
    };


    /**
     * Submeter um formulário via AJAX (jQuery)
     * @param  {Object} opcoes Objeto com as opções a serem aplicadas durante o
     * submit
     * @return {Object.jQuery} A instância jQuery com os elementos atualizados
     */
    $.fn.formAjax = function (metodo) {
        if (metodos[metodo]) {
            return metodos[metodo].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (!metodo || typeof metodo === 'object' || metodo === 'init') {
            return metodos.init.apply(this, arguments);
        } else {
            console.error('[Plugin $.fn.formAjax] O método [%s] não foi localizado!', metodo);
        } // Fim if ... elseif ... else
    };


    // Propriedades públicas ------------------------------------------------ //
    /**
     * Nome do namespace usado para criar e utilizar os eventos do plugin
     * @type {String}
     */
    $.fn.formAjax.evt_ns = '__formAjax';
})(jQuery);
