import React, { Component } from 'react'
import styled from 'styled-components'
import { set, createObserver } from 'dop'
import { Route as Show } from '/doprouter/react'
import QRious from 'qrious'

import { setInitialViewState, generateBitcoinWallet } from '/actions'
import state from '/stores/state'
import styles from '/styles'
import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import QRCode from '/components/styled/QRCode'
import Address from '/components/styled/Address'


export default class CreateBitcoin extends Component {

    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate());
        this.observer.observe(state.view, 'address');
        set(state,'view', {
            address: ''
        })
    }

    componentWillUnmount() {
        this.observer.destroy()
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        const isAddressDefined = state.view.address !== ''
        let qrcodebase64 = ''
        if (isAddressDefined) {
            const qr = new QRious({
                background: 'white',
                foreground: 'black',
                level: 'H',
                size: 300,
                value: state.view.address
            })
            qrcodebase64 = qr.toDataURL()
        }



        return (
            <div>
                <Div padding-bottom="15px">
                    <QRCode>
                        <Show if={isAddressDefined}>
                            <img width="150" src={qrcodebase64} />
                        </Show>
                    </QRCode>
                </Div>
                <Div padding-bottom="10px">
                    <CenterElement>
                        <Address>{state.view.address}</Address>
                    </CenterElement>
                </Div>
                <Div padding-bottom="50px">
                    <CenterElement>
                        <Button onClick={generateBitcoinWallet} width="100%">Generate address</Button>
                    </CenterElement>
                </Div>
                <Div padding-bottom="10px">
                    <div>
                        <Label>Password</Label>
                        <Input width="100%" />
                    </div>
                </Div>
                <Div padding-bottom="10px">
                    <div>
                        <Label>Repeat Password</Label>
                        <Input width="100%" type="password" />
                    </div>
                </Div>
            </div>
        )
    }
}



const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`



const Label = styled.label`
font-weight: 600;
margin-bottom: 0px;
line-height: 1.9em;
color: #5a5f6d;
font-size: 13px;
`

const Input = styled.input`
${props=>{
    if (props.width) return 'width:'+props.width+';'
}}
border: 1px solid ${styles.color.background4};
background: #FFF;
padding: 10px;
font-weight: 500;
outline: none;
font-family: monospace;
font-size: 14px;
color:${styles.color.front6};
box-shadow:0 1px 1px 0 rgba(0,0,0,0.05) inset;
box-sizing: border-box;

&:focus {
    box-shadow: none!important;
    border-color: ${styles.color.background3};
}
`


