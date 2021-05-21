import * as React from "react"

function Quiz(props) {
    const [q_range, set_q_range] = React.useState([0,0]);

    let q_length = props.quiz.length;

    let q_range_form = (
        <div>
            <input type="number"/> - <input/><br/>
            <input type="submit"/>
        </div>
    )

    return (
        <div>
            <p>Length of quiz: {q_length} questions</p>
            <p>Questions to test: {q_range_form}</p>
        </div>
    )
}

export default Quiz