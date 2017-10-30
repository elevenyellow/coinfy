import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'


export default styled.div`
text-align: center;
font-size: 30px;
font-weight: bold;
color: lightgrey;
height:100%;
padding: 0 40px;
${styles.media.fourth} {
    font-size: 20px
}
`