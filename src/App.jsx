import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import './App.css'

const notes = [
  { name: 'C', frequency: 261.63 },
  { name: 'C#', frequency: 277.18 },
  { name: 'D', frequency: 293.66 },
  { name: 'D#', frequency: 311.13 },
  { name: 'E', frequency: 329.63 },
  { name: 'F', frequency: 349.23 },
  { name: 'F#', frequency: 369.99 },
  { name: 'G', frequency: 392.0 },
  { name: 'G#', frequency: 415.3 },
  { name: 'A', frequency: 440.0 },
  { name: 'A#', frequency: 466.16 },
  { name: 'B', frequency: 493.88 },
]

const drumPads = [
  { name: 'KICK', type: 'kick' },
  { name: 'SNARE', type: 'snare' },
  { name: 'CLAP', type: 'clap' },
  { name: 'HAT', type: 'hat' },
  { name: 'TOM', type: 'tom' },
  { name: 'RIM', type: 'rim' },
  { name: 'FX', type: 'fx' },
  { name: 'CRASH', type: 'crash' },
]

const presets = {
  shimmer: { name: 'Shimmer Pad', wave1: 'sawtooth', wave2: 'triangle', attack: 0.45, release: 4.2, filter: 2100, volume: -14, shimmer: true, reverb: 7, delay: 0.38 },
  spaceReverse: { name: 'Space Reverse', wave1: 'sine', wave2: 'sawtooth', attack: 1.4, release: 5.2, filter: 900, volume: -13, shimmer: false, reverb: 8, delay: 0.55 },
  morning: { name: 'Morning Pad', wave1: 'triangle', wave2: 'sine', attack: 0.75, release: 3.4, filter: 1400, volume: -15, shimmer: false, reverb: 5, delay: 0.28 },
  referencePad: { name: 'Reference Pad', wave1: 'sawtooth', wave2: 'sine', attack: 0.95, release: 5.4, filter: 1600, volume: -14, shimmer: true, reverb: 8, delay: 0.44 },
  celestial: { name: 'Celestial Pad', wave1: 'sine', wave2: 'triangle', attack: 1.1, release: 6.2, filter: 2400, volume: -16, shimmer: true, reverb: 9, delay: 0.52 },
  darkMatter: { name: 'Dark Matter', wave1: 'sawtooth', wave2: 'square', attack: 0.8, release: 5.8, filter: 700, volume: -17, shimmer: false, reverb: 7, delay: 0.48 },
  glassCloud: { name: 'Glass Cloud', wave1: 'triangle', wave2: 'triangle', attack: 0.6, release: 4.8, filter: 3200, volume: -15, shimmer: true, reverb: 8, delay: 0.33 },
  analogWarm: { name: 'Analog Warm', wave1: 'sawtooth', wave2: 'sawtooth', attack: 0.5, release: 3.8, filter: 1200, volume: -13, shimmer: false, reverb: 4, delay: 0.22 },
  oceanWide: { name: 'Ocean Wide', wave1: 'sine', wave2: 'triangle', attack: 1.6, release: 7.2, filter: 1100, volume: -18, shimmer: false, reverb: 10, delay: 0.62 },
  neonDream: { name: 'Neon Dream', wave1: 'sawtooth', wave2: 'sine', attack: 0.7, release: 5.1, filter: 1900, volume: -14, shimmer: true, reverb: 8, delay: 0.4 },
}

