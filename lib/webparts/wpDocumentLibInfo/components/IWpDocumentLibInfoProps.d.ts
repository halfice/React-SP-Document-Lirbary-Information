import { SPHttpClient } from '@microsoft/sp-http';
export interface IWpDocumentLibInfoProps {
    spHttpClient: SPHttpClient;
    TotalItem: string;
    TotalFolders: string;
    TotalFiles: string;
    description: string;
    siteurl: string;
    ItemStart: number;
    ItemEnd: number;
    LoopForList: number;
    FileArray: Array<string>;
    DocFiles: number;
    XlsFiles: number;
    PDFFiles: number;
    P3Files: number;
    Photos: number;
    Drawing: number;
    TextFiles: number;
    MISCFiles: number;
    DocumentLibraryName: string;
}
