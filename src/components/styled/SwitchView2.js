import styled from 'styled-components'
import styles from '/const/styles'

export default styled.div`
    & > * {
        display: none;
    }
    & > *:nth-child(${props => Number(props.active) + 1 || 1}) {
        display: block;
        animation: movetoactive 1s forwards;
    }
    @keyframes movetoactive {
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
