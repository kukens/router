import Meyda from 'meyda';
import type { MeydaFeaturesObject } from 'meyda';

import { AudioAnalyzerService } from '~/features/audio/AudioAnalyzerService'
import type { AnalysisResult } from '~/features/audio/AudioAnalyzerService.types';

export type AudioAnalyzerWorkerIn =
    {
        type: "init";
        hopSize?: number;
    }
    | {
        type: "push";
        samples: Float32Array;
        sampleRate: number;
    };

export type AudioAnalyzerWorkerOut = {
    type: "spectrum";
    analysisResult: AnalysisResult;
};


const analyzer = new AudioAnalyzerService()

let windowSize = null;
let hopSize = null; 
let ringBufferSize = null;
let ringBuffer = null;
let writeIndex = 0;
let availableSamples = 0;

function pushSamples(input: Float32Array) {
    for (let i = 0; i < input.length; i++) {
        ringBuffer[writeIndex] = input[i];
        writeIndex = (writeIndex + 1) % ringBufferSize;
    }

    availableSamples += input.length;
}

function readWindow(readOffset: number): Float32Array {
    const window = new Float32Array(windowSize);
    const startIdx = (writeIndex - availableSamples + ringBufferSize) % ringBufferSize;

    for (let i = 0; i < windowSize; i++) {
        window[i] = ringBuffer[(startIdx + i) % ringBufferSize];
    }
    return window;
}


self.onmessage = (e: MessageEvent<AudioAnalyzerWorkerIn>) => {
    //console.log('AudioAnalyzerWorkerIn: ' + Date.now())

    if (e.data.type === "init" && e.data.hopSize) {
        hopSize = e.data.hopSize;
        windowSize = hopSize * 2
        ringBufferSize = windowSize * 2;

        ringBuffer = new Float32Array(ringBufferSize);
        writeIndex = 0;
        availableSamples = 0;

        console.log('setting window size:' + e.data.windowSize)
    }
    else if (e.data.type === "push") {
        const { samples, sampleRate } = e.data;

        pushSamples(samples);

        const now = Date.now();

        while (availableSamples >= windowSize) {
                const window = readWindow();

                Meyda.sampleRate = sampleRate;
                Meyda.bufferSize = windowSize;

                const meydaFeatures = Meyda.extract(["amplitudeSpectrum"], window) as MeydaFeaturesObject;


                const analysisResult = analyzer.anylyzeAudio(meydaFeatures.amplitudeSpectrum, sampleRate);

                const windowEndMs = Math.round(
                    now - ((availableSamples - windowSize) / sampleRate) * 1000
                );
                const windowStartMs = Math.round(
                    windowEndMs - (windowSize / sampleRate) * 1000
                );

                analysisResult.windowStart = windowStartMs;
                analysisResult.windowEnd = windowEndMs;
                
               // console.log('window analyzed: ' + windowStartMs + ' - ' + windowEndMs + '. Meyda extraction time:' + (Date.now() - windowEndMs) )

                self.postMessage({
                    type: "spectrum",
                    analysisResult,
                } satisfies AudioAnalyzerWorkerOut);

                availableSamples -= hopSize;
        }
    }
};
