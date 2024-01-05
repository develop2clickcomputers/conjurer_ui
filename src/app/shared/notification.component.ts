import { Component, OnInit, Input, Output, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from './common/modal.config';

/**
* This class represents the lazy loaded CommonNotificationComponent.
*/
@Component({
    moduleId: module.id,
    selector: 'app-common-notification',
    templateUrl: 'notification.component.html',
    // styleUrls: ['shared.component.css'],
})
export class CommonNotificationComponent implements OnInit, OnDestroy {

    /** Notification modal component class */
    @ViewChild('commonNotificationModal', {static: false}) commonNotificationModal: TemplateRef<any>;

    /** To grab notification message if present */
    @Input() notificationMessage: any;

    public modalRef: BsModalRef;

    /**
     * Notification component class dependencies
     * @param BsModalService modalService
     * @param ModalConfig modalConfig
     */
    constructor(
        private modalService: BsModalService,
        private modalConfig: ModalConfig
    ) {}

    /** @ignore */
    ngOnInit() {
    }

    /** @ignore */
    ngOnDestroy() {
        this.cancelCommonNotificationModal();
    }

    /**
     * To open policy modal
     */
    openComonNotificationModal() {
        this.modalRef = this.modalService.show(this.commonNotificationModal,
            Object.assign({}, this.modalConfig.config, {class: 'modal-md'}));
    }

    /**
     * To close or hide policy modal
     */
    cancelCommonNotificationModal() {
        if (this.modalRef) {
            this.modalRef.hide();
            this.modalRef = null;
        }
    }

    /**
     * To open notification modal based on message provided to it
     * @param string mgs
     */
    openNotificationModal(msg?: string) {
        if (!this.modalRef) {
            if (msg) {
                this.notificationMessage = msg;
            } else {
                this.notificationMessage = 'Something went wrong..Please try again';
            }
            this.openComonNotificationModal();
        }
    }

}
