import { useState } from 'react'
import useResumeStore from '../store/useResumeStore'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function LeftPanel() {
  const [localResume, setLocalResume] = useState('')
  const [localJob, setLocalJob] = useState('')
  const { setResume, setJobDescription, setIsAnalyzing } = useResumeStore()

const handlePDFUpload = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  
  let fullText = ''
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
    fullText += pageText + '\n'
  }
  
  setLocalResume(fullText)
}
  const handleAnalyze = () => {
    if (localResume.trim() === '') return
    if (localJob.trim() === '') return
    setResume(localResume)
    setJobDescription(localJob)
    setIsAnalyzing(true)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit">
      <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-2">
        Step 1 — Your resume
      </p>
      <p className="text-sm font-medium text-gray-900 mb-1">Paste your resume</p>
      <p className="text-xs text-gray-500 mb-4">
        We will analyze it and give you actionable feedback.
      </p>

      <textarea
        value={localResume}
        onChange={(e) => setLocalResume(e.target.value)}
        placeholder="Paste your resume text here...

Example:
Sara Ahmed — React Developer
2 years experience building React apps
Skills: React, TypeScript, Tailwind CSS..."
        className="w-full h-44 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none outline-none focus:border-purple-400 text-gray-900 placeholder-gray-400 transition-colors"
      />
      <p className="text-xs text-gray-400 text-right mb-4">
        {localResume.length} characters
      </p>
<span>Or</span>
<div
  className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:border-purple-400 hover:bg-purple-50 transition-colors cursor-pointer mb-3"
  onClick={() => document.getElementById('pdf-upload')?.click()}
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      handlePDFUpload(file)
    }
  }}
>
  <input
    id="pdf-upload"
    type="file"
    accept=".pdf"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0]
      if (file) handlePDFUpload(file)
    }}
  />
  <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
    <span className="text-gray-400 text-sm">↑</span>
  </div>
  <p className="text-sm text-gray-500 mb-1">Drag and drop your PDF here</p>
  <p className="text-xs text-gray-400">or click to browse</p>
</div>
      <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-2">
        Step 2 — Job description
      </p>
      <textarea
        value={localJob}
        onChange={(e) => setLocalJob(e.target.value)}
        placeholder="Paste the job description or job title..."
        className="w-full h-32 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none outline-none focus:border-purple-400 text-gray-900 placeholder-gray-400 transition-colors mb-4"
      />

      <button
        onClick={handleAnalyze}
        disabled={!localResume.trim() || !localJob.trim()}
        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        ✦ Analyze my resume
      </button>
    </div>
  )
}