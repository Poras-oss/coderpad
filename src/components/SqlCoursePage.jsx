import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import heroVideo from "../assets/heroCompressed.mp4";
import Loader from "./Loader";
import { Download } from "lucide-react";

const pdfResources = [
  {
    name: "SQL Cheatsheet",
    file: "assets/resources/SQL Cheatsheet.pdf",
  },
  {
    name: "SQL Handwritten Notes",
    file: "assets/resources/DS - SQL Hand Written Notes.pdf",
  },
  {
    name: "SQL Notes by DataSense",
    file: "assets/resources/SQL Notes by DataSense.pdf",
  },
];

export default function SQLCourseLandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const learningPlanSectionRef = useRef(null);

  useEffect(() => {
    // Simulate loading time for smooth page transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const scrollToLearningPlan = () => {
    learningPlanSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openImagePopup = (imageSrc, imageAlt) => {
    setSelectedImage({ src: imageSrc, alt: imageAlt });
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeImagePopup();
    }
  };

  if (isLoading) {
    return (
      <div className={`font-sans flex flex-col min-h-screen ${isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
        }`}>
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className={`font-sans flex flex-col min-h-screen ${isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
      }`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <div className={`w-full min-h-screen ${isDarkMode ? "bg-[#1D1E23]" : "bg-gray-100"
        } ${isDarkMode ? "text-gray-100" : "text-slate-900"} font-sans`}>
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold mb-4 ${isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700"
              }`}>
              The SQL Heist Program
            </span>
            <h1 className={`text-4xl md:text-5xl font-bold leading-tight ${isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              Learn SQL through <span className="text-emerald-600 dark:text-emerald-500">real company problems</span>
            </h1>
            <p className={`mt-5 text-lg md:max-w-xl ${isDarkMode ? "text-gray-300" : "text-slate-600"
              }`}>
              An 18-module, beginner-friendly, self-paced program where you solve real analytics
              problems step-by-step and build a strong SQL foundation.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={scrollToLearningPlan}
                className="mt-7 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-semibold shadow-md"
              >
                Get Instant Access
              </button>
              <a
                href="assets/resources/SQL Heist Brochure Final.pdf"
                download
                className="mt-7 px-10 py-4 bg-white text-emerald-700 font-semibold text-lg rounded-xl shadow-lg hover:bg-emerald-50 inline-flex text-center gap-2"
              >
                Course Overview
                <Download />
              </a>
            </div>
            <p className={`mt-3 text-sm ${isDarkMode ? "text-gray-400" : "text-slate-500"
              }`}>
              Self-paced • Beginner friendly • Lifetime access
            </p>
          </div>

          <div className="flex-1 flex justify-center">
            <div className={`w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden ${isDarkMode ? "border-emerald-700/50" : "border-emerald-200"
              }`}>
              <video
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </section>

        {/* FEATURES */}
        <section className={` py-16 ${isDarkMode ? "bg-[#1D1E23] border-gray-700" : "bg-white border-slate-200"
          }`}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className={`text-3xl font-bold text-center mb-10 ${isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              Why Learn SQL with The SQL Heist Program?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "100% Practical",
                  desc: "Solve 30+ real business SQL problems instead of memorising theory."
                },
                {
                  title: "Beginner Friendly",
                  desc: "Start from absolute basics. No prior coding experience required."
                },
                {
                  title: "Guided Structure",
                  desc: "18 modules designed like a real learning roadmap, not random topics."
                }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`border p-7 rounded-2xl shadow-sm ${isDarkMode
                    ? "bg-[#32363C] border-[#2f2f2f]"
                    : "bg-slate-50 border-slate-200"
                    }`}
                >
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-emerald-500" : "text-emerald-700"
                    }`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-slate-600"
                    }`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODULES */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className={`text-3xl font-bold text-center mb-8 ${isDarkMode ? "text-white" : "text-slate-900"
            }`}>
            18-Module Course Breakdown
          </h2>
          <p className={`text-center max-w-2xl mx-auto mb-10 text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-slate-600"
            }`}>
            Follow a clear path from absolute beginner to confident SQL problem solver. Each module
            includes explanations, real problems, and practice questions.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Intro to SQL & Databases",
              "SELECT Queries",
              "WHERE Filtering Deep Dive",
              "ORDER BY + LIMIT",
              "GROUP BY & Aggregations",
              "HAVING Clause",
              "Joins (Part 1)",
              "Joins (Part 2)",
              "Subqueries",
              "Case Study: Joins + Subqueries",
              "Window Functions",
              "Advanced Windows",
              "CTEs",
              "Multi-CTE Case Studies",
              "E-commerce Analytics",
              "SaaS Analytics",
              "Final SQL Challenge",
              "Placement + Interview Prep"
            ].map((module, i) => (
              <div
                key={i}
                className={`border p-5 rounded-xl hover:border-emerald-500 transition ${isDarkMode
                  ? "bg-[#32363C] border-[#2f2f2f]"
                  : "bg-white border-slate-200"
                  }`}
              >
                <p className={`text-sm md:text-base ${isDarkMode ? "text-gray-200" : "text-slate-700"
                  }`}>
                  <span className="font-semibold mr-1">{i + 1}.</span>
                  {module}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* LEARNING PLANS */}
        <section
          ref={learningPlanSectionRef}
          className={` py-16 ${isDarkMode ? "bg-[#1D1E23] border-gray-700" : "bg-slate-100 border-slate-200"
            }`}
        >
          <div className="max-w-6xl mx-auto px-6">
            <h2 className={`text-3xl font-bold text-center mb-10 ${isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              Choose Your Learning Plan
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              {/* Google Drive Plan */}
              <div className={`border rounded-2xl shadow-sm p-6 flex flex-col gap-6 ${isDarkMode
                ? "bg-[#32363C] border-[#2f2f2f]"
                : "bg-white border-slate-200"
                }`}>
                <h3 className={`text-2xl font-semibold mb-1 ${isDarkMode ? "text-emerald-500" : "text-emerald-700"
                  }`}>
                  Learn through Google Drive
                </h3>
                <div className={`w-full border group ${isDarkMode ? "border-[#2f2f2f]" : "border-slate-200"
                  }`}>
                  <img
                    src="assets/sql-course/gDrive.jpg"
                    alt="Google Drive access for The SQL Heist Program"
                    onClick={() => openImagePopup("assets/sql-course/gDrive.jpg", "Google Drive access for The SQL Heist Program")}
                    className="w-full h-full cursor-pointer object-cover rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>
                <ul className={`mt-3 space-y-2 text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-slate-600"
                  }`}>
                  <li>• Full control over your content</li>
                  <li>• Lifetime access to all videos</li>
                  <li>• Easy access on laptop, tablet, and mobile</li>
                  <li>• Low cost and simple to use</li>
                </ul>
                <button className="mt-7 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-semibold shadow-md" onClick={() => window.open("https://pages.razorpay.com/SQLHEIST", "_blank")}>
                  {/* <a href="https://pages.razorpay.com/SQLHEIST" className="text-white"> */}
                  Enroll Now
                  {/* </a> */}
                </button>
              </div>

              {/* Topmate Plan */}
              <div className={`border rounded-2xl shadow-sm p-6 flex flex-col gap-4 ${isDarkMode
                ? "bg-[#32363C] border-[#2f2f2f]"
                : "bg-white border-slate-200"
                }`}>
                <h3 className={`text-2xl font-semibold mb-1 ${isDarkMode ? "text-emerald-500" : "text-emerald-700"
                  }`}>
                  Learn through Topmate
                </h3>
                <div className={`w-full rounded-xl  border group ${isDarkMode ? "border-[#2f2f2f]" : "border-slate-200"
                  }`}>
                  <img
                    src="assets/sql-course/topmate.jpg"
                    alt="Topmate interface for The SQL Heist Program"
                    onClick={() => openImagePopup("assets/sql-course/topmate.jpg", "Topmate interface for The SQL Heist Program")}
                    className="w-full h-full object-cover cursor-pointer rounded-xl transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>
                <ul className={`mt-3 space-y-2 text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-slate-600"
                  }`}>
                  <li>• Professional, user-friendly learning interface</li>
                  <li>• Access to future upgrades & bonus sessions</li>
                  <li>• Easy access to other DataSense courses</li>
                  <li>• 1:1 SQL mentoring call (30 minutes)</li>
                </ul>
                {/* <button className="mt-7 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-semibold shadow-md" onClick={() => window.open("https://topmate.io/datasense/1809137", "_blank")}> */}
                <button className="mt-7 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-lg font-semibold shadow-md" onClick={() => window.open("https://www.topmate.io/datasense/page/5al4Lzj4cU", "_blank")}>
                  {/* <a href="https://topmate.io/datasense/1809137" className="text-white"> */}
                  Enroll Now
                  {/* </a> */}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CERTIFICATION SECTION */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"
                }`}>Certification on Completion</h2>
              <p className={`text-sm md:text-base mb-4 ${isDarkMode ? "text-gray-300" : "text-slate-600"
                }`}>
                Complete all modules of The SQL Heist Program and unlock an official certificate of
                completion from DataSense. Showcase your skills in SQL, analytical query writing, window
                functions, and performance tuning.
              </p>
              <p className={`text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-slate-600"
                }`}>
                You can add this certificate to your LinkedIn, resume, and portfolio as proof of your
                SQL learning journey.
              </p>
            </div>
            <div className={`w-full max-w-xl mx-auto  aspect-[4/3] group`}>
              <img
                src="assets/sql-course/3.png"
                alt="SQL Heist Program certificate of completion"
                onClick={() => openImagePopup("assets/sql-course/3.png", "SQL Heist Program certificate of completion")}
                className="w-full h-full object-contain cursor-pointer rounded-3xl transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            </div>
          </div>
        </section>

        {/* PRACTICE QUESTIONS SECTION */}
        <section className={` py-16 ${isDarkMode ? "bg-[#1D1E23] border-gray-700" : "bg-slate-100 border-slate-200"
          }`}>
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div className={`w-full aspect-[4/3] group`}>
              <img
                src="assets/sql-course/practiceQuestions.png"
                alt="DataSense practice website with 500+ SQL questions"
                onClick={() => openImagePopup("assets/sql-course/practiceQuestions.png", "DataSense practice website with 500+ SQL questions")}
                className="w-full h-full object-contain cursor-pointer rounded-3xl transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            </div>
            <div>
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"
                }`}>Access 500+ SQL Practice Questions</h2>
              <p className={`text-sm md:text-base mb-4 ${isDarkMode ? "text-gray-300" : "text-slate-600"
                }`}>
                Along with the course, you get access to our practice platform at
                <span className="font-semibold"> practice.datasenseai.com</span> with more than 500
                SQL questions based on real-world company scenarios.
              </p>
              <p className={`text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-slate-600"
                }`}>
                Work through curated paths, track your progress, and convert theory into actual
                problem-solving skills.
              </p>
            </div>
          </div>
        </section>

        {/* RESOURCE DOWNLOADS */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className={`text-3xl font-bold text-center mb-8 ${isDarkMode ? "text-white" : "text-slate-900"
            }`}>Bonus Resources</h2>
          <p className={`text-center max-w-2xl mx-auto mb-10 text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-slate-600"
            }`}>
            Download these supporting resources to revise faster and keep SQL concepts at your
            fingertips.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {pdfResources.map((pdf, idx) => {
              const descriptions = [
                "One-page summary of the most important SQL commands and patterns.",
                "Visual handwritten notes to make concepts stick and feel easy to revise.",
                "Structured SQL theory and examples prepared by the DataSense team."
              ];

              return (
                <div
                  key={idx}
                  className={`border rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition ${isDarkMode
                    ? "bg-[#32363C] border-[#2f2f2f]"
                    : "bg-white border-slate-200"
                    }`}
                >
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-emerald-500" : "text-emerald-700"
                      }`}>{pdf.name}</h3>
                    <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-600"
                      }`}>
                      {descriptions[idx]}
                    </p>
                  </div>
                  <a
                    href={pdf.file}
                    download
                    className={`mt-4 inline-flex items-center text-sm font-semibold ${isDarkMode ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-700 hover:text-emerald-600"
                      } transition-colors cursor-pointer`}
                  >
                    Download PDF
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className={` py-16 ${isDarkMode ? "bg-[#1D1E23] border-gray-700" : "bg-slate-100 border-slate-200"
          }`}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className={`text-3xl font-bold text-center mb-10 ${isDarkMode ? "text-white" : "text-slate-900"
              }`}>What Students Say</h2>
            <div className="overflow-x-auto flex gap-6 pb-2">
              {["This is the first time SQL actually made sense.", "Your real-world problems helped me clear interviews.", "Perfect for beginners — explanations are super clear and practical."].map(
                (t, i) => (
                  <div
                    key={i}
                    className={`min-w-[280px] md:min-w-[320px] border p-6 rounded-2xl shadow-sm ${isDarkMode
                      ? "bg-[#32363C] border-[#2f2f2f]"
                      : "bg-white border-slate-200"
                      }`}
                  >
                    <p className={`text-sm md:text-base italic ${isDarkMode ? "text-gray-200" : "text-slate-700"
                      }`}>"{t}"</p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className={`text-3xl text-center font-bold mb-8 ${isDarkMode ? "text-white" : "text-slate-900"
            }`}>
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Is this course beginner friendly?",
                a: "Yes. We start from absolute basics and slowly move into real-world case studies."
              },
              {
                q: "Is it a recorded program?",
                a: "Yes. The SQL Heist Program is fully recorded and self-paced so you can learn anytime."
              },
              {
                q: "How long do I have access?",
                a: "You get lifetime access to all videos and resources."
              },
              {
                q: "Do I get a certificate?",
                a: "Yes. Once you complete all modules, you unlock a verified certificate of completion."
              }
            ].map((item, i) => (
              <details
                key={i}
                className={`border p-5 rounded-2xl cursor-pointer ${isDarkMode
                  ? "bg-[#32363C] border-[#2f2f2f]"
                  : "bg-white border-slate-200"
                  }`}
              >
                <summary className={`text-base md:text-lg font-semibold ${isDarkMode ? "text-emerald-500" : "text-emerald-700"
                  }`}>
                  {item.q}
                </summary>
                <p className={`mt-3 text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-slate-600"
                  }`}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-600 py-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">Start Your SQL Heist Journey Today</h2>
          <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto text-emerald-50">
            Learn SQL with clarity, confidence, and real business problems — at your own pace.
          </p>
          <button
            onClick={scrollToLearningPlan}
            className="mt-7 px-10 py-4 bg-white text-emerald-700 font-semibold text-lg rounded-xl shadow-lg hover:bg-emerald-50"
          >
            Get Instant Access
          </button>
        </section>

        {/* FOOTER */}
        <footer className={`text-center py-8 text-xs md:text-sm border-t ${isDarkMode
          ? "bg-[#1D1E23] border-gray-700 text-gray-400"
          : "bg-white border-slate-200 text-slate-500"
          }`}>
          <div className="flex justify-center gap-5 mb-3 text-lg">
            <i className={`ri-instagram-line cursor-pointer ${isDarkMode ? "hover:text-gray-200" : "hover:text-slate-700"
              }`} />
            <i className={`ri-linkedin-box-line cursor-pointer ${isDarkMode ? "hover:text-gray-200" : "hover:text-slate-700"
              }`} />
            <i className={`ri-twitter-line cursor-pointer ${isDarkMode ? "hover:text-gray-200" : "hover:text-slate-700"
              }`} />
          </div>
          © {new Date().getFullYear()} The SQL Heist Program · DataSense. All rights reserved.
        </footer>

        {/* Image Popup Modal */}
        {selectedImage && (
          <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
