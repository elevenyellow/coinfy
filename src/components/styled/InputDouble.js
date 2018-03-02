import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function InputDouble(props) {
    const showerror =
        props.invalid && props.error ? (
            <InputError>{props.error}</InputError>
        ) : null
    return (
        <div>
            <InputDoubleStyled invalid={props.invalid}>
                <div>
                    <InputValue
                        onChange={props.onChange1}
                        color={props.color1}
                        value={props.value1}
                    />
                    <InputLabel color={props.color1}>{props.label1}</InputLabel>
                </div>
                <div>
                    <InputValue
                        onChange={props.onChange2}
                        color={props.color2}
                        value={props.value2}
                    />
                    <InputLabel color={props.color2}>{props.label2}</InputLabel>
                </div>
            </InputDoubleStyled>
            {showerror}
        </div>
    )
}

const InputDoubleStyled = styled.div`
    ${props => {
        if (props.width) return 'width:' + props.width + ';'
    }} 
    
    border: 1px solid ${props =>
        props.invalid
            ? `${styles.color.error} !important`
            : styles.color.background4};
    background: #fff;
    font-weight: 500;
    font-size: 14px;
    color: ${styles.color.front6};
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05) inset;
    text-align: ${props =>
        props['text-align'] ? props['text-align'] : 'left'};

    & > div {
        position: relative;
    }
    & div:first-child input {
        border-bottom: 2px solid ${styles.color.background1};
    }
`

const InputValue = styled.input`
    box-sizing: border-box;
    color: ${props => props.color || styles.color.front6};
    border: 0;
    margin: 0;
    width: 100%;
    line-height: 34px;
    font-weight: bold;
    font-size: 16px;
    padding: 0 38px 0 10px;
    background: transparent;
`

const InputLabel = styled.div`
    position: absolute;
    line-height: 34px;
    font-weight: bold;
    font-size: 12px;
    right: 10px;
    top: 0;
    color: ${props => props.color};
`

const InputError = styled.div`
    font-size: 10px;
    text-align: right;
    color: ${styles.color.error};
    font-weight: bold;
    letter-spacing: 0.3px;
`
