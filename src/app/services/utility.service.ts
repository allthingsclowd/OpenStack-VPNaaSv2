import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UtilityService {
    private userk5CORSproxy = new BehaviorSubject<boolean>(true);
    userK5CORS = this.userk5CORSproxy.asObservable();

  constructor() {
  }

  changek5proxy(proxy: boolean) {
    //console.log(this.userk5CORSproxy.getValue());
    this.userk5CORSproxy.next(!proxy);
    //console.log(this.userk5CORSproxy.getValue());
  }

    convertStringToArrayBufferView(str: string)
    {
        let bytes = new Uint8Array(str.length);
        for (let iii = 0; iii < str.length; iii++) 
        {
            bytes[iii] = str.charCodeAt(iii);
        }

        return bytes;
    }

    convertArrayBufferViewtoString(buffer: Uint8Array)
    {
        let str = "";
        for (let iii = 0; iii < buffer.byteLength; iii++) 
        {
            str += String.fromCharCode(buffer[iii]);
        }

        return str;
    }

    // Generate random password
    generateRandomPassword(passwordLength: number) {
            let text = '';
            const possible = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            for (let i = 0; i < passwordLength; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;

    }

    getEndpoint(k5token: any, endpointType: string) {
        // //console.log('Get Endpoint Token Details ' + JSON.stringify(k5token));
        // //console.log('Get Endpoint ObjectType Details ' + endpointType);
        for (const endpoint of (k5token.json().token.catalog)){
            if (endpoint.endpoints.length > 0) {
                if (endpointType === endpoint.endpoints[0].name) {
                    // //console.log(endpoint.endpoints[0].url);
                    return endpoint.endpoints[0].url;
                }
            }
        }
    }

    getItemId(itemList: Response, itemName: string, itemType: string) {
        let itemId = 'None';
        for (let item in itemList.json()[itemType]) {
            if (itemList.json()[itemType][item].name === itemName) {
                // //console.log('\n\n\n\===== OBJECT  LIST ======\n\n\n' + JSON.stringify(itemList.json()[itemType][item]));
                itemId = itemList.json()[itemType][item].id;
                break;
            }
        }

        return itemId;

    }

    getItemName(itemList: Response, itemID: number) {
        let itemName = 'None';
        
        for (let item in itemList.json()) {
            if (itemList.json()[item].id === itemID) {
                //console.log('\n\n\n\===== OBJECT  LIST ======\n\n\n' + JSON.stringify(itemList.json()));
                itemName = itemList.json()[item].name;
                break;
            }
        }

        return itemName;

    }

    sendViaCORSProxy(URL: string) {
        // //console.log(URL);
        if (this.userk5CORSproxy.getValue()) {
            // CORS PROXY URL
            //const corsProxy = 'http://localhost:2337/';https://corsproxy.uk-1.cf-app.net/
            const corsProxy = 'https://corsproxy.uk-1.cf-app.net/'
            // const corsProxy = 'https://hydra-t-apimng.uk-1.paas.cloud.global.fujitsu.com:10443/k5corsdemo/'
            // remove the first 8 characters of the URL...https:// and add export
            const protocol = URL.split(':', 1);
            const port = (protocol[0] === 'https') ? 443 : 80;

            // insert port number after host details
            const pureURL = URL.substring((protocol[0].length + 3), URL.length);
            // //console.log(pureURL);

            const hostName = pureURL.split('/', 1);
            const urlWithoutHost = pureURL.substring(hostName[0].length, pureURL.length);
            // //console.log(urlWithoutHost);
            const hostNamePort = hostName[0].concat(':', port.toString());

            const proxyURL = corsProxy.concat(hostNamePort, urlWithoutHost);
            // //console.log(proxyURL);
            return proxyURL;
        } else {
            return URL;
        }

    }

}

