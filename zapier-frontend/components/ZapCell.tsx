export const ZapCell = ({ name, index, onClick }: {
    name?: string,
    index: number
    onClick: () => void
}) => {

    return <div onClick={onClick} className="flex justify-center border border-black px-8 py-4 w-[300px] cursor-pointer">
        <div className="flex text-xl">
            <div className="font-bold">
                {index}.
            </div>
            <div>
                {name}
            </div>
        </div>

    </div>
}