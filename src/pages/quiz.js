import * as React from "react"

//styles
const table_style = {
    borderCollapse: 'collapse',
}
const cell_style = {
    border: '1px solid #ddd',
}
const even_cell_color_style = {
    backgroundColor: "#f2f2f2",
}
const head_cell_color_style = {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "7px",
}
//end styles


const RANGE_NAME = "quiz_range";
const BEGIN_QUIZ_NAME = "begin_quiz";//takes you to options menu
const START_QUIZ_NAME = "start_quiz";//acutally starts quiz
const END_QUIZ_NAME = "end_quiz";
const PAGE_NAME = "page_number";
const QUESTION_SELECT_NAME = "question_select";
const ANSWER_SELECT_NAME = "answer_select";
const ANSWER_BUTTON_NAME = "answer_button";
const RETAKE_NAME = "retake_button";

function Quiz(props) {
    function keys() {
        return [...Object.keys(props.quiz[0])]
    }
    
    const [q_range, set_q_range] = React.useState(5);
    const [q_page, set_q_page] = React.useState(1);
    const [q_table, set_q_table] = React.useState(makeTable());
    const [q_selection_error, set_q_selection_error] = React.useState(false);
    const [q_questions, set_q_questions] = React.useState([]);
    const [q_current_question, set_q_current_question] = React.useState(0);
    const [q_incorrect_counter, set_q_incorrect_counter] = React.useState(0);

    const DEFAULT_SELECTION = keys()[0]

    const [q_selected_question, set_q_selected_question] = React.useState(keys()[1]);
    const [q_selected_answer, set_q_selected_answer] = React.useState(keys()[2]);
    const [q_answered_counter, set_q_answered_counter] = React.useState(0);
    const [q_incorrect_arr, set_q_incorrect_arr] = React.useState([]);

    const TABLESTAGE = 1;
    const OPTIONSSTAGE = 2;
    const QUIZSTAGE = 3;
    const SCORECARDSTAGE = 4;

    const [q_is_shown, set_q_is_shown] = React.useState(TABLESTAGE);

    let q_length = props.quiz.length;

    function page_count() {
        return Math.ceil(q_length / q_range);
    }

    function page_box_width() {
        return {
            width: (q_page.toString().length + 3) + 'ch',
        }
    }
    
    function selected_items() {
        let range = [
            (q_page-1) * q_range,
            q_range * q_page
        ]

        return props.quiz.slice(range[0], range[1])
    }

    function change_current_question(a) {
        if (a >= selected_items().length) {
            set_q_is_shown(SCORECARDSTAGE);
        } else {
            set_q_current_question(a);
        }
    }

    function change_page(a) {
        if (a < 0) {
            a = 0;
        }

        if (a > page_count()) {
            a = page_count();
        }

        set_q_page(a);
    }

    function change_range(a) {
        if (a < 0) {
            a = 0;
        }

        if (a > q_length) {
            a = q_length
        }

        set_q_range(a);
    }

    function random_answers(arr, count) {
        let selection = [arr[q_current_question].answer];
        let used = [q_current_question];

        while (selection.length < count) {
            let rnd = Math.floor(Math.random() * arr.length);

            while (used.includes(rnd)) {
                rnd += 1;
                if (rnd === arr.length) {
                    rnd = 0;
                }
            }
            selection.push(arr[rnd].answer);
            used.push(rnd);
        }

        return selection;
    }

    function shuffle(arr) {
        var m = arr.length, t, i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            t = arr[m];
            arr[m] = arr[i];
            arr[i] = t;
        }

        return arr;
    }

    function resetQuiz() {
        change_current_question(0);
        set_q_incorrect_counter(0);
    }

    function quiz_modal() {
        let err = "";
        let data = <></>;

        if (q_selection_error) {
            err = "error";
        }

        switch (q_is_shown) {
            case TABLESTAGE:
                data = q_table;
                break;
            case OPTIONSSTAGE:
                data = (
                    <div>
                        <button name={END_QUIZ_NAME} onClick={handleEvent} >End Quiz</button><br />
                        Question: <select value={q_selected_question} onChange={handleEvent} name={QUESTION_SELECT_NAME}>
                            {keys().map(x => {
                                return <option value={x}>{x}</option>
                            })}
                        </select>
                        <br />
                        Answer: <select value={q_selected_answer} onChange={handleEvent} name={ANSWER_SELECT_NAME}>
                            {keys().map(x => {
                                return <option value={x}>{x}</option>
                            })}
                        </select>
                        <br />
                        <button onClick={handleEvent} name={START_QUIZ_NAME}>Begin Quiz</button><p>{err}</p>
                    </div>
                )
                break;
            case QUIZSTAGE:
                console.log(q_questions);
                let question = q_questions[q_current_question].question;
                let answers = shuffle(random_answers(q_questions, 4).slice());

                data = (
                    <div>
                        <b>{question}</b>
                        <br />
                        {answers.map((x,i) => (
                            <><button onClick={handleEvent} data-question={x.toString()} value={i} name={ANSWER_BUTTON_NAME}>{`${i+1}: `}{x}</button><br /></>
                        ))}
                        <br />Incorrect answers: {q_incorrect_counter};
                        <br /><button onClick={handleEvent} name={END_QUIZ_NAME}>End Quiz</button>
                    </div>
                )
                break;
            case SCORECARDSTAGE:
                data = (
                    <div>
                        You got {selected_items().length - q_incorrect_counter} correct!
                        <br />
                        <button onClick={handleEvent} name={END_QUIZ_NAME}>End Quiz</button>
                        <button onClick={handleEvent} name={RETAKE_NAME}>Retake Quiz</button>
                    </div>
                )
                break;
            default:
                data = <b>sumting broked</b>
                break;
        }
        return data;
    }

    function handleEvent(event) {
        set_q_selection_error(false);
        let name = event.target.name;
        let value = Number(event.target.value);
        let si;
        if (event.target.options) {
            si = event.target.options.selectedIndex
        }

        switch (name) {
            case RANGE_NAME:
                change_range(value);
                break;
            case BEGIN_QUIZ_NAME:
                set_q_is_shown(OPTIONSSTAGE);
                resetQuiz();
                break;
            case END_QUIZ_NAME:
                set_q_is_shown(TABLESTAGE);
                break;
            case PAGE_NAME:
                change_page(value);
                break;
            case QUESTION_SELECT_NAME:
                console.log(si)
                set_q_selected_question(keys()[si]);
                break;
            case ANSWER_SELECT_NAME:
                set_q_selected_answer(keys()[si]);
                break;
            case START_QUIZ_NAME:
                if (q_selected_question === q_selected_answer) {
                    set_q_selection_error(true);
                }else{
                    set_q_questions(selected_items().map(x => {
                        return {
                            question: x[q_selected_question],
                            answer: x[q_selected_answer],
                        }
                    }))
                    set_q_is_shown(QUIZSTAGE);
                }
                break;
            case ANSWER_BUTTON_NAME:
                if (event.target.dataset.question == q_questions[q_current_question].answer){//correct
                    let arr = q_questions;
                    let m = arr.length - q_answered_counter, t, i;

                    if (m) {
                        i = Math.floor(Math.random() * m--);

                        t = arr[m];
                        arr[m] = arr[i];
                        arr[i] = t;
                    }
                    
                    set_q_questions(arr);
                    set_q_answered_counter(q_answered_counter + 1);
                } else {//incorrect
                    set_q_incorrect_counter(q_incorrect_counter + 1);
                }
                break;
            case RETAKE_NAME:
                set_q_is_shown(OPTIONSSTAGE);
                resetQuiz();
            default:
                console.log("how?")
                break;
        }
        event.preventDefault();
    }

    function handleRangeFormSubmit(event) {
        //console.log(event, q_range);
        set_q_table(makeTable())
        event.preventDefault();
    }

    let q_range_form = (
        <form onSubmit={handleRangeFormSubmit}>
            Quiz Size:<br/><input name={RANGE_NAME} value={q_range.toString()} type="number" onChange={handleEvent}/>/{q_length}<br/>
            {/*<input type="submit"/>*/}
        </form>
    )

    function page_controls() {
        let page_increment = (x) => {
            change_page(q_page+x);
            console.log(q_page)
        }

        let cells = [
            <button onClick={() => page_increment(-1)} >{"Previous Page"}</button>,
            <button onClick={() => page_increment(1)} >{"Next Page"}</button>,
            <><input style={page_box_width()} type="number" name={PAGE_NAME} onChange={handleEvent} value={q_page.toString()} />{`/${page_count()}`}</>,
            <button name={BEGIN_QUIZ_NAME} onClick={handleEvent}>{"Begin Quiz"}</button>
        ];


        let pg = (<div>
            <table>
                <tbody>
                    <tr>
                        {cells.map(x => <td>{x}</td>)}
                    </tr>
                </tbody>
            </table>
        </div>)

        return pg;
    }

    function makeTable() {
        console.log('make table')
                            
        let even_odd = false;

        return (
            <div>
                <p>Questions to test: </p>
                {q_range_form}
                {page_controls()}
                <table style={table_style}>
                    <thead>
                        <tr>
                        {keys().map(x => <td style={{...cell_style,...head_cell_color_style}}>{x}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {selected_items().map(x => {
                            return (
                                <tr>
                                    {(() => {
                                        let tds = [];
                                        let style = cell_style;
                                        if (even_odd) {
                                            style = {...style,...even_cell_color_style}
                                        }
                                        for (var key in x) {
                                            tds.push(<td style={style}>{x[key]}</td>)
                                        }
                                        even_odd = !even_odd;
                                        return tds;
                                    })()}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {page_controls()}
            </div>
        )
    }
    
    React.useEffect(() => set_q_table(makeTable()), [q_page, q_range])

    return (
        <div>
            <p>Length of quiz: {q_range} questions</p>
            {quiz_modal()}
        </div>
    )
}

export default Quiz