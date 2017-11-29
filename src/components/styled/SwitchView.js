import React from 'react'
import styled from 'styled-components'
// import styles from '/const/styles'
import Div from '/components/styled/Div'

export default function SwitchView({ children }) {
    const width = children.length * 100
    const widthElement = Math.round(100 / children.length)
    const childrens = Array.isArray(children) ? children : [children]

    // childrens.forEach((child, index) => {
    //     if (child) {
    //         const attrs = child.props || child.attrs
    //         attrs.width = `${widthElement}%`
    //     }
    // })

    return (
        <SwitchViewStyled ref={onRef} width={width} widthElement={widthElement}>
            <div>{childrens}</div>
        </SwitchViewStyled>
    )
}

function onRef(e) {
    if (e && e.base) {
        const element = e.base
        const views = element.childNodes[0].childNodes
        let height = 0
        views.forEach(view => {
            if (view.offsetHeight > height) height = view.offsetHeight
        })
        element.style.height = `${height}px`
    }
}

const SwitchViewStyled = styled.div`
    width: 100%;
    overflow-x: hidden;
    & > div {
        position: relative;
        width: ${props => props.width}%;
    }
    & > div > div {
        display: block;
        position: absolute;
        left: 0;
        width: ${props => props.widthElement}%;
    }
`
