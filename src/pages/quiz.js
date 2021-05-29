import * as React from "react"

//styles
const table_style = {
    borderCollapse: 'collapse',
    //width: "100%",
    tableLayout: "fixed",
}
const cell_style = {
    border: '1px solid #ddd',
}
const even_cell_color_style = {
    backgroundColor: "#f2f2f2",
}
const head_cell_color_style = {
    backgroundColor: "rgb(164, 104, 215)",
    color: "white",
    padding: "7px",
}
const menu_button_style = {
    whiteSpace: "nowrap"
}
//end styles

const RANGE_NAME = "quiz_range";
const OFFSET_NAME = "quiz_offset";
const BEGIN_QUIZ_NAME = "begin_quiz";//takes you to options menu
const START_QUIZ_NAME = "start_quiz";//acutally starts quiz
const END_QUIZ_NAME = "end_quiz";
const PAGE_NAME = "page_number";
const QUESTION_SELECT_NAME = "question_select";
const ANSWER_SELECT_NAME = "answer_select";
const ANSWER_BUTTON_NAME = "answer_button";
const RETAKE_NAME = "retake_button";
const QUIZ_SELECT_NAME = "quiz_select";
const NUMBER_OF_ANSWERS_NAME = "number_of_answers";
const FLIP_BUTTON_NAME = "flip_button";

const TABLESTAGE = 1;
const OPTIONSSTAGE = 2;
const QUIZSTAGE = 3;
const SCORECARDSTAGE = 4;

