import { useState } from "react"
import { useNavigate } from "react-router"
import { CheckCircle } from "lucide-react"

const questions = [
  { id: 1, question: "At a party, you:", optionA: "Interact with many people including strangers", optionB: "Interact with a few close friends", dimensionA: "E", dimensionB: "I" },
  { id: 2, question: "You are more:", optionA: "Realistic than speculative", optionB: "Speculative than realistic", dimensionA: "S", dimensionB: "N" },
  { id: 3, question: "Is it worse to:", optionA: "Have your head in the clouds", optionB: "Be in a rut", dimensionA: "S", dimensionB: "N" },
  { id: 4, question: "You are more impressed by:", optionA: "Principles", optionB: "Emotions", dimensionA: "T", dimensionB: "F" },
  { id: 5, question: "You are more drawn toward:", optionA: "The convincing", optionB: "The touching", dimensionA: "T", dimensionB: "F" },
  { id: 6, question: "Do you prefer to work:", optionA: "To deadlines", optionB: "Just whenever", dimensionA: "J", dimensionB: "P" },
  { id: 7, question: "Do you tend to choose:", optionA: "Carefully", optionB: "Impulsively", dimensionA: "J", dimensionB: "P" },
  { id: 8, question: "At parties, do you:", optionA: "Stay late with increasing energy", optionB: "Leave early feeling drained", dimensionA: "E", dimensionB: "I" },
  { id: 9, question: "You are more attracted to:", optionA: "Sensible people", optionB: "Imaginative people", dimensionA: "S", dimensionB: "N" },
  { id: 10, question: "Are you more interested in:", optionA: "What is actual", optionB: "What is possible", dimensionA: "S", dimensionB: "N" },
  { id: 11, question: "In judging others, are you more swayed by:", optionA: "Laws than circumstances", optionB: "Circumstances than laws", dimensionA: "T", dimensionB: "F" },
  { id: 12, question: "In approaching others, your tendency is to be:", optionA: "Objective", optionB: "Personal", dimensionA: "T", dimensionB: "F" },
]

const mbtiDescriptions: Record<string, { title: string; description: string; careers: string[] }> = {
  INTJ: { title: "The Architect", description: "Strategic, independent thinkers who excel at planning and execution.", careers: ["Data Scientist", "Strategic Consultant", "Software Architect"] },
  INTP: { title: "The Logician", description: "Innovative inventors with an unquenchable thirst for knowledge.", careers: ["Research Analyst", "Software Developer", "Systems Analyst"] },
  ENTJ: { title: "The Commander", description: "Bold leaders who always find a way to achieve goals.", careers: ["Business Analyst", "Project Manager", "Management Consultant"] },
  ENTP: { title: "The Debater", description: "Smart and curious thinkers who can't resist a challenge.", careers: ["Product Manager", "Entrepreneur", "Marketing Strategist"] },
  INFJ: { title: "The Advocate", description: "Quiet visionaries who help others reach their potential.", careers: ["HR Manager", "Counselor", "UX Researcher"] },
  INFP: { title: "The Mediator", description: "Poetic, kind and altruistic people always eager to help.", careers: ["Content Writer", "UI/UX Designer", "Social Media Manager"] },
  ENFJ: { title: "The Protagonist", description: "Charismatic and inspiring leaders who captivate their audience.", careers: ["Team Lead", "Training Manager", "Business Development"] },
  ENFP: { title: "The Campaigner", description: "Enthusiastic, creative free spirits who can always find a reason to smile.", careers: ["Marketing Manager", "Sales Executive", "Brand Strategist"] },
  ISTJ: { title: "The Logistician", description: "Practical and reliable individuals who value tradition and loyalty.", careers: ["Data Analyst", "Financial Analyst", "Operations Manager"] },
  ISFJ: { title: "The Defender", description: "Dedicated and warm protectors always ready to defend their loved ones.", careers: ["Customer Success", "Quality Analyst", "Support Engineer"] },
  ESTJ: { title: "The Executive", description: "Excellent administrators who manage things and people.", careers: ["Operations Manager", "Supply Chain Analyst", "Project Coordinator"] },
  ESFJ: { title: "The Consul", description: "Caring, social and popular people always eager to help.", careers: ["Account Manager", "HR Executive", "Client Relations"] },
  ISTP: { title: "The Virtuoso", description: "Bold experimenters and masters of all kinds of tools.", careers: ["Backend Developer", "DevOps Engineer", "Database Administrator"] },
  ISFP: { title: "The Adventurer", description: "Flexible and charming artists always ready to explore new things.", careers: ["Frontend Developer", "Graphic Designer", "Creative Director"] },
  ESTP: { title: "The Entrepreneur", description: "Smart, energetic and perceptive people who enjoy living on the edge.", careers: ["Sales Manager", "Business Analyst", "Product Owner"] },
  ESFP: { title: "The Entertainer", description: "Spontaneous, energetic and enthusiastic entertainers.", careers: ["Digital Marketer", "Community Manager", "Event Coordinator"] },
}

