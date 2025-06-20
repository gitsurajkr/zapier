"use-client"
import { ReactNode } from "react"

export const LinkButton = ({ children, onClick }: { children: ReactNode, onClick: () => void }) => {
    return <div className="flex justify-center font-extralight px-2 py-2 cursor-pointer hover:bg-[#ebe9df] rounded" onClick={onClick}>
        {children}
    </div>
}

