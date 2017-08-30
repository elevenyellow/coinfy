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
    background: ${props => props.color};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
    color: white;
    box-shadow: 0 2px 1px 1px rgba(0, 0, 0, .1) inset;
`

const NotificationMessage = styled.div`
    text-align: center;
    & > div {
        padding: 15px ${styles.paddingOut};
        font-weight: 100;
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