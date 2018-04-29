/// <reference types="react" />
import * as React from 'react';
import { IWpDocumentLibInfoProps } from './IWpDocumentLibInfoProps';
export default class WpDocumentLibInfo extends React.Component<IWpDocumentLibInfoProps, {}> {
    state: IWpDocumentLibInfoProps;
    constructor(props: any, context: any);
    onComplete: () => void;
    onStart: () => void;
    componentDidMount(): void;
    private _GetListTotalCount();
    private GetRootFolders();
    private QueryITems();
    private QueryFilesAndFoldersWrapper();
    private GetFilesItems();
    private MakeDocuments(Leaf);
    render(): React.ReactElement<IWpDocumentLibInfoProps>;
}
