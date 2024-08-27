import Session from './Session.js';
import CommandPrompt from './CommandPrompt.js';
import { localize } from './util.js';

const DEFAULT_LANGUAGE = 'en';

const template = document.createElement('template');
template.innerHTML = `
    <style>
    </style>
    <div class="terminal">
        <div class="output"></div>
        <input class="input" type="text" maxlength="25">
    </div>
`;

class Terminal extends HTMLElement {
    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
        this.input = this.querySelector('.input');
        this.output = this.querySelector('.output');
        this.printLocalized({
            en: `Welcome to Pongers. Our super duper trancendence project.
        Please use the command \`help\` to see instructions on how to use our terminal!\n\n`,
            fi: `Tervetuloa Pongersiin. Super duper trancedence -projektimme.
        Käytä komentoa \`help\` nähdäksesi ohjeet terminaalimme käyttöön!\n\n`,
            vn: `Chào mừng bạn đến với Pongers. Dự án siêu tuyệt vời của chúng tôi.
            Sử dụng lệnh \`help\` để xem hướng dẫn sử dụng terminal của chúng tôi!\n\n`
        });
        this.prompt = new CommandPrompt(this);
    }

    connectedCallback() {
        this.addEventListener('click', () => this.input.focus());
        this.input.addEventListener('keydown', event => this.onKeydown(event));
        this.input.addEventListener('blur', () => (this.focus()));
        this.input.focus();
    }

    onKeydown(event) {
        if (this.prompt.onKeydown)
            this.prompt.onKeydown(event);
        if (event.key === 'Enter')
            this.onInput(this.input.value);
    }

    onInput(value) {
        this.input.value = '';
        this.prompt.onInput(value);
    }
    
    print(text) {
        this.output.innerText += `${text}\n`;
        this.output.scrollTop = this.output.scrollHeight;
    }

    clear() {
        this.output.innerText = '';
        this.input.value = '';
    }

    printLocalized(translations) {
        this.print(localize(translations));
    }
}

window.customElements.define('ft-terminal', Terminal);

export default Terminal;
