"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDom = require("react-dom");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var strings = require("WpDocumentLibInfoWebPartStrings");
var WpDocumentLibInfo_1 = require("./components/WpDocumentLibInfo");
var WpDocumentLibInfoWebPart = (function (_super) {
    __extends(WpDocumentLibInfoWebPart, _super);
    function WpDocumentLibInfoWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WpDocumentLibInfoWebPart.prototype.render = function () {
        var element = React.createElement(WpDocumentLibInfo_1.default, {
            description: this.properties.description,
            siteurl: this.context.pageContext.web.absoluteUrl,
            spHttpClient: this.context.spHttpClient,
            DocumentLibraryName: this.properties.description,
        });
        ReactDom.render(element, this.domElement);
    };
    Object.defineProperty(WpDocumentLibInfoWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    WpDocumentLibInfoWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                }),
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return WpDocumentLibInfoWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = WpDocumentLibInfoWebPart;

//# sourceMappingURL=WpDocumentLibInfoWebPart.js.map
