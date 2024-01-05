import { Component, OnInit } from '@angular/core';

/**
 * Before login footer component class
 */
@Component({
    selector: 'app-before-login-footer',
    templateUrl: './before-login-footer.html',
    // styleUrls: ['./before-login-footer.css']
})

export class BeforeLoginFooterComponent implements OnInit {

    /** @ignore */
    constructor() { }

    /** @ignore */
    ngOnInit() { }

    loadScript() {
        const tlJsHost = ((window.location.protocol === 'https:') ? 'https://secure.comodo.com/' : 'http://www.trustlogo.com/');
        const node = document.createElement('script');
        node.src = tlJsHost + 'trustlogo/javascript/trustlogo.js';
        node.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(node);

        setTimeout(() => {
            // node.innerText = `TrustLogo("/assets/img/logo/comodo_secure_seal_100x85_transp.png", "CL1", "none")`;
            this.loadImage();
        }, 1000);
    }

    /** To load image */
    loadImage() {
        const node1 = document.createElement('script');
        node1.type = 'text/javascript';
        node1.innerText = `TrustLogo("/assets/img/logo/comodo_secure_seal_100x85_transp.png", "CL1", "none")`;
        // document.getElementById('parentDiv').insertBefore(node1, document.getElementById('comodoLogo'));
        document.getElementsByTagName('head')[0].appendChild(node1);
    }
}