const drumEffects = {
  neonRoom: { name: 'Neon Room', volume: -8, filter: 8000, distortion: 0.08, delayTime: 0.16, delayFeedback: 0.16, delayWet: 0.1, reverbDecay: 2.2, reverbWet: 0.24 },
  tightPunch: { name: 'Tight Punch', volume: -7, filter: 9000, distortion: 0.04, delayTime: 0.08, delayFeedback: 0.06, delayWet: 0.04, reverbDecay: 0.8, reverbWet: 0.08 },
  darkClub: { name: 'Dark Club', volume: -7, filter: 2600, distortion: 0.16, delayTime: 0.22, delayFeedback: 0.18, delayWet: 0.11, reverbDecay: 2.8, reverbWet: 0.28 },
  wideSpace: { name: 'Wide Space', volume: -9, filter: 7000, distortion: 0.05, delayTime: 0.34, delayFeedback: 0.34, delayWet: 0.24, reverbDecay: 5.5, reverbWet: 0.48 },
  glitchEcho: { name: 'Glitch Echo', volume: -9, filter: 6500, distortion: 0.22, delayTime: 0.11, delayFeedback: 0.52, delayWet: 0.32, reverbDecay: 1.7, reverbWet: 0.18 },
  lofiTape: { name: 'Lo-Fi Tape', volume: -8, filter: 2800, distortion: 0.26, delayTime: 0.2, delayFeedback: 0.24, delayWet: 0.18, reverbDecay: 1.5, reverbWet: 0.16 },
  cleanStudio: { name: 'Clean Studio', volume: -7, filter: 12000, distortion: 0, delayTime: 0.12, delayFeedback: 0.04, delayWet: 0.03, reverbDecay: 1.2, reverbWet: 0.1 },
  deepCave: { name: 'Deep Cave', volume: -10, filter: 4200, distortion: 0.08, delayTime: 0.44, delayFeedback: 0.3, delayWet: 0.26, reverbDecay: 8, reverbWet: 0.62 },
  reverseGate: { name: 'Reverse Gate', volume: -8, filter: 3600, distortion: 0.12, delayTime: 0.27, delayFeedback: 0.28, delayWet: 0.24, reverbDecay: 4.2, reverbWet: 0.42 },
  metallicAir: { name: 'Metallic Air', volume: -9, filter: 10000, distortion: 0.1, delayTime: 0.19, delayFeedback: 0.2, delayWet: 0.16, reverbDecay: 3.4, reverbWet: 0.34 },
  dryMpc: { name: 'Dry MPC', volume: -6, filter: 11000, distortion: 0.03, delayTime: 0.05, delayFeedback: 0.02, delayWet: 0.01, reverbDecay: 0.4, reverbWet: 0.02 },
  bigHall: { name: 'Big Hall', volume: -9, filter: 7600, distortion: 0.04, delayTime: 0.3, delayFeedback: 0.22, delayWet: 0.2, reverbDecay: 6.8, reverbWet: 0.55 },
  hyperTrap: { name: 'Hyper Trap', volume: -7, filter: 9500, distortion: 0.18, delayTime: 0.09, delayFeedback: 0.12, delayWet: 0.08, reverbDecay: 1.1, reverbWet: 0.12 },
  ambientWash: { name: 'Ambient Wash', volume: -11, filter: 5200, distortion: 0.03, delayTime: 0.5, delayFeedback: 0.42, delayWet: 0.36, reverbDecay: 9, reverbWet: 0.7 },
  dubDelay: { name: 'Dub Delay', volume: -9, filter: 4800, distortion: 0.1, delayTime: 0.42, delayFeedback: 0.58, delayWet: 0.42, reverbDecay: 3.2, reverbWet: 0.32 },
  industrial: { name: 'Industrial', volume: -8, filter: 3400, distortion: 0.42, delayTime: 0.14, delayFeedback: 0.22, delayWet: 0.16, reverbDecay: 2.1, reverbWet: 0.24 },
  shortPlate: { name: 'Short Plate', volume: -7, filter: 8500, distortion: 0.04, delayTime: 0.1, delayFeedback: 0.05, delayWet: 0.03, reverbDecay: 1.6, reverbWet: 0.22 },
  psyFx: { name: 'Psy FX', volume: -9, filter: 9000, distortion: 0.25, delayTime: 0.13, delayFeedback: 0.48, delayWet: 0.36, reverbDecay: 3.8, reverbWet: 0.4 },
  subBoost: { name: 'Sub Boost', volume: -6, filter: 2200, distortion: 0.08, delayTime: 0.08, delayFeedback: 0.03, delayWet: 0.02, reverbDecay: 0.9, reverbWet: 0.06 },
  vintageSpring: { name: 'Vintage Spring', volume: -8, filter: 5000, distortion: 0.14, delayTime: 0.24, delayFeedback: 0.22, delayWet: 0.18, reverbDecay: 2.6, reverbWet: 0.38 },
}

