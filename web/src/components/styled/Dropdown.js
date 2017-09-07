import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export class DropDown extends React.Component {
    constructor(props) {
        super(props)

        this.state = { eventJustCreated: false }

        // binding
        this.onOpen = this.onOpen.bind(this)
        this.onClose = this.onClose.bind(this)

        if (props.open) this.createEvent()
    }

    componentWillReceiveProps(props, state) {
        if (this.props.open !== props.open)
            props.open ? this.createEvent() : this.removeEvent()
    }

    createEvent() {
        this.state.eventJustCreated = true
        this.callback = e => {
            if (
                !this.state.eventJustCreated &&
                this.state.dropdownmenu &&
                this.state.dropdownmenu.base !== e.target
            ) {
                // this.removeEvent()
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
        if (!this.props.open && this.props.onOpen) this.props.onOpen(e)
    }

    onClose(e) {
        if (this.props.open && this.props.onClose) this.props.onClose(e)
    }

    render() {
        const props = this.props
        const childrens = props.children
        childrens.forEach((child, index) => {
            // won't work in react
            let constructor = child.nodeName // || child.type
            let attrs = child.attributes // || child.props
            attrs.ref = element => (this.state.dropdownmenu = element)
            attrs.visible = props.open
        })

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
