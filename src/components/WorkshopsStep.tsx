import type { ReplacementOption, Vehicle, RentalCarOption } from '../types';

interface WorkshopsStepProps {
  vehicle: Vehicle;
  requiredPart: string;
  selectedReplacementOption: ReplacementOption | null;
  needsRentalCar: boolean | null;
  selectedRentalCar: RentalCarOption | null;
  location: string;
  onUpdateLocation: (location: string) => void;
}

const buildWorkshops = (location: string) => {
  const city = location || 'your area';
  return [
    { name: `${city} AutoFix`, description: `Downtown ${city}`, rate: 350 },
    { name: `Premium Garage ${city}`, description: `2 km away from ${city}`, rate: 420 },
    { name: `${city} QuickRepair`, description: `Near main road in ${city}`, rate: 280 },
  ];
};

export default function WorkshopsStep({
  vehicle,
  requiredPart,
  selectedReplacementOption,
  needsRentalCar,
  selectedRentalCar,
  location,
  onUpdateLocation,
}: WorkshopsStepProps) {
  const workshops = buildWorkshops(location || 'your area');

  return (
    <div className="card">
      <h2>Step 5: Workshops near you</h2>
      <p className="muted">Share where the car is located so we can suggest nearby workshops.</p>

      <label className="form-field">
        <span>Your city or area</span>
        <input value={location} onChange={(e) => onUpdateLocation(e.target.value)} placeholder="e.g., Tel Aviv" />
      </label>

      <div className="workshop-grid">
        {workshops.map((shop) => (
          <div key={shop.name} className="option-card">
            <p className="strong">{shop.name}</p>
            <p className="muted">{shop.description}</p>
            <p className="muted">Hourly labor: ₪{shop.rate}</p>
          </div>
        ))}
      </div>

      <div className="summary">
        <h3>Summary</h3>
        <p className="muted">This is a demo. All data is mock, except VIN decoding where available.</p>
        <ul>
          <li>
            Vehicle: {vehicle.year || 'Year?'} {vehicle.make || 'Make?'} {vehicle.model || 'Model?'}
          </li>
          <li>Required part: {requiredPart || 'Not specified yet'}</li>
          <li>
            Selected option: {selectedReplacementOption
              ? `${selectedReplacementOption.origin} origin · ${selectedReplacementOption.supplyTimeDays} days · $${selectedReplacementOption.price}`
              : 'No option selected'}
          </li>
          <li>Rental car: {needsRentalCar ? selectedRentalCar?.model || 'Needed, not selected' : 'Not requested'}</li>
          <li>Location: {location || 'Not provided yet'}</li>
        </ul>
      </div>
    </div>
  );
}
