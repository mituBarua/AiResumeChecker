import { useEffect } from 'react'
import useResumeStore from '../store/useResumeStore'

function RightPanel() {
  const { isAnalyzing, feedback, jobDescription, resume, setFeedback, setIsAnalyzing } = useResumeStore()

  useEffect(() => {
   
    if (!isAnalyzing) return

const analyzeResume = async () => {
  try {
    const response = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_COHERE_API_KEY}`
      },
      body: JSON.stringify({
       model: 'command-a-03-2025',
        messages: [
          {
            role: 'user',
            content: `You are an expert resume reviewer. Analyze this resume against the job description and give structured feedback in this exact format:

SCORE: X/100

STRENGTHS:
- Point 1
- Point 2
- Point 3

WEAKNESSES:
- Point 1
- Point 2
- Point 3

MISSING KEYWORDS:
- Keyword 1
- Keyword 2

IMPROVEMENTS:
- Specific suggestion 1
- Specific suggestion 2
- Specific suggestion 3

Be specific, honest, and actionable.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}`
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.log('API Error:', errorData)
      setFeedback(`Error: ${errorData.message || 'Something went wrong'}`)
      setIsAnalyzing(false)
      return
    }

    const data = await response.json()
    const text = data.message.content[0].text
    setFeedback(text)
    setIsAnalyzing(false)

  } catch (error) {
    console.log('Network error:', error)
    setFeedback('Network error. Please check your connection.')
    setIsAnalyzing(false)
  }
}

    analyzeResume()
  }, [isAnalyzing])

  
  if (!isAnalyzing && !feedback) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center h-full]">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <p className="text-sm font-medium text-gray-900 mb-2">
          Your results will appear here
        </p>
        <p className="text-xs text-gray-400 text-center">
          Paste your resume and job description on the left, then click Analyze.
        </p>
      </div>
    )
  }


  if (isAnalyzing && !feedback) {
    return (
     <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center h-full">
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 animate-pulse">
          <span className="text-2xl">✦</span>
        </div>
        <p className="text-sm font-medium text-gray-900 mb-2">
          Analyzing your resume...
        </p>
        <p className="text-xs text-gray-400">
          This takes about 10 seconds
        </p>
      </div>
    )
  }


 return (
  <div className="bg-white rounded-xl border border-gray-200 p-6 overflow-y-auto">
    <p className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-4">
      AI Feedback
    </p>
    <div className="text-sm text-gray-700 leading-relaxed">
      {feedback.split('\n').map((line, index) => {
        // Score line
        if (line.startsWith('SCORE:')) {
          const score = line.replace('SCORE:', '').trim()
          return (
            <div key={index} className="flex items-center gap-3 mb-6 p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl font-semibold text-purple-600">{score}</span>
              <span className="text-sm text-purple-500">ATS Match Score</span>
            </div>
          )
        }
        // Section headers
        if (line.startsWith('**STRENGTHS') || line.startsWith('STRENGTHS')) {
          return <p key={index} className="font-medium text-green-700 mt-4 mb-2">✓ Strengths</p>
        }
        if (line.startsWith('**WEAKNESSES') || line.startsWith('WEAKNESSES')) {
          return <p key={index} className="font-medium text-red-600 mt-4 mb-2">✗ Weaknesses</p>
        }
        if (line.startsWith('**MISSING') || line.startsWith('MISSING')) {
          return <p key={index} className="font-medium text-orange-600 mt-4 mb-2">⚠ Missing Keywords</p>
        }
        if (line.startsWith('**IMPROVEMENTS') || line.startsWith('IMPROVEMENTS')) {
          return <p key={index} className="font-medium text-blue-600 mt-4 mb-2">→ Improvements</p>
        }
        // Bullet points
       if (line.startsWith('- ') || line.startsWith('• ') || line.match(/^\s+-/)) {
          const text = line.replace(/^[-•]\s+/, '').replace(/^\s*-\s+/, '').replace(/\*\*/g, '').trim()
          return (
            <div key={index} className="flex gap-2 mb-1 ml-2">
              <span className="text-gray-400 mt-0.5">•</span>
              <p className="text-gray-600">{text}</p>
            </div>
          )
        }
        // Empty lines
        if (line.trim() === '') return <div key={index} className="h-1" />
        // Normal text — remove ** markdown
        const cleanText = line.replace(/\*\*/g, '')
        return <p key={index} className="text-gray-600 mb-1">{cleanText}</p>
      })}
    </div>
  </div>
)
}

export default RightPanel