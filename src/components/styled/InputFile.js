import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import { createInputFile } from '/api/browser'
import Input from '/components/styled/Input'
import IconMenu from 'react-icons/lib/md/folder-open'

export default class InputFile extends Component {
    componentWillMount() {
        this.state = { fileName: '' }
        this.input = createInputFile()
        this.input.addEventListener('change', e => {
            if (e.target.files && e.target.files[0])
                this.setState({ fileName: e.target.files[0].name })
            if (typeof this.props.onChange == 'function') this.props.onChange(e)
        })
        this.onClick = this.onClick.bind(this)
    }

    onClick(e) {
        this.input.click()
    }

    render() {
        return (
            <Container onClick={this.onClick} invalid={this.props.invalid}>
                <div className="icon">
                    <IconMenu size={20} color={styles.color.front5} />
                </div>
                <div className="input">
                    <Input
                        {...this.props}
                        placeholder={this.props.placeholder || 'Select file'}
                        disabled={true}
                        value={this.state.fileName}
                        onChange={null}
                    />
                </div>
            </Container>
        )
    }
}

const Container = styled.div`
    & .icon {
        float: left;
        text-align: center;
        width: 40px;
        height: 31px;
        background-image: linear-gradient(#fff, ${styles.color.background1});
        border: 1px solid
            ${props =>
                props.invalid ? styles.color.error : styles.color.background5};
        font-weight: bold;
        font-size: 12px;
        display: inline-block;
        line-height: 20px;
        border-radius: 5px 0 0 5px;
        border-right: 0;
        padding-top: 6px;
        ${styles.media.fourth} {
            height: 32px;
        }
    }
    & .input {
        float: left;
        width: calc(100% - 42px);
    }
`
