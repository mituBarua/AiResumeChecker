import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'

export default function App() {
  return (
    <div className=" min-h-screen bg-gray-50">
   <header className="mx-auto bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
      <span className="text-purple-600 text-sm font-medium">R</span>
    </div>
    <span className="font-medium text-gray-900">
      Resume<span className="text-purple-600">AI</span>
    </span>
  </div>
  <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1 rounded-full border border-purple-100">
  Powered by AI
</span>
</header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-2 gap-6 items-stretch">
        <LeftPanel />
        <RightPanel />
      </main>
    </div>
  )
}