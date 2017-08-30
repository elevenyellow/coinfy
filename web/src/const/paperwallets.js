export const BTC = `
<html>
    <head>
    <style>
body {
    font-family: sans-serif;
    font-size: 1rem;
    color: black;
}
#content {
    /* border: 1px solid black */
}
.area {
    width: 95%;
    clear: both;
    height: 150px;
    margin: 0 auto 2.3em auto;
}
.area-qr {
    float: left;
    padding-top: 0.7em;
    padding-right: 1em;
}

.area-title {
    font-weight: bold;
    font-size: 2em;
    padding-top: 0.5em;
    padding-bottom: 0.3em;
}
.area-hash {
    color:black;
    font-family: monospace;
    font-weight: bold;
    word-break: break-all;
    font-size: 1.3em;
}
.area-description {
    padding-top: 0.8em;
    font-size: 1em;
    font-weight: bold;
    opacity: 0.3;
}
.area-titlesmall {
    font-weight: bold;
    font-size: 1.2em;
}
.area-long {
    font-family: monospace;
    word-break: break-all;
}
.red * {
    color: #DD0033 !important
}
#claim {
    text-align: center;
    color: #CCC
}
    </style>
    </head>
    <body>
        <div id="content">

            <div class="area">
                <div class="area-qr">
                    <img width="125" height="125" src="{{address_qr}}" width="150">
                </div>
                <div class="area-right">
                    <div class="area-title">Address</div>
                    <div class="area-hash">{{address}}</div>
                    <div class="area-description">Share this address to receive funds.</div>
                </div>
            </div>
            <div class="area">
                <div class="area-qr">
                    <img width="125" height="125" src="{{address_comp_qr}}" width="150">
                </div>
                <div class="area-right">
                    <div class="area-title">Address compressed</div>
                    <div class="area-hash">{{address_comp}}</div>
                    <div class="area-description">This address is the compressed version. You can share it to receive funds.</div>
                </div>
            </div>


            <div class="area">
                <div class="area-qr">
                    <img width="125" src="{{private_key_qr}}">
                </div>
                <div class="area-right red">
                    <div class="area-title">Private Key</div>
                    <div class="area-hash">{{private_key}}</div>
                    <div class="area-description">This CAN NOT BE SHARED. If you share this private key you can lose your funds. WIF format, 51 characters base58, starts with a '5'</div>
                </div>
            </div>


            <div class="area">
                <div class="area-qr">
                    <img width="125" src="{{private_key_comp_qr}}">
                </div>
                <div class="area-right red">
                    <div class="area-title">Private Key compressed</div>
                    <div class="area-hash">{{private_key_comp}}</div>
                    <div class="area-description">This CAN NOT BE SHARED. If you share this private key you can lose your funds. WIF format, 52 characters base58, starts with a 'K' or 'L'</div>
                </div>
            </div>
    
            <div class="area">
                <div class="area-right">
                    <div class="area-titlesmall">Public Key (130 characters [0-9A-F]):</div>
                    <div class="area-long">04859b2aa16756e9c1297464117c2ed90e1749b83a9e5d6e8572bcac0a17020f1158107eb1a44cab507080291ac998b45530be81f113b35b9a164e04ac1f6a4ab0</div>
                    <br />
                    <div class="area-titlesmall">Public Key (compressed, 66 characters [0-9A-F]):</div>
                    <div class="area-long">02859b2aa16756e9c1297464117c2ed90e1749b83a9e5d6e8572bcac0a17020f11</div>
                </div>
            </div>

            <div id="claim">WWW.WEDONTNEEDBANKS.ORG</div>
        </div>
    </body>
</html>
`