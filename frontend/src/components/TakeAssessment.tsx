import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import { startAttempt, submitAttempt } from '../api'

interface Question {
  id: number
  questionText: string
  type: string
  difficultyLevel: number
  options: string[] | null
}

interface Result {
  id: number
  score: number
  totalQuestions: number
  passed: boolean
  status: string
}

export default function TakeAssessment() {
  const { inviteId } = useParams<{ inviteId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'loading' | 'questions' | 'submitting' | 'results'>('loading')
  const [attemptId, setAttemptId] = useState<number>(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!inviteId) return
    startAttempt(Number(inviteId))
      .then(data => {
        setAttemptId(data.attemptId)
        setQuestions(data.questions)
        setPhase('questions')
      })
      .catch((err: any) => {
        setError(err.message)
        setPhase('questions')
      })
  }, [inviteId])

  const handleSubmit = async () => {
    setPhase('submitting')
    try {
      const answerList = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || '',
      }))
      const res = await submitAttempt(attemptId, answerList)
      setResult(res)
      setPhase('results')
    } catch (err: any) {
      setError(err.message)
      setPhase('questions')
    }
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-lg">Starting assessment...</div>
      </div>
    )
  }

  if (error && phase !== 'questions') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(user?.role === 'DEVELOPER' ? '/developer' : '/admin')}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'results' && result) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            result.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.passed ? (
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {result.passed ? 'Congratulations!' : 'Assessment Complete'}
          </h2>
          <p className="text-slate-600 mb-6">
            {result.passed
              ? 'You passed the assessment! Your skill level has been updated.'
              : result.status === 'PENDING_REVIEW'
              ? 'Your assessment is under review. Results will be finalized soon.'
              : 'Unfortunately, you did not pass this time. Keep practicing!'}
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="text-3xl font-bold text-indigo-600">
              {result.score}/{result.totalQuestions}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {Math.round((result.score / result.totalQuestions) * 100)}% correct
            </div>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-6 ${
            result.passed
              ? 'bg-green-100 text-green-800'
              : result.status === 'PENDING_REVIEW'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {result.passed ? 'PASSED' : result.status === 'PENDING_REVIEW' ? 'PENDING REVIEW' : 'FAILED'}
          </span>
          <div className="mt-6">
            <button
              onClick={() => navigate(user?.role === 'DEVELOPER' ? '/developer' : '/admin')}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h1 className="text-lg font-semibold text-slate-900">Assessment</h1>
          <div className="text-sm text-slate-500">
            {Object.keys(answers).length}/{questions.length} answered
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        <div className="space-y-5">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-slate-900 font-medium mb-1">{q.questionText}</p>
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {q.type === 'MCQ' ? 'Multiple Choice' : 'Fill in the blank'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-600">
                      Level {q.difficultyLevel}
                    </span>
                  </div>

                  {q.type === 'MCQ' && q.options ? (
                    <div className="space-y-2">
                      {q.options.map((option, oi) => (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                            answers[q.id] === option
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={option}
                            checked={answers[q.id] === option}
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: option }))}
                            className="accent-indigo-600"
                          />
                          <span className="text-sm text-slate-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-slate-900 bg-white"
                      placeholder="Type your answer..."
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {questions.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={phase === 'submitting'}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
              {phase === 'submitting' ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
