import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

const QuizInstructionsDialog = ({ 
  isOpen, 
  onClose, 
  onProceed, 
  quizType 
}) => {
  const getInstructions = () => {
    switch(quizType) {
      case 'sql':
        return {
          title: "SQL Quiz Instructions",
          points: [
            "You'll be presented with database scenarios and must write SQL queries",
            "Each question has a specific expected output",
            "Your queries will be evaluated for correctness and efficiency",
            "Use standard SQL syntax for your answers"
          ]
        };
      case 'python':
        return {
          title: "Python Quiz Instructions",
          points: [
            "Write Python code to solve the given programming challenges",
            "Your code will be tested against multiple test cases",
            "Follow PEP 8 style guidelines where possible",
            "Make sure your code handles edge cases"
          ]
        };
      case 'mcq':
        return {
          title: "Multiple Choice Quiz Instructions",
          points: [
            "Select the best answer from the given options",
            "Only one answer is correct per question",
            "Read each question carefully before selecting",
            "You can review your answers before final submission"
          ]
        };
      default:
        return {
          title: "Quiz Instructions",
          points: [
            "Read each question carefully",
            "Take your time to understand the requirements",
            "Submit your answers when ready",
            "Good luck!"
          ]
        };
    }
  };

  const instructions = getInstructions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{instructions.title}</DialogTitle>
          <DialogDescription className="pt-4">
            <div className="space-y-4">
              {instructions.points.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="min-w-4 mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onProceed}>
            Start Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizInstructionsDialog;