import { Injectable } from '@angular/core';


@Injectable()
export class PasswordManagementService {
    crypto = window.crypto;
    encryptAlgorithm = {
        name: "RSA-OAEP",
        hash: {
            name: "SHA-1"
        }
    };

      
    constructor() { 
      
    }

    // importPublicKey(pemKey) {
    //     //console.log('import pem key');
    //     //console.log(this.convertPemToBinary(pemKey));
        
    //     return new Promise(function(resolve) {
    //         let importer = crypto.subtle.importKey("spki", this.convertPemToBinary(pemKey), this.encryptAlgorithm, false, ["encrypt"]);
    //         importer.then(function(key) { 
    //         resolve(key);
    //         });
    // });
    // }

    importKey(pemkey){
        pemkey = this.convertPemToBinary(pemkey);
        window.crypto.subtle.importKey(
            "pkcs8", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
            pemkey,
            {   //these are the algorithm options
                name: "RSA-OAEP",
                hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            },
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ["decrypt"] //"encrypt" or "wrapKey" for public key import or
                        //"decrypt" or "unwrapKey" for private key imports
        )
        .then(function(publicKey){
            //returns a publicKey (or privateKey if you are importing a private key)

            //console.log(publicKey);
            return publicKey;
        });
    }

    convertPemToBinary(pem) {
        //console.log('convert pem key');
        //console.log(pem);
        let lines = pem.split('\n');
        let encoded = '';
        for(let i = 0;i < lines.length;i++){
            if (lines[i].trim().length > 0 &&
                lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 && 
                lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
                lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
                lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
                lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
                lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
            encoded += lines[i].trim();
            }
        }
        //console.log('converted pem key');
        //console.log(encoded);
        //console.log(this.base64StringToArrayBuffer(encoded));
        return this.base64StringToArrayBuffer(encoded);
    }

    base64StringToArrayBuffer(b64str) {
        let byteStr = atob(b64str);
        let bytes = new Uint8Array(byteStr.length);
        for (var i = 0; i < byteStr.length; i++) {
            bytes[i] = byteStr.charCodeAt(i);
        }
        return bytes.buffer;
    }
    arrayBufferToBase64String(arrayBuffer) {
        let byteArray = new Uint8Array(arrayBuffer)
        let byteString = '';
        for (var i=0; i<byteArray.byteLength; i++) {
            byteString += String.fromCharCode(byteArray[i]);
        }
        return btoa(byteString);
    }

    decrypt_data(private_key_object:any,encrypted_data:any) {
        //console.log(' decrypt key debug....');
        //console.log(private_key_object);
        private_key_object = this.importKey(private_key_object);
        //console.log(private_key_object);
        //console.log(encrypted_data);
        encrypted_data = this.base64StringToArrayBuffer(encrypted_data);
        //console.log(encrypted_data);
        window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP",
                //label: Uint8Array([...]) //optional
            },
            private_key_object, //from generateKey or importKey above
            encrypted_data //ArrayBuffer of the data
            )
            .then(function(decrypted){
                //returns an ArrayBuffer containing the decrypted data
                //console.log(new Uint8Array(decrypted));
            });
    }

    // generateKeys(){
    //     let private_key_object = null; 
    //     let public_key_object = null; 

    //     let promise_key = null;

    //     let crypto = window.crypto;

    //     if(crypto.subtle)
    //     {
    //         alert("Cryptography API Supported");
            
    //         //Parameters:
    //         //1. Asymmetric Encryption algorithm name and its requirements
    //         //2. Boolean indicating extractable. which indicates whether or not the raw keying material may be exported by the application (http://www.w3.org/TR/WebCryptoAPI/#dfn-CryptoKey-slot-extractable)
    //         //3. Usage of the keys. (http://www.w3.org/TR/WebCryptoAPI/#cryptokey-interface-types)
    //         promise_key = crypto.subtle.generateKey({name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([0x01, 0x00, 0x01]), hash: {name: "SHA-256"}}, false, ["encrypt", "decrypt"]);

    //         promise_key.then(function(key){
    //             private_key_object = key.privateKey;
    //             public_key_object = key.publicKey;
    //             //console.log('New Crypto Keys Start');
    //             //console.log(private_key_object);
    //             //console.log(public_key_object);
    //             //console.log('New Crypto Keys End');

    //         });

    //         promise_key.catch = function(e){
    //             //console.log(e.message);
    //         }
            
    //     }
    //     else
    //     {
    //         alert("Cryptography API not Supported");
    //     }        
    // }

 

}
