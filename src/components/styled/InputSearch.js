import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import { createInputFile } from '/api/browser'
import Input from '/components/styled/Input'
import Div from '/components/styled/Div'
import IconSearch from 'react-icons/lib/md/search'
import IconClose from 'react-icons/lib/md/close'

export default function(props) {
    return (
        <Container value={props.value || ''}>
            <div className="icon">
                <IconSearch
                    size={22}
                    color={
                        props.invalid ? styles.color.error : styles.color.grey1
                    }
                />
            </div>
            <div className="input">
                <Input type="text" {...props} />
            </div>
            <div className="delete" onClick={props.onClear}>
                <IconClose size={24} color="black" />
            </div>
            <Div clear="both" />
        </Container>
    )
}

const Container = styled.div`
    position: relative;

    & .icon {
        z-index: 1;
        position: absolute;
        text-align: center;
        width: 40px;
        height: 31px;
        font-weight: bold;
        font-size: 12px;
        display: inline-block;
        line-height: 20px;
        border-radius: 5px 0 0 5px;
        border-right: 0;
        padding-top: 9px;
        left: 0;
        ${styles.media.fourth} {
            height: 32px;
        }
    }
    & .input {
        float: left;
        width: calc(100%);
    }
    & .input input {
        padding-left: 35px;
    }
    & .delete {
        display: ${props => (props.value.length > 0 ? 'block' : 'none')};
        position: absolute;
        width: 40px;
        height: 31px;
        right: 0;
        text-align: center;
        padding-top: 7px;
        opacity: 0.3;
    }
    & .delete:hover {
        opacity: 1;
    }
`
