'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">conjurer documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountAppRoutingModule.html" data-type="entity-link">AccountAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AccountModule.html" data-type="entity-link">AccountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AccountModule-73b725add0c93feca8b116522fd669a0"' : 'data-target="#xs-components-links-module-AccountModule-73b725add0c93feca8b116522fd669a0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccountModule-73b725add0c93feca8b116522fd669a0"' :
                                            'id="xs-components-links-module-AccountModule-73b725add0c93feca8b116522fd669a0"' }>
                                            <li class="link">
                                                <a href="components/AccountComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccountComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AccountModule-73b725add0c93feca8b116522fd669a0"' : 'data-target="#xs-injectables-links-module-AccountModule-73b725add0c93feca8b116522fd669a0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AccountModule-73b725add0c93feca8b116522fd669a0"' :
                                        'id="xs-injectables-links-module-AccountModule-73b725add0c93feca8b116522fd669a0"' }>
                                        <li class="link">
                                            <a href="injectables/CarrierHelper.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CarrierHelper</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CustomOutputService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CustomOutputService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AlertServiceModule.html" data-type="entity-link">AlertServiceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AlertServiceModule-8aec5538fcf63aa2b7c43796290e1938"' : 'data-target="#xs-components-links-module-AlertServiceModule-8aec5538fcf63aa2b7c43796290e1938"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AlertServiceModule-8aec5538fcf63aa2b7c43796290e1938"' :
                                            'id="xs-components-links-module-AlertServiceModule-8aec5538fcf63aa2b7c43796290e1938"' }>
                                            <li class="link">
                                                <a href="components/AlertComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AlertComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppConfigModule.html" data-type="entity-link">AppConfigModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppForgotPasswordRoutinModule.html" data-type="entity-link">AppForgotPasswordRoutinModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppLoginRoutinModule.html" data-type="entity-link">AppLoginRoutinModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-c52425edbb8cbf03e46094236fdbcd4e"' : 'data-target="#xs-components-links-module-AppModule-c52425edbb8cbf03e46094236fdbcd4e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-c52425edbb8cbf03e46094236fdbcd4e"' :
                                            'id="xs-components-links-module-AppModule-c52425edbb8cbf03e46094236fdbcd4e"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PageNotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-c52425edbb8cbf03e46094236fdbcd4e"' : 'data-target="#xs-injectables-links-module-AppModule-c52425edbb8cbf03e46094236fdbcd4e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-c52425edbb8cbf03e46094236fdbcd4e"' :
                                        'id="xs-injectables-links-module-AppModule-c52425edbb8cbf03e46094236fdbcd4e"' }>
                                        <li class="link">
                                            <a href="injectables/Logger.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>Logger</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RxJSHelper.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RxJSHelper</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthorisedFooterModule.html" data-type="entity-link">AuthorisedFooterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuthorisedFooterModule-463fb21b463ea92fb20402cbb04c337a"' : 'data-target="#xs-components-links-module-AuthorisedFooterModule-463fb21b463ea92fb20402cbb04c337a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthorisedFooterModule-463fb21b463ea92fb20402cbb04c337a"' :
                                            'id="xs-components-links-module-AuthorisedFooterModule-463fb21b463ea92fb20402cbb04c337a"' }>
                                            <li class="link">
                                                <a href="components/AuthorisedFooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthorisedFooterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthorisedHeaderModule.html" data-type="entity-link">AuthorisedHeaderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AuthorisedHeaderModule-1bfdb76a34295b2cf97759b6174e04ea"' : 'data-target="#xs-components-links-module-AuthorisedHeaderModule-1bfdb76a34295b2cf97759b6174e04ea"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AuthorisedHeaderModule-1bfdb76a34295b2cf97759b6174e04ea"' :
                                            'id="xs-components-links-module-AuthorisedHeaderModule-1bfdb76a34295b2cf97759b6174e04ea"' }>
                                            <li class="link">
                                                <a href="components/AuthorisedHeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthorisedHeaderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BatchReportAppRoutingModule.html" data-type="entity-link">BatchReportAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BatchReportModule.html" data-type="entity-link">BatchReportModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BatchReportModule-af5b3ff9e2183dc565eb44182978f8b5"' : 'data-target="#xs-components-links-module-BatchReportModule-af5b3ff9e2183dc565eb44182978f8b5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BatchReportModule-af5b3ff9e2183dc565eb44182978f8b5"' :
                                            'id="xs-components-links-module-BatchReportModule-af5b3ff9e2183dc565eb44182978f8b5"' }>
                                            <li class="link">
                                                <a href="components/BatchReportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BatchReportComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BeforeLoginFooterModule.html" data-type="entity-link">BeforeLoginFooterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BeforeLoginFooterModule-a22bea081ba39d913fe2717ff1ec735f"' : 'data-target="#xs-components-links-module-BeforeLoginFooterModule-a22bea081ba39d913fe2717ff1ec735f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BeforeLoginFooterModule-a22bea081ba39d913fe2717ff1ec735f"' :
                                            'id="xs-components-links-module-BeforeLoginFooterModule-a22bea081ba39d913fe2717ff1ec735f"' }>
                                            <li class="link">
                                                <a href="components/BeforeLoginFooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BeforeLoginFooterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BeforeLoginHeaderModule.html" data-type="entity-link">BeforeLoginHeaderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BeforeLoginHeaderModule-25aff2831e4b4f0b9ccf0f1972505b9d"' : 'data-target="#xs-components-links-module-BeforeLoginHeaderModule-25aff2831e4b4f0b9ccf0f1972505b9d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BeforeLoginHeaderModule-25aff2831e4b4f0b9ccf0f1972505b9d"' :
                                            'id="xs-components-links-module-BeforeLoginHeaderModule-25aff2831e4b4f0b9ccf0f1972505b9d"' }>
                                            <li class="link">
                                                <a href="components/BeforeLoginHeaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BeforeLoginHeaderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BudgetAppRoutingModule.html" data-type="entity-link">BudgetAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BudgetModule.html" data-type="entity-link">BudgetModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BudgetModule-4125ec72d41ff957d3add98fd66843e0"' : 'data-target="#xs-components-links-module-BudgetModule-4125ec72d41ff957d3add98fd66843e0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BudgetModule-4125ec72d41ff957d3add98fd66843e0"' :
                                            'id="xs-components-links-module-BudgetModule-4125ec72d41ff957d3add98fd66843e0"' }>
                                            <li class="link">
                                                <a href="components/BudgetComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BudgetComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CarrierAppRoutingModule.html" data-type="entity-link">CarrierAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CarrierInformationModule.html" data-type="entity-link">CarrierInformationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CarrierInformationModule-7d9f6ab535f784040c94319e5f1c07a3"' : 'data-target="#xs-components-links-module-CarrierInformationModule-7d9f6ab535f784040c94319e5f1c07a3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CarrierInformationModule-7d9f6ab535f784040c94319e5f1c07a3"' :
                                            'id="xs-components-links-module-CarrierInformationModule-7d9f6ab535f784040c94319e5f1c07a3"' }>
                                            <li class="link">
                                                <a href="components/CarrierInformationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CarrierInformationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CarrierModule.html" data-type="entity-link">CarrierModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CarrierModule-7f0a42ed86e60c3faabfa51a76a6ae8f"' : 'data-target="#xs-components-links-module-CarrierModule-7f0a42ed86e60c3faabfa51a76a6ae8f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CarrierModule-7f0a42ed86e60c3faabfa51a76a6ae8f"' :
                                            'id="xs-components-links-module-CarrierModule-7f0a42ed86e60c3faabfa51a76a6ae8f"' }>
                                            <li class="link">
                                                <a href="components/CarrierComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CarrierComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CarrierModule-7f0a42ed86e60c3faabfa51a76a6ae8f"' : 'data-target="#xs-injectables-links-module-CarrierModule-7f0a42ed86e60c3faabfa51a76a6ae8f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CarrierModule-7f0a42ed86e60c3faabfa51a76a6ae8f"' :
                                        'id="xs-injectables-links-module-CarrierModule-7f0a42ed86e60c3faabfa51a76a6ae8f"' }>
                                        <li class="link">
                                            <a href="injectables/CarrierHelper.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CarrierHelper</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CarrierPipeModule.html" data-type="entity-link">CarrierPipeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-CarrierPipeModule-9b7bf8859509f9441d9c71eecae37b1c"' : 'data-target="#xs-pipes-links-module-CarrierPipeModule-9b7bf8859509f9441d9c71eecae37b1c"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-CarrierPipeModule-9b7bf8859509f9441d9c71eecae37b1c"' :
                                            'id="xs-pipes-links-module-CarrierPipeModule-9b7bf8859509f9441d9c71eecae37b1c"' }>
                                            <li class="link">
                                                <a href="pipes/CarrierSearchFilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CarrierSearchFilterPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CarrierSharedModule.html" data-type="entity-link">CarrierSharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CarrierSharedModule-face0806483b81124f4f1c4e67567021"' : 'data-target="#xs-components-links-module-CarrierSharedModule-face0806483b81124f4f1c4e67567021"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CarrierSharedModule-face0806483b81124f4f1c4e67567021"' :
                                            'id="xs-components-links-module-CarrierSharedModule-face0806483b81124f4f1c4e67567021"' }>
                                            <li class="link">
                                                <a href="components/CarrierMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CarrierMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RiderMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RiderMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SharedComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SharedComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClientAdvisorsAppRoutingModule.html" data-type="entity-link">ClientAdvisorsAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ClientAdvisorsModule.html" data-type="entity-link">ClientAdvisorsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ClientAdvisorsModule-02ad4b055e70ce5a18825d2a5c5e8f8a"' : 'data-target="#xs-components-links-module-ClientAdvisorsModule-02ad4b055e70ce5a18825d2a5c5e8f8a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ClientAdvisorsModule-02ad4b055e70ce5a18825d2a5c5e8f8a"' :
                                            'id="xs-components-links-module-ClientAdvisorsModule-02ad4b055e70ce5a18825d2a5c5e8f8a"' }>
                                            <li class="link">
                                                <a href="components/ClientAdvisorsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ClientAdvisorsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClientAdvisorsModule-02ad4b055e70ce5a18825d2a5c5e8f8a"' : 'data-target="#xs-injectables-links-module-ClientAdvisorsModule-02ad4b055e70ce5a18825d2a5c5e8f8a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClientAdvisorsModule-02ad4b055e70ce5a18825d2a5c5e8f8a"' :
                                        'id="xs-injectables-links-module-ClientAdvisorsModule-02ad4b055e70ce5a18825d2a5c5e8f8a"' }>
                                        <li class="link">
                                            <a href="injectables/AccountService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AccountService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CommonHttpAdapterService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CommonHttpAdapterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonDirectiveModule.html" data-type="entity-link">CommonDirectiveModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-CommonDirectiveModule-68e36922090517120edff5f7bf2f3f16"' : 'data-target="#xs-directives-links-module-CommonDirectiveModule-68e36922090517120edff5f7bf2f3f16"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-CommonDirectiveModule-68e36922090517120edff5f7bf2f3f16"' :
                                        'id="xs-directives-links-module-CommonDirectiveModule-68e36922090517120edff5f7bf2f3f16"' }>
                                        <li class="link">
                                            <a href="directives/AppRestrictSpecialCharDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppRestrictSpecialCharDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/MyCurrencyFormatterDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyCurrencyFormatterDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/OnlyNumberDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">OnlyNumberDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/RestrictSpecialCharacterDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">RestrictSpecialCharacterDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/UpperCaseDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">UpperCaseDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonHttpAdapterModule.html" data-type="entity-link">CommonHttpAdapterModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CommonHttpAdapterModule-4576cea9b858d961be332b3097e646cf"' : 'data-target="#xs-injectables-links-module-CommonHttpAdapterModule-4576cea9b858d961be332b3097e646cf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommonHttpAdapterModule-4576cea9b858d961be332b3097e646cf"' :
                                        'id="xs-injectables-links-module-CommonHttpAdapterModule-4576cea9b858d961be332b3097e646cf"' }>
                                        <li class="link">
                                            <a href="injectables/AlertService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AlertService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonPipeModule.html" data-type="entity-link">CommonPipeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-CommonPipeModule-7ce4a4ed78d7047d7bbcf93a52ea6f64"' : 'data-target="#xs-pipes-links-module-CommonPipeModule-7ce4a4ed78d7047d7bbcf93a52ea6f64"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-CommonPipeModule-7ce4a4ed78d7047d7bbcf93a52ea6f64"' :
                                            'id="xs-pipes-links-module-CommonPipeModule-7ce4a4ed78d7047d7bbcf93a52ea6f64"' }>
                                            <li class="link">
                                                <a href="pipes/CurrencySymbolPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CurrencySymbolPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DateFormatNewPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateFormatNewPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DateFormatPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateFormatPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ExactSearchFilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExactSearchFilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterInputValue.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterInputValue</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/GroupByPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GroupByPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/MyCurrencyPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyCurrencyPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SafeHtmlPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeHtmlPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SearchFilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchFilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/StandardDateFormatPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StandardDateFormatPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TableFilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TableFilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ValidateValuePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateValuePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ValidatetableValuePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidatetableValuePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CustomOutputModule.html" data-type="entity-link">CustomOutputModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CustomOutputModule-bbaa1bc457bc1aaa2fdd8cdeb4afc615"' : 'data-target="#xs-components-links-module-CustomOutputModule-bbaa1bc457bc1aaa2fdd8cdeb4afc615"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CustomOutputModule-bbaa1bc457bc1aaa2fdd8cdeb4afc615"' :
                                            'id="xs-components-links-module-CustomOutputModule-bbaa1bc457bc1aaa2fdd8cdeb4afc615"' }>
                                            <li class="link">
                                                <a href="components/CustomOutputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CustomOutputComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CustomOutputModule-bbaa1bc457bc1aaa2fdd8cdeb4afc615"' : 'data-target="#xs-injectables-links-module-CustomOutputModule-bbaa1bc457bc1aaa2fdd8cdeb4afc615"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CustomOutputModule-bbaa1bc457bc1aaa2fdd8cdeb4afc615"' :
                                        'id="xs-injectables-links-module-CustomOutputModule-bbaa1bc457bc1aaa2fdd8cdeb4afc615"' }>
                                        <li class="link">
                                            <a href="injectables/CustomOutputService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CustomOutputService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FormHelper.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FormHelper</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DropdownModule.html" data-type="entity-link">DropdownModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DropdownModule-edab03ce23ef48012772ada3e9053fdf"' : 'data-target="#xs-components-links-module-DropdownModule-edab03ce23ef48012772ada3e9053fdf"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DropdownModule-edab03ce23ef48012772ada3e9053fdf"' :
                                            'id="xs-components-links-module-DropdownModule-edab03ce23ef48012772ada3e9053fdf"' }>
                                            <li class="link">
                                                <a href="components/AdminDropdownComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminDropdownComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FactFinderModule.html" data-type="entity-link">FactFinderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FactFinderModule-8ee95955a8a7ba0e1608d6464bc43bf2"' : 'data-target="#xs-components-links-module-FactFinderModule-8ee95955a8a7ba0e1608d6464bc43bf2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FactFinderModule-8ee95955a8a7ba0e1608d6464bc43bf2"' :
                                            'id="xs-components-links-module-FactFinderModule-8ee95955a8a7ba0e1608d6464bc43bf2"' }>
                                            <li class="link">
                                                <a href="components/FactFinderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FactFinderComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ForgotPasswordModule.html" data-type="entity-link">ForgotPasswordModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ForgotPasswordModule-fce753372813d54bf2a1e060c9cefa19"' : 'data-target="#xs-components-links-module-ForgotPasswordModule-fce753372813d54bf2a1e060c9cefa19"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ForgotPasswordModule-fce753372813d54bf2a1e060c9cefa19"' :
                                            'id="xs-components-links-module-ForgotPasswordModule-fce753372813d54bf2a1e060c9cefa19"' }>
                                            <li class="link">
                                                <a href="components/ForgotPasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForgotPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ResetPasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResetPasswordComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InvestmentAppRoutingModule.html" data-type="entity-link">InvestmentAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/InvestmentModule.html" data-type="entity-link">InvestmentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-InvestmentModule-c9ce440b0bf7b19aad37d0c59c55bb38"' : 'data-target="#xs-components-links-module-InvestmentModule-c9ce440b0bf7b19aad37d0c59c55bb38"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InvestmentModule-c9ce440b0bf7b19aad37d0c59c55bb38"' :
                                            'id="xs-components-links-module-InvestmentModule-c9ce440b0bf7b19aad37d0c59c55bb38"' }>
                                            <li class="link">
                                                <a href="components/InvestmentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InvestmentComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginModule.html" data-type="entity-link">LoginModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginModule-bed09f96e63b3f0de8e77d71198a3a70"' : 'data-target="#xs-components-links-module-LoginModule-bed09f96e63b3f0de8e77d71198a3a70"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginModule-bed09f96e63b3f0de8e77d71198a3a70"' :
                                            'id="xs-components-links-module-LoginModule-bed09f96e63b3f0de8e77d71198a3a70"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LogoutAppRoutingModule.html" data-type="entity-link">LogoutAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LogoutModule.html" data-type="entity-link">LogoutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LogoutModule-e1171e946886627782297e6ca0cd0ae3"' : 'data-target="#xs-components-links-module-LogoutModule-e1171e946886627782297e6ca0cd0ae3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LogoutModule-e1171e946886627782297e6ca0cd0ae3"' :
                                            'id="xs-components-links-module-LogoutModule-e1171e946886627782297e6ca0cd0ae3"' }>
                                            <li class="link">
                                                <a href="components/LogoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogoutComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LogoutModule-e1171e946886627782297e6ca0cd0ae3"' : 'data-target="#xs-injectables-links-module-LogoutModule-e1171e946886627782297e6ca0cd0ae3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LogoutModule-e1171e946886627782297e6ca0cd0ae3"' :
                                        'id="xs-injectables-links-module-LogoutModule-e1171e946886627782297e6ca0cd0ae3"' }>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthenticationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PlanModule.html" data-type="entity-link">PlanModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PlanModule-388118015bdcb46f2efdc8dfb3e7b798"' : 'data-target="#xs-components-links-module-PlanModule-388118015bdcb46f2efdc8dfb3e7b798"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PlanModule-388118015bdcb46f2efdc8dfb3e7b798"' :
                                            'id="xs-components-links-module-PlanModule-388118015bdcb46f2efdc8dfb3e7b798"' }>
                                            <li class="link">
                                                <a href="components/PlanComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PlanComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PolicyInformationModule.html" data-type="entity-link">PolicyInformationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PolicyInformationModule-c30223353b8f17be04df75def090dc07"' : 'data-target="#xs-components-links-module-PolicyInformationModule-c30223353b8f17be04df75def090dc07"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PolicyInformationModule-c30223353b8f17be04df75def090dc07"' :
                                            'id="xs-components-links-module-PolicyInformationModule-c30223353b8f17be04df75def090dc07"' }>
                                            <li class="link">
                                                <a href="components/PolicyInformationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PolicyInformationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PolicyInformationModule-c30223353b8f17be04df75def090dc07"' : 'data-target="#xs-injectables-links-module-PolicyInformationModule-c30223353b8f17be04df75def090dc07"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PolicyInformationModule-c30223353b8f17be04df75def090dc07"' :
                                        'id="xs-injectables-links-module-PolicyInformationModule-c30223353b8f17be04df75def090dc07"' }>
                                        <li class="link">
                                            <a href="injectables/CarrierInformationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CarrierInformationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ClientHelper.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ClientHelper</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PreviewAppRoutingModule.html" data-type="entity-link">PreviewAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PreviewModule.html" data-type="entity-link">PreviewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PreviewModule-b99771e5d4570b996e026e470c152472"' : 'data-target="#xs-components-links-module-PreviewModule-b99771e5d4570b996e026e470c152472"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PreviewModule-b99771e5d4570b996e026e470c152472"' :
                                            'id="xs-components-links-module-PreviewModule-b99771e5d4570b996e026e470c152472"' }>
                                            <li class="link">
                                                <a href="components/PreviewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PreviewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PreviewModule-b99771e5d4570b996e026e470c152472"' : 'data-target="#xs-injectables-links-module-PreviewModule-b99771e5d4570b996e026e470c152472"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PreviewModule-b99771e5d4570b996e026e470c152472"' :
                                        'id="xs-injectables-links-module-PreviewModule-b99771e5d4570b996e026e470c152472"' }>
                                        <li class="link">
                                            <a href="injectables/CommonHelperService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CommonHelperService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PreviewPipeModule.html" data-type="entity-link">PreviewPipeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-PreviewPipeModule-09af6b951de58ecd8c203bdd3f3cf6f9"' : 'data-target="#xs-pipes-links-module-PreviewPipeModule-09af6b951de58ecd8c203bdd3f3cf6f9"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-PreviewPipeModule-09af6b951de58ecd8c203bdd3f3cf6f9"' :
                                            'id="xs-pipes-links-module-PreviewPipeModule-09af6b951de58ecd8c203bdd3f3cf6f9"' }>
                                            <li class="link">
                                                <a href="pipes/NumberFormatWithCurrencySymbolPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NumberFormatWithCurrencySymbolPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/NumberFormatWithoutCurrencySymbolPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NumberFormatWithoutCurrencySymbolPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/NumberWithZeroCurrencySymbolPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NumberWithZeroCurrencySymbolPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ValidateDatePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateDatePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ValidateISINPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateISINPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ValidateValuePipe-1.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateValuePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ValidateValuePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ValidateValuePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RepositoryAppRoutingModule.html" data-type="entity-link">RepositoryAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RepositoryModule.html" data-type="entity-link">RepositoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RepositoryModule-f20ed03391d8787132d927d94c2bc57c"' : 'data-target="#xs-components-links-module-RepositoryModule-f20ed03391d8787132d927d94c2bc57c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RepositoryModule-f20ed03391d8787132d927d94c2bc57c"' :
                                            'id="xs-components-links-module-RepositoryModule-f20ed03391d8787132d927d94c2bc57c"' }>
                                            <li class="link">
                                                <a href="components/RepositoryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RepositoryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReviewAppRoutingModule.html" data-type="entity-link">ReviewAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ReviewModule.html" data-type="entity-link">ReviewModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ReviewModule-442190c1f32e1c204961b497495819c3"' : 'data-target="#xs-components-links-module-ReviewModule-442190c1f32e1c204961b497495819c3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ReviewModule-442190c1f32e1c204961b497495819c3"' :
                                            'id="xs-components-links-module-ReviewModule-442190c1f32e1c204961b497495819c3"' }>
                                            <li class="link">
                                                <a href="components/ReviewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReviewComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RiderAppRoutingModule.html" data-type="entity-link">RiderAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RiderCommissionModule.html" data-type="entity-link">RiderCommissionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RiderCommissionModule-774880ee88faad04a433d3d0eff85e46"' : 'data-target="#xs-components-links-module-RiderCommissionModule-774880ee88faad04a433d3d0eff85e46"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RiderCommissionModule-774880ee88faad04a433d3d0eff85e46"' :
                                            'id="xs-components-links-module-RiderCommissionModule-774880ee88faad04a433d3d0eff85e46"' }>
                                            <li class="link">
                                                <a href="components/RiderCommissionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RiderCommissionComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RiderCommissionModule-774880ee88faad04a433d3d0eff85e46"' : 'data-target="#xs-injectables-links-module-RiderCommissionModule-774880ee88faad04a433d3d0eff85e46"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RiderCommissionModule-774880ee88faad04a433d3d0eff85e46"' :
                                        'id="xs-injectables-links-module-RiderCommissionModule-774880ee88faad04a433d3d0eff85e46"' }>
                                        <li class="link">
                                            <a href="injectables/CarrierInformationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CarrierInformationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-912778fc82e7142a7226247bcee77dcc"' : 'data-target="#xs-components-links-module-SharedModule-912778fc82e7142a7226247bcee77dcc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-912778fc82e7142a7226247bcee77dcc"' :
                                            'id="xs-components-links-module-SharedModule-912778fc82e7142a7226247bcee77dcc"' }>
                                            <li class="link">
                                                <a href="components/CommonNotificationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CommonNotificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeleteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DeleteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DropdownComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DropdownComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NewPolicyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NewPolicyComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SignupAppRoutingModule.html" data-type="entity-link">SignupAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SignupModule.html" data-type="entity-link">SignupModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SignupModule-a3ce1f5f88a58f7fc08629b1d18b5d2e"' : 'data-target="#xs-components-links-module-SignupModule-a3ce1f5f88a58f7fc08629b1d18b5d2e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SignupModule-a3ce1f5f88a58f7fc08629b1d18b5d2e"' :
                                            'id="xs-components-links-module-SignupModule-a3ce1f5f88a58f7fc08629b1d18b5d2e"' }>
                                            <li class="link">
                                                <a href="components/SignupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/StatementRepositoryAppRoutingModule.html" data-type="entity-link">StatementRepositoryAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StatementRepositoryModule.html" data-type="entity-link">StatementRepositoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-StatementRepositoryModule-2b4d7a023cf49bc527f0247decaee7df"' : 'data-target="#xs-components-links-module-StatementRepositoryModule-2b4d7a023cf49bc527f0247decaee7df"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-StatementRepositoryModule-2b4d7a023cf49bc527f0247decaee7df"' :
                                            'id="xs-components-links-module-StatementRepositoryModule-2b4d7a023cf49bc527f0247decaee7df"' }>
                                            <li class="link">
                                                <a href="components/StatementRepositoryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StatementRepositoryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionAppRoutingModule.html" data-type="entity-link">TransactionAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionModule.html" data-type="entity-link">TransactionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TransactionModule-3c49c500511e79bb3bd99cb0ea1652c9"' : 'data-target="#xs-components-links-module-TransactionModule-3c49c500511e79bb3bd99cb0ea1652c9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TransactionModule-3c49c500511e79bb3bd99cb0ea1652c9"' :
                                            'id="xs-components-links-module-TransactionModule-3c49c500511e79bb3bd99cb0ea1652c9"' }>
                                            <li class="link">
                                                <a href="components/TransactionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TransactionComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/XmlfileModule.html" data-type="entity-link">XmlfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-XmlfileModule-7312dd2e724a16df51d5c20986317879"' : 'data-target="#xs-components-links-module-XmlfileModule-7312dd2e724a16df51d5c20986317879"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-XmlfileModule-7312dd2e724a16df51d5c20986317879"' :
                                            'id="xs-components-links-module-XmlfileModule-7312dd2e724a16df51d5c20986317879"' }>
                                            <li class="link">
                                                <a href="components/XmlfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">XmlfileComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/XMLViewerAppRoutingModule.html" data-type="entity-link">XMLViewerAppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/XmlViewerModule.html" data-type="entity-link">XmlViewerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-XmlViewerModule-bfa451b13b0e97fea82ed43938dc0452"' : 'data-target="#xs-components-links-module-XmlViewerModule-bfa451b13b0e97fea82ed43938dc0452"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-XmlViewerModule-bfa451b13b0e97fea82ed43938dc0452"' :
                                            'id="xs-components-links-module-XmlViewerModule-bfa451b13b0e97fea82ed43938dc0452"' }>
                                            <li class="link">
                                                <a href="components/XMLViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">XMLViewerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-XmlViewerModule-bfa451b13b0e97fea82ed43938dc0452"' : 'data-target="#xs-injectables-links-module-XmlViewerModule-bfa451b13b0e97fea82ed43938dc0452"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-XmlViewerModule-bfa451b13b0e97fea82ed43938dc0452"' :
                                        'id="xs-injectables-links-module-XmlViewerModule-bfa451b13b0e97fea82ed43938dc0452"' }>
                                        <li class="link">
                                            <a href="injectables/CommonHelperService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CommonHelperService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AccountConstant.html" data-type="entity-link">AccountConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/AccountHelper.html" data-type="entity-link">AccountHelper</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppConfig.html" data-type="entity-link">AppConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/BudgetConstant.html" data-type="entity-link">BudgetConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/CarrierConstant.html" data-type="entity-link">CarrierConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChartConfig.html" data-type="entity-link">ChartConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClientConstant.html" data-type="entity-link">ClientConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommonConstant.html" data-type="entity-link">CommonConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/DropdownConstant.html" data-type="entity-link">DropdownConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginConstant.html" data-type="entity-link">LoginConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModalConfig.html" data-type="entity-link">ModalConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/PreviewConstant.html" data-type="entity-link">PreviewConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/Review.html" data-type="entity-link">Review</a>
                            </li>
                            <li class="link">
                                <a href="classes/StatementRepositoryConstant.html" data-type="entity-link">StatementRepositoryConstant</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionConstant.html" data-type="entity-link">TransactionConstant</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BatchReportService.html" data-type="entity-link">BatchReportService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BudgetService.html" data-type="entity-link">BudgetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CarrierService.html" data-type="entity-link">CarrierService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChartHelperService.html" data-type="entity-link">ChartHelperService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonService.html" data-type="entity-link">CommonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DropdownService.html" data-type="entity-link">DropdownService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FactFinderService.html" data-type="entity-link">FactFinderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InvestmentService.html" data-type="entity-link">InvestmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoginService.html" data-type="entity-link">LoginService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogoutService.html" data-type="entity-link">LogoutService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PolicyInformationService.html" data-type="entity-link">PolicyInformationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PreviewService.html" data-type="entity-link">PreviewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReviewService.html" data-type="entity-link">ReviewService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RiderCommissionService.html" data-type="entity-link">RiderCommissionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SignupService.html" data-type="entity-link">SignupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatementRepositoryService.html" data-type="entity-link">StatementRepositoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransactionService.html" data-type="entity-link">TransactionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XmlfileService.html" data-type="entity-link">XmlfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XMLViewerService.html" data-type="entity-link">XMLViewerService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Address.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Contact.html" data-type="entity-link">Contact</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PhoneNumbers.html" data-type="entity-link">PhoneNumbers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PolicyInformation.html" data-type="entity-link">PolicyInformation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductOptions.html" data-type="entity-link">ProductOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RiderCommission.html" data-type="entity-link">RiderCommission</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});