import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function RadioButton(props) {
    return (
        <RadioButtonStyled {...props}>
            <input {...props} type="radio" />
            <div />
        </RadioButtonStyled>
    )
}

const RadioButtonStyled = styled.div`
    & input {
        box-sizing: content-box;
        display: none;
    }
    & div {
        position: relative;
        float: left;
        display: block;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        vertical-align: top;
        cursor: ${props => (props.disabled ? 'default' : 'pointer')};
        border: 3px solid
            ${props => {
                if (props.disabled) return styles.color.grey1
                else if (props.checked) return styles.color.background3
                else return styles.color.background3
            }};
        transition: all 0.35s ease;
        -webkit-transition: all 0.35s ease;
        -moz-transition: all 0.55s ease;
        -o-transition: all 0.35s ease;
    }
    & div:before {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: ${props => {
            if (!props.checked) return 'transparent'
            else if (props.disabled) return styles.color.grey1
            else return styles.color.background3
        }};
        transition: all 0.35s ease;
        -webkit-transition: all 0.35s ease;
        -moz-transition: all 0.55s ease;
        -o-transition: all 0.35s ease;
    }
`
