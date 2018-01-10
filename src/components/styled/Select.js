import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function Select(props) {
    const showerror =
        props.invalid && props.error ? (
            <SelectError>{props.error}</SelectError>
        ) : null
    return (
        <div>
            <SelectStyled {...props} />
            {showerror}
        </div>
    )
}

const SelectStyled = styled.select`
    ${props => {
        if (props.width) return 'width:' + props.width + ';'
    }} border: 1px solid ${props =>
            props.invalid
                ? `${styles.color.error} !important`
                : styles.color.background4};
    background-color: #ffffff;
    font-weight: 500;
    outline: none;
    font-family: monospace;
    font-size: 14px;
    color: ${styles.color.front6};
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.05) inset;
    box-sizing: border-box;
    height: 38px;
    padding: 5px;

    font-weight: bold;
    font-size: 15px;
    color: #000;
    letter-spacing: 1px;
`

const SelectError = styled.div`
    font-size: 10px;
    text-align: right;
    color: ${styles.color.error};
    font-weight: bold;
    letter-spacing: 0.3px;
`
