import React from 'react'
import styled from 'styled-components'
// import styles from '/const/styles'
import Div from '/components/styled/Div'

export default function SwitchView({ children, active = 0 }) {
    let childrens = Array.isArray(children) ? children : [children]
    if (childrens.length > 1) {
        childrens = childrens.map((child, index) => (
            <View left={(index - active) * 100}>{child}</View>
        ))
    }
    return <SwitchViewStyled ref={onRef}>{childrens}</SwitchViewStyled>
}
function onRef(e) {
    if (e && e.base) {
        const container = e.base
        const views = container.childNodes
        let height = 0
        views.forEach((view, index) => {
            view = view.childNodes[0]
            if (view.offsetHeight > height) height = view.offsetHeight
        })
        container.style.height = `${height}px`
    }
}

const SwitchViewStyled = styled.div`
    width: 100%;
    overflow-x: hidden;
    position: relative;
    & > div {
        transition: 0.75s ease left;
        display: block;
        position: absolute;

        width: 100%;
    }
    & > div > div {
        width: 100%;
    }
`
const View = styled.div`
    left: ${props => props.left}%;
`
