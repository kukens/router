import Meyda from 'meyda';
import type { MeydaFeaturesObject } from 'meyda';

import { AudioAnalyzerService } from '../features/audio/AudioAnalyzerService'
import type { AnalysisResult } from '../features/audio/AudioAnalyzerService.types';

export type AudioAnalyzerWorkerIn =
    {
        type: "init";
        windowSize: number
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

let windowSize = 4096;
let hopSize = 1024; 
let ringBufferSize = windowSize * 4;

let ringBuffer = new Float32Array(ringBufferSize);
let writeIndex = 0;
let availableSamples = 0;

console.log('setting default window size:' + windowSize)

function pushSamples(input: Float32Array) {
    for (let i = 0; i < input.length; i++) {
        ringBuffer[writeIndex] = input[i];
        writeIndex = (writeIndex + 1) % ringBufferSize;
    }

    availableSamples += input.length;
}

function readWindow(): Float32Array {
    const start =
        (writeIndex - availableSamples + ringBufferSize) %
        ringBufferSize;

    const window = new Float32Array(windowSize);

    for (let i = 0; i < windowSize; i++) {
        window[i] =
            ringBuffer[(start + i) % ringBufferSize];
    }

    return window;
}


self.onmessage = (e: MessageEvent<AudioAnalyzerWorkerIn>) => {

    if (e.data.type === "init" && windowSize) {
        windowSize = e.data.windowSize;
        hopSize = windowSize / 4
        ringBufferSize = windowSize * 4;

        ringBuffer = new Float32Array(ringBufferSize);
        writeIndex = 0;
        availableSamples = 0;

        console.log('setting window size:' + e.data.windowSize)
    }
    else if (e.data.type === "push") {
        const { samples, sampleRate } = e.data;

        pushSamples(samples);

        while (availableSamples >= windowSize) {
            const window = readWindow();

            Meyda.sampleRate = sampleRate;
            Meyda.bufferSize = windowSize;

            const spectrum = Meyda.extract(["amplitudeSpectrum"], window) as MeydaFeaturesObject;

            const analysisResult = analyzer.anylyzeAudio(spectrum.amplitudeSpectrum, sampleRate);

            self.postMessage({
                type: "spectrum",
                analysisResult,
            } satisfies AudioAnalyzerWorkerOut);

            availableSamples -= hopSize;
        }
    }
};
