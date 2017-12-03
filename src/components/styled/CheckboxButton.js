import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function CheckboxButton(props) {
    return (
        <CheckboxButtonStyled {...props}>
            <input {...props} type="checkbox" />
            <div />
        </CheckboxButtonStyled>
    )
}

const CheckboxButtonStyled = styled.div`
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
        border-radius: 2px;
        vertical-align: top;
        cursor: ${props => (props.disabled ? 'default' : 'pointer')};
        background-color: ${props => {
            if (props.disabled && props.checked) return styles.color.grey1
            else if (props.checked) return styles.color.background3
            else return 'white'
        }};
        border: 2px solid
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
        position: absolute;
        top: 0;
        left: 4px;
        width: 4px;
        height: 8px;
        content: '';
        border-color: white;
        border-style: solid;
        border-top: 0;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-left: 0;

        transform: scale(${props => (props.checked ? 1 : 0)}) rotate(45deg);
        -webkit-transform: scale(${props => (props.checked ? 1 : 0)})
            rotate(45deg);
        -ms-transform: scale(${props => (props.checked ? 1 : 0)}) rotate(45deg);
        -webkit-transform: scale(${props => (props.checked ? 1 : 0)})
            rotate(45deg);

        transition: all 0.35s ease;
        -webkit-transition: all 0.35s ease;
        -moz-transition: all 0.55s ease;
        -o-transition: all 0.35s ease;
    }
`
