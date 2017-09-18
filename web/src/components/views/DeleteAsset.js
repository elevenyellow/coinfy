import React, { Component } from 'react'
import styled from 'styled-components'

import state from '/store/state'
import { deleteAsset } from '/store/actions'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'

export default class DeleteAsset extends Component {
    onDelete() {
        const asset_id = state.location.path[1]
        deleteAsset(asset_id)
    }
    render() {
        return React.createElement(DeleteAssetTemplate, {
            onDelete: this.onDelete
        })
    }
}

function DeleteAssetTemplate({ onDelete }) {
    return (
        <div>
            <CenterElement>
                <Button red={true} onClick={onDelete} width="100%">
                    Delete this asset
                </Button>
            </CenterElement>
        </div>
    )
}


const CenterElement = styled.div`
margin: 0 auto;
width: 360px;
`