import * as React from "react";
import Slider from "./slider";
import { useState, useEffect } from "react";

import {
  motion,
  transform,
  AnimatePresence,
  useAnimation
} from "framer-motion";

interface Props {
  currentAge: number;
  yearlyContribution: number;
  initialPrinciple: number;
}

const calculateInterest = (
  initialPrinciple: number,
  interestRate: number,
  numTimePeriodsElapsed: number
) => {
  return (
    //----------------
    initialPrinciple * Math.pow(1 + interestRate, numTimePeriodsElapsed) -
    initialPrinciple
  );
};

const calculateCash = (
  initialPrinciple: number,
  yearlyContribution: number,
  yearMultiplier: number
) => {
  return initialPrinciple + yearMultiplier * yearlyContribution;
};

const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const darkBlue = "#272640";
const topOffset = 100;
const bottomOffset = 60;
//----------------
const maxBarHeight = window.innerHeight * 0.8 - bottomOffset;

export function AxisLabel({ age, x, fixed }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: "205px",
        x: x - 4 + "px",
        fontSize: "12px",
        fontWeight: 300,
        color: "white"
      }}
      initial={{
        scale: 0.8
      }}
      animate={{
        scale: !fixed ? 1.6 : 1
      }}
      exit={{
        scale: 0.8
      }}
    >
      <span>{age}</span>
    </motion.div>
  );
}

export function InnerBar({ h, tint: color }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: "100%",
        height: h + "px",
        y: 200 - h,
        background: color
      }}
    />
  );
}

export function Bar({ isSelected, x, totalH: h, cashH: ch, width }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: width,
        x: x + "px",
        borderRadius: "3px 3px 0 0"
      }}
      initial={{
        scaleX: 1,
        opacity: 0.8
      }}
      animate={{
        scaleX: isSelected ? 2.5 : 1,
        opacity: isSelected ? 1 : 0.8
      }}
    >
      <InnerBar h={h} tint={"turquoise"} />
      <InnerBar h={ch} tint={"turquoise"} />
    </motion.div>
  );
}

export function AgeBars(props) {
  const { currentAge, yearlyContribution, initialPrincipal } = props;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const controls = useAnimation();

  const selectOnLoad = (index) => {
    controls.start({ x: index * (w + spacer) - spacer / 2 + 4 }).then(() => {
      setSelectedIndex(index);
      controls.stop();
    });
  };

  const numberOfYears = 80 - currentAge;
  const arr = new Array(numberOfYears)
    .fill(0)
    .map((d, i) =>
      calculateInterest(initialPrincipal + i * yearlyContribution, 0.04, i)
    );
  const totalWidth = window.innerWidth - 32 * 2;
  const w = totalWidth / arr.length / 3;
  const spacer = totalWidth / arr.length - w;
  const offset = 16 + spacer - w;
  // const offset = 0;

  // Event handlers
  const handleDrag = (e, info) => {
    const index = Math.floor((info.point.x - offset) / (w + spacer));
    setSelectedIndex(index);
  };
  const handleDragEnd = (e, info) => {
    const index = Math.floor((info.point.x - offset) / (w + spacer));
    setSelectedIndex(index <= 0 ? 0 : index >= 42 ? 42 : index);
    controls.start({
      x: index * (w + spacer) - spacer / w
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const index = 30;
      selectOnLoad(index);
    }, 500);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute",
        fontFamily: "Avenir, Helvetica, sans-serif",
        width: "100%",
        height: "100%",
        background: "white",
        padding: 0,
        margin: 0,
        top: 0,
        left: 0
      }}
    >
      <div style={{ width: "100%", height: 400, background: darkBlue }}>
        {arr.map((d, i) => {
          const h = transform(d, [initialPrincipal, 800000], [0, 200]);
          const cashContributed = calculateCash(
            initialPrincipal,
            yearlyContribution,
            i
          );
          const cashH = transform(
            cashContributed,
            [initialPrincipal, 800000],
            [0, 200]
          );
          const age = currentAge + i;
          const xPos = 32 + i * (w + spacer);
          return (
            <div
              key={`ineinei_` + i}
              style={{ position: "absolute", top: 80, width: w }}
            >
              <Bar
                isSelected={selectedIndex === i}
                x={xPos}
                totalH={h}
                cashH={cashH}
                width={w}
              />
              {/* age label */}
              {i % 5 === 0 &&
                i !== selectedIndex + 1 &&
                i !== selectedIndex - 1 &&
                i !== selectedIndex && (
                  <AxisLabel key={`inebnei_` + i} age={age} x={xPos} fixed />
                )}
              {i === selectedIndex && (
                <AxisLabel
                  key={`ineinuh_` + i}
                  age={age}
                  x={xPos}
                  fixed={false}
                />
              )}
            </div>
          );
        })}
        {/* drag handle */}
        <motion.div
          style={{
            position: "absolute",
            y: 90,
            left: offset,
            width: 30,
            height: 30,
            borderRadius: "50%"
          }}
          drag="x"
          dragConstraints={{ left: 0, right: totalWidth }}
          animate={controls}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          <motion.div
            style={{
              position: "absolute",
              top: 4,
              left: -2,
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "2px solid turquoise"
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              left: 12,
              top: 25,
              width: 7,
              height: 161,
              background: "turquoise",
              borderRadius: 3
            }}
          />
        </motion.div>
        <AnimatePresence>
          {selectedIndex > 0 && selectedIndex < 43 && (
            <motion.div
              initial={{
                y: -100
              }}
              animate={{
                y: 0
              }}
              exit={{
                y: -100
              }}
              style={{
                position: "absolute",
                top: 10,
                width: totalWidth,
                height: "30px",
                originX: 1,
                originY: 0,
                x: 32 + 250,
                textAlign: "center",
                fontWeight: 700,
                fontSize: 24,
                color: "White"
              }}
            >
              {"$" + numberWithCommas(Math.floor(arr[selectedIndex]))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <Slider />
      </div>
    </motion.div>
  );
}

AgeBars.defaultProps = {
  currentAge: 37,
  yearlyContribution: 3650,
  initialPrincipal: 3000
};
