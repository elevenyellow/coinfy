import React, { Component } from 'react'
import { createObserver } from 'dop'
import state from '/store/state'
import styled from 'styled-components'
import { deleteNotification } from '/store/actions'
import styles from '/const/styles'
import Notification from '/components/styled/Notification'

export default class Notifications extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => {
            mutations.forEach(mutation => {
                let notification = mutation.value
                if (
                    notification !== undefined &&
                    typeof notification.timeout == 'number' &&
                    notification.timeout > 0
                ) {
                    setTimeout(() => {
                        this.onClose(notification.id)
                    }, notification.timeout)
                }
            })
            this.forceUpdate()
        })
        this.observer.observe(state.notifications)

        // binding
        this.onClose = this.onClose.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onClose(id) {
        deleteNotification(id)
    }

    render() {
        return React.createElement(NotificationsTemplate, {
            notifications: state.notifications,
            onClose: this.onClose
        })
    }
}

function NotificationsTemplate({ notifications, onClose }) {
    const items = []
    let notification
    const ids = Object.keys(notifications)
        .map(Number)
        .reverse()

    ids.forEach(id => {
        notification = notifications[id]
        items.push(
            <Notification
                key={id}
                color={notification.color}
                onClose={e => onClose(id)}
            >
                {notification.text}
            </Notification>
        )
    })
    return <NotificationContainer>{items}</NotificationContainer>
}

const NotificationContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 4;
`
