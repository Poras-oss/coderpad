import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import img from '../assets/bgimg.jpg';
import img1 from '../assets/dslogo1.png';

const Instructions = () => {
  const navigate = useNavigate();
  const parsed = queryString.parse(window.location.search);
  const subject = parsed.subject;

  // State to control access to the quiz
  const [showRestrictionMessage, setShowRestrictionMessage] = useState(false);

  const navigateToHome = () => {
    window.location.href = 'https://practice.datasenseai.com/';
  };

  useEffect(() => {
    checkAndBreakOutOfIframe();
  }, []);

  const checkAndBreakOutOfIframe = () => {
    if (window.self !== window.top) {
      // The page is in an iframe
      const currentUrl = window.location.href;
      try {
        // Attempt to break out of the iframe
        window.top.location.href = currentUrl;
      } catch (e) {
        // If we can't access window.top due to same-origin policy,
        // we can try to break out using window.open
        window.open(currentUrl, '_top');
      }
    }
  };

  const handleStartClick = () => {
    setShowRestrictionMessage(true);
  };

  return (
    <div className='relative min-h-screen w-full flex flex-col'>
      <img className="absolute inset-0 w-full h-full object-cover" src={img} alt="Background" />
      
      <div className='relative flex-grow p-6 md:p-6 mx-auto bg-white/30 backdrop-blur-sm rounded-lg shadow-lg flex flex-col'>
        <div className='flex justify-between items-center mb-2'>
        {showRestrictionMessage ? (<h1 className='text-3xl p-3 font-bold text-cyan-800'></h1>):(<h1 className='text-3xl p-3 font-bold text-cyan-800'>Instructions</h1>)}  
          <img src={img1} alt="Logo" className="h-[100px] w-auto" />
        </div>
        
        {showRestrictionMessage ? (
          <div className='text-lg font-medium p-8 backdrop-blur-lg rounded-lg shadow-xl border-4 border-dotted border-red-700 flex-grow flex flex-col justify-between text-center'>
            <div>
              <h2 className='mb-4'><b>"Unlock the Full Experience!</b></h2>
              <h6>Are you ready to enhance your learning and explore the world of professional quizzes and interview questions?  To access the main quiz, you'll need a subscription. Subscriptions will be available starting from <b> 30th  September.</b> Get ready to dive deeper, challenge your skills, and take your knowledge to the next level! </h6>
              <h6><b>All the Best for Future Learning!</b></h6>
              <br />
              <h6>Best Regards, </h6>
              <h6><b>DataSense</b></h6>
            </div>
          </div>
        ) : (
          <div className='flex gap-2 backdrop-blur-lg rounded-lg p-8 shadow-xl border-4 border-dotted border-teal-700 flex-grow'>
            <ol className='text-lg list-decimal font-medium space-y-6'>
              <li>Welcome to the quiz! Please read the following instructions carefully before proceeding:</li>
              <li>This quiz consists of 50 multiple-choice questions. Each question has 4 possible options, with only one correct answer.</li>
              <li>You will have 60 minutes to complete the quiz. The timer will start as soon as you click the "Start" button.</li>
              <li>Once you begin the quiz, you will not be able to pause or stop the timer. Please ensure you have enough time to complete the quiz before starting.</li>
              <li>Each question must be answered before you can proceed to the next question. You cannot skip or return to previous questions.</li>
              <li>Your score will be displayed at the end of the quiz. To pass the quiz, you must achieve a minimum score of 70%.</li>
              <li>If you do not pass the quiz on your first attempt, you will be given the opportunity to retake it. However, the questions and answer choices may be rearranged.</li>
              <li>Cheating or sharing answers is strictly prohibited. Doing so may result in disqualification from the quiz and potential disciplinary action.</li>
              <li>By clicking the <span className='font-bold'>START</span> button, you agree to abide by these instructions and the terms and conditions of this quiz. If you do not agree, please exit the quiz now.</li>
            </ol>
          </div>
        )}
        
        <div className={`flex ${showRestrictionMessage ? 'justify-center' : 'justify-between'} mt-6`}>
          <button className='px-8 py-2 text-white rounded-md bg-teal-600 hover:bg-teal-700 transition-colors' onClick={navigateToHome}>« Exit</button>
          {!showRestrictionMessage && (
            <button className='px-8 py-2 text-white rounded-md bg-cyan-600 hover:bg-cyan-700 transition-colors' onClick={handleStartClick}>Start »</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Instructions;
