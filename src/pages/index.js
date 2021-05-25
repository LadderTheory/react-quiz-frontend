import * as React from "react"
import Quiz from "./quiz.js"

const quiz_data = [
  require("./quiz_data/afrikaans"),
  require("./quiz_data/albanian"),
  require("./quiz_data/german"),
  require("./quiz_data/greek"),
  require("./quiz_data/hawaiian"),
  require("./quiz_data/hangul"),
  require("./quiz_data/hebrew"),
  require("./quiz_data/hindi"),
  require("./quiz_data/italian"),
  require("./quiz_data/japanese"),
  require("./quiz_data/korean"),
  require("./quiz_data/russian"),
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
  return (
    <main style={pageStyles}>
      <title>Somou</title>
      <Quiz datasets={quiz_data} />
    </main>
  )
}

export default IndexPage
