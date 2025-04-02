"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Sun, Moon, Send } from "lucide-react"
import "./index.css"
import MarkdownRenderer from "./components/MarkdownRenderer"

// Message type definition
type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `¡Hola! 👋 Bienvenido/a, soy **IA TRABAJO FINAL UAPA**, tu chatbot asistente 🤖.

Fui desarrollado como parte del trabajo final de la asignatura **Inteligencia Artificial** en la Universidad Abierta para Adultos (UAPA).

👨‍💻 Autor: **Garving Vásquez S.**  
📘 Matrícula: **201900861**

Estoy aquí para ayudarte, conversar y acompañarte en esta demostración de lo que la IA puede ofrecer.

¡Empecemos! ✨`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const callChatAPI = async (input: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "WSP ChatBot",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: input }],
      }),
    })

    const data = await res.json()
    return data.choices?.[0]?.message?.content || "No response received."
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    const botReply = await callChatAPI(inputMessage)

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: botReply,
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
    setIsLoading(false)
  }

  return (
    <div className={`flex flex-col h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">IA TRABAJO FINAL UAPA</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="h-5 w-5 text-gray-200" /> : <Moon className="h-5 w-5 text-gray-700" />}
        </button>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto p-4">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm prose dark:prose-invert max-w-none"
                }`}
              >
                <MarkdownRenderer content={message.content} />
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg rounded-bl-none shadow-sm">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className={`p-2 rounded-full ${
              isLoading || !inputMessage.trim()
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            }`}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
