import React, { Component } from 'react'
import styled from 'styled-components'

import { state } from '/store/state'
import { deleteWallet } from '/store/actions'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'

export default class DeleteWallet extends Component {

    render() {
        return React.createElement(DeleteWalletTemplate, {
        })
    }
}

function DeleteWalletTemplate({  }) {
    return (
        <div>
            <CenterElement>

            </CenterElement>
        </div>
    )
}


const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`