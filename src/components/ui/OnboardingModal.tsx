import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type OnboardingStep = {
  title: string;
  description: React.ReactNode;
};

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Welcome to Personal Pomodoro!",
    description: (
      <div className="space-y-2">
        <p>This app helps you stay focused and productive using the Pomodoro technique.</p>
        <p>Let&apos;s take a quick tour of the features available to you.</p>
      </div>
    ),
  },
  {
    title: "Pomodoro Timer",
    description: (
      <div className="space-y-2">
        <p>The Pomodoro timer helps you work in focused intervals:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Work for 25 minutes or 50 minutes (one pomodoro)</li>
          <li>Take a 5-minute break</li>
        </ul>
        <p>You can start, pause, and reset the timer using the controls.</p>
      </div>
    ),
  },
  {
    title: "Task Management",
    description: (
      <div className="space-y-2">
        <p>Keep track of your tasks:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Add tasks you want to complete</li>
          <li>Mark tasks as complete when finished</li>
          <li>Tasks are automatically saved for your next visit</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Workout Mode",
    description: (
      <div className="space-y-2">
        <p>When you are on break from tasks, to keep you healthy, we generate mini-workouts for you:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Choose different workout types in settings</li>
          <li>Select your difficulty level</li>
          <li>Follow along with guided exercises</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Settings & Customization",
    description: (
      <div className="space-y-2">
        <p>Personalize your experience:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Change themes and colors</li>
          <li>Adjust sound settings</li>
          <li>View your statistics</li>
        </ul>
        <p>Visit the settings page by clicking the gear icon in the navigation bar.</p>
      </div>
    ),
  },
];

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function OnboardingModal({
  open,
  onOpenChange,
  onComplete,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentOnboardingStep = onboardingSteps[currentStep];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{currentOnboardingStep.title}</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {onboardingSteps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {currentOnboardingStep.description}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <button
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleSkip}
          >
            Skip Tour
          </button>
          <div className="space-x-2">
            {currentStep > 0 && (
              <button
                className="px-4 py-2 text-sm border rounded-md hover:bg-accent transition-colors"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </button>
            )}
            <button
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
              onClick={handleNext}
            >
              {currentStep < onboardingSteps.length - 1 ? "Next" : "Get Started"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}