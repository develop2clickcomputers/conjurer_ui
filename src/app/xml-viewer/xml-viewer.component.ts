import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import 'rxjs/add/operator/takeUntil';
import { RxJSHelper } from '../helpers/rxjs-helper/rxjs.helper';

import { CommonConstant } from '../constants/common/common.constant';
import { XMLViewerService } from './xml-viewer.service';
import { CommonNotificationComponent } from '../shared/notification.component';
import { CommonHttpAdapterService } from '../adapters/common-http-adapter.service';

import * as _ from 'lodash';
/** Jquery integration */
declare var $: any;

/**
 * XML viewer component class
 */
@Component({
  selector: 'app-xml-viewer',
  templateUrl: './xml-viewer.component.html',
  styleUrls: ['./xml-viewer.component.css'],
  providers: [
    XMLViewerService, CommonHttpAdapterService,
    RxJSHelper
  ]
})
export class XMLViewerComponent implements OnInit, OnDestroy {

  /** notification component reference */
  @ViewChild('notificationComponent', {static: false}) notificationComponent: CommonNotificationComponent;

  public xmlString: string;
  public xmlViewData: any;
  private xmlData: any;
  public tableFileds;
  public tableHead: any[] = [];
  public obj: any;

  public rowClass;
  public rowSibling;
  public xmlAttr;
  public xmlAttrSibling;

  public xmlElementTagList: any[] = [];
  private xmlRowClass: string;
  public notificationMessage = null;
  saveXMLButton = true;
  // cancelXMLButton = true;

  // xml
  private x = null;
  random = this.getRandomNumber();
  count = 1;

  /** @ignore */
  constructor(
    private xmlViewerService: XMLViewerService,
    private router: Router,
    private rxjsHelper: RxJSHelper
  ) { }

  /** @ignore */
  ngOnInit() {
    this.getSelectedXMLFile();
  }

  /** @ignore */
  ngOnDestroy() {
    this.rxjsHelper.unSubscribeServices.next();
    this.rxjsHelper.unSubscribeServices.complete();
  }

