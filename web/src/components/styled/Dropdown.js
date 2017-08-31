import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export class DropDown extends React.Component {
    constructor(props) {
        super(props)

        this.state = {eventJustCreated:false}

        // binding
        this.onOpen = this.onOpen.bind(this)
        this.onClose = this.onClose.bind(this)

        if (props.open) this.createEvent()
    }

    componentWillReceiveProps(props, state) {
        props.open ? this.createEvent() : this.removeEvent()
    }

    createEvent() {
        this.state.eventJustCreated = true
        this.callback = e => {
            if (!this.state.eventJustCreated) {
                this.onClose(e)
            }
            this.state.eventJustCreated = false
        }
        document.addEventListener('click', this.callback)
    }

    removeEvent() {
        document.removeEventListener('click', this.callback)
    }

    onOpen(e) {
        if (!this.props.open) this.props.onOpen(e)
    }

    onClose(e) {
        if (this.props.open) this.props.onClose(e)
    }

    render() {
        const props = this.props
        const childrens = props.children
        childrens.forEach((child, index) => {
            let constructor = child.type || child.nodeName
            let attrs = child.props || child.attributes
            attrs.visible = props.open // won't work in react
        })

        // if (!this.state.eventCreated && props.open) {
        //     const callback = e => {
        //         if (!this.state.eventCreated)
        //             this.state.eventCreated = true
        //         else if (!props.open)
        //             document.removeEventListener('click', callback)
        //         else
        //             this.onClose(e)

        //         // if (e.target.children.length===0) { // means is <DropDownItem> and now <DropDownMenu>
        //         // }
        //     }
        //     document.addEventListener('click', callback)
        // }

        return (
            <DropDownStyled onClick={this.onOpen}>
                {childrens}
            </DropDownStyled>
        )
    }
}

const DropDownStyled = styled.div`
    position: relative;
    z-index: 1;
`

export const DropDownMenu = styled.div`
    position: absolute;
    background: white;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    display: ${props => (props.visible ? 'block' : 'none')};
    left: ${props => props.left};
    right: ${props => props.right};
    top: ${props => props.top};
`

export const DropDownItem = styled.div`
    padding: 10px 20px;
    font-size: 13px;
    color: ${props =>
        props.disabled ? styles.color.disabled : styles.color.front1};
    border-top: 1px solid ${styles.color.background4};
    width: 90px;
    text-align: left;
    pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
    &:first-child {
        border-top: 0;
    }
    &:hover {
        background-color: ${styles.color.background1};
        color: ${styles.color.background2};
    }
`

export const DropDownArrow = styled.span`
    display: inline-block;
    vertical-align: middle;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 7px solid ${styles.color.front1};
    margin-top: -2px;
`
