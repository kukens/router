'use client';

import { useEffect, useState, useRef } from 'react';
import type { HitsData, CurrentAudioData, EvaluatedChord } from '~/features/audio/AudioAnalyzerService.types';

import { getTolerance } from '~/features/audio/AudioAnalyzerUtilities';
import { useChord } from "~/features/audio/ChordContext";
import type { AudioAnalyzerWorkerIn, AudioAnalyzerWorkerOut } from "~/workers/AudioAnalyzerWorker";
import { Button } from "flowbite-react";

export default function AudioAnalyzer() {

    const [hitsData, sethitsData] = useState<HitsData | null>(null);
    const [audioData, setAudioData] = useState<CurrentAudioData | null>(null);
    const [evaluatedChords, setEvaluatedChords] = useState<EvaluatedChord[]>([]);
    const { setEvaluatedChord } = useChord();

    const workerRef = useRef<Worker>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    const windowSize = 4096;

    const [isRecording, setIsRecording] = useState(true);
    const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(false);


    useEffect(() => {
       
            return () => stopRecording();
        }, []);

    useEffect(() => {

        console.log("AudioAnalyzer effect toggle" + isRecording);

        if (isRecording) {

            console.log("Creating web worker");
            workerRef.current = new Worker(
                new URL("../workers/AudioAnalyzerWorker.tsx", import.meta.url),
                { type: "module" }
            );
            startRecording();
            workerRef.current.onmessage = (e: MessageEvent<AudioAnalyzerWorkerOut>) => {

                if (e.data.type === "spectrum") {
                    const analyzisResult = e.data.analysisResult;
                    if (diagnosticsEnabled) {
                        if (analyzisResult.audioData) setAudioData(analyzisResult.audioData);
                        if (analyzisResult.hitsData) sethitsData(analyzisResult.hitsData);
                        if (analyzisResult.evaluatedChords.length > 0) {
                            setEvaluatedChords(analyzisResult.evaluatedChords);
                        }
                    }
                    if (analyzisResult.evaluatedChords.length > 0) {
                        setEvaluatedChord({
                            value: analyzisResult.evaluatedChords[0].chordName,
                            version: crypto.randomUUID(),
                        });
                    }
                }
            };
        }

    }, [isRecording]);

    const handleToggle = () => {
        if (isRecording) {
            stopRecording();
        }
        else {
            startRecording();
        }
    };

    const enableDiagnostics = () => {
        setDiagnosticsEnabled(prevState => !prevState);
    };

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(windowSize, 1, 1);
      
        processorRef.current = processor;

        workerRef.current?.postMessage(
            {
                type: "init",
                windowSize: windowSize,
            } as AudioAnalyzerWorkerIn
        );

        source.connect(processor);
        processor.connect(audioCtx.destination);

        processor.onaudioprocess = (e) => {
            const samples = e.inputBuffer.getChannelData(0);

            workerRef.current?.postMessage(
                {
                    type: "push",
                    samples,
                    sampleRate: audioCtx.sampleRate,
                } as AudioAnalyzerWorkerIn,
                [samples.buffer]
            );
        };

        setIsRecording(true);
    };

    const stopRecording = () => {
     
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
             processorRef.current?.disconnect();
             audioCtxRef.current.close()
             workerRef.current?.terminate();

            console.log('Closing audio ctx and disposing web worker');
        };

        setIsRecording(false);
    };


    return <div className="w-full">

        <Button className="m-2" as="span" color="teal" pill onClick={handleToggle}>
            {isRecording ? 'STOP' : 'START'}
        </Button>

        <Button className="m-2" as="span" color="teal" pill onClick={enableDiagnostics}>
            {diagnosticsEnabled ? 'DIAGNOSTICS OFF' : 'DIAGNOSTICS ON'}
        </Button>

        <br />  <br />

        {diagnosticsEnabled &&
            <div><p>mean: {audioData?.mean.toFixed(1)}</p>
                <p>rms: {audioData?.rms.toFixed(1)}</p>
                <br />
                <p>meanScore: {hitsData?.meanScore.toFixed(1)}</p>
                <p>rmsFrequencyHits: {hitsData?.rmsFrequencyHits.toFixed(1)}</p>
                <p>rmsFrequencyHits: {hitsData?.meanFrequencyHits.toFixed(1)}</p>
                <p>rmsFrequencyHits: {hitsData?.rmsFrequencyHits.toFixed(1)}</p>
                <br />

                <h3>Chords:</h3>
                <ul>
                    {evaluatedChords.slice(0, 5).map(x => (
                        <li key={x.chordName}>{x.chordName} - {x.score.toFixed(1)}</li>
                    ))}
                </ul>

                <br />
                <h3>Notes:</h3>
                <ul>
                    {hitsData?.familyScores.map(x => (
                        <li key={x[0]}>{x[0]} - {x[1].toFixed(1)}</li>
                    ))}
                </ul>
                <br />


                <h3>Freq vs Amplitude:</h3>
                <ul>
                    {audioData?.peaks.map(x => (
                        <li key={x.freq}>{x.freq.toFixed(1)} ({getTolerance(x.freq).toFixed(1)}) - {x.magnitude.toFixed(1)}</li>
                    ))}
                </ul>
            </div>

        }
    </div>
}