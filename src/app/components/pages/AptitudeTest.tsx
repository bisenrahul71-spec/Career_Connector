import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { CheckCircle } from "lucide-react"
import API from "../../src/api/config"

export function AptitudeTest() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loadingQ, setLoadingQ] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await API.get("/api/ai/generate-questions")
        setQuestions(res.data.questions)
      } catch {
        setQuestions([
          {
            id: 1, section: "LRDI",
            question: "If A > B > C and C > D, which is smallest?",
            options: ["A", "B", "C", "D"],
            answer: "D"
          },
          {
            id: 2, section: "LRDI",
            question: "Find next: 2, 4, 8, 16, ?",
            options: ["24", "32", "20", "28"],
            answer: "32"
          },
          {
            id: 3, section: "LRDI",
            question: "Ram is 4th from left in a row of 10. Position from right?",
            options: ["6th", "7th", "8th", "5th"],
            answer: "7th"
          },
          {
            id: 4, section: "QA",
            question: "What is 15% of 200?",
            options: ["25", "30", "35", "20"],
            answer: "30"
          },
          {
            id: 5, section: "QA",
            question: "Train travels 60km/hr. Distance in 2.5 hours?",
            options: ["120 km", "150 km", "130 km", "140 km"],
            answer: "150 km"
          },
          {
            id: 6, section: "QA",
            question: "Square root of 144?",
            options: ["10", "11", "12", "13"],
            answer: "12"
          },
          {
            id: 7, section: "VARC",
            question: "Synonym for 'Abundant':",
            options: ["Scarce", "Plentiful", "Limited", "Rare"],
            answer: "Plentiful"
          },
          {
            id: 8, section: "VARC",
            question: "Antonym for 'Ancient':",
            options: ["Old", "Modern", "Historic", "Vintage"],
            answer: "Modern"
          },
          {
            id: 9, section: "VARC",
            question: "She ___ to the market yesterday.",
            options: ["go", "goes", "went", "going"],
            answer: "went"
          },
        ])
      } finally {
        setLoadingQ(false)
      }
    }
    fetchQuestions()
  }, [])

  const currentQ = questions[current]
  const totalQ = questions.length

  const handleSelect = (option: string) => {
    setSelected({ ...selected, [currentQ.id]: option })
    setError(null)
  }

  const handleNext = () => {
    if (current < totalQ - 1) setCurrent(current + 1)
  }

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const handleSubmit = async () => {
    if (Object.keys(selected).length < totalQ) {
      const firstUnanswered = questions.findIndex(q => !selected[q.id])
      if (firstUnanswered !== -1) setCurrent(firstUnanswered)
      setError("Please answer all questions before submitting.")
      return
    }

    setSubmitted(true)
    let score = 0
    questions.forEach(q => {
      if (selected[q.id] === q.answer) score++
    })

    // Save to localStorage
    localStorage.setItem("aptitudeScore", JSON.stringify({ score, total: totalQ }))

    // Also save to MongoDB
    try {
      const sections: Record<string, number> = {}
      ;["LRDI", "QA", "VARC"].forEach(section => {
        const sectionQs = questions.filter(q => q.section === section)
        sections[section] = sectionQs.filter(q => selected[q.id] === q.answer).length
      })
      await API.post("/api/ai/save-aptitude", {
        score,
        total: totalQ,
        sections
      })
    } catch {
      console.error("Could not save aptitude score to server")
    }
  }

  const getScore = () => {
    let score = 0
    questions.forEach(q => {
      if (selected[q.id] === q.answer) score++
    })
    return score
  }

  const getSectionScore = (section: string) => {
    const sectionQs = questions.filter(q => q.section === section)
    return sectionQs.filter(q => selected[q.id] === q.answer).length
  }

  if (loadingQ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-600 font-semibold text-lg">Generating your unique questions with AI...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    const score = getScore()
    const percentage = Math.round((score / totalQ) * 100)
    return (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Test Completed!</h1>
            <p className="text-gray-600 mb-6">Here are your results</p>
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white mb-6">
              <p className="text-5xl font-bold mb-2">{percentage}%</p>
              <p className="text-orange-100">{score} out of {totalQ} correct</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {["LRDI", "QA", "VARC"].map(section => (
                <div key={section} className="bg-orange-50 p-4 rounded-lg">
                  <p className="font-bold text-orange-600 text-xl">{getSectionScore(section)}/3</p>
                  <p className="text-gray-600 text-sm">{section}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/student/personality")}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Next: Personality Test →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-600">Aptitude Test</h1>
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
            {currentQ?.section}
          </span>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {current + 1} of {totalQ}</span>
            <span>{Object.keys(selected).length} answered</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full transition-all"
              style={{ width: `${((current + 1) / totalQ) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {current + 1}. {currentQ?.question}
          </h2>
          <div className="space-y-3">
            {currentQ?.options.map((option: string) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                  selected[currentQ.id] === option
                    ? "border-orange-500 bg-orange-50 text-orange-700 font-medium"
                    : "border-gray-200 hover:border-orange-300 text-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="px-6 py-3 rounded-lg border-2 border-orange-300 text-orange-600 font-semibold disabled:opacity-50 hover:bg-orange-50 transition-all"
          >
            ← Previous
          </button>
          {current === totalQ - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:shadow-lg transition-all"
            >
              Submit Test ✓
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold hover:shadow-lg transition-all"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
