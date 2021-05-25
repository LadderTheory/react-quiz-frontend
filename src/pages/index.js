import * as React from "react"
import Quiz from "./quiz.js"

const language_data = [
  require("./language_data/albanian"),
  require("./language_data/greek"),
  require("./language_data/hindi"),
  require("./language_data/russian"),
]

// styles
const pageStyles = {
  color: "#232129",
  padding: 30,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  alignContent: "center",
  width: "100",
}

// markup
const IndexPage = () => {
  const [chosen_language, set_chosen_language] = React.useState(0);

  function handleSelectionChange(event) {
    console.log(event.target.value)
    set_chosen_language(event.target.value);
  }

  return (
    <main style={pageStyles}>
      <title>H</title>
      selection: {chosen_language}<br />
      Language: <select value={chosen_language} onChange={handleSelectionChange}>
        {language_data.map((x,i) => {
          return (
            <option value={i}>{x.language}</option>
          )
        })}
      </select>
      <Quiz quiz={language_data[chosen_language].data} />
    </main>
  )
}

export default IndexPage
