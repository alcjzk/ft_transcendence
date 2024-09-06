const template = document.createElement('template');
template.innerHTML = `
    <div class='terminal'>
        <div class='output'></div>
        <input type='text' name='input' class='hidden'/>
    </div>
`;

class Banner extends HTMLElement {
    constructor({text, onContinue}) {
        super();

        this.appendChild(template.content.cloneNode(true));
        this.output = this.querySelector('.output');
        this.input = this.querySelector('input');
        this.output.innerText = text;
        this.onContinue = onContinue;
    }

    connectedCallback() {
        this.input.addEventListener('keydown', ({key}) => {
            if (key === 'Enter')
                this.onContinue();
        });
        this.input.addEventListener('blur', () => ( this.input.focus() ));
        this.input.focus();
    }
}

window.customElements.define('ft-banner', Banner);

export default Banner;
