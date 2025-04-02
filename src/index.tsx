import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

// Make sure DOM is loaded before trying to access elements
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root")

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  } else {
    console.error("Could not find root element to mount React app")
    // Create a fallback element if root doesn't exist
    const fallbackRoot = document.createElement("div")
    fallbackRoot.id = "root"
    document.body.appendChild(fallbackRoot)

    const root = ReactDOM.createRoot(fallbackRoot)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  }
})

