"use strict"
import * as vscode from 'vscode'
import * as path from "path";

/**
 * very simple read-only html content
 * https://code.visualstudio.com/docs/extensionAPI/vscode-api#_a-nametextdocumentcontentprovider
 */
export default class HtmlDocumentContentProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange: vscode.EventEmitter<vscode.Uri>;
    static readonly scheme = "preview"
    static readonly PREVIEW_URI = HtmlDocumentContentProvider.scheme + "://authority/preview"
    
    body = `<p>preview html</p>`;
    css:string
    script: string;

    constructor(private context: vscode.ExtensionContext) {
        this._onDidChange = new vscode.EventEmitter<vscode.Uri>();

        // overwrite style and script in the media folder with your own css & javascript
        this.css = `<link rel="stylesheet" type="text/css" href="${this.getMediaPath("style.css")}">`
        this.script = `<script src="${this.getMediaPath('script.js')}"></script>`
    }

    provideTextDocumentContent(uri: vscode.Uri): string {
        return this.css + this.body + this.script;
    };

    public update() {
        this._onDidChange.fire(vscode.Uri.parse(HtmlDocumentContentProvider.PREVIEW_URI));
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    /**
     * starts preview
     */
    public register(){
        vscode.workspace.registerTextDocumentContentProvider(HtmlDocumentContentProvider.scheme, this);
    }

    private getMediaPath(mediaFile: string): string {
        // stolen from https://github.com/Microsoft/vscode/tree/master/extensions/markdown
		return vscode.Uri.file(this.context.asAbsolutePath(path.join('media', mediaFile))).toString();
    }
    
    public changeHtml(input:string){
        this.body = input;
        this.update();
    }
}