const rhythmFigures = [
  { id: 'quarter', name: 'Seminima 1/4', interval: '4n', accentEvery: 4 },
  { id: 'eighth', name: 'Colcheia 1/8', interval: '8n', accentEvery: 8 },
  { id: 'sixteenth', name: 'Semicolcheia 1/16', interval: '16n', accentEvery: 16 },
  { id: 'triplet', name: 'Tercina 1/8T', interval: '8t', accentEvery: 12 },
  { id: 'half', name: 'Minima 1/2', interval: '2n', accentEvery: 2 },
  { id: 'whole', name: 'Semibreve 1/1', interval: '1m', accentEvery: 1 },
]

const metronomeModes = [
  { id: 'accent', name: 'Acento no 1' },
  { id: 'constant', name: 'Constante' },
]

function App() {
  const [selectedPreset, setSelectedPreset] = useState('shimmer')
  const [selectedDrumEffect, setSelectedDrumEffect] = useState('neonRoom')
  const [activeNotes, setActiveNotes] = useState([])
  const [bpm, setBpm] = useState(90)
  const [isMetronomeOn, setIsMetronomeOn] = useState(false)
  const [selectedRhythm, setSelectedRhythm] = useState('quarter')
  const [metronomeMode, setMetronomeMode] = useState('accent')

  const engineRef = useRef(null)
  const drumRef = useRef(null)
  const drumBuildRef = useRef(null)
  const heldNotesRef = useRef(new Set())
  const tapTimesRef = useRef([])
  const metronomeLoopRef = useRef(null)
  const metronomeSynthRef = useRef(null)
  const metronomeCountRef = useRef(0)

  const currentPreset = presets[selectedPreset]
  const currentDrumEffect = drumEffects[selectedDrumEffect]

  function getMetronomeSynth() {
    if (!metronomeSynthRef.current) {
      metronomeSynthRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.01,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.08,
          sustain: 0,
          release: 0.03,
        },
        volume: -8,
      }).toDestination()
    }

    return metronomeSynthRef.current
  }

  async function toggleMetronome() {
    await Tone.start()
    setIsMetronomeOn((current) => !current)
  }

  function handleTapTempo() {
    const now = performance.now()
    const recentTaps = tapTimesRef.current.filter((tap) => now - tap < 2500)

    recentTaps.push(now)
    tapTimesRef.current = recentTaps.slice(-6)

    if (tapTimesRef.current.length < 2) return

    const intervals = tapTimesRef.current
      .slice(1)
      .map((tap, index) => tap - tapTimesRef.current[index])

    const averageInterval =
      intervals.reduce((total, interval) => total + interval, 0) / intervals.length

    const nextBpm = Math.round(60000 / averageInterval)
    setBpm(Math.min(240, Math.max(40, nextBpm)))
  }

  function disposeMetronome() {
    if (metronomeLoopRef.current) {
      metronomeLoopRef.current.dispose()
      metronomeLoopRef.current = null
    }

    Tone.Transport.stop()
    Tone.Transport.cancel()
    metronomeCountRef.current = 0
  }

  function stopMetronome() {
    setIsMetronomeOn(false)
    disposeMetronome()
  }

  function disposeEngine() {
    if (!engineRef.current) return
    Object.values(engineRef.current).forEach((node) => node.dispose())
    engineRef.current = null
  }

  function disposeDrums() {
    if (!drumRef.current) return

    Object.values(drumRef.current).forEach((node) => {
      if (node && typeof node.dispose === 'function') {
        node.dispose()
      }
    })

    drumRef.current = null
    drumBuildRef.current = null
  }

  async function createEngine(preset) {
    await Tone.start()

    const volume = new Tone.Volume(preset.volume).toDestination()
    const reverb = new Tone.Reverb({ decay: preset.reverb, wet: 0.55 }).connect(volume)
    const delay = new Tone.FeedbackDelay({ delayTime: preset.delay, feedback: 0.35, wet: 0.28 }).connect(reverb)
    const chorus = new Tone.Chorus({ frequency: 0.45, delayTime: 4, depth: 0.7, wet: 0.35 }).start().connect(delay)
    const filter = new Tone.Filter({ type: 'lowpass', frequency: preset.filter, Q: 1.2 }).connect(chorus)

    const synth1 = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: preset.wave1 },
      envelope: { attack: preset.attack, decay: 0.4, sustain: 0.82, release: preset.release },
    }).connect(filter)

    const synth2 = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: preset.wave2 },
      envelope: { attack: preset.attack + 0.15, decay: 0.5, sustain: 0.72, release: preset.release },
    }).connect(filter)

    const shimmerSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: preset.attack + 0.35, decay: 0.6, sustain: 0.38, release: preset.release + 1 },
    }).connect(delay)

    engineRef.current = { synth1, synth2, shimmerSynth, filter, chorus, delay, reverb, volume }
  }

  async function ensureEngine() {
    if (!engineRef.current) await createEngine(currentPreset)
    return engineRef.current
  }

  function createDrums(effect) {
    const volume = new Tone.Volume(effect.volume).toDestination()
    const limiter = new Tone.Limiter(-1).connect(volume)

    const reverb = new Tone.Reverb({
      decay: effect.reverbDecay,
      wet: effect.reverbWet,
    }).connect(limiter)

    const delay = new Tone.FeedbackDelay({
      delayTime: effect.delayTime,
      feedback: effect.delayFeedback,
      wet: effect.delayWet,
    }).connect(reverb)

    const compressor = new Tone.Compressor({
      threshold: -16,
      ratio: 5,
      attack: 0.002,
      release: 0.12,
    })

    compressor.connect(limiter)
    compressor.connect(delay)

    const distortion = new Tone.Distortion({
      distortion: effect.distortion,
      wet: effect.distortion > 0 ? 0.28 : 0,
    }).connect(compressor)

    const filter = new Tone.Filter({
      type: 'lowpass',
      frequency: effect.filter,
      Q: 0.7,
    }).connect(distortion)

    const input = new Tone.Gain(1).connect(filter)

    drumRef.current = {
      input,
      filter,
      distortion,
      compressor,
      delay,
      reverb,
      limiter,
      volume,

      kickBody: new Tone.MembraneSynth({
        pitchDecay: 0.045,
        octaves: 9,
        volume: -2,
        envelope: { attack: 0.001, decay: 0.42, sustain: 0.01, release: 0.7 },
      }).connect(input),

      kickSub: new Tone.MonoSynth({
        volume: -5,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.22, sustain: 0, release: 0.08 },
      }).connect(input),

      kickClick: new Tone.NoiseSynth({
        volume: -19,
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.018, sustain: 0, release: 0.01 },
      }).connect(input),

      snareBody: new Tone.MembraneSynth({
        pitchDecay: 0.02,
        octaves: 3,
        volume: -9,
        envelope: { attack: 0.001, decay: 0.16, sustain: 0, release: 0.08 },
      }).connect(input),

      snareNoise: new Tone.NoiseSynth({
        volume: -8,
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.05 },
      }).connect(input),

      clapNoise: new Tone.NoiseSynth({
        volume: -8,
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.09, sustain: 0, release: 0.04 },
      }).connect(input),

      clapTail: new Tone.NoiseSynth({
        volume: -15,
        noise: { type: 'pink' },
        envelope: { attack: 0.004, decay: 0.34, sustain: 0, release: 0.08 },
      }).connect(input),

      hatMetal: new Tone.MetalSynth({
        frequency: 420,
        volume: -15,
        envelope: { attack: 0.001, decay: 0.055, release: 0.01 },
        harmonicity: 5.1,
        modulationIndex: 24,
        resonance: 6200,
        octaves: 1.4,
      }).connect(input),

      hatNoise: new Tone.NoiseSynth({
        volume: -22,
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.01 },
      }).connect(input),

      tom: new Tone.MembraneSynth({
        pitchDecay: 0.04,
        octaves: 5,
        volume: -5,
        envelope: { attack: 0.001, decay: 0.38, sustain: 0.01, release: 0.32 },
      }).connect(input),

      rim: new Tone.MetalSynth({
        frequency: 520,
        volume: -14,
        envelope: { attack: 0.001, decay: 0.09, release: 0.02 },
        harmonicity: 3.4,
        modulationIndex: 18,
        resonance: 3600,
        octaves: 0.8,
      }).connect(input),

      crash: new Tone.MetalSynth({
        frequency: 280,
        volume: -12,
        envelope: { attack: 0.002, decay: 1.6, release: 0.25 },
        harmonicity: 5.8,
        modulationIndex: 28,
        resonance: 5200,
        octaves: 2,
      }).connect(input),

      crashNoise: new Tone.NoiseSynth({
        volume: -18,
        noise: { type: 'white' },
        envelope: { attack: 0.003, decay: 1.2, sustain: 0, release: 0.25 },
      }).connect(input),
    }

    return drumRef.current
  }

  async function ensureDrums() {
    if (!drumRef.current) await createDrums(currentDrumEffect)
    return drumRef.current
  }

  async function toggleNote(note) {
    if (heldNotesRef.current.has(note.name)) {
      stopNote(note)
      return
    }

    const engine = await ensureEngine()
    heldNotesRef.current.add(note.name)
    setActiveNotes([...heldNotesRef.current])

    engine.synth1.triggerAttack(note.frequency)
    engine.synth2.triggerAttack(note.frequency * 1.005)

    if (currentPreset.shimmer) {
      engine.shimmerSynth.triggerAttack(note.frequency * 2)
    }
  }

  function stopNote(note) {
    if (!engineRef.current) return

    heldNotesRef.current.delete(note.name)
    setActiveNotes([...heldNotesRef.current])

    engineRef.current.synth1.triggerRelease(note.frequency)
    engineRef.current.synth2.triggerRelease(note.frequency * 1.005)

    if (currentPreset.shimmer) {
      engineRef.current.shimmerSynth.triggerRelease(note.frequency * 2)
    }
  }

  function stopAllNotes() {
    if (engineRef.current) {
      notes.forEach((note) => {
        engineRef.current.synth1.triggerRelease(note.frequency)
        engineRef.current.synth2.triggerRelease(note.frequency * 1.005)

        if (currentPreset.shimmer) {
          engineRef.current.shimmerSynth.triggerRelease(note.frequency * 2)
        }
      })
    }

    heldNotesRef.current.clear()
    setActiveNotes([])
  }

  function stopEverything() {
    stopAllNotes()
    stopMetronome()
  }

  async function playDrum(type) {
    await Tone.start()

    const drums = await ensureDrums()
    const now = Tone.immediate()

    if (type === 'kick') {
      drums.kickBody.triggerAttackRelease('C1', '8n', now)
      drums.kickSub.triggerAttackRelease('C1', '16n', now)
      drums.kickClick.triggerAttackRelease('32n', now)
    }

    if (type === 'snare') {
      drums.snareBody.triggerAttackRelease('D2', '16n', now)
      drums.snareNoise.triggerAttackRelease('16n', now)
    }

    if (type === 'clap') {
      drums.clapNoise.triggerAttackRelease('16n', now)
      drums.clapNoise.triggerAttackRelease('16n', now + 0.035)
      drums.clapNoise.triggerAttackRelease('16n', now + 0.07)
      drums.clapTail.triggerAttackRelease('8n', now + 0.045)
    }

    if (type === 'hat') {
      drums.hatMetal.triggerAttackRelease('32n', now)
      drums.hatNoise.triggerAttackRelease('32n', now)
    }

    if (type === 'tom') {
      drums.tom.triggerAttackRelease('G1', '8n', now)
    }

    if (type === 'rim') {
      drums.rim.triggerAttackRelease('32n', now)
    }

    if (type === 'fx') {
      drums.crash.triggerAttackRelease('2n', now)
      drums.crashNoise.triggerAttackRelease('2n', now)
    }

    if (type === 'crash') {
      drums.crash.triggerAttackRelease('1n', now)
      drums.crashNoise.triggerAttackRelease('1n', now)
    }
  }

  function changePreset(key) {
    stopAllNotes()
    disposeEngine()
    setSelectedPreset(key)
  }

  function changeDrumEffect(key) {
    disposeDrums()
    setSelectedDrumEffect(key)
  }

  useEffect(() => {
    Tone.Transport.bpm.rampTo(bpm, 0.05)
  }, [bpm])

  useEffect(() => {
    disposeMetronome()

    if (!isMetronomeOn) return undefined

    const currentFigure =
      rhythmFigures.find((figure) => figure.id === selectedRhythm) || rhythmFigures[0]

    const metronome = getMetronomeSynth()

    metronomeLoopRef.current = new Tone.Loop((time) => {
      const isAccent =
        metronomeMode === 'accent' &&
        metronomeCountRef.current % currentFigure.accentEvery === 0

      metronome.triggerAttackRelease(
        isAccent ? 'C6' : 'C5',
        '32n',
        time,
        isAccent ? 0.9 : 0.55
      )

      metronomeCountRef.current += 1
    }, currentFigure.interval).start(0)

    Tone.Transport.start('+0.02')

    return () => {
      disposeMetronome()
    }
  }, [isMetronomeOn, selectedRhythm, metronomeMode])

  useEffect(() => {
    return () => {
      disposeEngine()
      disposeDrums()
      disposeMetronome()

      if (metronomeSynthRef.current) {
        metronomeSynthRef.current.dispose()
      }
    }
  }, [])

  return (
    <main className="app">
      <div className="appContent">
        <section className="menuRow">
          <label className="menuControl">
            <span>Pad Preset</span>
            <select value={selectedPreset} onChange={(event) => changePreset(event.target.value)}>
              {Object.entries(presets).map(([key, preset]) => (
                <option key={key} value={key}>
                  {preset.name}
                </option>
              ))}
            </select>
          </label>

          <header className="header">
            <h1>NexusPad</h1>

            <div className="metronomePanel">
              <button
                className={`metronomeButton ${isMetronomeOn ? 'active' : ''}`}
                onClick={toggleMetronome}
              >
                {isMetronomeOn ? 'ON' : 'PLAY'}
              </button>

              <button className="tapButton" onClick={handleTapTempo}>
                TAP
              </button>

              <span className="bpmDisplay">{bpm} BPM</span>

              <select
                className="rhythmSelect"
                value={selectedRhythm}
                onChange={(event) => setSelectedRhythm(event.target.value)}
              >
                {rhythmFigures.map((figure) => (
                  <option key={figure.id} value={figure.id}>
                    {figure.name}
                  </option>
                ))}
              </select>

              <select
                className="modeSelect"
                value={metronomeMode}
                onChange={(event) => setMetronomeMode(event.target.value)}
              >
                {metronomeModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <label className="menuControl">
            <span>Drum FX</span>
            <select value={selectedDrumEffect} onChange={(event) => changeDrumEffect(event.target.value)}>
              {Object.entries(drumEffects).map(([key, effect]) => (
                <option key={key} value={key}>
                  {effect.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="presetBar">
          <button className="stopButton" onClick={stopEverything}>
            STOP ALL
          </button>
        </section>

        <section className="pads">
          {notes.map((note) => (
            <button
              className={`pad ${activeNotes.includes(note.name) ? 'activePad' : ''}`}
              key={note.name}
              onClick={() => toggleNote(note)}
            >
              {note.name}
            </button>
          ))}
        </section>

        <section className="drumSection">
          <h2>Drum Pad</h2>

          <div className="drumPads">
            {drumPads.map((drum) => (
              <button
                className="drumPad"
                key={drum.type}
                onPointerDown={(event) => {
                  event.preventDefault()
                  playDrum(drum.type)
                }}
              >
                {drum.name}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
