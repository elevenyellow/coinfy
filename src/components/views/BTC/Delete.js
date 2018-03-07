import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import routes from '/router/routes'
import styles from '/const/styles'

import state from '/store/state'
import { deleteAsset, addNotification, setHref } from '/store/actions'

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
        const collector = collect()
        const asset_id = state.location.path[1]
        const name =
            state.assets[asset_id].label || state.assets[asset_id].address
        deleteAsset(asset_id)
        setHref(routes.home())
        addNotification(`"${name}" asset has been deleted`)
        collector.emit()
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
                        label="I understand that if I don't have a Recovery Phrase, my Paper Wallet or a Backup I won't be able to recover this asset."
                    />
                </div>
                <Div padding-top="10px">
                    <ButtonBig
                        font-size="14px"
                        disabled={!confirmed}
                        onClick={onDelete}
                        width="100%"
                    >
                        Delete this asset
                    </ButtonBig>
                </Div>
            </CenterElement>
        </Div>
    )
}
