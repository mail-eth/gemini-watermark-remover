import { interpolateAlphaMap } from '../core/adaptiveDetector.js';
import {
    WatermarkEngine,
    detectWatermarkConfig,
    calculateWatermarkPosition,
    removeRepeatedWatermarkLayers
} from '../core/watermarkEngine.js';
import { processWatermarkImageData } from '../core/watermarkProcessor.js';

export async function createWatermarkEngine() {
    return WatermarkEngine.create();
}

export async function removeWatermarkFromImage(image, options = {}) {
    const engine = options.engine instanceof WatermarkEngine
        ? options.engine
        : await createWatermarkEngine();
    const canvas = await engine.removeWatermarkFromImage(image, options);

    return {
        canvas,
        meta: canvas.__watermarkMeta || null
    };
}

export async function removeWatermarkFromImageData(imageData, options = {}) {
    const engine = options.engine instanceof WatermarkEngine
        ? options.engine
        : await createWatermarkEngine();
    const alpha48 = await engine.getAlphaMap(48);
    const alpha96 = await engine.getAlphaMap(96);

    return processWatermarkImageData(imageData, {
        ...options,
        alpha48,
        alpha96,
        getAlphaMap: options.getAlphaMap || ((size) => {
            if (size === 48) return alpha48;
            if (size === 96) return alpha96;
            return interpolateAlphaMap(alpha96, 96, size);
        })
    });
}

export {
    WatermarkEngine,
    calculateWatermarkPosition,
    detectWatermarkConfig,
    removeRepeatedWatermarkLayers
};
