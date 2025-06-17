// "use-client"
import { ReactNode } from "react";

export const SecondaryButton = ({ children, onClick, size = "small" }: {
    children: ReactNode,
    onClick: () => void,
    size?: "big" | "small"
}) => {
    return <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 pt-2.5" : "px-12 py-2"}  cursor-pointer font-bold rounded-full hover:shadow-md border   `}>
        {children}
    </div>
}

