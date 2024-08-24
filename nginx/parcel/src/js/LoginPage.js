import { DEFAULT_LANGUAGE, setPage } from './util.js';
import TerminalPage from './TerminalPage.js';

const template = document.createElement('template');

template.innerHTML = `
    <div class="d-grid gap-4 mx-auto" id="login-container">
        <h1 class="text-center">Pongers</h1>
        <button class="btn btn-lg btn-primary" id="login-oauth">Login with 42</button>
        <button class="btn btn-lg btn-secondary" id="login-guest">Login as Guest</button>
    </div>
`;

class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
        this.buttons = {
            loginOauth: this.querySelector('#login-oauth'),
            loginAsGuest: this.querySelector('#login-guest'),
        };
    }

    connectedCallback() {
        this.buttons.loginAsGuest.addEventListener('click', this.loginAsGuest);
        this.buttons.loginOauth.addEventListener('click', this.loginOauth);
    }

    loginAsGuest() {
        sessionStorage.setItem('first_name', 'Guest');
        sessionStorage.setItem('language', DEFAULT_LANGUAGE);
        setPage(new TerminalPage());
    }

    loginOauth() {
        window.location.replace('auth/initiate_oauth');
    }
}

window.customElements.define('ft-login-page', LoginPage);

export default LoginPage;
