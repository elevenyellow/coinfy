import React, { Component } from 'react'
import { createObserver } from 'dop'
import { state } from '/store/state'
import { removeNotification } from '/store/actions'
import styles from '/const/styles'
import Notification from '/components/styled/Notification'


export default class Notifications extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => {
            mutations.forEach(mutation => {
                let notification = mutation.value
                if (
                    notification !== undefined &&
                    typeof notification.timeout == 'number'
                ) {
                    setTimeout(() => {
                        removeNotification(notification.id)
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
        removeNotification(id)
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
    const ids = Object.keys(notifications).map(Number).sort()
    ids.forEach(id => {
        notification = notifications[id]
        items.push(
            <Notification
                color={notification.color}
                onClose={e => onClose(id)}
            >
                {notification.text}
            </Notification>
        )
    })
    return (
        <div>
            {items}
        </div>
    )
}


