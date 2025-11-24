import type { RentalCarOption, ReplacementOption } from '../types';

interface RentalCarStepProps {
  needsRentalCar: boolean | null;
  onDecision: (needsCar: boolean) => void;
  selectedReplacementOption: ReplacementOption | null;
  selectedRentalCar: RentalCarOption | null;
  onSelectRentalCar: (car: RentalCarOption | null) => void;
}

const rentalOptions: RentalCarOption[] = [
  { model: 'Toyota Corolla', pricePerDay: 55, availability: 'Comfortable sedan' },
  { model: 'Hyundai i20', pricePerDay: 42, availability: 'Compact and efficient' },
  { model: 'Kia Picanto', pricePerDay: 38, availability: 'Great for city driving' },
  { model: 'Mazda 3', pricePerDay: 60, availability: 'Modern hatchback' },
  { model: 'Honda HR-V', pricePerDay: 70, availability: 'Small crossover' },
];

export default function RentalCarStep({
  needsRentalCar,
  onDecision,
  selectedReplacementOption,
  selectedRentalCar,
  onSelectRentalCar,
}: RentalCarStepProps) {
  const supplyDays = selectedReplacementOption?.supplyTimeDays ?? 0;

  return (
    <div className="card">
      <h2>Step 4: Replacement car (optional)</h2>
      <p className="muted">Do you need a rental while your car is waiting for the part?</p>
      <div className="chip-row">
        <button
          type="button"
          className={`chip ${needsRentalCar === true ? 'active' : ''}`}
          onClick={() => onDecision(true)}
        >
          Yes, show rental options
        </button>
        <button
          type="button"
          className={`chip ${needsRentalCar === false ? 'active' : ''}`}
          onClick={() => onDecision(false)}
        >
          No, I can wait
        </button>
      </div>

      {needsRentalCar && (
        <div className="rental-grid">
          {rentalOptions.map((option) => (
            <label key={option.model} className={`option-card ${selectedRentalCar?.model === option.model ? 'selected' : ''}`}>
              <input
                type="radio"
                name="rental-option"
                checked={selectedRentalCar?.model === option.model}
                onChange={() => onSelectRentalCar(option)}
              />
              <div>
                <p className="strong">{option.model}</p>
                <p className="muted">${option.pricePerDay} per day</p>
              </div>
              <p className="muted">Available for up to {supplyDays || 'several'} days.</p>
              <p className="muted small">{option.availability}</p>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
