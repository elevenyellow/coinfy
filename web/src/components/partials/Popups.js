import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'
import state from '/store/state'
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
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state.popups.closeSession, 'open')
        

        // binding
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(PopupsTemplate, {
            closeSession: state.popups.closeSession
        })
    }
}

function PopupsTemplate({ closeSession }) {
    return (
        <PopupManager zIndex={999}>
            {/* <Popup open={true}>
                Hola
            </Popup> */}
            <Popup
                width="400px"
                open={closeSession.open}
                onKeyEnter={closeSession.confirm}
                onClose={closeSession.cancel}
            >
                {/* <PopupHeader onClose={e=>{console.log('Close')}}>Add account</PopupHeader> */}
                <PopupContent>
                    <strong>
                        You haven't exported your assets. If you continue you
                        will lose any change you made. Are you sure to
                        continue?
                    </strong>
                </PopupContent>
                <PopupFooter>
                    <Button onClick={closeSession.cancel}>
                        Cancel
                    </Button>
                    <Button onClick={closeSession.confirm} red={true}>
                        Continue
                    </Button>
                </PopupFooter>
            </Popup>
        </PopupManager>
    )
}
