import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import state from '/store/state'
import styles from '/const/styles'

import Div from '/components/styled/Div'
import Input from '/components/styled/Input'
import Button from '/components/styled/Button'
import CenterElement from '/components/styled/CenterElement'

export default class Send extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {
        }

        // binding
        // this.onChangeEncryption = this.onChangeEncryption.bind(this)
    }


    render() {
        return React.createElement(SendTemplate, {

        })
    }
}

function SendTemplate({  }) {
    return (
            <CenterElement width="500px">
                <Div>
                    <Input placeholder="Address" width="100%" text-align="center" />
                </Div>
                <Div padding-top="10px">
                    double
                </Div>
                <Div padding-top="10px">
                    <Button font-size="14px" width="300px" margin="0 auto" >
                        Send
                    </Button>
                </Div>
            </CenterElement>
    )
}
