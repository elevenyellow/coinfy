import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import state from '/store/state'
import { deleteAsset } from '/store/actions'
import styles from '/const/styles'

import Div from '/components/styled/Div'
import ButtonBig from '/components/styled/ButtonBig'
import Checkbox from '/components/styled/Checkbox'
import CenterElement from '/components/styled/CenterElement'

export default class Delete extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
            confirmed: false
        }

        // binding
        // this.onChangeEncryption = this.onChangeEncryption.bind(this)
    }
    onConfirm() {
        state.view.confirmed = !state.view.confirmed
    }
    onDelete() {
        const asset_id = state.location.path[1]
        deleteAsset(asset_id)
    }
    render() {
        return React.createElement(DeleteTemplate, {
            confirmed: state.view.confirmed,
            onConfirm: this.onConfirm,
            onDelete: this.onDelete
        })
    }
}

function DeleteTemplate({ confirmed, onConfirm, onDelete }) {
    return (
        <Div padding-top="30px">
            <CenterElement>
                <div>
                    <Checkbox
                        checked={confirmed}
                        onChange={onConfirm}
                        label="I understand that if I don't have a Paper Wallet or a Backup I won't be able to recover this asset."
                    />
                </div>
                <Div padding-top="10px">
                    <ButtonBig disabled={!confirmed} onClick={onDelete} width="100%">
                        Delete this asset
                    </ButtonBig>
                </Div>
            </CenterElement>
        </Div>
    )
}
