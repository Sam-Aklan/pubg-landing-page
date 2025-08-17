import { useEffect, useRef } from 'react'
import { pubgPath } from "./PubgText";
import {
  useScroll,
  useTransform,
  motion,
  useMotionTemplate,
  easeInOut,
} from "framer-motion";
import { debounce } from '../utils';

const Hero = () => {
    const logoContainer = useRef<HTMLDivElement>(null);
  const pathElement = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const overlayCopyRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (!pathElement.current || !logoContainer.current || !overlayCopyRef.current) return;
   
    const updateLogoPosition = () => {
      let screenScaleFactor = 0
      pathElement.current?.setAttribute("d", pubgPath);
      const logoDimensions = logoContainer.current!.getBoundingClientRect();
      const logoBoundingBox = pathElement.current!.getBBox();
      if(window.innerWidth > 1440){screenScaleFactor = (window.innerWidth  - (1440 + window.innerWidth * .15)) }
      // Calculate scaling factor
      const horizontalScaleRatio = logoDimensions.width / logoBoundingBox.width;
      const verticalScaleRatio = logoDimensions.height / logoBoundingBox.height;
      const logoScaleFactor = Math.min(horizontalScaleRatio, verticalScaleRatio);
     
     
    
      pathElement.current?.setAttribute(
        "transform",
        `translate(${logoDimensions.left - screenScaleFactor}, ${logoDimensions.top}) scale(${horizontalScaleRatio},${verticalScaleRatio})`
      );
     
    };
  
   
  const debouncedUpdate = debounce(updateLogoPosition, 100);
  updateLogoPosition(); 
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
    }else return 1.05
  })
  const overlayScale = useTransform(scrollYProgress,(progress)=>{
    if (progress <.85) {
      const normalizedProgress = progress * (1 /.85)
      const overlayScale = 350 * Math.pow(1/350,normalizedProgress)
      return overlayScale
    }
    return 1;
  })

  const fadeOverlayOpacity = useTransform(scrollYProgress,(progress)=>{
    if(progress > .25){
      return Math.min(1,(progress - .25) * (1/.4))
    }else return 0
  })

 

  const gradientBottomPosition = useTransform(
    scrollYProgress,
    [0.6, 0.85], 
    [240, -40], 
    {
      ease: easeInOut 
    }
  );
  
  const gradientTopPosition = useTransform(
    scrollYProgress,
    [0.6, 0.85],
    [140, -140], 
    {
      ease: easeInOut
    }
  );

 const overlayCopyScale = useTransform(scrollYProgress,progress=>{
    if(progress >.6 && progress <.85){
      const overlayCopyRevealProgress = (progress - .6) *(1/.25)
      const overlayCopyScale = 1.25 -.25 * overlayCopyRevealProgress
      return overlayCopyScale
  } return 1
  })
  const textGradinet = useMotionTemplate `linear-gradient(to bottom, #111117 0%, #668cb7 ${gradientTopPosition}%, #d4b949 ${gradientBottomPosition}%, #d4b949 100%)`

 
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
        <motion.div className="overlay"
        style={
          {scale:overlayScale,
            position:'absolute',
          }
        }>
          <svg className="w-full h-full absolute inset-0">
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
        </motion.div>
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