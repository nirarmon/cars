import { useMemo, useState } from 'react';
import VehicleStep from './components/VehicleStep';
import RequiredPartStep from './components/RequiredPartStep';
import ReplacementOptionsStep from './components/ReplacementOptionsStep';
import RentalCarStep from './components/RentalCarStep';
import WorkshopsStep from './components/WorkshopsStep';
import type { ReplacementOption, Vehicle, RentalCarOption } from './types';

const baseOptions: ReplacementOption[] = [
  { id: 1, origin: 'US', supplyTimeDays: 20, price: 100 },
  { id: 2, origin: 'EU', supplyTimeDays: 10, price: 70 },
  { id: 3, origin: 'IL', supplyTimeDays: 2, price: 120 },
];

function Stepper({ currentStep }: { currentStep: number }) {
  const steps = ['Vehicle', 'Part', 'Options', 'Rental', 'Workshops'];
  return (
    <div className="stepper">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isComplete = currentStep > stepNumber;
        return (
          <div key={label} className={`step ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
            <span className="bubble">{stepNumber}</span>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicle, setVehicle] = useState<Vehicle>({});
  const [requiredPart, setRequiredPart] = useState('');
  const [selectedReplacementOption, setSelectedReplacementOption] = useState<ReplacementOption | null>(null);
  const [hasReplacementOptions, setHasReplacementOptions] = useState(true);
  const [needsRentalCar, setNeedsRentalCar] = useState<boolean | null>(null);
  const [selectedRentalCar, setSelectedRentalCar] = useState<RentalCarOption | null>(null);
  const [location, setLocation] = useState('');

  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Boolean(vehicle.model && vehicle.year);
      case 2:
        return Boolean(requiredPart.trim());
      case 3:
        return Boolean(selectedReplacementOption) && hasReplacementOptions;
      case 4:
        return needsRentalCar !== null;
      case 5:
        return Boolean(location.trim());
      default:
        return false;
    }
  }, [currentStep, vehicle, requiredPart, selectedReplacementOption, hasReplacementOptions, needsRentalCar, location]);

  const handleNext = () => {
    if (currentStep === 4 && needsRentalCar === false) {
      setCurrentStep(5);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <main className="layout">
      <header className="header">
        <div>
          <p className="muted">Auto parts replacement demo</p>
          <h1>Guided repair & replacement flow</h1>
          <p className="muted">This is a demo. All data is mock, except VIN decoding where available.</p>
        </div>
        <div className="progress">
          <p className="muted">
            Step {currentStep} of {totalSteps}
          </p>
          <button className="pill">React + TypeScript</button>
        </div>
      </header>

      <Stepper currentStep={currentStep} />

      {currentStep === 1 && <VehicleStep vehicle={vehicle} onVehicleChange={setVehicle} />}

      {currentStep === 2 && (
        <RequiredPartStep requiredPart={requiredPart} onUpdatePart={setRequiredPart} />
      )}

      {currentStep === 3 && (
        <ReplacementOptionsStep
          vehicle={vehicle}
          requiredPart={requiredPart}
          baseOptions={baseOptions}
          selectedOption={selectedReplacementOption}
          onSelectOption={setSelectedReplacementOption}
          onHasOptionsChange={setHasReplacementOptions}
        />
      )}

      {currentStep === 4 && (
        <RentalCarStep
          needsRentalCar={needsRentalCar}
          onDecision={(decision) => {
            setNeedsRentalCar(decision);
            if (!decision) {
              setSelectedRentalCar(null);
            }
          }}
          selectedReplacementOption={selectedReplacementOption}
          selectedRentalCar={selectedRentalCar}
          onSelectRentalCar={setSelectedRentalCar}
        />
      )}

      {currentStep === 5 && (
        <WorkshopsStep
          vehicle={vehicle}
          requiredPart={requiredPart}
          selectedReplacementOption={selectedReplacementOption}
          needsRentalCar={needsRentalCar}
          selectedRentalCar={selectedRentalCar}
          location={location}
          onUpdateLocation={setLocation}
        />
      )}

      <footer className="nav">
        <button className="secondary" onClick={handleBack} disabled={currentStep === 1}>
          Back
        </button>
        {currentStep < totalSteps ? (
          <button onClick={handleNext} disabled={!isStepValid}>
            Next
          </button>
        ) : (
          <button disabled={!isStepValid}>Finish</button>
        )}
      </footer>
    </main>
  );
}
