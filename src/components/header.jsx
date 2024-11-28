import React from 'react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { ArrowLeft, Moon, Sun } from 'lucide-react'
import { Button } from "./ui/button"

const Header = ({ isSignedIn, subject, isDarkMode, setIsDarkMode }) => {
  return (
    <header className="border-b dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => window.top.location.href = 'https://practice.datasenseai.com'} 
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back
          </Button>
          <span className="text-sm font-medium">
            {subject.charAt(0).toUpperCase() + subject.slice(1)} Practice
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          {isSignedIn ? (
            <UserButton afterSignOutUrl={`/practice-area?subject=${subject}`} />
          ) : (
            <SignInButton mode="modal" fallbackRedirectUrl={`/practice-area?subject=${subject}`}>
              <Button>Sign in</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

