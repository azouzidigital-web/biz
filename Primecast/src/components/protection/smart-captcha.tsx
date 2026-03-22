"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface CaptchaChallenge {
  type: 'math' | 'pattern' | 'image' | 'logic';
  question: string;
  answer: string;
  options?: string[];
}

interface SmartCaptchaProps {
  onVerify: (verified: boolean) => void;
  suspicionLevel: number;
  onFailed?: () => void;
}

export function SmartCaptcha({ onVerify, suspicionLevel, onFailed }: SmartCaptchaProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const generateMathChallenge = useCallback((): CaptchaChallenge => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1: number, num2: number, answer: number;
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 20) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 30) + 10;
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 5;
        num2 = 3;
        answer = 8;
    }

    return {
      type: 'math',
      question: `${num1} ${operation} ${num2} = ?`,
      answer: answer.toString()
    };
  }, []);

  const generatePatternChallenge = useCallback((): CaptchaChallenge => {
    const patterns = [
      { sequence: [2, 4, 6, 8], next: 10, question: "2, 4, 6, 8, ?" },
      { sequence: [1, 3, 5, 7], next: 9, question: "1, 3, 5, 7, ?" },
      { sequence: [5, 10, 15, 20], next: 25, question: "5, 10, 15, 20, ?" },
      { sequence: [1, 4, 9, 16], next: 25, question: "1, 4, 9, 16, ?" },
      { sequence: [2, 6, 18, 54], next: 162, question: "2, 6, 18, 54, ?" }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    return {
      type: 'pattern',
      question: `Complete the sequence: ${pattern.question}`,
      answer: pattern.next.toString()
    };
  }, []);

  const generateLogicChallenge = useCallback((): CaptchaChallenge => {
    const challenges = [
      {
        type: 'logic' as const,
        question: "If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?",
        answer: "5",
        options: ["5", "20", "100", "500"]
      },
      {
        type: 'logic' as const,
        question: "How many months have 28 days?",
        answer: "12",
        options: ["1", "2", "11", "12"]
      },
      {
        type: 'logic' as const,
        question: "What comes next: Monday, Wednesday, Friday, ?",
        answer: "Sunday",
        options: ["Saturday", "Sunday", "Tuesday", "Thursday"]
      },
      {
        type: 'logic' as const,
        question: "If you have 3 apples and you take away 2, how many do you have?",
        answer: "2",
        options: ["1", "2", "3", "5"]
      }
    ];
    
    return challenges[Math.floor(Math.random() * challenges.length)];
  }, []);

  const generateImageChallenge = useCallback((): CaptchaChallenge => {
    // Simple text-based image challenge for now
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    const shapes = ['circle', 'square', 'triangle'];
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    return {
      type: 'image',
      question: `Click on the ${color} ${shape}`,
      answer: `${color}-${shape}`,
      options: [
        `${color}-${shape}`,
        `${colors[(colors.indexOf(color) + 1) % colors.length]}-${shape}`,
        `${color}-${shapes[(shapes.indexOf(shape) + 1) % shapes.length]}`,
        `${colors[(colors.indexOf(color) + 2) % colors.length]}-${shapes[(shapes.indexOf(shape) + 1) % shapes.length]}`
      ]
    };
  }, []);

  const generateChallenge = useCallback(() => {
    const challengeTypes = ['math', 'pattern', 'logic', 'image'];
    let selectedType: string;
    
    // Higher suspicion = harder challenges
    if (suspicionLevel > 80) {
      selectedType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    } else if (suspicionLevel > 50) {
      selectedType = Math.random() > 0.5 ? 'math' : 'pattern';
    } else {
      selectedType = 'math';
    }
    
    let newChallenge: CaptchaChallenge;
    
    switch (selectedType) {
      case 'pattern':
        newChallenge = generatePatternChallenge();
        break;
      case 'logic':
        newChallenge = generateLogicChallenge();
        break;
      case 'image':
        newChallenge = generateImageChallenge();
        break;
      default:
        newChallenge = generateMathChallenge();
    }
    
    setChallenge(newChallenge);
    setStartTime(Date.now());
  }, [suspicionLevel, generateMathChallenge, generatePatternChallenge, generateLogicChallenge, generateImageChallenge]);

  useEffect(() => {
    // Show CAPTCHA based on suspicion level
    if (suspicionLevel > 30) {
      setShowCaptcha(true);
      generateChallenge();
    } else {
      onVerify(true); // Auto-verify for normal users
    }
  }, [suspicionLevel, onVerify, generateChallenge]);

  const handleVerify = async () => {
    if (!challenge) return;
    
    setIsLoading(true);
    
    // Simulate processing time (bots often respond instantly)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const timeTaken = Date.now() - startTime;
    const isCorrect = userInput.toLowerCase().trim() === challenge.answer.toLowerCase().trim();
    
    // Additional bot detection based on response time
    const isSuspiciouslyFast = timeTaken < 1000; // Less than 1 second
    const isSuspiciouslySlow = timeTaken > 300000; // More than 5 minutes
    
    if (isCorrect && !isSuspiciouslyFast && !isSuspiciouslySlow) {
      onVerify(true);
      setShowCaptcha(false);
    } else {
      setAttempts(prev => prev + 1);
      
      if (attempts >= 2) {
        // Too many failed attempts
        onFailed?.();
        return;
      }
      
      // Generate new challenge
      generateChallenge();
      setUserInput('');
      
      if (isSuspiciouslyFast) {
        alert('Please take your time to read the question carefully.');
      } else if (!isCorrect) {
        alert('Incorrect answer. Please try again.');
      }
    }
    
    setIsLoading(false);
  };

  const handleOptionClick = (option: string) => {
    setUserInput(option);
  };

  if (!showCaptcha || !challenge) return null;

  const renderImageChallenge = () => {
    if (challenge.type !== 'image' || !challenge.options) return null;
    
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    const shapes = ['circle', 'square', 'triangle'];
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {challenge.options.map((option, index) => {
          const [color, shape] = option.split('-');
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleOptionClick(option)}
              className={`p-4 border-2 rounded-lg transition-all ${
                userInput === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center">
                <div
                  className={`w-8 h-8 ${
                    shape === 'circle' ? 'rounded-full' : 
                    shape === 'triangle' ? 'triangle' : 'rounded-none'
                  }`}
                  style={{
                    backgroundColor: color,
                    clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined
                  }}
                />
              </div>
              <div className="text-xs mt-1">{color} {shape}</div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <p className="text-sm font-medium text-yellow-800">
          Security Verification Required
        </p>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-yellow-700 font-medium">
          {challenge.question}
        </p>
        
        {challenge.type === 'image' ? (
          renderImageChallenge()
        ) : challenge.options ? (
          <div className="grid grid-cols-2 gap-2">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`p-2 text-sm border rounded transition-all ${
                  userInput === option
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Enter your answer"
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={handleVerify}
            disabled={!userInput || isLoading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm px-4 py-2"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
          
          <button
            type="button"
            onClick={generateChallenge}
            className="text-xs text-yellow-600 hover:text-yellow-700 underline"
          >
            New question
          </button>
        </div>
        
        {attempts > 0 && (
          <p className="text-xs text-red-600">
            {3 - attempts} attempts remaining
          </p>
        )}
      </div>
    </div>
  );
}

// Progressive CAPTCHA that gets harder with each failure
export function ProgressiveCaptcha({ onVerify, suspicionLevel }: SmartCaptchaProps) {
  const [difficulty, setDifficulty] = useState(1);
  const [failures, setFailures] = useState(0);

  const handleFailed = () => {
    setFailures(prev => prev + 1);
    setDifficulty(prev => Math.min(prev + 1, 5));
  };

  const handleVerify = (verified: boolean) => {
    if (verified) {
      onVerify(true);
    } else {
      handleFailed();
    }
  };

  return (
    <SmartCaptcha
      onVerify={handleVerify}
      suspicionLevel={suspicionLevel + (difficulty * 20)}
      onFailed={handleFailed}
    />
  );
}
