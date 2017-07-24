import React, { Component } from 'react';
import dop from 'dop';
import styled from 'styled-components';

import cipher from 'browserify-cipher';
import bignumber from 'bignumber.js';
import bitcoin from 'bitcoinjs-lib';
import QRCode from 'qrcode.react';

class App extends Component {

    // componentDidMount() {
    //     require.ensure('dop', dop=>{
    //         console.log(dop)
    //     })
    //     require.ensure('styled-components', styled=>{
    //         console.log(styled)
    //     })
    // }

    render() {
        return (
            <div>
                <h1>Hello mundo!</h1>
                <p>I 💖 preact</p>
            </div>
        );
    }
}

export default App;
