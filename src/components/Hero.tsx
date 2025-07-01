import { useEffect, useRef } from 'react'
import { pubgPath } from "./PubgText";
import {
  useScroll,
  useTransform,
  motion,
  useMotionValueEvent,
  useMotionTemplate,
} from "framer-motion";
import { debounce } from '../utils';

const Hero = () => {
    const logoContainer = useRef<HTMLDivElement>(null);
  const pathElement = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const overlayCopyRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (!pathElement.current || !logoContainer.current || !overlayCopyRef.current) return;
    overlayCopyRef.current.style.backgroundClip = 'text'
    const updateLogoPosition = () => {
      pathElement.current!.setAttribute("d", pubgPath);
      const logoDimensions = logoContainer.current!.getBoundingClientRect();
      const logoBoundingBox = pathElement.current!.getBBox();
  
      // Calculate scaling factor
      const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;
      const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;
      const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);
  
      // Calculate centered position
      const logoHorizontalPosition =
        logoDimensions.left +
        (logoDimensions.width - logoBoundingBox.width * logoScaleFactor) / 2 -
        logoBoundingBox.x * logoScaleFactor;
  
      const logoVerticalPosition =
        logoDimensions.top +
        (logoDimensions.height - logoBoundingBox.height * logoScaleFactor) / 2 -
        logoBoundingBox.y * logoScaleFactor;
  
      pathElement.current!.setAttribute(
        "transform",
        `translate(${logoHorizontalPosition}, ${logoVerticalPosition}) scale(${logoScaleFactor})`
      );
    };
  
   
  const debouncedUpdate = debounce(updateLogoPosition, 100);
  updateLogoPosition(); // Initial call
  window.addEventListener("resize", debouncedUpdate);

  return () => {
    window.removeEventListener("resize", debouncedUpdate);
  };
  }, []);

 

  const { scrollYProgress } = useScroll({ target: sectionRef,
    offset:["start start", "end end"]
   },);
  const opacity = useTransform(scrollYProgress, (progress) => {
    if (progress < 0.15) {
      return 1 - progress * (1 / 0.15);
    } else return 0;
  });

 const heroImgScale = useTransform(scrollYProgress,(progress)=>{
    if(progress < .85){
      const normalizedProgress = progress * (1 /.85)
      const heroImgContainerScale = 1.5 - .5 * normalizedProgress
      
      return heroImgContainerScale
    }else return 1
  })
  const overlayScale = useTransform(scrollYProgress,(progress)=>{
    if (progress <.85) {
      const normalizedProgress = progress * (1 /.85)
      const overlayScale = 350 * Math.pow(1/350,normalizedProgress)
      return overlayScale
    } else return 0
  })

  const fadeOverlayOpacity = useTransform(scrollYProgress,(progress)=>{
    if(progress > .25){
      return Math.min(1,(progress - .25) * (1/.4))
    }else return 0
  })

 

  const gradientBottomPostion = useTransform(scrollYProgress,(progress)=>{
    if(progress >.6 && progress <.85){
        const overlayCopyRevealProgress = (progress - .6) *(1/.25)
        
        const gradientBottomPostion = 240 - overlayCopyRevealProgress * 280;
        return gradientBottomPostion
    } else return 100
  })

  const gradientTopPostion =useTransform(scrollYProgress,(progress)=>{
    if(progress >.6 && progress <.85){
        const overlayCopyRevealProgress = (progress - .6) *(1/.25)
        const gradientSpread = 100
        const gradientBottomPostion = 240 - overlayCopyRevealProgress * 280;
        const gradientTopPostion = gradientBottomPostion - gradientSpread;
        return gradientTopPostion
    } return 0
  })

 const overlayCopyScale = useTransform(scrollYProgress,progress=>{
    if(progress >.6 && progress <.85){
      const overlayCopyRevealProgress = (progress - .6) *(1/.25)
      const overlayCopyScale = 1.25 -.25 * overlayCopyRevealProgress
      return overlayCopyScale
  } return 1
  })
  const textGradinet = useMotionTemplate `linear-gradient(to bottom, #111117 0%, #668cb7 ${gradientTopPostion}%, #d4b949 ${gradientBottomPostion}%, #d4b949 100%)`

 
  const overlayH1Opacity = useTransform(scrollYProgress,[0,.6,1],[0,0,1])
  

  return (
    <section className="hero relative h-[500vh]" ref={sectionRef}>
    <div className="sticky top-0 left-0 w-full h-screen">
      <div className="relative w-full h-full overflow-hidden">
      <motion.div className="hero-image-container "
    style={{
      scale:heroImgScale
    }}>
      <img src="/pubg-background.jpg" alt="" />

      <motion.div
        className="hero-image-logo w-full"
        style={{
          opacity,
        }}
      >
        <img src="/pubg-logo.png" alt="" />
      </motion.div>

      <img src="/pubg-foreground.png" alt="" />

      <motion.div
        className="hero-img-copy"
        style={{
          opacity,
        }}
      >
        <p>Scroll down to reveal</p>
      </motion.div>
      <motion.div className="fade-overlay"
      style={{
        opacity:fadeOverlayOpacity
      }}>
        <div className="overlay">
          <svg className="w-full h-full absolute">
            <defs>
              <mask id="logoRevealMask">
                <rect width="100%" height="100%" fill="white" />
                <path id="logoMask" ref={pathElement}></path>
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#111117"
              mask="url(#logoRevealMask)"
            />
          </svg>
        </div>
        <div className="logo-container" ref={logoContainer}></div>
        <div className="overlay-copy">
          <motion.h1 ref={overlayCopyRef} style={{
             scale: overlayCopyScale,
             opacity: overlayH1Opacity,
             backgroundImage: textGradinet, 
             backgroundClip: "text",
             WebkitBackgroundClip: "text",
             color: "transparent",
             display: "inline-block", 
             WebkitTextFillColor: "transparent", 
          }}>
            Lorem ipsum
            <br />
            dolor sit amet
            <br />
            consectetur adipiscing.
          </motion.h1>
        </div>
      </motion.div>
    </motion.div>
      </div>
    </div>
   
  </section>
  )
}

export default Hero