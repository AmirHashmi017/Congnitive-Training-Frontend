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
    const { color, rotation, size, opacity = 1 } = attributes;

    return (
        <svg
            viewBox="0 0 100 100"
            width={width}
            height={height}
            className={`transition-all duration-300 transform ${className}`}
            style={{
                transform: `rotate(${rotation}deg) scale(${size})`,
                opacity: opacity,
            }}
        >
            <path
                d={getShapePath(attributes)}
                fill={color}
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="2"
            />
        </svg>
    );
};

export default ShapeRenderer;
