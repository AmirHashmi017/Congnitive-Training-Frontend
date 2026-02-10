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

    const paddingClass = attributes.type === 'pattern' ? 'p-3' : 'p-4';

    return (
        <div
            onClick={!isDisabled ? onClick : undefined}
            className={`
        card-interactive h-full flex items-center justify-center ${paddingClass}
        ${isSelected ? 'card-selected' : ''}
        ${feedbackClass}
        ${isDisabled ? 'cursor-default' : 'cursor-pointer hover:shadow-lg'}
      `}
        >
            <ShapeRenderer
                attributes={attributes}
                width={attributes.type === 'pattern' ? '100%' : '80%'}
                height={attributes.type === 'pattern' ? '100%' : '80%'}
            />
        </div>
    );
};

export default MatchingCard;