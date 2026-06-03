import { useContext } from "react"
import { UIContext } from "../context/UiProvider"

export const useUiContext = () => {
    const context = useContext(UIContext)

    if (!context) {
        throw new Error("context not provided")
    }

    return context
}
