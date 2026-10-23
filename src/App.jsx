import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center space-y-5 border border-slate-200">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-teal-500 text-white font-bold text-2xl shadow-lg shadow-teal-500/20">
          📚
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Library Management System
        </h1>
        <p className="text-sm text-slate-500">
          Vite + React + Tailwind CSS basic template is ready.
        </p>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition shadow-sm active:scale-95"
        >
          Count is: {count}
        </button>
      </div>
    </div>
  )
}
