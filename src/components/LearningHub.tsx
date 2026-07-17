import React, { useState } from "react";
import { BookOpen, Award, FileSpreadsheet, Search, CheckCircle, HelpCircle, GraduationCap, ChevronRight, AwardIcon } from "lucide-react";
import { GLOSSARY_TERMS, KNOWLEDGE_ARTICLES, LEARNING_COURSES, DAILY_TIPS, ENGINEERING_QUOTES } from "../data";

export default function LearningHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"courses" | "dictionary" | "articles" | "quiz">("courses");

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = [
    {
      question: "Which foundation type is highly recommended for structures built on expanding soft clay soils?",
      options: [
        "A standard narrow strip footing foundation",
        "A shallow isolated pad footing foundation",
        "A continuous solid raft foundation (to spread loads evenly)",
        "Placing hollow concrete blocks directly on the soil surface"
      ],
      answer: 2,
      explanation: "A raft foundation spreads the loading profile of the entire structure over a massive surface area, bypassing the differential settlement risks typical of soft expanding clays."
    },
    {
      question: "Why must concrete elements be cured (kept moist) for at least 7 days?",
      options: [
        "To make the concrete surface look clean and polished",
        "To allow proper hydration of cement, allowing concrete to attain designated compressive strength",
        "To speed up dry times so brickwork can begin the next day",
        "To prevent water from evaporating into the surrounding air"
      ],
      answer: 1,
      explanation: "The curing hydration reaction takes time. Retaining moisture allows the calcium silicate hydrate crystals to bind together, reaching full design load capacity."
    },
    {
      question: "In structural design, what is concrete's primary mechanical weakness?",
      options: [
        "It is weak in compressive strength",
        "It is weak in tensile strength (prone to pulling apart)",
        "It dissolves when exposed to direct standing rainwater",
        "It cannot be combined with steel bars"
      ],
      answer: 1,
      explanation: "Concrete has high compressive capacity but is weak under tension. Steel reinforcing bars are embedded in structural tension zones to carry those pulling forces."
    }
  ];

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  const glossaryCategories = ["All", ...Array.from(new Set(GLOSSARY_TERMS.map(item => item.category)))];

  const filteredGlossary = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold font-display text-amber-500 flex items-center gap-2">
            <GraduationCap className="w-7 h-7" /> Castro Civil Learning Studio
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Access building code directories, comprehensive textbooks, structural training courses, an engineering glossary, and student interactive quizzes.
          </p>
        </div>
      </div>

      {/* Rotating Tip & Quote header banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Daily Construction Tip
          </div>
          <p className="text-sm text-slate-200 italic">
            "{DAILY_TIPS[0]}"
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
          <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            Engineering Inspiration
          </div>
          <p className="text-sm text-slate-200 italic">
            "{ENGINEERING_QUOTES[3].quote}"
          </p>
          <div className="text-xs text-slate-400 mt-1.5 text-right">— {ENGINEERING_QUOTES[3].author}</div>
        </div>
      </div>

      {/* Internal Hub Tabs */}
      <div className="flex border-b border-slate-900 gap-1 overflow-x-auto pb-1">
        {[
          { id: "courses", label: "Structural Courses", icon: BookOpen },
          { id: "dictionary", label: "Engineering Dictionary", icon: FileSpreadsheet },
          { id: "articles", label: "Sessional Reading Library", icon: BookOpen },
          { id: "quiz", label: "Student Mode Quiz", icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-amber-500 text-amber-500"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEARNING_COURSES.map((course) => (
              <div key={course.id} className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span className="text-amber-500 font-semibold">{course.level}</span>
                    </div>
                  </div>
                  <BookOpen className="w-5 h-5 text-amber-500" />
                </div>

                <div className="space-y-4 pt-2">
                  {course.modules.map((mod, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-900">
                      <h4 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">{mod.name}</h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {mod.lessons.map((les, lidx) => (
                          <li key={lidx} className="flex items-center gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                            <span>{les}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "dictionary" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="Search 500+ engineering and architectural terms (e.g. concrete, BIM, raft)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Category Filter */}
            <select
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {glossaryCategories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Dictionary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="bg-slate-900/35 border border-slate-900 rounded-xl p-4 space-y-1 hover:border-amber-500/20 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-slate-200">{item.term}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{item.category}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{item.definition}</p>
              </div>
            ))}

            {filteredGlossary.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                No matching engineering terms found. Try searching for "concrete", "foundation" or "BOQ".
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "articles" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {KNOWLEDGE_ARTICLES.map((art) => (
              <div key={art.id} className="glass-panel p-6 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md font-semibold">
                    {art.category}
                  </span>
                  <span className="text-xs text-slate-400">{art.readTime}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-200 font-display">{art.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{art.summary}</p>
                
                {/* Article body */}
                <div className="bg-slate-950/80 p-4 rounded-xl text-xs text-slate-300 space-y-2 border border-slate-900 max-h-48 overflow-y-auto">
                  {art.content.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('###')) {
                      return <h4 key={pIdx} className="font-bold text-amber-500 pt-1">{paragraph.replace('###', '')}</h4>;
                    }
                    if (paragraph.startsWith('-')) {
                      return (
                        <ul key={pIdx} className="list-disc pl-4 space-y-1 text-slate-400">
                          {paragraph.split('\n').map((li, lidx) => (
                            <li key={lidx}>{li.replace('-', '').trim()}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={pIdx} className="leading-relaxed">{paragraph}</p>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl">
          {!quizStarted && !quizFinished && (
            <div className="text-center space-y-4">
              <Award className="w-16 h-16 text-amber-500 mx-auto stroke-1 animate-bounce" />
              <h3 className="text-lg font-semibold text-slate-200 font-display">Student Mode: Licensing Practice Quiz</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Test your knowledge in concrete hydration mechanics, structural soils bearing coefficients, and material stress calculations.
              </p>
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-amber-500 text-slate-950 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-amber-400 transition-all cursor-pointer"
              >
                Start Engineering Quiz
              </button>
            </div>
          )}

          {quizStarted && !quizFinished && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                <span className="text-xs font-semibold text-amber-500 uppercase">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span className="text-xs text-slate-400 font-mono">Score: {score} / {currentQuestion}</span>
              </div>

              <h4 className="text-base font-semibold text-slate-200 leading-relaxed">
                {quizQuestions[currentQuestion].question}
              </h4>

              <div className="space-y-2.5">
                {quizQuestions[currentQuestion].options.map((opt, idx) => {
                  let btnStyle = "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300";
                  if (selectedAnswer !== null) {
                    if (idx === quizQuestions[currentQuestion].answer) {
                      btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                    } else if (idx === selectedAnswer) {
                      btnStyle = "bg-red-500/10 border-red-500 text-red-400";
                    } else {
                      btnStyle = "bg-slate-900/40 border-slate-900 text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex justify-between items-center ${btnStyle} ${selectedAnswer === null ? 'cursor-pointer' : ''}`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && idx === quizQuestions[currentQuestion].answer && (
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== null && (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900 space-y-2">
                  <div className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" /> Explanation
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{quizQuestions[currentQuestion].explanation}</p>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="bg-amber-500 text-slate-950 font-semibold px-4 py-1.5 rounded-lg text-xs hover:bg-amber-400 transition-all cursor-pointer"
                    >
                      {currentQuestion + 1 === quizQuestions.length ? "Finish Quiz" : "Next Question"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {quizFinished && (
            <div className="text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping" />
                <Award className="w-16 h-16 text-amber-500 absolute inset-0 m-auto" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200 font-display">Quiz Complete!</h3>
              <p className="text-sm text-slate-300">
                You scored <strong className="text-amber-500 text-lg">{score} out of {quizQuestions.length}</strong> questions correctly!
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {score === quizQuestions.length ? "Excellent structural awareness! You're ready for the civil board exam." : "Good try! We highly recommend reviewing our structural modules."}
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={resetQuiz}
                  className="bg-amber-500 text-slate-950 font-semibold px-5 py-2 rounded-xl text-xs hover:bg-amber-400 transition-all cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