function Quiz(props) {
    const [q_data, set_q_data] = React.useState(props.datasets[0].data);
    function keys() {
        return [...Object.keys(q_data[0])]
    }

    const [q_range, set_q_range] = React.useState(20);
    const [q_range_offset, set_q_range_offset] = React.useState(0);
    const [q_page, set_q_page] = React.useState(1);
    const [q_table, set_q_table] = React.useState(makeTable());
    const [q_selection_error, set_q_selection_error] = React.useState(false);
    const [q_questions, set_q_questions] = React.useState([]);
    const [q_current_question, set_q_current_question] = React.useState(0);
    const [q_incorrect_counter, set_q_incorrect_counter] = React.useState(0);
    const [q_selected_question, set_q_selected_question] = React.useState(keys()[0]);
    const [q_selected_answer, set_q_selected_answer] = React.useState(keys()[0]);
    const [q_answered_counter, set_q_answered_counter] = React.useState(0);
    const [q_answers, set_q_answers] = React.useState(4);
    const [q_chosen_quiz, set_chosen_quiz] = React.useState(0);
    const [q_is_shown, set_q_stage] = React.useState(TABLESTAGE); 

    function q_length() {
        return q_data.length;
    }

    function page_count() {
        return Math.ceil(q_length() / q_range);
    }

    function input_box_width(basis) {
        return {
            width: (basis.toString().length + 3) + 'ch',
        }
    }
    
    function selected_items() {
        let range = [
            (q_page-1) * q_range,
            q_range * q_page
        ]

        range = range.map(x => x + q_range_offset);

        return q_data.slice(range[0], range[1])
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

    //EVENTS
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
                set_q_questions(selected_items());
                break;
            case OFFSET_NAME:
                change_offset(value);
                break;
            case BEGIN_QUIZ_NAME:
                if (selected_items().length > 0) {
                    change_q_answers(q_answers);
                    set_q_stage(OPTIONSSTAGE);
                    resetQuiz();
                }
                
                break;
            case END_QUIZ_NAME:
                set_q_stage(TABLESTAGE);
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
                if (q_selected_question === q_selected_answer || q_answers == 0) {
                    set_q_selection_error(true);
                }else{
                    //console.log(selected_items()[0], q_selected_question, q_selected_answer)
                    set_q_questions(selected_items().map(x => {
                        return {
                            question: x[q_selected_question],
                            answer: x[q_selected_answer],
                            fails: 0,
                        }
                    }))
                    set_q_stage(QUIZSTAGE);
                }
                break;
            case ANSWER_BUTTON_NAME:
                answer_button_event(event);
                break;
            case RETAKE_NAME:
                set_q_stage(OPTIONSSTAGE);
                resetQuiz();
                break;
            case QUIZ_SELECT_NAME:
                handleSelectionChange(event)
                break;
            case NUMBER_OF_ANSWERS_NAME:
                change_q_answers(event.target.value);
                break;
            case FLIP_BUTTON_NAME:
                let t = q_selected_answer;
                set_q_selected_answer(q_selected_question);
                set_q_selected_question(q_selected_answer);
                break;
            default:
                console.log("how?")
                break;
        }
        event.preventDefault();
    }
    
    function answer_button_event(event) {
        if (event.target.dataset.question === q_questions[q_current_question].answer) {//correct answer
            let arr = q_questions.slice();
            let t = arr[q_current_question];
            let m = (q_questions.length - 1) - q_answered_counter;

            arr[q_current_question] = arr[m];
            arr[m] = t;

            if (q_answered_counter + 1 === q_questions.length) {
                set_q_stage(SCORECARDSTAGE);
            }

            set_q_answered_counter(q_answered_counter + 1);
            set_q_questions(arr);
        }else{
            set_q_incorrect_counter(q_incorrect_counter + 1);
            let arr = q_questions.slice();
            arr[q_current_question].fails += 1;
            set_q_questions(arr);
        }

        change_current_question();
    }

    function handleRangeFormSubmit(event) {
        //console.log(event, q_range);
        set_q_table(makeTable())
        event.preventDefault();
    }
    //END EVENTS

    //STATE CHANGERS
    function handleSelectionChange(event) {
        set_chosen_quiz(Number(event.target.value));
    }

    function resetQuiz() {
        change_current_question()
        set_q_incorrect_counter(0);
        set_q_answered_counter(0);
    }

    function change_offset(a) {
        if (a < 0) {
            a = 0
        }

        set_q_range_offset(a);
    }

    function change_current_question() {
        let m = (selected_items().length - 1) - q_answered_counter, i=0;

        console.log('m', m);
        
        if (m > 0) {
            i = Math.floor(Math.random() * m);
        }

        set_q_current_question(i);
    }

    function change_page(a) {
        if (a < 0) {
            a = page_count();
        }

        if (a > page_count()) {
            a = 0;
        }

        set_q_page(a);
    }

    function change_range(a) {
        if (a < 0) {
            a = 0;
        }

        if (a > q_length()) {
            a = q_length();
        }

        set_q_range(a);
    }
    
    function change_q_answers(value) {
        if (value < 0) {
            value = 0;
        }

        let len = selected_items().length

        if (value > len) {
            value = len
        }

        set_q_answers(value)
    }
    //END STATE CHANGERS

    //JSX ELEMENTS
    let q_range_form = (
        <form onSubmit={handleRangeFormSubmit}>
            Quiz Size:<br/><input name={RANGE_NAME} style={input_box_width(q_range)} value={q_range.toString()} type="number" onChange={handleEvent}/>/{q_length()}<br/>
            Offset: <br /><input name={OFFSET_NAME} style={input_box_width(q_range_offset)} value={q_range_offset.toString()} type="number" onChange={handleEvent} /><br/>
            {/*<input type="submit"/>*/}
        </form>
    )

    function page_controls() {
        let page_increment = (x) => {
            change_page(q_page+x);
            console.log(q_page)
        }

        let cells = [
            <button style={menu_button_style} onClick={() => page_increment(-1)} >{"Previous Page"}</button>,
            <button style={menu_button_style} onClick={() => page_increment(1)} >{"Next Page"}</button>,
            <><input style={input_box_width(q_page)} type="number" name={PAGE_NAME} onChange={handleEvent} value={q_page.toString()} />{`/${page_count()}`}</>,
            <button style={menu_button_style} name={BEGIN_QUIZ_NAME} onClick={handleEvent}>{"Begin Quiz"}</button>
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
                {quiz_select()}
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

    function quiz_select() {
        return (<>
            Choose Quiz: <select name={QUIZ_SELECT_NAME} value={q_chosen_quiz} onChange={handleEvent}>
                {props.datasets.map((x,i) => {
                return (
                    <option value={i}>{x.title}</option>
                )
                })}
            </select>
        </>)
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
                        <button style={menu_button_style} name={END_QUIZ_NAME} onClick={handleEvent} >End Quiz</button><br />
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
                        <button name={FLIP_BUTTON_NAME} onClick={handleEvent} >flip</button>
                        <br />
                        Answers per question: <input style={input_box_width(q_answers)} type="number" value={q_answers} name={NUMBER_OF_ANSWERS_NAME} onChange={handleEvent} />
                        <br />
                        <button style={menu_button_style} onClick={handleEvent} name={START_QUIZ_NAME}>Begin Quiz</button>{err}
                    </div>
                )
                break;
            case QUIZSTAGE:
                console.log("q_questions", q_questions);
                let question = q_questions[q_current_question].question;
                let answers = shuffle(random_answers(q_questions, q_answers).slice());

                data = (
                    <div>
                        <b>Q: {question}</b>
                        <br /><br />
                        {answers.map((x,i) => (
                            <>{`${i+1}:\t\t`}<button onClick={handleEvent} data-question={x.toString()} value={i} name={ANSWER_BUTTON_NAME}>{x}</button><br /></>
                        ))}
                        <br />Questions Left: {selected_items().length - q_answered_counter}
                        <br />Correct Answers: {q_answered_counter}
                        <br />Incorrect Answers: {q_incorrect_counter}
                        <br /><button style={menu_button_style} onClick={handleEvent} name={END_QUIZ_NAME}>End Quiz</button>
                    </div>
                )
                break;
            case SCORECARDSTAGE:
                data = (
                    <div>
                        You Got {q_answered_counter} correct and {q_incorrect_counter} incorrect.<br />
                        You scored {selected_items().length - q_incorrect_counter}/{q_questions.length}
                        <br />
                        <button style={menu_button_style} onClick={handleEvent} name={END_QUIZ_NAME}>End Quiz</button>
                        <button style={menu_button_style} onClick={handleEvent} name={RETAKE_NAME}>Retake Quiz</button>
                        <br />What you need to study:<br />
                        <table style={table_style}>
                            <thead>
                                <tr>
                                {[...Object.keys(q_questions[0])].map(x => {
                                    return (
                                        <td style={{...cell_style,...head_cell_color_style}}>{x}</td>
                                    )
                                })}
                                </tr>
                            </thead>
                            <tbody>
                                {q_questions.filter(x => x.fails > 0).map(x => {
                                    return (
                                        <tr>
                                            {[...Object.keys(x)].map(xx => {
                                                return <td style={cell_style}>{x[xx]}</td>
                                            })}
                                        </tr>
                                        
                                    )
                                })}
                            </tbody>
                        </table>
                        
                    </div>
                )
                break;
            default:
                data = <b>sumting broked</b>
                break;
        }
        return data;
    }
    //END JSX ELEMENTS
    
    //REACT EFFECTS
    React.useEffect(() => set_q_table(makeTable()), [q_page, q_range, q_range_offset])
    React.useEffect(() => {
        set_q_table(makeTable());
        set_q_selected_question(keys()[props.datasets[q_chosen_quiz].default_qa[0]]);
        set_q_selected_answer(keys()[props.datasets[q_chosen_quiz].default_qa[1]])
    }, [q_data]);
    React.useEffect(() => {
        set_q_data(props.datasets[q_chosen_quiz].data);
    }, [q_chosen_quiz]);
    //END REACT EFFECTS

    return (
        <div style={{width: "fit-content"}}>
            <p>Length of quiz: {selected_items().length} questions</p>
            {quiz_modal()}
        </div>
    )

}

export default Quiz