import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration } from '@microsoft/sp-webpart-base';
import { IWpDocumentLibInfoProps } from './components/IWpDocumentLibInfoProps';
export default class WpDocumentLibInfoWebPart extends BaseClientSideWebPart<IWpDocumentLibInfoProps> {
    render(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
