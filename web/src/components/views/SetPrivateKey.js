import React, { Component } from 'react'
import styled from 'styled-components'

import { state } from '/store/state'
import { deleteWallet } from '/store/actions'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'

export default class SetPrivateKey extends Component {
    onDelete() {
        const [symbol, address] = state.location.path
        deleteWallet(symbol, address)
    }
    render() {
        return React.createElement(SetPrivateKeyTemplate, {
            onDelete: this.onDelete
        })
    }
}

function SetPrivateKeyTemplate({ onDelete }) {
    return (
        <div>
            hola
        </div>
    )
}


const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`