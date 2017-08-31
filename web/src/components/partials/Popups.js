import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import { state } from '/store/state'
import { removeNotification } from '/store/actions'
import styles from '/const/styles'
import {
    PopupManager,
    Popup,
    PopupHeader,
    PopupContent,
    PopupFooter
} from '/components/styled/Popup'
import Button from '/components/styled/Button'
import Div from '/components/styled/Div'

export default class Popups extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => {})
        // this.observer.observe(state.Popups)

        // binding
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(PopupsTemplate, {})
    }
}

function PopupsTemplate({ children }) {
    return (
        <PopupManager zIndex={999}>
            {/* <Popup open={true}>
                Hola
            </Popup> */}
            <Popup
                width="400px"
                open={true}
                onKeyEnter={e => console.log('Ok')}
                onClose={e => {
                    console.log('Close')
                }}
            >
                {/* <PopupHeader onClose={e=>{console.log('Close')}}>Add account</PopupHeader> */}
                <PopupContent>
                    <Div text-align="center">
                        <strong>
                            You haven't export your wallets. If you continue you
                            will lose any change you made in your wallets. Are
                            you sure to continue?
                        </strong>
                    </Div>
                </PopupContent>
                <PopupFooter>
                    <Button
                        onClick={e => {
                            console.log('Close')
                        }}
                    >
                        Cancel
                    </Button>
                    <Button highlighted={true} onClick={e => console.log('Ok')}>
                        Continue
                    </Button>
                </PopupFooter>
            </Popup>
        </PopupManager>
    )
}
