import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import Input from '/components/styled/Input'


export default function InputFile(props) {
    return <Input type="file" {...props} />
}