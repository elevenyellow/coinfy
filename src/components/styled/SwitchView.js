import styled from 'styled-components'
import styles from '/const/styles'

let active_last
export default styled.div`
    & > * {
        display: none;
    }
    & > *:nth-child(${({ active = 1 }) => Number(active) + 1}) {
        display: block;
        ${({ active = 1 }) => {
            const last = active_last
            active = Number(active) + 1
            active_last = active
            return last === active || last === undefined
                ? ''
                : last > active
                  ? 'animation: back 0.75s ease;'
                  : 'animation: next 0.75s ease;'
        }};
    }

    @keyframes next {
        0% {
            transform: translateX(100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes back {
        0% {
            transform: translateX(-100%);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
