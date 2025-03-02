"use client";

import { useState, useEffect } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useOnboardStore } from "@/store/useOnboardingStore";

const OnboardingDialog = () => {
    const [open, setOpen] = useState(true);
    const { step, answers, setStep, setAnswer, reset } = useOnboardStore();

    useEffect(() => {
        const storedState = localStorage.getItem("onboardingState");
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            setStep(parsedState.step);
        }
    }, [setStep]);

    const getQuestion = () => {
        switch (step) {
            case 1:
                return {
                    question: "How do you want to use ReflectAi?",
                    answers: ["Writing Notes", "Voice Memos", "AI Summarization"],
                };
            case 2:
                return {
                    question: "What’s your main goal with ReflectAi?",
                    answers: ["Self-Improvement", "Journaling", "Tracking Habits"],
                };
            case 3:
                return {
                    question: "Which theme do you prefer?",
                    answers: ["Minimalist", "Dark Mode", "Colorful UI"],
                };
            default:
                return { question: "", answers: [] };
        }
    };

    const { question, answers: possibleAnswers } = getQuestion();

    const handleAnswerSelection = async (answer: string) => {
        setAnswer(step, answer);
        if (step < 3) {
            setStep(step + 1);
        } else {

            setOpen(false);
        }
    };

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="max-w-md p-6 bg-black-100 h-[75vh] border-none shadow-none">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-bold text-gray-300">
                        Step {step}/3
                    </AlertDialogTitle>
                    <p className="text-gray-300 text-xl">{question}</p>
                </AlertDialogHeader>

                <div className="flex flex-col gap-3">
                    {possibleAnswers.map((answer, index) => {
                        const isSelected = answers && answers[step] === answer; // Check if it's the selected answer
                        return (
                            <Button
                                key={index}
                                className={`w-full p-10 border hover:bg-gray-900 mb-2 shadow-lg border-gray-600 
                  ${isSelected ? "bg-gray-700 text-white border-gray-500 inset-ring-2 inset-ring-blue-500   shadow-purple-500/50"   : "bg-black-100 text-gray-300"}`}
                                onClick={() => handleAnswerSelection(answer)}
                            >
                                {answer}
                            </Button>
                        );
                    })}
                </div>

                <AlertDialogFooter >
                    <div className="flex justify-between w-full">
                        <AlertDialogCancel onClick={() => reset()}>
                          cancel
                        </AlertDialogCancel>

                        {step > 1 && (
                            <AlertDialogCancel onClick={() => step > 0 ? setStep(step - 1) : null}>
                              back
                            </AlertDialogCancel>
                        )}
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default OnboardingDialog;