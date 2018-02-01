import styled from 'styled-components'
import styles from '/const/styles'

export default styled.div`
    display: none;
    ${props => {
        if (props.active)
            return `
        display: block;
        animation: movetoactive 1s forwards;
        `
    }} @keyframes movetoactive {
        0% {
            transform: translateX(100px);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
