import { useEffect, useRef } from "react";
import "./App.css";
import Hero from "./components/Hero";
import ReactLenis, { type LenisRef } from 'lenis/react'
import { cancelFrame, frame,} from 'framer-motion'


function App() {
  const lenisRef = useRef<LenisRef>(null)
  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp
      lenisRef.current?.lenis?.raf(time)
    }

    frame.update(update, true)

    return () => cancelFrame(update)
  }, [])
  
  return (
    <ReactLenis ref={lenisRef} root options={{lerp:0.01,duration:1.5, smoothWheel:true, autoRaf:false}}>
    <div className="h-full min-h-screen">
     <Hero/>
      <section className="outro h-screen">
        <p>Build your empire. Rule your city</p>
      </section>
    </div>
</ReactLenis>
  );
}

export default App;
