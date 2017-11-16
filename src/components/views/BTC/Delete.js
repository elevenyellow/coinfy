import React, { Component } from 'react'
import styled from 'styled-components'

import state from '/store/state'
import { deleteAsset } from '/store/actions'
import styles from '/const/styles'

import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import CenterElement from '/components/styled/CenterElement'

export default class Delete extends Component {
    onDelete() {
        const asset_id = state.location.path[1]
        deleteAsset(asset_id)
    }
    render() {
        return React.createElement(DeleteTemplate, {
            onDelete: this.onDelete
        })
    }
}

function DeleteTemplate({ onDelete }) {
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