export function PersonalityTest() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const currentQ = questions[current]
  const totalQ = questions.length

  const handleSelect = (dimension: string) => {
    setAnswers({ ...answers, [currentQ.id]: dimension })
    setError(null)
  }

  const handleNext = () => {
    if (current < totalQ - 1) setCurrent(current + 1)
  }

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const calculateMBTI = () => {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
    Object.values(answers).forEach(d => {
      counts[d as keyof typeof counts]++
    })
    const mbti =
      (counts.E >= counts.I ? "E" : "I") +
      (counts.S >= counts.N ? "S" : "N") +
      (counts.T >= counts.F ? "T" : "F") +
      (counts.J >= counts.P ? "J" : "P")
    return mbti
  }

  const handleSubmit = () => {
    if (Object.keys(answers).length < totalQ) {
      const firstUnanswered = questions.findIndex(q => !answers[q.id])
      if (firstUnanswered !== -1) setCurrent(firstUnanswered)
      setError("Please answer all questions before submitting.")
      return
    }
    const mbti = calculateMBTI()
    setResult(mbti)
    localStorage.setItem("mbtiResult", mbti)
  }

  if (result) {
    const info = mbtiDescriptions[result] || {
      title: "Unique Personality",
      description: "You have a unique blend of traits.",
      careers: ["Data Analyst", "Business Analyst", "Consultant"]
    }

    return (
      <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Personality Type</h1>

            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white mb-6">
              <p className="text-6xl font-bold mb-2">{result}</p>
              <p className="text-xl text-orange-100">{info.title}</p>
            </div>

            <p className="text-gray-600 mb-6">{info.description}</p>

            <div className="bg-orange-50 p-4 rounded-lg mb-8 text-left">
              <p className="font-semibold text-gray-800 mb-2">Recommended Career Paths:</p>
              <ul className="space-y-1">
                {info.careers.map((career, i) => (
                  <li key={i} className="text-orange-600 flex items-center">
                    <span className="mr-2">→</span>{career}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate("/student/recommendations")}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Get AI Career Recommendations →
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
          <h1 className="text-2xl font-bold text-orange-600">Personality Test</h1>
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
            MBTI
          </span>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {current + 1} of {totalQ}</span>
            <span>{Object.keys(answers).length} answered</span>
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
            {current + 1}. {currentQ.question}
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => handleSelect(currentQ.dimensionA)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                answers[currentQ.id] === currentQ.dimensionA
                  ? "border-orange-500 bg-orange-50 text-orange-700 font-medium"
                  : "border-gray-200 hover:border-orange-300 text-gray-700"
              }`}
            >
              {currentQ.optionA}
            </button>
            <button
              onClick={() => handleSelect(currentQ.dimensionB)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                answers[currentQ.id] === currentQ.dimensionB
                  ? "border-orange-500 bg-orange-50 text-orange-700 font-medium"
                  : "border-gray-200 hover:border-orange-300 text-gray-700"
              }`}
            >
              {currentQ.optionB}
            </button>
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
              See My Personality Type ✓
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
