import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import IconClose from 'react-icons/lib/md/close'

export default function Notification({
    children,
    key,
    color = styles.color.background2,
    onClose
}) {
    return (
        <NotificationContainer key={key} color={color}>
            <NotificationMessage>
                <div>{children}</div>
            </NotificationMessage>
            <NotificationClose onClick={onClose}>
                <IconClose size={25} color="white" />
            </NotificationClose>
        </NotificationContainer>
    )
}
const NotificationContainer = styled.div`
position: relative;
background: ${props => props.color};
width: 100%;
box-shadow: 0 2px 1px 1px rgba(0, 0, 0, .1) inset;
animation: open .75s ease;
@keyframes open {
    0% {
        /* transform: translateY(-100%); */
        margin-top: -50px;
    }
    100% {
        /* transform: translateY(0); */
        margin-top: 0;
    }
`

const NotificationMessage = styled.div`
    color: white;
    text-align: center;
    & > div {
        letter-spacing: 1px;
        font-size: 15px;
        padding: 15px ${styles.paddingOut};
    }
`

const NotificationClose = styled.div`
    position: absolute;
    right: 12px;
    top: 12px;
    cursor: pointer;
    opacity: 0.8;
    &:hover {
        opacity: 1;
    }
`
