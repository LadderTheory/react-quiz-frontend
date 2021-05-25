import * as React from "react"
import Quiz from "./quiz.js"

const language_data = [
  require("./language_data/albanian"),
  require("./language_data/greek"),
  require("./language_data/hawaiian"),
  require("./language_data/hebrew"),
  require("./language_data/hindi"),
  require("./language_data/italian"),
  require("./language_data/japanese"),
  require("./language_data/korean"),
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
  return (
    <main style={pageStyles}>
      <title>Somou</title>
      <Quiz datasets={language_data} />
    </main>
  )
}

export default IndexPage
