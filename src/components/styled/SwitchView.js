import styled from 'styled-components'
import styles from '/const/styles'

export default styled.div`
    position: relative;
    & > * {
        /* display: none; */
        width: 100%;
        position: absolute;
        top: 0;
        transition: 0.75s ease all;
    }
    & > *:nth-child(-n + ${props => Number(props.active) + 1 - 1}) {
        left: -100%;
        opacity: 0;
        pointer-events: none;
    }
    & > *:nth-child(${props => Number(props.active) + 1}) {
        left: 0;
        opacity: 1;
    }
    & > *:nth-child(n + ${props => Number(props.active) + 1 + 1}) {
        left: 100%;
        opacity: 0;
        pointer-events: none;
    }
`
