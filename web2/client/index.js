import { render } from 'preact';
import dop from 'dop'
import styled from 'styled-components'
import bignumber from 'bignumber.js'

import crypto from 'crypto'
import bitcoin from 'bitcoinjs-lib'
import QRCode from 'qrcode.react'

render((
    <div id="foo">
        <span>Hello, world!</span>
        <button onClick={ e => alert("Hola mundo!") }>Presioname</button>
    </div>
), document.body);