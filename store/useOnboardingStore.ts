import {create } from 'zustand';
interface OnboardingState {
    step: number;
    answers: {[key:number] : string };
    setStep: (step:number) => void;
    setAnswer: (step:number, answer:string)=> void;
    reset: () => void;

}

const loadState = () =>{
    if(typeof window !=="undefined"){
        const storedState = localStorage.getItem('onboardingState');
        return storedState? JSON.parse(storedState) : {step:1, answer:{}}
    }
    return {step:1, answer: {}};
}


export const useOnboardStore = create <OnboardingState> ((set) => ({
    ...loadState(),
    setStep: (step) => {
        set((state) => {
            const newState = { ...state, step };
            localStorage.setItem("onboardingState", JSON.stringify(newState));
           return newState
        })
    },
    setAnswer: (step, answer) => {
        set((state) => {
          const newAnswers = { ...state.answers, [step]: answer };
          const newState = { ...state, answers: newAnswers };
          localStorage.setItem("onboardingState", JSON.stringify(newState)); // Persist to localStorage
          return newState;
        });
      },
      reset: () => {
        localStorage.removeItem("onboardingState");
        set({ step: 1, answers: {} });
      },
}))