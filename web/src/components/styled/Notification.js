import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import IconClose from 'react-icons/lib/md/close'

export default function Notification({ children, color = styles.color.background2, onClose }) {
    return (
        <NotificationContainer color={color}>
            <NotificationMessage>
                <div>
                    {children}
                </div>
            </NotificationMessage>
            <NotificationClose onClick={onClose}>
                <IconClose size={25} color="white" />
            </NotificationClose>
        </NotificationContainer>
    )
}
const NotificationContainer = styled.div`
position: relative;
top: 0;
background: ${props => props.color};
width: 100%;
box-shadow: 0 2px 1px 1px rgba(0, 0, 0, .1) inset;
`

const NotificationMessage = styled.div`
    color: white;
    text-align: center;
    & > div {
        padding: 15px ${styles.paddingOut};
        font-weight: bold;
    }
`

const NotificationClose = styled.div`
    position: absolute;
    right: 12px;
    top: 12px;
    cursor: pointer;
    opacity: .8;
    &:hover {
        opacity: 1;
    }
`