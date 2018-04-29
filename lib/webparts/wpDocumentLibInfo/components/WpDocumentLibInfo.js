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
var WpDocumentLibInfo_module_scss_1 = require("./WpDocumentLibInfo.module.scss");
var react_countup_1 = require("react-countup");
var sp_loader_1 = require("@microsoft/sp-loader");
var jquery = require("jquery");
var WpDocumentLibInfo = (function (_super) {
    __extends(WpDocumentLibInfo, _super);
    function WpDocumentLibInfo(props, context) {
        var _this = _super.call(this, props) || this;
        _this.onComplete = function () {
        };
        _this.onStart = function () {
        };
        _this.state = {
            spHttpClient: _this.props.spHttpClient,
            DocumentLibraryName: _this.props.DocumentLibraryName,
            TotalItem: "",
            TotalFolders: "0",
            TotalFiles: "",
            description: "",
            siteurl: "",
            ItemStart: 0,
            ItemEnd: 4000,
            LoopForList: 0,
            FileArray: [],
            DocFiles: 0,
            XlsFiles: 0,
            PDFFiles: 0,
            P3Files: 0,
            Photos: 0,
            Drawing: 0,
            TextFiles: 0,
            MISCFiles: 0,
        };
        sp_loader_1.SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css');
        return _this;
    }
    WpDocumentLibInfo.prototype.componentDidMount = function () {
        this._GetListTotalCount();
    };
    WpDocumentLibInfo.prototype._GetListTotalCount = function () {
        var reactHandler = this;
        var NewISiteUrl = this.props.siteurl;
        var NewSiteUrl = NewISiteUrl.replace("SitePages", "");
        if (this.state.DocumentLibraryName == "") {
            return;
        }
        console.log(NewSiteUrl);
        jquery.ajax({
            url: NewSiteUrl + "/_api/web/Lists/getbytitle('" + this.state.DocumentLibraryName + "')/ItemCount",
            type: "GET",
            headers: { 'Accept': 'application/json; odata=verbose;' },
            success: function (resultData) {
                this.setState({ TotalItem: resultData.d.ItemCount });
                var number = parseInt(this.state.TotalItem);
                var LoopToQuery = number / 4000;
                var LooingItemInt = Math.ceil(LoopToQuery);
                this.setState({ LoopForList: LooingItemInt });
                this.QueryFilesAndFoldersWrapper();
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    };
    WpDocumentLibInfo.prototype.GetRootFolders = function () {
        var reactHandler = this;
        var NewISiteUrl = this.props.siteurl;
        var NewSiteUrl = NewISiteUrl.replace("SitePages", "");
        if (this.state.DocumentLibraryName == "") {
            return;
        }
        jquery.ajax({
            url: NewSiteUrl + "/_api/web/Lists/Getbytitle('" + this.state.DocumentLibraryName + "')/rootfolder/folders",
            type: "GET",
            headers: { 'Accept': 'application/json; odata=verbose;' },
            success: function (resultData) {
                this.setState({ TotalFolders: resultData.d.results.length });
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    };
    WpDocumentLibInfo.prototype.QueryITems = function () {
        var reactHandler = this;
        var NewISiteUrl = this.props.siteurl;
        var NewSiteUrl = NewISiteUrl.replace("SitePages", "");
        if (this.state.DocumentLibraryName == "") {
            return;
        }
        jquery.ajax({
            url: NewSiteUrl + "/_api/web/lists/getbytitle('" + this.state.DocumentLibraryName + "')/items?$select=ID,EncodedAbsUrl,FileRef,FileLeafRef,File_x0020_Type&$filter=ID gt " + this.state.ItemStart + " and ID lt " + this.state.ItemEnd,
            type: "GET",
            headers: { 'Accept': 'application/json; odata=verbose;' },
            success: function (resultDataItems) {
                var TempArray = this.state.FileArray;
                for (var x = 0; x < resultDataItems.d.results.length; x++) {
                    TempArray.push(resultDataItems.d.results[x]["ID"].toString());
                    if (resultDataItems.d.results[x]["File_x0020_Type"] != null) {
                        reactHandler.MakeDocuments(resultDataItems.d.results[x]["File_x0020_Type"].toString());
                    }
                }
                var GlobalLoop = this.state.LoopForList;
                GlobalLoop = GlobalLoop - 1;
                var tempStart = this.state.ItemStart + 4000;
                var tempEnd = this.state.ItemEnd + 4000;
                this.setState({
                    ItemStart: tempStart,
                    ItemEnd: tempEnd,
                    LoopForList: GlobalLoop,
                    FileArray: TempArray,
                });
                var TotlaFoldersCount = parseInt(this.state.TotalFolders);
                TotlaFoldersCount = TotlaFoldersCount + resultDataItems.d.results.length;
                this.setState({ TotalFolders: TotlaFoldersCount });
                if (this.state.LoopForList > 0) {
                    this.QueryITems();
                }
                else {
                    this.GetFilesItems();
                }
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
            }
        });
    };
    WpDocumentLibInfo.prototype.QueryFilesAndFoldersWrapper = function () {
        var LoopToQuery = this.state.LoopForList;
        this.QueryITems();
    };
    WpDocumentLibInfo.prototype.GetFilesItems = function () {
        var DynamicUrl = "";
        var nums = this.state.TotalItem;
        var FileIdsArray = this.state.FileArray;
        var reactHandler = this;
        var NewISiteUrl = this.props.siteurl;
        var NewSiteUrl = NewISiteUrl.replace("SitePages", "");
        var UrlsTohit = [];
        if (this.state.DocumentLibraryName == "") {
            return;
        }
        var DynamicFilterValues = "";
        DynamicFilterValues = "";
        var ItemCounter = 0;
        for (var i = 0; i <= parseInt(nums); i++) {
            if (FileIdsArray.indexOf(i.toString()) < 0) {
                DynamicFilterValues += "(ID eq " + i.toString() + ") or ";
                ItemCounter++;
            }
            if (ItemCounter == 50) {
                ItemCounter = 0;
                var str = DynamicFilterValues;
                DynamicFilterValues = str.substring(0, str.length - 3);
                DynamicUrl = NewSiteUrl + "/_api/web/lists/getbytitle('" + this.state.DocumentLibraryName + "')/items?$filter=" + DynamicFilterValues + "&$select=Title,FileLeafRef,File_x0020_Type";
                UrlsTohit.push(DynamicUrl);
                DynamicFilterValues = "";
            } //50 end
        }
        if (ItemCounter < 2) {
            for (var i = 0; i <= parseInt(nums); i++) {
                DynamicFilterValues += "(ID eq " + i.toString() + ") or ";
            }
            var str = DynamicFilterValues;
            DynamicFilterValues = str.substring(0, str.length - 3);
            DynamicUrl = NewSiteUrl + "/_api/web/lists/getbytitle('" + this.state.DocumentLibraryName + "')/items?$filter=" + DynamicFilterValues + "&$select=Title,FileLeafRef,File_x0020_Type";
            UrlsTohit.push(DynamicUrl);
        }
        for (var i = 0; i <= UrlsTohit.length; i++) {
            var NewUrl = "" + UrlsTohit[i];
            jquery.ajax({
                url: "" + NewUrl,
                type: "GET",
                headers: { 'Accept': 'application/json; odata=verbose;' },
                success: function (resultDataItemsEach) {
                    for (var y = 0; y < resultDataItemsEach.d.results.length; y++) {
                        reactHandler.MakeDocuments(resultDataItemsEach.d.results[y]["File_x0020_Type"]);
                    } //for end
                }.bind(this),
                error: function (jqXHR, textStatus, errorThrown) {
                }
            }); //jquery end*/
        }
    };
    WpDocumentLibInfo.prototype.MakeDocuments = function (Leaf) {
        var temp = 0;
        var ItemFound = 0;
        if (Leaf == null) {
            Leaf = "FOLDER";
        }
        Leaf = Leaf.toUpperCase();
        console.log(Leaf);
        if (Leaf.indexOf("DOC") > -1 || Leaf.indexOf("DOCX") > -1) {
            temp = this.state.DocFiles;
            temp++;
            this.setState({ DocFiles: temp });
            ItemFound++;
        }
        if (Leaf.indexOf("XLS") > -1 || Leaf.indexOf(".XLSX") > -1) {
            temp = this.state.XlsFiles;
            temp++;
            this.setState({ XlsFiles: temp });
            ItemFound++;
        }
        if (Leaf.indexOf("PDF") > -1) {
            temp = this.state.PDFFiles;
            temp++;
            this.setState({ PDFFiles: temp });
            ItemFound++;
        }
        if (Leaf.indexOf("TXT") > -1) {
            temp = this.state.TextFiles;
            temp++;
            this.setState({ TextFiles: temp });
            ItemFound++;
        }
        if (Leaf.indexOf("P3") > -1) {
            temp = this.state.P3Files;
            temp++;
            this.setState({ P3Files: temp });
            ItemFound++;
        }
        if (Leaf.indexOf("FOLDER") > -1) {
            temp = parseInt(this.state.TotalFolders);
            temp++;
            this.setState({ P3Files: temp.toString() });
        }
        if (Leaf.indexOf("JPG") > -1 || Leaf.indexOf("JPEG") > -1 || Leaf.indexOf("JPEG") > -1 || Leaf.indexOf("PNG") > -1) {
            temp = this.state.Photos;
            temp++;
            this.setState({ Photos: temp });
            ItemFound++;
        }
        if (ItemFound == 0) {
            temp = this.state.MISCFiles;
            temp++;
            this.setState({ MISCFiles: temp });
            ItemFound++;
        }
    };
    WpDocumentLibInfo.prototype.render = function () {
        return (React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.wpDocumentLibInfo },
            React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.container },
                React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.row },
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 0, end: this.state.TotalItem, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: "Items ", suffix: " ", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) })),
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement("img", { src: "http://files.softicons.com/download/toolbar-icons/flatastic-icons-part-1-by-custom-icon-design/png/512x512/folder.png", className: WpDocumentLibInfo_module_scss_1.default.ImagesClass }),
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 0, end: this.state.TotalFolders, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: " ", suffix: " ", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) })),
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement("img", { src: "https://c.s-microsoft.com/en-us/CMSImages/msd-mdl-icons-systemgrid-camera-vp3.png?version=d24208e2-f503-7fe7-b84d-56812f2f8708", className: WpDocumentLibInfo_module_scss_1.default.ImagesClass }),
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 333330, end: this.state.Photos, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: " ", suffix: "", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) })),
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement("img", { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Word_2013_file_icon.svg/185px-Word_2013_file_icon.svg.png", className: WpDocumentLibInfo_module_scss_1.default.ImagesClass }),
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 11110, end: this.state.DocFiles, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: "  ", suffix: "", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) })),
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement("img", { src: "http://www.integragen.com/wp-content/uploads/icon_excel.png", className: WpDocumentLibInfo_module_scss_1.default.ImagesClass }),
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 2220, end: this.state.XlsFiles, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: " ", suffix: "", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) })),
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement("img", { src: "https://image.flaticon.com/icons/svg/337/337946.svg", className: WpDocumentLibInfo_module_scss_1.default.ImagesClass }),
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 33330, end: this.state.PDFFiles, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: " ", suffix: "", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) })),
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement("img", { src: "https://cdn2.iconfinder.com/data/icons/game-center-mixed-icons/128/note.png", className: WpDocumentLibInfo_module_scss_1.default.ImagesClass }),
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 50000, end: this.state.TextFiles, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: "Text ", suffix: "", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) })),
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 4000, end: this.state.P3Files, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: "P3 ", suffix: "", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) })),
                    React.createElement("div", { className: WpDocumentLibInfo_module_scss_1.default.Box },
                        React.createElement(react_countup_1.default, { className: WpDocumentLibInfo_module_scss_1.default.AccountBalance, start: 4000, end: this.state.MISCFiles, duration: 2.75, useEasing: true, useGrouping: true, separator: " ", decimals: 0, decimal: ",", prefix: "Other ", suffix: "", onComplete: this.onComplete.bind(this), onStart: this.onStart.bind(this) }))))));
    };
    return WpDocumentLibInfo;
}(React.Component));
exports.default = WpDocumentLibInfo;

//# sourceMappingURL=WpDocumentLibInfo.js.map
