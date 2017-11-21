import React from 'react'
import styled from 'styled-components'


export default styled.span`
color: ${props=>props.color||'inherit'};
font-weight: ${props=>props['font-weight']||'inherit'};
`