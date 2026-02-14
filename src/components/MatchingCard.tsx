import React from 'react';
import ShapeRenderer from './ShapeRenderer';
import type { ShapeAttributes } from '../types';

interface MatchingCardProps {
    attributes: ShapeAttributes;
    onClick: () => void;
    isSelected?: boolean;
    isDisabled?: boolean;
    feedback?: 'correct' | 'incorrect' | null;
}

const MatchingCard: React.FC<MatchingCardProps> = ({
    attributes,
    onClick,
    isSelected,
    isDisabled,
    feedback
}) => {
    let feedbackClass = "";
    if (feedback === 'correct') feedbackClass = "border-primary bg-primary/10 scale-105";
    if (feedback === 'incorrect') feedbackClass = "border-danger bg-danger/10 animate-shake";

    // FIXED: Constrained padding to prevent overflow on iPad
    const paddingClass = attributes.type === 'pattern' ? 'p-3' : 'p-4';
    
    // Ensure proper width/height for different shape types - constrained to 80%
    const shapeWidth = attributes.type === 'pattern' ? '100%' : 
                      attributes.type === 'text' ? '100%' : 
                      '80%';
    const shapeHeight = attributes.type === 'pattern' ? '100%' : 
                       attributes.type === 'text' ? 'auto' : 
                       '80%';

    return (
        <div
            onClick={!isDisabled ? onClick : undefined}
            className={`
        card-interactive h-full w-full flex items-center justify-center ${paddingClass}
        ${isSelected ? 'card-selected' : ''}
        ${feedbackClass}
        ${isDisabled ? 'cursor-default' : 'cursor-pointer hover:shadow-lg'}
      `}
        >
            <div className="w-full h-full flex items-center justify-center max-w-full max-h-full overflow-hidden">
                <ShapeRenderer
                    attributes={attributes}
                    width={shapeWidth}
                    height={shapeHeight}
                />
            </div>
        </div>
    );
};

export default MatchingCard;