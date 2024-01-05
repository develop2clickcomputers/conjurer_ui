import { Component, OnInit, Input, Output, TemplateRef, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import 'rxjs/add/operator/takeUntil';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { ModalConfig } from '../common/modal.config';
import { CommonService } from '../../services/common/common.service';
import { RxJSHelper } from '../../helpers/rxjs-helper/rxjs.helper';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CommonConstant } from '../../constants/common/common.constant';
import { CommonNotificationComponent } from '../notification.component';

/**
* This class represents the lazy loaded DeleteComponent.
*/
@Component({
    selector: 'app-delete',
    templateUrl: 'delete.component.html',
    // styleUrls: ['shared.component.css'],
})
export class DeleteComponent implements OnInit, OnDestroy {

    /** Delete modal reference */
    @ViewChild('deleteModal', {static: false}) deleteModal: TemplateRef<any>;

    /** Notification component reference */
    @ViewChild('notificationComponent', {static: false})
    private notificationComponent: CommonNotificationComponent;

    // tslint:disable-next-line:no-output-on-prefix
    @Output() onDelete: EventEmitter<any> = new EventEmitter();

    public modalRef: BsModalRef;

    public filterPolicyPlanType;
    public requestData: any = {};

    /** @ignore */
    constructor(
        private modalService: BsModalService,
        private modalConfig: ModalConfig,
        private commonService: CommonService,
        private rxjsHelper: RxJSHelper,
        private loaderService: Ng4LoadingSpinnerService,
    ) { }

    /** @ignore */
    ngOnInit() {
        // this.deleteModal();
    }

    /** @ignore */
    ngOnDestroy() {
        this.rxjsHelper.unSubscribeServices.next();
        this.rxjsHelper.unSubscribeServices.complete();
        this.closeDeleteModal();
    }

    /**
     * To open delete Modal
     */
    openDeleteModal() {
        this.modalRef = this.modalService.show(this.deleteModal,
            Object.assign({}, this.modalConfig.config, { class: 'modal-sm deleteTransconfModal' }));
    }

    /**
     * To close or hide policy modal
     */
    closeDeleteModal() {
        if (this.modalRef) {
            this.modalRef.hide();
            this.modalRef = null;
        }
    }

    /** To delete */
    delete() {
        if (Object.keys(this.requestData).length > 0) {
            if (!this.requestData['apiName']) {
                this.notificationComponent.openNotificationModal();
                return;
            }
            const apiName = this.requestData['apiName'];
            delete this.requestData['apiName'];
            this.loaderService.show();
            this.commonService.delete(apiName, this.requestData).subscribe(
                    res => {
                        this.closeDeleteModal();
                        this.loaderService.hide();
                        if (res[CommonConstant.ERROR_CODE] === 0) {
                            const resData = res[CommonConstant.DATA];
                            this.onDelete.emit('delete successfully');
                        } else {
                            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
                        }
                    },
                    error => {
                        this.closeDeleteModal();
                        this.loaderService.hide();
                        this.notificationComponent.openNotificationModal();
                    }
                );
        }
    }

}
