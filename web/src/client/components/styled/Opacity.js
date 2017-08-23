import styled from 'styled-components'
import styles from '/styles'

export default styled.div`
opacity: ${props=>props.normal};
:hover {
    opacity: ${props=>props.hover};
}
`