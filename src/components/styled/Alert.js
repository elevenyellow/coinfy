import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import { OK, ERROR, ALERT, NORMAL } from '/const/'
import IconInfo from 'react-icons/lib/ti/info-large'
import IconError from 'react-icons/lib/md/error'

export default function Alert({ children, color = ALERT }) {
    let Icon = IconInfo
    if (color === ERROR) Icon = IconError
    return (
        <AlertStyled color={color}>
            <span className="icon">
                <Icon size={20} color={color} />
            </span>
            <span className="text">{children}</span>
        </AlertStyled>
    )
}

const AlertStyled = styled.div`
    text-align: center;
    /* background-color: ${props => props.color};
    padding: 5px;
    box-sizing: border-box;
    border-radius: 3px; */

    & .icon {
        width: 20px;
        /* margin-right: 8px; */
        padding: 2px;
        border-radius: 50%;
        /* box-shadow: 0px 1px 0.1px rgba(0, 0, 0, 0.3); */
    }
    & .text {
        color: ${props => props.color};
        font-weight: bold;
        font-size: 11px;
        line-height: 11px;
        letter-spacing: 0.3px;
        padding-top: 7px;
    }
`
