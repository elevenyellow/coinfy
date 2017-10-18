import React, { Component } from 'react'

export default function Circle({
    segments = [],
    strokeWidth = 2,
    backgroundStrokeColor = '#E5E5E5',
    backgroundColor = 'transparent',
    size = 200,
    children
}) {
    let percentageUsed = 0
    let c = 17.1
    let r = '15.91549430918952'
    return (
        <svg width={size} height={size} viewBox={`0 0 ${c*2} ${c*2}`}>
            <circle
                cx={c}
                cy={c}
                r={r}
                fill={backgroundColor}
            />
            <circle
                cx={c}
                cy={c}
                r={r}
                fill="transparent"
                stroke={backgroundStrokeColor}
                stroke-width={strokeWidth}
            />

            {segments.map(s =>{
                let dasharray = `${s.percentage} ${100 - s.percentage}`
                let offset = 100 - percentageUsed + 25
                percentageUsed += s.percentage

                return (
                    <circle
                        cx={c}
                        cy={c}
                        r={r}
                        fill="transparent"
                        stroke={s.color}
                        stroke-width={strokeWidth}
                        stroke-dasharray={dasharray}
                        stroke-dashoffset={offset}
                    />
                )
            })}

            {children}
        </svg>
    )
}

// export default function Circle(props) {

//     let xy = props.size / 2
//     let r = xy - props.stroke / 2
//     let strokeDasharray = Math.PI * (r * 2)
//     let strokeDashoffset = (100 - props.percentage) / 100 * strokeDasharray

//     return (
//         <CircleTheme {...props}>
//             <div className="eyc-back">
//                 <svg>
//                     <circle
//                         cx={xy}
//                         cy={xy}
//                         r={r}
//                         strokeWidth={props.stroke}
//                         stroke={props.backgroundColor}
//                         fill="none"
//                     />
//                 </svg>
//             </div>
//             <div className="eyc-front">
//                 <svg>
//                     <circle
//                         cx={xy}
//                         cy={xy}
//                         r={r}
//                         strokeWidth={props.stroke}
//                         stroke={props.color}
//                         fill="none"
//                         style={{
//                             strokeDashoffset: strokeDashoffset,
//                             strokeDasharray: strokeDasharray
//                         }}
//                     />
//                 </svg>
//             </div>
//         </CircleTheme>
//     )
// }

// const CircleTheme = styled.div`
// box-sizing: content-box;
// position: relative;
// width: ${props=>props.size}px;
// height: ${props=>props.size}px;

// & > div {
//     box-sizing: content-box;
//     position: absolute;
//     left: 0;
//     top: 0;
//     width: ${props=>props.size}px;
//     height: ${props=>props.size}px;
// }
// & svg {
//     box-sizing: content-box;
//     width:100%;
//     height:100%;
//     display: block;
// }
// & .eyc-back svg circle {
//     box-sizing: content-box;
//   stroke-dashoffset: 1
// }
// `
