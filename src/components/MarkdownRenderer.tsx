import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Props {
    content: string
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
    return (
        <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    )
}

export default MarkdownRenderer
