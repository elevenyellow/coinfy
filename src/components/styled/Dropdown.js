import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export class Dropdown extends React.Component {
    constructor(props) {
        super(props)

        this.eventJustCreated = false

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
        this.eventJustCreated = true
        this.callback = e => {
            if (
                !this.eventJustCreated &&
                this.dropdownmenu &&
                this.dropdownmenu.base !== e.target
            ) {
                // this.removeEvent()
                this.onClose(e)
            }
            this.eventJustCreated = false
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
            if (attrs !== undefined) {
                attrs.ref = element => (this.dropdownmenu = element)
                attrs.visible = props.open
            }
        })

        return (
            <DropdownStyled onClick={this.onOpen}>{childrens}</DropdownStyled>
        )
    }
}

const DropdownStyled = styled.div`
    position: relative;
    /* z-index: 1; */
`

export const DropdownMenu = styled.div`
    z-index: 99;
    width: ${props => (props.width ? `calc(${props.width} - 2px)` : 'auto')};
    margin-left: 1px;
    position: absolute;
    background: white;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    display: ${props => (props.visible ? 'block' : 'none')};
    left: ${props => props.left};
    right: ${props => props.right};
    top: ${props => props.top};
`

export const DropdownItem = styled.a`
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    text-decoration: none;
    padding: 10px 18px;
    font-size: 13px;
    color: ${props =>
        props.disabled
            ? styles.color.disabled
            : props.selected ? styles.color.front3 : styles.color.front1};
    background-color: ${props =>
        props.selected ? styles.color.background1 : 'transparent'};
    border-top: 1px solid ${styles.color.background4};
    min-width: 90px;
    text-align: left;
    pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
    &:first-child {
        border-top: 0;
    }
    &:hover {
        background-color: ${styles.color.background1};
        color: ${styles.color.front3};
    }
`
