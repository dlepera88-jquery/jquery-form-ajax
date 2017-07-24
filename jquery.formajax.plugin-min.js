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
void 0===jQuery&&console.warn("[Plugin $.fn.formAjax] O jQuery ainda não foi inciado.\nPara utilizar esse plugin é necessário inicializar o jQuery antes."),function($){var e={},a={serialize:function(e){var a="input:not(:file), select, textarea",n=[];return $.merge(e.find(a),e.filter(a)).each(function(){var e=$(this),a,t,i;if(!e.prop("disabled")){if(void 0===(a=e.attr("name")))return;if(e.is("select[multiple]"))e.find("option").each(function(){e.prop("selected")&&n.push(a+"="+this.value)});else{switch(t=e.attr("type"),i=encodeURIComponent(e.val()),t){case"checkbox":if("on"===i)i=e.prop("checked")?"on":"off";else if(!e.prop("checked"))return;break;case"radio":if(!e.prop("checked"))return;break}n.push(a+"="+i)}}}),n.join("&")},submeter:function(n,t){var i,o=Object.keys(e),r=o.length;if(t=$.extend(!0,{acao:n.attr("action"),metodo:n.attr("method"),func_antes:null,func_depois:null},t),r>0){i=new FormData;for(var s,f,c=0;c<r;c++)if(s=o[c],(f=Object.keys(e[s]).length)>1)for(var l=0;l<f;l++)i.append(s+"[]",e[s][l]);else i.append(s,e[s][0]);$.each(a.serialize(n).split("&"),function(e,a){var n=/^([\w\-\[\]]+)=(.+)?$/,t;n.test(a)&&(t=n.exec(a),i.append(t[1],t[2]||""))})}$.ajax({url:t.acao,type:t.metodo,data:i||a.serialize(n),cache:!1,processData:0===r,contentType:!(r>0)&&"application/x-www-form-urlencoded",success:function(e){"function"==typeof t.func_depois?t.func_depois.apply(e):(console.warn("[Plugin $.fn.formAjax] Considere utilizar o plugin $.mostrarMsg para melhorar a experiência do usuário ao receber a resposta do submit."),console.log(e))}})},validarCampo:function(e,a,n){return e?a.setCustomValidity(n):a.validity.valid||a.validationMessage!==n?null:a.setCustomValidity("")}},n={arquivosUpload:function(a){var n=a.find(":file");"multipart/form-data"===a.attr("enctype")&&n.length>0&&n.on("change."+$.fn.formAjax.evt_ns,function(a){e[this.name]=a.target.files})},alternarMaskFone:function(){$('[data-acao="alterar-mask-telefone"]').on("change."+$.fn.formAjax.evt_ns,function(){var e=$(this),a=$("#"+e.data("acao-param-telefone"));a.mascara(e.prop("checked")?a.data("mask9"):a.data("mask8")).trigger("focus")})},validacoesAdicionais:function(e){e.find("[data-vld-func]").off("."+$.fn.formAjax.evt_ns).on("change."+$.fn.formAjax.evt_ns+" blur."+$.fn.formAjax.evt_ns,function(e){var n=$(this),t=e.target,i=window[n.data("vld-func")],o=n.data("vld-msg"),r="file"===this.type?{arq:t.files,exts:n.data("vld-exts"),max:n.data("vld-max")}:n.val();return"function"!=typeof i?(console.error("A função "+i+" não existe ou não pode ser acessada!"),!1):a.validarCampo(""!==r&&!i(r),t,o)}).trigger("change."+$.fn.formAjax.evt_ns)}},t={init:function(e){return e=$.extend(!0,{validar_invisiveis:!1,func_antes:null,func_depois:null},e),this.each(function(){if("FORM"!==this.tagName)return void console.warn("[Plugin $.fn.formAjax] Esse plugin deve ser inicializado apenas em formulários (<form></form>).");var t=$(this);for(var i in n)n[i](t);t.off("."+$.fn.formAjax.evt_ns).on("submit."+$.fn.formAjax.evt_ns,{acao:t.attr("action"),metodo:t.attr("method"),func_antes:e.func_antes,func_depois:e.func_depois},function(e,n){if(e.stopPropagation(),e.preventDefault(),n=n||e.data,"function"==typeof n.func_antes&&!n.func_antes.apply())return!1;a.submeter($(this),n)}),e.validar_invisiveis||t.find(":submit").off("."+$.fn.formAjax.evt_ns).on("click."+$.fn.formAjax.evt_ns,function(){var e=$(this).parents("form"),a=e.find("[required]:not(:visible)");a.prop("disabled",!0),e[0].checkValidity()||a.prop("disabled",!1)})})},"submit-alternativo":function(e){return this.each(function(){$(this).trigger("submit",e)})}};$.fn.formAjax=function(e){return t[e]?t[e].apply(this,Array.prototype.slice.call(arguments,1)):e&&"object"!=typeof e&&"init"!==e?void console.error("[Plugin $.fn.formAjax] O método [%s] não foi localizado!",e):t.init.apply(this,arguments)},$.fn.formAjax.evt_ns="__formAjax"}(jQuery);