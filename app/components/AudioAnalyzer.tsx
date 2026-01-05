'use client';

import { useEffect, useState, useRef } from 'react';
import type { HitsData, CurrentAudioData, EvaluatedChord } from '~/features/audio/AudioAnalyzerService.types';

import { getTolerance } from '~/features/audio/AudioAnalyzerUtilities';
import { useChord } from "~/features/audio/ChordContext";
import type { AudioAnalyzerWorkerIn, AudioAnalyzerWorkerOut } from "~/features/audio/AudioAnalyzerWorker";
import { Button } from "flowbite-react";

export default function AudioAnalyzer() {

    const [hitsData, sethitsData] = useState<HitsData | null>(null);
    const [audioData, setAudioData] = useState<CurrentAudioData | null>(null);
    const [evaluatedChords, setEvaluatedChords] = useState<EvaluatedChord[]>([]);
    const { setEvaluatedChord } = useChord();

    const workerRef = useRef<Worker>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    const windowSize = 4096 * 2;

    const [isRecording, setIsRecording] = useState(true);
    const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(false);

    useEffect(() => {

        let isCurrent = true;

        const startRecording = async () => {

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            if (!isCurrent) {
                stream.getTracks().forEach(track => track.stop());
                return;
            }

            workerRef.current = new Worker(
                new URL("~/features/audio/AudioAnalyzerWorker.tsx", import.meta.url),
                { type: "module" }
            );
            workerRef.current?.postMessage(
                {
                    type: "init",
                    windowSize: windowSize,
                } as AudioAnalyzerWorkerIn
            );

            streamRef.current = stream;

            audioCtxRef.current = new AudioContext();

            sourceRef.current = audioCtxRef.current.createMediaStreamSource(streamRef.current);
            processorRef.current = audioCtxRef.current.createScriptProcessor(windowSize, 1, 1);

            sourceRef.current.connect(processorRef.current);
            processorRef.current.connect(audioCtxRef.current.destination);

            processorRef.current.onaudioprocess = (e) => {
                const samples = e.inputBuffer.getChannelData(0);

                workerRef.current?.postMessage(
                    {
                        type: "push",
                        samples,
                        sampleRate: audioCtxRef.current?.sampleRate,
                    } as AudioAnalyzerWorkerIn,
                    [samples.buffer]
                );
            };

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
        };

        const cleanup = () => {

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                    track.enabled = false;
                });
                streamRef.current = null;
            }

            if (audioCtxRef.current) {
                sourceRef.current?.disconnect();
                processorRef.current?.disconnect();
                if (audioCtxRef.current.state !== 'closed') {
                    audioCtxRef.current.close();
                }
                audioCtxRef.current = null;
            }

            workerRef.current?.terminate();
            workerRef.current = null;
        };

        if (isRecording) {
            startRecording();          
        }
        else {
            cleanup();    
        }

        return () => {
            isCurrent = false;
            cleanup();
        }

    }, [isRecording, diagnosticsEnabled]);

    const handleToggle = () => {
        setIsRecording(!isRecording);
    };

    const enableDiagnostics = () => {
        setDiagnosticsEnabled(!diagnosticsEnabled);
    };

    return <>

        <Button color="teal" pill onClick={handleToggle}>
            {isRecording ? 'STOP' : 'START'} RECORDING
        </Button>

        <Button color="teal" pill onClick={enableDiagnostics}>
            {diagnosticsEnabled ? 'DISABLE' : 'ENABLE'} DIAGNOSTICS
        </Button>


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
    </>
}