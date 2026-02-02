import React from 'react';
import type { ShapeAttributes } from '../types';
import { getShapePath } from '../utils/shapeUtils';

interface ShapeRendererProps {
    attributes: ShapeAttributes;
    className?: string;
    width?: number | string;
    height?: number | string;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({
    attributes,
    className = "",
    width = "100%",
    height = "100%"
}) => {
    const { color, rotation, size, opacity = 1, value } = attributes;

    return (
        <svg
            viewBox="0 0 100 100"
            width={width}
            height={height}
            className={`transition-all duration-300 ${className}`}
            style={{
                transform: `scale(${size})`,
                opacity: opacity,
            }}
        >
            <path
                d={getShapePath(attributes)}
                fill={color}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="2"
                className="transition-all duration-300"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center'
                }}
            />
            {value !== undefined && (
                <text
                    x="50"
                    y="50"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fill="white"
                    fontSize="28"
                    fontWeight="900"
                    className="select-none pointer-events-none"
                    style={{
                        paintOrder: 'stroke',
                        stroke: 'rgba(0,0,0,0.4)',
                        strokeWidth: '4px',
                        strokeLinejoin: 'round'
                    }}
                >
                    {value}
                </text>
            )}
        </svg>
    );
};

export default ShapeRenderer;
