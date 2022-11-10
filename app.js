const cryptojs = require('crypto-js');
const http = require('http');

const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});
server.listen(port);



const plain_secret = "ThisIsASecret";
// const secretSize = Buffer.byteLength(plain_secret, "utf-8");
// console.log("Secret size (bytes): " + secretSize.toString());


function encrypt(plainText) {
    const secret = cryptojs.enc.Base64.parse(plain_secret);
    // console.log("Secret: " + secret);
    
    const srcs = cryptojs.enc.Utf8.parse(plainText);
    
    var iv = cryptojs.lib.WordArray.random(16);
    console.log("IV: " + iv.toString());
    // console.log("IV size: " + Buffer.byteLength(iv.toString(), "utf-8"));
    
    var body = cryptojs.AES.encrypt(srcs, secret, {iv: iv, mode: cryptojs.mode.CBC, padding: cryptojs.pad.Pkcs7, format: cryptojs.format.Hex }); //initialization vector
    // console.log("Encrypted text: " + body.toString());
    
    var result = iv.toString() + body.toString();
    // console.log("Encrypted IV + Encrypted text: " + result);
    // console.log("Encrypted IV + Encrypted text: " + encryptedIV + body.toString());

    return result;
}

function decrypt(cipherText) {
    const secret = cryptojs.enc.Base64.parse(plain_secret);

    var cipherMessage = cipherText.substring(32);
    // console.log("cipherMessage: " + cipherMessage);
    
    var iv = cipherText.substring(0, 32);
    var byteIV = cryptojs.enc.Hex.parse(iv);
    console.log("IV: " + iv);
    
    var body = cryptojs.AES.decrypt(cipherMessage, secret, {iv: byteIV, mode: cryptojs.mode.CBC, padding: cryptojs.pad.Pkcs7, format: cryptojs.format.Hex });
    // console.log("Decrypted text: " + body.toString(cryptojs.enc.Utf8));

    return body.toString(cryptojs.enc.Utf8);
}


var encryptResult = encrypt("esto es una descripción");
console.log("encryptResult: " + encryptResult);

var decryptResult = decrypt("0ebfa628cf45dfa21292c1d8a9a00c9ef85c829be2b4c36e612499a92d658777d8811e6c63ebc23b55fb22497a7be6ce4c6ade80411597143dc6ea51b054fd9b");
console.log("decryptResult: " + decryptResult);
