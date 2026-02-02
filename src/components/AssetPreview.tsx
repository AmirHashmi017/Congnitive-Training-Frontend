import React, { useState, useEffect } from 'react';
import ShapeRenderer from './ShapeRenderer';
import { ShapeFactory } from '../utils/shapeFactory';
import type { ShapeAttributes } from '../types';
import { RefreshCw } from 'lucide-react';

const AssetPreview: React.FC = () => {
    const [shapes, setShapes] = useState<ShapeAttributes[]>([]);

    const generateLayout = () => {
        const newShapes = Array.from({ length: 12 }, () => ShapeFactory.generateRandomShape());
        setShapes(newShapes);
    };

    useEffect(() => {
        generateLayout();
    }, []);

    return (
        <div className="p-8 bg-surface min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text">SVG Shape Factory</h1>
                        <p className="text-text-muted">Preview of procedurally generated assets</p>
                    </div>
                    <button
                        onClick={generateLayout}
                        className="btn-primary flex items-center gap-2"
                    >
                        <RefreshCw size={20} />
                        Regenerate
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {shapes.map((shape, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl p-8 flex items-center justify-center shadow-sm border-2 border-transparent hover:border-primary/20 transition-all aspect-square"
                        >
                            <ShapeRenderer
                                attributes={shape}
                                width={80}
                                height={80}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AssetPreview;
