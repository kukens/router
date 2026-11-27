'use client';

import { useEffect, useState, useRef } from 'react';
import type { HitsData, CurrentAudioData, EvaluatedChord } from '~/features/audio/AudioAnalyzerService.types';

import { getTolerance } from '~/features/audio/AudioAnalyzerUtilities';
import { useChord } from "~/features/audio/ChordContext";
import type { AudioAnalyzerWorkerIn, AudioAnalyzerWorkerOut } from "~/features/audio/AudioAnalyzerWorker";
import { Button } from '@base-ui/react/button';

type AudioWindow = Window & {
    webkitAudioContext?: typeof AudioContext;
};

export default function AudioAnalyzer() {

    const [hitsData, sethitsData] = useState<HitsData | null>(null);
    const [audioData, setAudioData] = useState<CurrentAudioData | null>(null);
    const [evaluatedChordsDiagnostics, setEvaluatedChordsDiagnostics] = useState<EvaluatedChord[]>([]);
    const { setEvaluatedChord: setEvaluatedChords } = useChord();
    const { setIsAnalyzing } = useChord();

    const workerRef = useRef<Worker>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);

    const hopSize = 4096;

    const [isStarting, setIsStarting] = useState(true);
    const [statusMessage, setStatusMessage] = useState('Starting microphone…');
    const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(false);

    useEffect(() => {

        let isCurrent = true;

        const cleanupAudioResources = () => {
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

            sourceRef.current = null;
            processorRef.current = null;

            workerRef.current?.terminate();
            workerRef.current = null;
        };

        const startRecording = async () => {
            try {
                if (!navigator.mediaDevices?.getUserMedia) {
                    throw new Error('Microphone access is not supported by this browser.');
                }

                const AudioContextCtor = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
                if (!AudioContextCtor) {
                    throw new Error('Audio analysis is not supported by this browser.');
                }

                setIsStarting(true);
                setStatusMessage('Waiting for microphone permission…');

                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });


                if (!isCurrent) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                console.log('approved')

                workerRef.current = new Worker(
                    new URL("~/features/audio/AudioAnalyzerWorker.tsx", import.meta.url),
                    { type: "module" }
                );
                workerRef.current?.postMessage(
                    {
                        type: "init",
                        hopSize: hopSize,
                    } as AudioAnalyzerWorkerIn
                );

                streamRef.current = stream;

                audioCtxRef.current = new AudioContextCtor();
                if (audioCtxRef.current.state === 'suspended') {
                    await audioCtxRef.current.resume();
                }

                if (!isCurrent) {
                    cleanupAudioResources();
                    return;
                }

                sourceRef.current = audioCtxRef.current.createMediaStreamSource(streamRef.current);
                processorRef.current = audioCtxRef.current.createScriptProcessor(hopSize, 1, 1);

                sourceRef.current.connect(processorRef.current);
                processorRef.current.connect(audioCtxRef.current.destination);

                processorRef.current.onaudioprocess = (e) => {
                    if (!workerRef.current || !audioCtxRef.current) {
                        return;
                    }

                    const samples = new Float32Array(e.inputBuffer.getChannelData(0));

                    workerRef.current.postMessage(
                        {
                            type: "push",
                            samples,
                            sampleRate: audioCtxRef.current.sampleRate,
                        } as AudioAnalyzerWorkerIn,
                        [samples.buffer]
                    );
                };

                workerRef.current.onmessage = (e: MessageEvent<AudioAnalyzerWorkerOut>) => {

                    if (e.data.type === "spectrum") {
                        setIsAnalyzing(true);
                        setStatusMessage('Listening…');

                        const analyzisResult = e.data.analysisResult;
                        if (diagnosticsEnabled) {
                            if (analyzisResult.audioData) setAudioData(analyzisResult.audioData);
                            if (analyzisResult.hitsData) sethitsData(analyzisResult.hitsData);
                            if (analyzisResult.evaluatedChords.length > 0) {
                                setEvaluatedChordsDiagnostics(analyzisResult.evaluatedChords);
                            }
                        }
                        if (analyzisResult.evaluatedChords.length > 0) {
                            setEvaluatedChords({
                                chords: analyzisResult.evaluatedChords.map(chord => chord.chordName).slice(0, 3),
                                windowStart: analyzisResult.windowStart,
                                windowEnd: analyzisResult.windowEnd
                            });
                        }
                    }
                };

                setStatusMessage('Listening…');
            } catch (error) {
                cleanupAudioResources();

                if (isCurrent) {
                    const errorMessage = error instanceof Error ? error.message : 'Unable to start the microphone.';
                    setStatusMessage(errorMessage);
                }
            } finally {
                if (isCurrent) {
                    setIsStarting(false);
                }
            }
        };

        const cleanup = () => {
            setIsAnalyzing(false);
            cleanupAudioResources();
        };

        startRecording();
        return () => {
            isCurrent = false;
            cleanup();
        }

    }, [diagnosticsEnabled]);

    const enableDiagnostics = () => {
        setDiagnosticsEnabled(!diagnosticsEnabled);
    };

    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>



        <Button className="btn-action" onClick={enableDiagnostics} style={{ display: 'none' }}>
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
                    {evaluatedChordsDiagnostics.slice(0, 5).map(x => (
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