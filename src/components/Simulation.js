// simulation.js
export const simulateWaterFlow = (
    waterUnitsAtA,
    setWaterUnitsAtA,
    setWaterUnitsAtB,
    setWaterUnitsAtC,
    setWaterUnitsAtD
  ) => {
    if (waterUnitsAtA.length > 0) {
      const unit = waterUnitsAtA.pop();
      setWaterUnitsAtA([...waterUnitsAtA]);
  
      if (waterUnitsAtA.length > 4) {
        setWaterUnitsAtB((prevUnits) => (prevUnits.length < 5 ? [...prevUnits, 1] : prevUnits));
        setWaterUnitsAtC((prevUnits) => (prevUnits.length < 5 ? [...prevUnits, 1] : prevUnits));
      } else {
        setTimeout(() => {
          setWaterUnitsAtB([]);
          setWaterUnitsAtC([]);
          setWaterUnitsAtD((prevUnits) => (prevUnits.length < 10 ? [...prevUnits, 1] : prevUnits));
        }, 2000);
      }
    }
  };
  