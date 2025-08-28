const template = document.createElement("template");

template.innerHTML = `    

    <section id="avisoCookies" class="container-cookies">
        <!-- AVISO COOKIES -->
        <p data-i18n="cookies:paragraph.one"></p>
        <p data-i18n="cookies:paragraph.two"></p>
        <form class="form form--inline" id="frmAvisoCookies" action="/we001/was/PrivacidadServlet">
            <button id="aceptarCookies" value="aceptar" class="btn" type="submit" data-i18n="cookies:button.accept"></button> 
            <button id="rechazarCookies" value="rechazar" class="btn" type="reset" data-i18n="cookies:button.decline"></button> 
        </form>
        <a href="/wb021/was/contenidoAction.do?idioma=es&amp;uid=u65df3783_18d8c5a91a7__34fb" class="btn" data-i18n="cookies:button.manage"></a> 
    </section>`;

export default template;
