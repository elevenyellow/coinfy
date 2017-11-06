import styled from 'styled-components'
import styles from '/const/styles'

export default styled.div`
opacity: ${props=>props.normal||0.5};
:hover {
    opacity: ${props=>props.hover||1};
}
`