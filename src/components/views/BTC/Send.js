import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver } from 'dop'

import state from '/store/state'
import styles from '/const/styles'

import Div from '/components/styled/Div'
import Span from '/components/styled/Span'
import Input from '/components/styled/Input'
import InputDouble from '/components/styled/InputDouble'
import Button from '/components/styled/Button'
import ButtonBig from '/components/styled/ButtonBig'
import CenterElement from '/components/styled/CenterElement'

export default class Send extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        // Initial state
        state.view = {}

        // binding
        // this.onChangeEncryption = this.onChangeEncryption.bind(this)
    }

    render() {
        return React.createElement(SendTemplate, {})
    }
}

function SendTemplate({}) {
    return (
        <CenterElement width="500px">
            <Div>
                <Input placeholder="Address" width="100%" text-align="center" />
            </Div>
            <Div padding-top="10px">
                <Div float="left">
                    <Button
                        line-height="54px"
                        width="72px"
                        font-size="15px"
                        border-radius="10px 0 0 10px"
                        border-right="1px solid transparent"
                    >
                        All
                    </Button>
                </Div>
                <Div float="left" width="calc(100% - 72px)">
                    <InputDouble
                        value1="0.01"
                        value2="341.1"
                        color1="#fcaf43"
                        color2="#000"
                        label1="BTC"
                        label2="USD"
                    />
                </Div>
            </Div>
            <Div clear="both" />

            <Div text-align="center" padding-top="10px">
                <TextFee href="#">
                    <span>Recomended Network Fee </span>
                    <Span color="#fcaf43" font-weight="bold">
                        0.012{' '}
                    </Span>
                    <Span color="#000" font-weight="bold">
                        $23.1
                    </Span>
                </TextFee>
            </Div>

            <Div padding-top="20px">
                <Input
                    placeholder="Password"
                    type="password"
                    width="100%"
                    text-align="center"
                />
            </Div>


            <Div padding-top="10px">
                <ButtonBig font-size="14px" width="100%">
                    Send
                </ButtonBig>
            </Div>

        </CenterElement>
    )
}

const TextFee = styled.a`
    font-size: 12px;
    color: ${styles.color.grey1};
`
