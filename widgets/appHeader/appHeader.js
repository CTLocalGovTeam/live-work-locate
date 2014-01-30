﻿/*global dojo,define,document */
/*jslint sloppy:true */
/** @license
| Version 10.2
| Copyright 2013 Esri
|
| Licensed under the Apache License, Version 2.0 (the "License");
| you may not use this file except in compliance with the License.
| You may obtain a copy of the License at
|
|    http://www.apache.org/licenses/LICENSE-2.0
|
| Unless required by applicable law or agreed to in writing, software
| distributed under the License is distributed on an "AS IS" BASIS,
| WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
| See the License for the specific language governing permissions and
| limitations under the License.
*/
//============================================================================================================================//
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-attr",
    "dojo/dom",
    "dojo/dom-class",
     "dojo/topic",
     "dojo/query",
    "dojo/text!./templates/appHeaderTemplate.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!nls/localizedStrings"
],
     function (declare, domConstruct, lang, array, domAttr, dom, domClass, topic, query, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls) {

         //========================================================================================================================//

         return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
             templateString: template,
             nls: nls,

             /**
             * create header panel
             *
             * @param {string} dojo.configData.ApplicationName Applicaton name specified in configuration file
             *
             * @class
             * @name widgets/appHeader/appHeader
             */
             postCreate: function () {
                 topic.subscribe("loadingIndicatorHandler", (lang.hitch(this, function () {
                     this._showProgressIndicator();
                 })));
                 topic.subscribe("hideLoadingIndicatorHandler", (lang.hitch(this, function () {
                     this._hideProgressIndicator();
                 })));

                 /**
                 * add applicationHeaderParentContainer to div for header panel and append to esriCTParentDivContainer container
                 *
                 * applicationHeaderParentContainer container for application header
                 * @member {div} applicationHeaderParentContainer
                 * @private
                 * @memberOf widgets/appHeader/appHeader
                 */
                 var applicationHeaderDiv = domConstruct.create("div", {}, dom.byId("esriCTParentDivContainer"));
                 domConstruct.place(this.applicationHeaderParentContainer, applicationHeaderDiv);
                 this._loadApplicationHeaderIcon();
                 /**
                 * set browser header and application header to application name
                 *
                 * applicationHeaderName container for application name
                 * @member {div} applicationHeaderName
                 * @private
                 * @memberOf widgets/appHeader/appHeader
                 */
                 document["title"] = dojo.configData.ApplicationName;
                 //  domAttr.set(this.applicationHeaderName, "innerHTML", dojo.configData.ApplicationName);
                 for (var i in dojo.configData.Workflows) {
                     domConstruct.create("span", { innerHTML: i, class: "esriCTApplicationHeaderTextTD " + i }, this.applicationHeaderName);
                 }
             },

             /**
             * append widgets to header panel
             * @param {object} widgets Contain widgets to be displayed in header panel
             * @memberOf widgets/appHeader/appHeader
             */
             loadHeaderWidgets: function (widgets) {

                 /**
                 * applicationHeaderWidgetsContainer container for header panel widgets
                 * @member {div} applicationHeaderWidgetsContainer
                 * @private
                 * @memberOf widgets/appHeader/appHeader
                 */
                 for (var i in widgets) {
                     if (widgets[i].domNode) {
                         domConstruct.place(widgets[i].domNode, this.applicationHeaderWidgetsContainer);
                     }
                 }
                 if (location.hash) {
                     var workflow = location.hash.split("#")[1].split("?app=")[1];
                     domClass.add(query("." + workflow)[0], "esriCTApplicationHeaderTextSelected");
                 }
             },
             /**
                         * load Application Header Icon
                         * @memberOf widgets/appHeader/appHeader
                         */
             _loadApplicationHeaderIcon: function () {
                 if (dojo.configData.ApplicationIcon && lang.trim(dojo.configData.ApplicationIcon).length != 0) {
                     this._loadIcons("apple-touch-icon-precomposed", dojo.configData.ApplicationIcon);
                     this._loadIcons("apple-touch-icon", dojo.configData.ApplicationIcon);
                     domConstruct.create("img", { "class": "esriCTApplicationHeaderIcon", "src": dojoConfig.baseURL + dojo.configData.ApplicationIcon }, this.applicationHeaderParentContainer);
                 }
             },
             _loadIcons: function (rel, iconPath) {
                 var icon = domConstruct.create("link");
                 icon.rel = rel;
                 icon.type = "image/x-icon";
                 icon.href = dojoConfig.baseURL + iconPath;
                 document.getElementsByTagName('head')[0].appendChild(icon);
             },
             _showProgressIndicator: function () {
                 domClass.replace(this.divLoadingIndicator, "displayBlockAll", "displayNoneAll");

             },
             _hideProgressIndicator: function () {
                 domClass.replace(this.divLoadingIndicator, "displayNoneAll", "displayBlockAll");
             }
         });
     });