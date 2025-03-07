import { ChatbotUIContext } from "@/context/context"
import {
  type UIEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"

export const useScroll = () => {
  const { isGenerating, chatMessages } = useContext(ChatbotUIContext)

  const messagesStartRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isAutoScrolling = useRef(false)

  const [isAtTop, setIsAtTop] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [userScrolled, setUserScrolled] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const autoScrollTimeout = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    setUserScrolled(false)

    if (!isGenerating && userScrolled) {
      setUserScrolled(false)
    }
  }, [isGenerating])

  useEffect(() => {
    if (isGenerating && !userScrolled) {
      scrollToBottom()
    }
  }, [chatMessages, isGenerating])

  const forceScrollToBottom = useCallback(() => {
    isAutoScrolling.current = true

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" })
    }

    if (autoScrollTimeout.current) {
      clearTimeout(autoScrollTimeout.current)
    }

    autoScrollTimeout.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" })
      }
      isAutoScrolling.current = false
      autoScrollTimeout.current = null
    }, 100)

    setUserScrolled(false)
  }, [])

  const handleScroll: UIEventHandler<HTMLDivElement> = useCallback(e => {
    const target = e.target as HTMLDivElement
    const bottom =
      Math.round(target.scrollHeight) - Math.round(target.scrollTop) ===
      Math.round(target.clientHeight)
    setIsAtBottom(bottom)

    const top = target.scrollTop === 0
    setIsAtTop(top)

    if (!bottom) {
      if (autoScrollTimeout.current) {
        clearTimeout(autoScrollTimeout.current)
        autoScrollTimeout.current = null
      }

      isAutoScrolling.current = false
      setUserScrolled(true)
    } else {
      setUserScrolled(false)
      scrollToBottom()
    }

    const isOverflow = target.scrollHeight > target.clientHeight
    setIsOverflowing(isOverflow)
  }, [])

  const scrollToTop = useCallback(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollIntoView({ behavior: "instant" })
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    if (userScrolled) return

    isAutoScrolling.current = true

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" })
    }

    if (autoScrollTimeout.current) {
      clearTimeout(autoScrollTimeout.current)
    }

    autoScrollTimeout.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" })
      }

      isAutoScrolling.current = false
      autoScrollTimeout.current = null
    }, 100)
  }, [userScrolled])

  return {
    messagesStartRef,
    messagesEndRef,
    isAtTop,
    isAtBottom,
    userScrolled,
    isOverflowing,
    handleScroll,
    forceScrollToBottom,
    scrollToTop,
    scrollToBottom,
    setIsAtBottom
  }
}
