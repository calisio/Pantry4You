import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { auth } from '../../../App';

class MyWebViewComponent extends Component {
    getWebviewContent() {
        var originalForm = '<!DOCTYPE html><html><head><script src="https://www.google.com/recaptcha/api.js"></script></head><body><form action="[POST_URL]" method="post"><input type="hidden" value="[TITLE]"><input type="hidden" value="[DESCRIPTION]"><input type="hidden" value="[URL]"><div class="g-recaptcha" data-sitekey="6LfDoZslAAAAAIvpNQPYS5XWmROft1lB45P0U42a"></div><input type="submit" value="Send"/></form></body></html>';
        var tmp = originalForm
            .replace("[POST_URL]", "http://localhost:3000/v1/video")
            .replace("[TITLE]", this.state.form.title)
            .replace("[DESCRIPTION]", this.state.form.description)
            .replace("[URL]", this.state.form.url);
    
        return tmp;
    }
    

    render() {
        return (
            <WebView 
                javaScriptEnabled={true} 
                mixedContentMode={'always'} 
                style={{height: 200}} 
                source={{
                    html: this.getWebviewContent(),
                    baseUrl: 'pantry4you-bf048.firebaseapp.com'
                }}
            />
        );
    }
}

export default MyWebViewComponent;
