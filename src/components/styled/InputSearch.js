import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import { createInputFile } from '/api/browser'
import Input from '/components/styled/Input'
import Div from '/components/styled/Div'
import IconMenu from 'react-icons/lib/md/search'

export default class InputSearch extends Component {
    render() {
        return (
            <Container>
                <div className="icon">
                    <IconMenu size={24} color={styles.color.front5} />
                </div>
                <div className="input">
                    <Input {...this.props} />
                </div>
                <Div clear="both" />
            </Container>
        )
    }
}

const Container = styled.div`
    & .icon {
        float: left;
        text-align: center;
        width: 40px;
        height: 31px;
        background-image: linear-gradient(#fff, ${styles.color.background1});
        border: 1px solid
            ${props =>
                props.invalid ? styles.color.error : styles.color.background5};
        font-weight: bold;
        font-size: 12px;
        display: inline-block;
        line-height: 20px;
        border-radius: 5px 0 0 5px;
        border-right: 0;
        padding-top: 6px;
    }
    & .input {
        float: left;
        width: calc(100% - 42px);
    }
`
