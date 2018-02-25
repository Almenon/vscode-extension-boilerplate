'use strict'
import * as vscode from 'vscode'
import HtmlDocumentContentProvider from './HTMLDocumentContentProvider'

// This class initializes the previewmanager based on extension type and manages all the subscriptions
export default class PreviewManager {

    preview: HtmlDocumentContentProvider;
    disposable: vscode.Disposable;
    activeDoc: vscode.TextDocument;

    constructor(context: vscode.ExtensionContext) {
        const settings = vscode.workspace.getConfiguration('vscode-extension-boilerplate');
        let aSetting = settings.get<number>('exampleSetting');
        console.log("user has set exampleSetting to " + aSetting)


        this.preview = new HtmlDocumentContentProvider(context);
        vscode.workspace.registerTextDocumentContentProvider(HtmlDocumentContentProvider.scheme, this.preview);
        
        this.activeDoc = vscode.window.activeTextEditor.document;
        
        // keep track of our subscriptions so we can dispose them when user stops using our extension
        let subscriptions: vscode.Disposable[] = [];
        
        vscode.workspace.onDidCloseTextDocument((e)=>{
            // dispose if user closed active doc or if user closed preview
            if(e == this.activeDoc || e.uri.scheme == HtmlDocumentContentProvider.scheme) this.dispose()
        }, this, subscriptions)
        
        vscode.workspace.onDidChangeTextDocument((e)=>{
            if(e.document == this.activeDoc){
                let text = e.document.getText();
                console.log("the active text doc contains " + text);
            }
        }, this, subscriptions);
        
        vscode.window.onDidChangeActiveTextEditor((e) => {
            if(e == null) return;
            
            if(e.document == this.activeDoc){
                console.log("back to active editor")
            }
            else{
                console.log("left active editor")
            }
        }, this, subscriptions)
        
        this.disposable = vscode.Disposable.from(...subscriptions);
    }

    dispose() {
        this.disposable.dispose();
    }
}