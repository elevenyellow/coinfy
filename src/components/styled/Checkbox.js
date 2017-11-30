import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import CheckboxButton from '/components/styled/CheckboxButton'

export default function Checkbox(props) {
    return (
        <CheckboxStyled
            onClick={props.onChange}
            checked={props.checked}
            disabled={props.disabled}
        >
            <CheckboxButton {...props} />
            <span>{props.label}</span>
        </CheckboxStyled>
    )
}

const CheckboxStyled = styled.div`
    box-sizing: content-box;
    display: block;
    border: 2px solid ${styles.color.background4};
    border-radius: 5px;
    padding: 10px 12px;

    & span {
        margin-top: -2px;
        line-height: normal;
        font-size: 15px;

        display: block;
        padding-left: 25px;
        font-weight: bold;
        color: ${props => {
            if (props.disabled) return styles.color.grey1
            else
                /* else if (props.checked) */
                /* return styles.color.background2 */
                return styles.color.front3
        }};
        vertical-align: top;
        transition: all 0.35s ease;
        -webkit-transition: all 0.35s ease;
        -webkit-transition: all 0.35s ease;
        -moz-transition: all 0.55s ease;
        -o-transition: all 0.35s ease;
    }
`
