const template = document.createElement(`template`);

template.innerHTML = `
<div class="alert alert-danger" role="alert">
    OAuth authentication failed!
</div>
`;

class Alert extends HTMLElement {
    constructor() {
        super();
        this.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define('ft-alert', Alert);

export default Alert;
