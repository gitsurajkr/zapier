"use client"
import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { Input } from "@/components/Input";
import { ZapCell } from "@/components/ZapCell";
import axios from "axios";
import { propagateServerField } from "next/dist/server/lib/render-server";
import { Amarante } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { json } from "stream/consumers";

function useAvailableActionAndTrigger() {
    const [availableActions, setAvailableAction] = useState([]);
    const [availableTriggers, setAvailableTriggers] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
            .then(x => setAvailableTriggers(x.data.availableTriggers))

        axios.get(`${BACKEND_URL}/api/v1/action/available`)
            .then(x => setAvailableAction(x.data.availableActions))

    }, [])

    return {
        availableActions,
        availableTriggers
    }
}

export default function () {
    const router = useRouter();
    const { availableActions, availableTriggers } = useAvailableActionAndTrigger();

    const [selectedTrigger, setSelectedTrigger] = useState<{
        id: string,
        name: string;
        // image: string
    }>()

    const [selectedActions, setSelectedActions] = useState<{
        index: number
        availableActionId: string,
        availableActionName: string,
        metadata: any
    }[]>([])

    const [selectedModelIndex, setSelecteModelIndex] = useState<null | number>(null)

    return <div className="min-h-screen bg-gray-50">
        <Appbar />
        <div className="flex justify-end">
            <div className="pt-5 pr-5">
                <PrimaryButton onClick={async () => {
                    if (!selectedTrigger?.id) {
                        return;
                    }
                    await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                        "availableTriggerId": selectedTrigger.id,
                        "triggerMetadata": {},
                        "actions": selectedActions.map(a => ({
                            availableActionId: a.availableActionId,
                            actionMetadata: a.metadata
                        }))
                    }, {
                        headers: {
                            Authorization: localStorage.getItem('token')
                        }
                    });
                    router.push("/dashboard")
                }}>

                    Publish
                </PrimaryButton>
            </div>


        </div>
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">Create Your Zap</h1>

            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <div className="flex justify-center w-full mb-8">
                    <ZapCell
                        onClick={() => setSelecteModelIndex(1)}
                        name={selectedTrigger?.name ? selectedTrigger.name : "Select Trigger"}
                        index={1}
                    />
                </div>

                {selectedActions.length > 0 && (
                    <div className="w-full space-y-4 mb-8">
                        <div className="relative flex justify-center">
                            <div className="absolute top-0 bottom-0 w-0.5 bg-gray-200 -translate-y-4"></div>
                        </div>

                        {selectedActions.map((action, index) => (
                            <div key={index} className="flex justify-center">
                                <ZapCell
                                    onClick={() => setSelecteModelIndex(action.index)}
                                    name={action.availableActionName ? action.availableActionName : "Select Action"}
                                    index={action.index}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-center">
                    <PrimaryButton
                        onClick={() => {
                            setSelectedActions(a => [...a, {
                                index: a.length + 2,
                                availableActionId: "",
                                availableActionName: "",
                                metadata: {}
                            }])
                        }}
                    >
                        <div className="text-2xl">+</div>
                    </PrimaryButton>
                </div>
            </div>
        </div>

        {selectedModelIndex && (
            <Modal
                availableItems={selectedModelIndex === 1 ? availableTriggers : availableActions}
                onSelect={(props: null | { name: string, id: string,  metadata: any }) => {
                    if (props === null) {
                        setSelecteModelIndex(null)
                        return;
                    }
                    if (selectedModelIndex === 1) {
                        setSelectedTrigger({
                            id: props.id,
                            name: props.name,
                            // image: props.image
                        })
                    } else {
                        setSelectedActions(a => {
                            let newActions = [...a];
                            newActions[selectedModelIndex - 2] = {
                                index: selectedModelIndex,
                                availableActionId: props.id,
                                availableActionName: props.name,
                                metadata: props.metadata

                            }
                            return newActions;
                        })
                    }
                }}
                index={selectedModelIndex}
            />
        )}
    </div>
}

function Modal({ index, onSelect, availableItems }: {
    index: number,
    onSelect: (props: null | { name: string; id: string, metadata:any }) => void,
    availableItems: { id: string, name: string, image: string }[]
}) {
    const [step, setStep] = useState(0);
    const [selectedAction, setSelectedAction] = useState<{
        id: string,
        name: string
    }>()
    const isTrigger = index === 1;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl mx-4">
                <div className="relative bg-white rounded-xl shadow-lg border border-gray-100 animate-fadeIn overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-800">
                            Select {index === 1 ? "Trigger" : "Action"}
                        </h3>
                        <button
                            onClick={() => onSelect(null)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                        >
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                    <div className="p-5 max-h-[60vh] overflow-y-auto">
                        <div className="space-y-3">
                            {/* {JSON.stringify(selectedAction)} debug things */}
                            {(step === 1 && selectedAction?.id === "email" && <EmailSelector setMetadata={(metadata) =>{
                                onSelect({
                                    ...selectedAction,
                                    metadata
                                })

                            }} />)}

                            {(step === 1 && selectedAction?.id === "sol" && <SolanaSelector setMetadata={(metadata) => {
                                onSelect({
                                    ...selectedAction,
                                    metadata
                                })
                            }} />)}

                            {step === 0 && <div> {availableItems.map(({ id, name, image }) => (
                                <div
                                    key={id}
                                    onClick={() => {
                                        if (isTrigger) {
                                            onSelect({ id, name, metadata: {} })
                                        } else {
                                            setStep(s => s + 1)
                                            setSelectedAction({
                                                id,
                                                name
                                            })
                                        }
                                    }}
                                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <div className="w-10 h-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {image ? (
                                            <img src={image} alt={name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-gray-400 text-xl">{name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="font-medium">{name}</div>
                                </div>
                            ))}
                                {availableItems.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">No items available</div>
                                )} </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EmailSelector({setMetadata}:{
    setMetadata:(params: any) => void
}) {
    const [email, setEmail] = useState("")
    const [body, setBody] = useState("")

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setEmail(e.target.value)} ></Input>
        <Input label={"Body"} type={"text"} placeholder="Body" onChange={(e) => setBody(e.target.value)}></Input>
    <PrimaryButton onClick={() => {
           setMetadata({
            email,
            body
           })
        }}>Submit</PrimaryButton>
    </div>
}

function SolanaSelector({setMetadata}:{
    setMetadata:(params: any) => void
}) {
    const [amount, setAmount] = useState("")
    const [address, setAddress] = useState("");

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setAddress(e.target.value)} ></Input>
        <Input label={"Amount"} type={"text"} placeholder="To" onChange={(e) => setAmount(e.target.value)}></Input>
        <PrimaryButton onClick={() => {
           setMetadata({
            amount,
            address
           })
        }}>Submit</PrimaryButton>
    </div>
}