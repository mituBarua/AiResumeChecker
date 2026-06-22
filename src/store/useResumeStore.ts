import {create} from 'zustand'
interface ResumeStore {
    resume: string
    jobDescription: string
    isAnalyzing:boolean
    feedback:string

    setResume:(resume:string)=>void
    setJobDescription:(job:string)=> void
    setIsAnalyzing:(value:boolean)=>void
    setFeedback:(feedback:string)=>void
}
const useResumeStore = create<ResumeStore>()((set)=>({
    resume:'',
    jobDescription:'',
    isAnalyzing:false,
    feedback:'',
    
    setResume:(resume)=> set({resume}),
    setJobDescription:(job) =>set({jobDescription:job}),
    setIsAnalyzing:(value) => set({isAnalyzing:value}),
    setFeedback:(feedback) => set({feedback})
}))
export default useResumeStore;