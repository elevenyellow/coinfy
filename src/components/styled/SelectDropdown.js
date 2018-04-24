import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

import {
    Dropdown,
    DropdownItem,
    DropdownMenu
} from '/components/styled/Dropdown'

export default class SelectDropdown extends React.Component {
    constructor(props) {
        super(props)
        this.state = { open: false }
    }

    onOpen() {
        this.setState({ open: true })
    }

    onClose() {
        this.setState({ open: false })
    }

    onChange(value, index, child) {
        this.props.onChange({ target: { value: value } }, value, index)
    }

    render() {
        const props = this.props
        const state = this.state
        const childrens = props.children || this.childrens
        this.childrens = Array.isArray(childrens) ? childrens : [childrens]
        let selected_index = -1
        const options = this.childrens.map((child, index) => {
            const attrs = child.attributes // || child.props
            if (attrs.selected) selected_index = index
            return (
                <DropdownItem
                    {...attrs}
                    onClick={e => {
                        if (!attrs.selected)
                            this.onChange(attrs.value, index, child)
                    }}
                >
                    {child.children}
                </DropdownItem>
            )
        })
        // const selected = selected_index === -1 ? childrens[0] : childrens[selected_index]
        const label =
            selected_index === -1 ? '' : childrens[selected_index].children
        return (
            <Dropdown
                onOpen={this.onOpen.bind(this)}
                onClose={this.onClose.bind(this)}
                open={state.open}
            >
                <DropdownButton open={state.open}>
                    <DropdownLabel open={state.open}>{label}</DropdownLabel>
                    <DropdownArrow open={state.open}>
                        <span />
                    </DropdownArrow>
                </DropdownButton>
                <DropdownMenu width="100%">{options}</DropdownMenu>
            </Dropdown>
        )
    }
}

const DropdownButton = styled.div`
    position: relative;
    background-image: linear-gradient(#fff, ${styles.color.background1});
    border: 1px solid
        ${props =>
            props.open ? styles.color.background3 : styles.color.background5};
    border-radius: 4px;
    border-right: auto;
    margin: 0 auto;
    display: block;
    outline: none;
    min-height: 37px;
    &:hover {
        border-color: ${styles.color.background3};
    }
    &:hover > * {
        border-left-color: ${styles.color.background3};
    }
`

const DropdownLabel = styled.div`
    color: ${styles.color.front3};
    font-weight: bold;
    font-size: 13px;
    padding: 8px 0px 8px 18px;
    width: calc(100% - 62px);
    line-height: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
`
const DropdownArrow = styled.div`
    right: 0;
    top: 0;
    position: absolute;
    padding: 8px 14px;
    border-left: 1px solid
        ${props =>
            props.open ? styles.color.background3 : styles.color.background5};
    box-sizing: content-box;

    & span {
        display: inline-block;
        vertical-align: middle;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 7px solid ${styles.color.front1};
        margin-top: -2px;
    }
`
