import React from 'react'
import styled from 'styled-components'
// import styles from '/const/styles'
import Div from '/components/styled/Div'

export default function SwitchView({ children, active = 0 }) {
    // const width = children.length * 100
    // const widthElement = Math.round(100 / children.length)
    // const childrens = Array.isArray(children) ? children : [children]
    // childrens.forEach((child, index) => {
    //     if (child) {
    //         const attrs = child.props || child.attrs
    //         attrs.width = `${widthElement}%`
    //     }
    // })

    return (
        <SwitchViewStyled ref={onRef.bind(active)}>{children}</SwitchViewStyled>
    )
}
function onRef(e) {
    const active = this
    if (e && e.base) {
        const container = e.base
        const views = container.childNodes
        let height = 0
        views.forEach((view, index) => {
            if (view.offsetHeight > height) height = view.offsetHeight
            view.style.left = `${(index - active) * 100}%`
        })
        container.style.height = `${height}px`
    }
}

const SwitchViewStyled = styled.div`
    width: 100%;
    overflow-x: hidden;
    position: relative;
    & > div {
        transition: 1s ease left;
        display: block;
        position: absolute;
        left: 0;
        width: 100%;
    }
`