  /**
   * To get selected xml files
   */
  getSelectedXMLFile() {
    this.xmlViewerService.getXmlFile().subscribe(
      res => {
        if (res[CommonConstant.ERROR_CODE] === 0) {
          this.xmlString = res[CommonConstant.XML_STRING];
          this.parseXmlFileToJson();
        } else {
          console.log(res[CommonConstant.MESSAGE]);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  /**
   * To flatten passed object
   * @param object
   */
  flatten(object) {
    const check = _.isPlainObject(object) && _.size(object) === 1;
    return check ? this.flatten(_.values(object)[0]) : object;
  }

  /**
   * To parse XML to JSON
   * @param xml
   * @param type
   */
  parse(xml, type) {
    const data = {};
    const nodename = xml.nodeName;
    // console.log(nodename);

    const isText = xml.nodeType === 3,
      isElement = xml.nodeType === 1,
      body = xml.textContent && xml.textContent.trim(),
      hasChildren = xml.children && xml.children.length,
      hasAttributes = xml.attributes && xml.attributes.length;

    // if it's text just return it
    if (isText) { return xml.nodeValue.trim(); }

    // if it doesn't have any children or attributes, just return the contents
    if (!hasChildren && !hasAttributes) { return body; }

    // if it doesn't have children but _does_ have body content, we'll use that
    if (!hasChildren && body.length) { data['text'] = body; }
    //
    // if it's an element with attributes, add them to data.attributes
    if (isElement && hasAttributes) {
      data['attributes'] = _.reduce(xml.attributes, (obj, name, id) => {
        const attr = xml.attributes.item(id);
        obj[attr.name] = attr.value;
        if (nodename === 'TRXC') {
          // console.log(random);
          if (this.isUndefined(obj['id'])) {
            obj['id'] = 'txn-' + this.random;
            this.random = this.getRandomNumber();
          }
          if (this.isUndefined(obj['id1'])) {
            obj['id1'] = 'sibling-' + this.count;
            this.count = 1;
          }
          if (this.isUndefined(obj['rowType'])) {
            obj['rowType'] = 'TRXC';
          }
        } else if (nodename === 'TRX') {
          // console.log(random);
          if (this.isUndefined(obj['id'])) {
            this.random = this.getRandomNumber();
            obj['id'] = 'txn-' + this.random;
          }
          if (this.isUndefined(obj['id1'])) {
            this.count = 1;
            obj['id1'] = 'sibling-' + this.count;
            this.count++;
          }
          if (this.isUndefined(obj['rowType'])) {
            obj['rowType'] = 'TRX';
          }
          if (type !== 'trx') {
            this.random = this.getRandomNumber();
            obj['id1'] = 'sibling-1';
          }
        } else if (nodename === 'PSX') {
          obj['id'] = 'psx-' + this.random;
          this.random = this.getRandomNumber();
          obj['id1'] = 'sibling-1';
          obj['rowType'] = 'PSX';
        } else if (nodename === 'SCX') {
          obj['id'] = 'scx-' + this.random;
          this.random = this.getRandomNumber();
          obj['id1'] = 'sibling-1';
          obj['rowType'] = 'SCX';
        }
        // console.log(obj);
        return obj;
      }, {});
    }

    // recursively call #parse over children, adding results to data
    _.each(xml.children, (child) => {
      const name = child['nodeName'];

      // if we've not come across a child with this nodeType, add it as an object
      // and return here
      if (!_.has(data, name)) {
        data[name] = this.parse(child, type);
        return;
      }

      // if we've encountered a second instance of the same nodeType, make our
      // representation of it an array
      if (!_.isArray(data[name])) { data[name] = [data[name]]; }

      // and finally, append the new child
      data[name].push(this.parse(child, type));
    });

    // if we can, let's fold some attributes into the body
    _.each(data['attributes'], (value, key) => {
      if (data[key] != null) { return; }
      data[key] = value;
      delete data['attributes'][key];
    });

    // if data.attributes is now empty, get rid of it
    if (_.isEmpty(data['attributes'])) { delete data['attributes']; }

    // simplify to reduce number of final leaf nodes and return
    return this.flatten(data);
  }

  /**
   * To get random numbers
   */
  getRandomNumber() {
    return Math.floor((Math.random() * 10000) + 1);
  }

  /**
   * To parse xml to json object/array
   */
  parseXmlFileToJson() {

    // use the DOMParser browser API to convert text to a Document
    const XML = new DOMParser().parseFromString(this.xmlString, 'text/xml');

    let type;
    const fileName = this.xmlViewerService.getFileName();
    const index = fileName.lastIndexOf('.');
    type = fileName.substr(index + 1);
    // and then use #parse to convert it to a JS object
    const obj = this.parse(XML, type);
    this.obj = obj;
    this.xmlData = obj;

    this.createXMLView1();
  }

  /**
   * XML VIEWER INTEGRATION
   */

  /**
   * To create xml view
   */
  createXMLView() {
    const head = this.getDiv();
    const startTag = this.getTagElement('<');
    const tag = this.getTagElement('xml');
    const space = this.getSpace();
    const attrName = this.getAttrNameElement('version');
    const eq = this.getElementWithText(' = ');
    const val = this.getAttrValueElement('4.0');
    const endTag = this.getTagElement(' />');
    head.appendChild(startTag);
    head.appendChild(tag);
    head.appendChild(space);
    head.appendChild(attrName);
    head.appendChild(eq);
    head.appendChild(val);
    head.appendChild(endTag);
    this.x = head;
    document.body.appendChild(head);
  }

  /**
   * To create xml view
   */
  createXMLView1() {
    const data = this.obj;
    const view = document.getElementById('appendXmlView');
    // this.populateRow(data, 'AdventXML', document.body, 0);
    this.populateRow(data, 'AdventXML', view, 0);

    this.addEventToXmlRow();
  }

  /**
   * It will return elemtn based on trx, psx or scx
   */
  getXMLRowElement() {
    let el;
    if (document.querySelectorAll('*[class*="txn-"]').length > 0) {
      el = document.querySelectorAll('*[class*="txn-"]')
    } else if (document.querySelectorAll('*[class*="psx-"]').length > 0) {
      el = document.querySelectorAll('*[class*="psx-"]');
    } else if (document.querySelectorAll('*[class*="scx-"]').length > 0) {
      el = document.querySelectorAll('*[class*="scx-"]');
    }

    return el;
  }

  /**
   * To add click event to xml row
   */
  addEventToXmlRow() {
    const el = this.getXMLRowElement();
    for (let i = 0; i < el.length; i++) {
      const classAttr = el[i].getAttribute('class');
      if (classAttr.indexOf('xml-row') !== -1) {
        el[i].addEventListener('click', this.XMLRowClick.bind(this), false);
        // el[i].addEventListener('mouseover', this.XMLRowMouseover.bind(this), false);
        // el[i].addEventListener('mouseout', this.XMLRowMouseout.bind(this), false);
      }
    }

    setTimeout(() => {
      this.bindMouseEvent();
    });
  }

  /**
   * To check substring to class attribute
   * @param classAttrIndex
   */
  checkElemntIndexOf(classAttrIndex) {
    let checkedIndex;
    if (classAttrIndex.indexOf('txn-') !== -1) {
      checkedIndex = classAttrIndex.indexOf('txn-') !== -1;
    } else if (classAttrIndex.indexOf('psx-') !== -1) {
      checkedIndex = classAttrIndex.indexOf('psx-') !== -1;
    } else if (classAttrIndex.indexOf('scx-') !== -1) {
      checkedIndex = classAttrIndex.indexOf('scx-') !== -1
    }

    return checkedIndex;
  }

  /**
   * Clik event on xml row
   * @param event
   */
  XMLRowClick(event) {
    if (event.target) {
      const ancestorElement = this.findAncestor(event.target, 'xml-row');
      // console.log(this.xmlData);
      const classAttr = ancestorElement.getAttribute('class').split(' ');
      if (this.isArray(classAttr)) {
        for (const index in classAttr) {
          if (this.checkElemntIndexOf(classAttr[index])) {
            this.getXMLFields(this.xmlData, classAttr[index]);
            this.getTableRowValues(classAttr[index]);
          }
        }
      }
    }

  }

  /**
   * Mouseover on xml row
   * @param event
   */
  XMLRowMouseover(event) {
    if (event.target) {
      const ancestorElement = this.findAncestor(event.target, 'xml-row');
      const classes = event.target.getAttribute('class');
      if ( classes == null || classes.indexOf('xml-row') === -1) {
        return;
      }
      const classList = classes.split(' ');
      if (this.isArray(classList)) {
        for (const index in classList) {
          if (this.checkElemntIndexOf(classList[index])) {
            this.xmlRowClass = classList[index];
            const clsElement = (document.getElementsByClassName(classList[index]));
            for (let j = 0; j < clsElement.length; j++) {
              const element = (<HTMLInputElement>document.getElementsByClassName(classList[index])[j]);
              element.style.backgroundColor = '#f2f2f2';
              element.style.cursor = 'pointer';
            }
          }
        }
      }
    }
  }

  /**
   * Mouseout on xml row
   * @param any event
   */
  XMLRowMouseout(event: any) {
    if (event.target) {
      const clsElement = (document.getElementsByClassName(this.xmlRowClass));
      const classes = event.target.getAttribute('class');
      if ( classes == null || classes.indexOf('xml-row') === -1) {
        return;
      }
      for (let j = 0; j < clsElement.length; j++) {
        const element = (<HTMLInputElement>document.getElementsByClassName(this.xmlRowClass)[j]);
        element.style.backgroundColor = 'transparent';
        element.style.cursor = 'pointer';
      }
    }
  }

  /**
   * To find ancestor of any element
   * @param el
   * @param cls
   */
  findAncestor(el, cls) {
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
  }

  /**
   * To get table input fileds value
   * @param rowClass
   */
  getTableRowValues(rowClass) {
    // console.log('get table row head***********');
    this.rowClass = rowClass;
    this.getTableRowHeading(rowClass);
    setTimeout(() => {
      const rowElement = document.getElementsByClassName(rowClass);
      let count = 1;
      for (let i = 0; i < rowElement.length; i++) {
        this.tableFileds.forEach((field) => {
          if (document.getElementById(this.rowClass + '_' + 'sibling-' + count + '_' + field) != null) {
            const text = document.getElementById(this.rowClass + '_' + 'sibling-' + count + '_' + field).innerText;
            // remove disabled attribute
            const x = (<HTMLInputElement>document.getElementById(this.rowClass + '_' + 'sibling-' + count + '_' + field + '_' + count));
            x.removeAttribute('disabled');

            this.setInputValue(count, text, field);
          } else {
            const x = (<HTMLInputElement>document.getElementById(this.rowClass + '_' + 'sibling-' + count + '_' + field + '_' + count));
            x.value = '-';
            x.style.textAlign = 'center';
            x.setAttribute('disabled', 'true');
          }
        })
        count++;
      }

    });

  }

  /**
   * To combine array into one array
   */
  conbineListValue() {
    const list1 = [];
    if (this.xmlData.AccountProvider.hasOwnProperty('TRXList')) {
      Array.prototype.push.apply(list1, this.xmlData.AccountProvider.TRXList.TRX);
      Array.prototype.push.apply(list1, this.xmlData.AccountProvider.TRXList.TRXC);
    } else if (this.xmlData.AccountProvider.hasOwnProperty('PSXList')) {
      Array.prototype.push.apply(list1, this.xmlData.AccountProvider.PSXList.PSX);
    } else if (this.xmlData.AccountProvider.hasOwnProperty('SCXList')) {
      Array.prototype.push.apply(list1, this.xmlData.AccountProvider.SCXList.SCX);
    }

    return list1;
  }

  /**
   * To bind mouseover and mouseout
   */
  bindMouseEvent() {
    const list1 = this.conbineListValue();
    list1.forEach(element => {
      $('.' + element.id).mouseover(() => {
        $('.' + element.id).css({'background-color': '#c9c9c9', 'cursor': 'pointer'});
      });
      $('.' + element.id).mouseout(() => {
          if ($('.' + element.id).hasClass('activeRowElement')) {

          } else {
            $('.' + element.id).css({'background': 'none', 'cursor': 'none'});
          }
      });

      // to highlight selected xml row
      $('.' + element.id).click(() => {
        this.removeBackground();
        if ($('.xml-row').hasClass('activeRowElement')) {
          $('.xml-row').css({'background': 'transparent', 'cursor': 'none'}).removeClass('activeRowElement');
        }
        $('.' + element.id).css({'background-color': '#a3a3a3', 'cursor': 'pointer'}).addClass('activeRowElement');
      });
    });
  }

  /**
   * To get table headings
   * @param rowClass
   */
  getTableRowHeading(rowClass) {
    this.tableHead = [];
    const rowElement = document.getElementsByClassName(rowClass);
    const list1: any[] = this.conbineListValue();

    /* let count = 1;
    for (let i = 0; i < rowElement.length; i++) {
      console.log(rowElement[i]);
      this.tableHead.push('sibling-' + count);
      count++;
    } */

    list1.forEach(element => {
      if (element.id === rowClass) {
        this.tableHead.push(element.rowType);
      }
    })
  }

  /**
   * To set input values
   * @param count
   * @param value
   * @param field
   */
  setInputValue(count, value, field) {
    if (document.getElementById(this.rowClass + '_' + 'sibling-' + count + '_' + field) != null) {
      (<HTMLInputElement>document.getElementById(this.rowClass + '_' + 'sibling-' + count + '_' + field + '_' + count)).value = value;
    } else {
      document.getElementById(this.rowClass + '_' + 'sibling-' + count + '_' + field + '_' + count).parentElement.innerHTML = '-';
      // tslint:disable-next-line:max-line-length
      document.getElementById(this.rowClass + '_' + 'sibling-' + count + '_' + field + '_' + count).parentElement.style.textAlign = 'center';
    }
  }

  /**
   * To update input fields value
   * @param event
   */
  updateValue(event) {
    if (event.target) {
      // To enable buttons
      this.saveXMLButton = false;

      const inputELementId = event.target.id;
      const index = inputELementId.lastIndexOf('_');
      const targetId = inputELementId.substr(0, index);
      const activeElement = (<HTMLInputElement>document.getElementById(targetId));
      // activeElement.style.backgroundColor = 'cyan';
      activeElement.innerHTML = event.target.value;
      this.removeBackground();
      (<HTMLInputElement>document.getElementsByClassName(targetId)[0]).style.backgroundColor = '#E5FF00';
    }
  }

  /**
   * To remove background from previous active element
   */
  removeBackground() {
    const el = this.getXMLRowElement();
    for (let i = 0; i < el.length; i++) {
      const classAttr = el[i].getAttribute('class');
      if (classAttr.indexOf('activeRowElement') < 0) {
        (<HTMLInputElement>el[i]).style.backgroundColor = 'transparent';
      }
      // (<HTMLInputElement>el[i]).style.backgroundColor = 'transparent';
    }
  }

  /**
   * To hightlight correspondong element
   * @param event
   */
  hightlightCorrespondingElement(event) {
    if (event.target) {
      const inputELementId = event.target.id;
      const index = inputELementId.lastIndexOf('_');
      const targetId = inputELementId.substr(0, index);
      this.removeBackground();
      (<HTMLInputElement>document.getElementsByClassName(targetId)[0]).style.backgroundColor = '#E5FF00';
    }
  }

  /**
   * To get xml fileds to populate it into table
   * @param xmlData
   * @param id
   */
  getXMLFields(xmlData, id) {
    const list1 = this.conbineListValue();
    const resultList = [];
    let set = new Set();
    for (let i = 0; i < list1.length; i++) {
      if (list1[i].id === id) {
        Array.prototype.push.apply(resultList, Object.keys(list1[i]));
      }
    }
    set = new Set(resultList);
    if (set.has('id')) {
      set.delete('id');
    }
    if (set.has('id1')) {
      set.delete('id1');
    }
    if (set.has('rowType')) {
      set.delete('rowType');
    }
    // console.log(set);
    this.tableFileds = set;
  }

  /**
   * To get updated xml file
   */
  getUpdatedXMLFile() {
    let text = document.getElementById('appendXmlView').innerText;
    // console.log(text);
    text = text.replace(new RegExp('\r', 'g'), '');
    text = text.replace(new RegExp('\n', 'g'), '');
    text = text.replace(new RegExp('>', 'g'), '>\r\n');

    return text;
  }

  /**
   * To save xml file
   */
  exportXMLFile() {
    const text = this.getUpdatedXMLFile();
    if (text) {
      this.xmlViewerService.saveXMLFile(text).subscribe(
        res => {
          // console.log(res);
          if (res[CommonConstant.ERROR_CODE] === 0) {
            // this.router.navigateByUrl('/repo/xmlfile');
            this.saveXMLButton = true;
            this.notificationComponent.openNotificationModal(res[CommonConstant.MESSAGE]);
          } else {
            this.notificationMessage = res[CommonConstant.MESSAGE];
            this.notificationComponent.openComonNotificationModal();
          }
        },
        error => {
          // console.log(error);
          this.notificationMessage = 'Something went wrong..Please try again later';
          this.notificationComponent.openComonNotificationModal();
        }
      )
    }
  }

  /**
   * To download updated xml files
   */
  downloadXMLFile() {
    const fileName = this.xmlViewerService.getFileName();
    const text = this.getUpdatedXMLFile();
    const element = document.createElement('a');
    if (text) {
      element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
      // CommonConstant.XML_FILE_HEAD + res[CommonConstant.BYTE_CODE];
      element.setAttribute('download', fileName);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }

  /**
   * To cancel update xml and redirect to xml repo page
   */
  cancelXMLFileUpdate() {
    this.router.navigateByUrl('/repo/xmlfile');
  }

  /**
   * To populate rows
   * @param data
   * @param tag
   * @param element
   * @param count
   */
  populateRow(data, tag, element, count) {
    const div = this.getDiv();
    if (!this.isNull(data) && !this.isUndefined(data['id'])) {
      const elements = document.getElementsByClassName(data['id']);
      if (elements.length > 0) {
        const ele = elements[elements.length - 1];
        this.insertAfter(div, ele);
      } else {
        element.appendChild(div);
      }
    } else {
      element.appendChild(div);
    }

    // const spaceEle = getSpaceShift(count);
    const startTag = this.getTagElement('<');
    const tagEle = this.getTagElement(tag);
    let space = this.getSpace();
    // div.appendChild(spaceEle);
    div.appendChild(startTag);
    div.appendChild(tagEle);
    // div.appendChild(space);
    count++;

    const dict = {};
    let list = [];
    let id = null;
    let id1 = null;
    if (!this.isNull(data)) {
      id = data['id'];
      id1 = data['id1'];
    }
    // console.log(id1);
    for (const value in data) {
      if (this.isNumber(data[value]) || this.isString(data[value])) {
        if (value === 'Imports' || value === 'InterpretFXRates') {
          continue;
        } else if ((value === 'id') || (value === 'id1')) {
          div.classList.add(data[value]);
          continue;
        } else if (value === 'rowType') {
          continue;
        }
        space = this.getSpace();
        div.appendChild(space);
        const span = this.getAttrElement(value, data[value], id, id1);
        div.appendChild(span);

      } else if (this.isObject(data[value]) || this.isArray(data[value])) {
        this.obj = data[value];
        const key = value;
        dict[key] = this.obj;
      } else if (this.isArray(data[value])) {
        list = data[value];
        dict[value] = list;
      }
    }
    if (Object.keys(dict).length > 0) {
      let end = this.getTagElement('>');
      div.appendChild(end);
      if (tag === 'AccountProvider') {

        this.populateRow(null, 'Imports', div, count);
        this.populateRow(null, 'InterpretFXRates', div, count);
      }
      for (const key in dict) {
        if (this.isArray(dict[key])) {
          // tslint:disable-next-line:forin
          for (const index in dict[key]) {
            this.populateRow(dict[key][index], key, div, count);
          }
        } else {
          this.populateRow(dict[key], key, div, count);
        }

      }

      end = this.getTagElement('</' + tag + '>');
      div.appendChild(end);

    } else {
      const end = this.getTagElement('/>');
      div.appendChild(end);
    }
  }

  /**
   * Helper functions
   */

  /**
   * To insert after a element
   * @param newNode
   * @param referenceNode
   */
  insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  /**
   * To get div element
   */
  getDiv() {
    const element = document.createElement('div');
    element.setAttribute('class', 'xml-row');
    return element;
  }

  /**
   * To get span element
   */
  getSpan() {
    const element = document.createElement('span');
    return element;
  }

  /**
   * To get space shift
   * @param count
   */
  getSpaceShift(count) {
    const element = document.createElement('span');
    for (let i = 0; i < count; i++) {
      const t = document.createTextNode('&nbsp;');
      element.appendChild(t);
    }
    return element;
  }

  /**
   * To get space element
   */
  getSpace() {
    return this.getElementWithText(' ');
  }

  /**
   * To get tag of element
   * @param name
   */
  getTagElement(name) {
    const element = this.getElementWithText(name);
    element.setAttribute('class', 'xml-tag');
    return element;
  }

  /**
   * To get attribute of an element
   * @param name
   * @param value
   * @param id
   * @param id1
   */
  getAttrElement(name, value, id, id1) {
    const element = this.getSpan();
    const nameEle = this.getAttrNameElement(name);
    const eq = this.getEqualElement();
    const newId = this.getId(name, id, id1);
    const valueEle = this.getAttrValueElement(value, newId);
    // console.log(newId);
    if (newId.indexOf('undefined') === -1) {
      element.setAttribute('class', newId);
    }
    element.appendChild(nameEle);
    element.appendChild(eq);
    element.appendChild(valueEle);

    return element;
  }

  /**
   * To get ID
   * @param name
   * @param id
   * @param id1
   */
  getId(name, id, id1) {
    return id + '_' + id1 + '_' + name;
  }

  /**
   * To get element for equal symbol
   */
  getEqualElement() {
    const element = this.getElementWithText('=');
    element.setAttribute('class', 'xml-equal');
    return element;
  }

  /**
   * To get attribute name of element
   * @param name
   */
  getAttrNameElement(name) {
    const element = this.getElementWithText(name);
    element.setAttribute('class', 'attribute-name');
    return element;
  }

  /**
   * TO get attribute value element
   * @param value
   * @param newId
   */
  getAttrValueElement(value, newId?) {
    const span = this.getSpan();
    const quotes1 = this.getElementWithText('"');
    const quotes2 = this.getElementWithText('"');
    const element = this.getElementWithText(value);
    span.setAttribute('class', 'attribute-value');
    if (value === 'tbd') {
      span.classList.add('warning');
    }
    if (newId.indexOf('undefined') === -1) {
      element.setAttribute('id', newId);
    }
    span.appendChild(quotes1);
    span.appendChild(element);
    span.appendChild(quotes2);
    return span;
  }

/**
 * To get ELement with text
 * @param text
 */
  getElementWithText(text) {
    const element = document.createElement('span');
    const t = document.createTextNode(text);
    element.appendChild(t);
    return element;
  }

  /**
   * Returns if a value is a string
   * @param value
   */
  isString(value) {
    return typeof value === 'string' || value instanceof String;
  };

  /**
   * Returns if a value is really a number
   * @param value
   */
  isNumber(value) {
    return typeof value === 'number' && isFinite(value);
  };

  /**
   * Returns if a value is an array
   * @param value
   */
  isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
  };

  /**
   * Returns if a value is a function
   * @param value
   */
  isFunction(value) {
    return typeof value === 'function';
  };

  /**
   * Returns if a value is an object
   * @param value
   */
  isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
  };

  /**
   * Returns if a value is null
   * @param value
   */
  isNull(value) {
    return value === null;
  };

  /**
   * Returns if a value is undefined
   * @param value
   */
  isUndefined(value) {
    return typeof value === 'undefined';
  };

  /**
   * Returns if a value is a boolean
   * @param value
   */
  isBoolean(value) {
    return typeof value === 'boolean';
  };

  /**
   * Returns if a value is a regexp
   * @param value
   */
  isRegExp(value) {
    return value && typeof value === 'object' && value.constructor === RegExp;
  };

  /**
   * Returns if value is an error object
   * @param value
   */
  isError(value) {
    return value instanceof Error && typeof value.message !== 'undefined';
  };

  /**
   * Returns if value is a date object
   * @param value
   */
  isDate(value) {
    return value instanceof Date;
  };

  /**
   * Returns if a Symbol
   * @param value
   */
  isSymbol(value) {
    return typeof value === 'symbol';
  };

}
