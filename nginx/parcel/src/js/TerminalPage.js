import Confetti from './Confetti.js';
import Terminal from './Terminal.js';

class TerminalPage extends HTMLElement {
    constructor() {
        super();

        this.appendChild(new Confetti());
        this.appendChild(new Terminal());
    }
}

window.customElements.define('ft-terminal-page', TerminalPage);

export default TerminalPage;
