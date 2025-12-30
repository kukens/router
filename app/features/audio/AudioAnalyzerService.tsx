import { getTolerance } from './AudioAnalyzerUtilities';

import type { AnalysisResult, SpectrumEntry, MatchedNoteData, EvaluatedChord } from './AudioAnalyzerService.types';

import { CHORDS_DATA } from '~/data/chordsData';
import { CHARMONICS_DATA } from '~/data/charmonicsData';

export class AudioAnalyzerService {
    
    public anylyzeAudio(amplitudeSpectrum: Float32Array, sampleRate:number): AnalysisResult {
            const nyquist = sampleRate / 2;
            const freqStep = nyquist / amplitudeSpectrum.length;
    
            const startBin = Math.floor(50 / freqStep);
            const endBin = Math.ceil(10000 / freqStep);
            const visibleBins = amplitudeSpectrum.slice(startBin, endBin);
            const binCount = visibleBins.length;
    
            const freqsWithMagnitudes: SpectrumEntry[] = [];
    
            const mean = visibleBins.reduce((a, b) => a + b, 0) / binCount;
    
            for (let i = 0; i < binCount; i++) {
                freqsWithMagnitudes.push({ freq: (startBin + i) * freqStep, magnitude: visibleBins[i] });
            }
    
            const peaks: SpectrumEntry[] = [];
    
            for (let i = 1; i < freqsWithMagnitudes.length - 1; ++i) {
                if (
                    freqsWithMagnitudes[i - 1].magnitude < freqsWithMagnitudes[i].magnitude && freqsWithMagnitudes[i].magnitude > freqsWithMagnitudes[i + 1].magnitude)
                    peaks.push(freqsWithMagnitudes[i])
            }
    
            const aboveMean = peaks.filter(x => x.magnitude > mean);
            const rms = Math.sqrt(aboveMean.reduce((sum, val) => sum + val.magnitude * val.magnitude, 0) / aboveMean.length);
    
            const analyzedAudio: AnalysisResult = {
                audioData: { rms: rms, mean: mean, peaks: peaks },
                hitsData: null,
                evaluatedChords: []
            };
    
            if (!aboveMean.some(x => x.magnitude > 10)) {
                return analyzedAudio;
            }
    
            const matchedNotes = this.matchFrequencies(aboveMean)
    
            const rmsScore = Math.sqrt(matchedNotes.reduce((sum, val) => sum + val.score * val.score, 0) / matchedNotes.length);
            const meanScore = matchedNotes.reduce((a, b) => a + b.score, 0) / matchedNotes.length;
            const rmsFrequencyHits = Math.sqrt(matchedNotes.reduce((sum, val) => sum + val.frequencies.length * val.frequencies.length, 0) / matchedNotes.length);
            const meanFrequencyHits = matchedNotes.reduce((a, b) => a + b.frequencies.length, 0) / matchedNotes.length;
    
            const filteredMatchedNotes = matchedNotes.filter(x => x.score > meanScore && x.frequencies.length > 4).sort((a, b) => b.score - a.score);
    
            const familyScores: { [family: string]: number; } = {};
    
            filteredMatchedNotes.forEach(x => {
                const currentFamilyScore = familyScores[x.family];
                if (currentFamilyScore == null) {
                    familyScores[x.family] = x.score;
                }
                else {
                    familyScores[x.family] = currentFamilyScore + x.score
                }
            });
    
            const sortedFaimilyScores = Object.entries(familyScores).sort((a, b) => b[1] - a[1]);
            const evaluatedChords = this.EvaluateChord(sortedFaimilyScores)
    
            analyzedAudio.evaluatedChords = evaluatedChords;
            analyzedAudio.hitsData = {
                meanScore: meanScore,
                rmsScore: rmsScore,
                meanFrequencyHits: meanFrequencyHits,
                rmsFrequencyHits: rmsFrequencyHits,
                familyScores: sortedFaimilyScores
            }
    
            return analyzedAudio;
        }
    
        private matchFrequencies(inputFrequencies: SpectrumEntry[]): MatchedNoteData[] {
            const matchedNotes: MatchedNoteData[] = [];
    
            CHARMONICS_DATA.forEach(harmonicDataElement => {
                const matchedMagnitudes: number[] = [];
                const matchedHarmonics = harmonicDataElement.freqs.filter(harmFreq =>
    
                    inputFrequencies.some(() => {
                        const tol = getTolerance(harmFreq);
    
                        // filter elements by tolerance (if tol is 10 then it tolerates 10 downwards and upwards)
                        const filtered = inputFrequencies.filter(inputFreq => (harmFreq - inputFreq.freq <= tol && inputFreq.freq - harmFreq < tol));
    
                        if (filtered.length > 0) {
    
                            const magnitude = filtered.filter(x => x.freq)[0].magnitude;
    
                            matchedMagnitudes.push(magnitude);
                            return true;
                        }
    
                        return false
                    })
                );
    
                if (matchedHarmonics.length > 0) {
                    matchedNotes.push(
                        {
                            note: harmonicDataElement.note,
                            family: harmonicDataElement.family,
                            score: matchedMagnitudes.reduce((a, b) => a + b),
                            magnitudes: matchedMagnitudes,
                            frequencies: matchedHarmonics
                        });
                }
            });
    
            return matchedNotes;
        }
    
        private EvaluateChord(familyScores: [string, number][]): EvaluatedChord[] {
    
            const chords: EvaluatedChord[] = [];
    
            CHORDS_DATA.forEach(chordType => {              

                chordType.chords.forEach(chord => {
                    let finalScore = 0;

                    if (chord.notes.every(note => {
                        const matchedNoteFamily = familyScores.filter(x => x[0] == note);
                        const isMatch = matchedNoteFamily?.length == 1;

                        if (isMatch) {
                            finalScore += matchedNoteFamily[0][1];
                        }
                        return isMatch;
                    })) {
                        const matchedChordInfo: EvaluatedChord = {
                            chordName: chord.name,
                            score: finalScore,
                            notes: chord.notes
                        }

                        chords.push(matchedChordInfo)
                    }
                });
            });
    
            const sortedChords = Object.entries(chords).sort((a, b) => b[1].score - a[1].score).map(x => x[1]);
    
            return sortedChords
        }
}
