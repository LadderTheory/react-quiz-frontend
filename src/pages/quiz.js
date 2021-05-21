import * as React from "react"

function Quiz(props) {
    const [q_range, set_q_range] = React.useState([1,20]);
    const [q_table, set_q_table] = React.useState(makeTable())

    const range_names = ["range1","range2"]

    let q_length = props.quiz.length;

    function handleRangeChange(event) {
        let name = event.target.name;
        let value = Number(event.target.value);

        if (value == '') {
            //value = 0;
        }

        if (range_names[0] == name) {
            set_q_range([value, q_range[1]])
        }else if (range_names[1] == name) {
            set_q_range([q_range[0], value])
        }
    }

    function handleRangeFormSubmit(event) {
        console.log(event, q_range);
        set_q_table(makeTable())
        event.preventDefault();
    }

    let q_range_form = (
        <form onSubmit={handleRangeFormSubmit}>
            <input name={range_names[0]} value={q_range[0].toString()} type="number" onChange={handleRangeChange}/> - <input onChange={handleRangeChange} value={q_range[1]} name={range_names[1].toString()} type="number"/><br/>
            <input type="submit"/>
        </form>
    )

    function makeTable() {
        console.log('make table')
        return (
            <table><tbody>
                {props.quiz.slice(q_range[0]-1, q_range[1]).map(x => {
                    return (
                        <tr>
                            {(() => {
                                let tds = [];
                                for (var key in x) {
                                    tds.push(<td>{x[key]}</td>)
                                }
                                console.log(tds)
                                return tds
                            })()}
                        </tr>
                    )
                })}
            </tbody></table>
        )
    }

    return (
        <div>
            <p>Length of quiz: {q_length} questions</p>
            <p>Questions to test: </p>{q_range_form}
            {q_table}
        </div>
    )
}

export default Quiz