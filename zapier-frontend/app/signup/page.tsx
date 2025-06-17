"use client"
import { Appbar } from "@/components/Appbar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function () {
    const router = useRouter(); 
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="max-w-4xl w-full px-4 py-24 flex flex-col md:flex-row gap-6">
                {/* Left column - Features */}
                <div className="md:flex-1 pt-6">
                    <div className="font-semibold text-3xl pb-6">
                        Join millions worldwide who automate their work using zapier
                    </div>
                    <div className="space-y-6">
                        <CheckFeature label={"Integrate 8,000+ apps and 300+ AI tools without code"} />
                        <CheckFeature label={"Build AI-powered workflows in minutes, not weeks"} />
                        <CheckFeature label={"14-day trial of all premium features and apps"} />
                    </div>
                </div>
                
                {/* Right column - Sign up form */}
                <div className="md:flex-1 flex flex-col">
                    <div className="border border-slate-200 rounded p-6">
                        <div className="space-y-4">
                            <Input onChange={e=>{
                                setName(e.target.value)
                            }} label={"Name"} type={"text"} placeholder={"Your name"} />
                            <Input onChange={e => { setEmail(e.target.value) }} label={"Email"} type={"text"} placeholder="Your Email" />
                            <Input onChange={e => {setPassword(e.target.value) }} label={"password"} type={"password"} placeholder="Password" />
                        </div>
                        
                        <div className="mt-6">
                            <PrimaryButton size={"big"} onClick={async() => {
                                const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
                                username:email,
                                password,
                                name
                            })
                            router.push("/login")
                            }}>
                                Get Started for Free
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

}