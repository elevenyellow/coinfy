import React from 'react'
// import styled from 'styled-components'
// import styles from '/const/styles'
import Div from '/components/styled/Div'

export default function SwitchView({ children }) {
    const width = children.length * 100
    const widthElement = Math.round(100 / children.length)
    const childrens = Array.isArray(children) ? children : [children]

    childrens.forEach((child, index) => {
        if (child) {
            const attrs = child.props || child.attrs
            attrs.width = `${widthElement}%`
        }
    })

    return (
        <Div width="100%" overflow-x="hidden">
            <Div width={width + '%'}>{children}</Div>
        </Div>
    )
}
