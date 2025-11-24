import { useEffect, useMemo, useState } from 'react';
import type { Vehicle } from '../types';

interface VehicleStepProps {
  vehicle: Vehicle;
  onVehicleChange: (vehicle: Vehicle) => void;
}

type Status = { message: string; tone: 'success' | 'error' | 'info' } | null;

const carImages: Record<string, string> = {
  'toyota-corolla':
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=900&q=80',
  'honda-civic':
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
  'ford-focus':
    'https://images.unsplash.com/photo-1502877828070-33e293ef3c5a?auto=format&fit=crop&w=900&q=80',
};

const getCarImage = (make?: string, model?: string) => {
  const key = `${(make || '').toLowerCase()}-${(model || '').toLowerCase()}`;
  return (
    carImages[key] ||
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=900&q=80'
  );
};

async function decodeVin(vin: string): Promise<{ make: string; model: string; year: number } | null> {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${encodeURIComponent(vin)}?format=json`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  const result = data?.Results?.[0];
  const make = result?.Make;
  const model = result?.Model;
  const year = Number(result?.ModelYear);
  if (make && model && year) {
    return { make, model, year };
  }
  return null;
}

export default function VehicleStep({ vehicle, onVehicleChange }: VehicleStepProps) {
  const [vinInput, setVinInput] = useState(vehicle.vin || '');
  const [status, setStatus] = useState<Status>(null);
  const [isDecoding, setIsDecoding] = useState(false);

  useEffect(() => {
    onVehicleChange({ ...vehicle, vin: vinInput });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vinInput]);

  const manualUpdate = (field: keyof Vehicle, value: string) => {
    const updatedVehicle = { ...vehicle, [field]: value };
    if (field === 'year') {
      updatedVehicle.year = value ? Number(value) : undefined;
    }
    onVehicleChange(updatedVehicle);
  };

  const handleDecode = async () => {
    if (!vinInput.trim()) return;
    setIsDecoding(true);
    setStatus(null);
    try {
      const decoded = await decodeVin(vinInput.trim());
      if (decoded) {
        onVehicleChange({ vin: vinInput.trim(), ...decoded });
        setStatus({
          message: 'VIN decoded via NHTSA vehicle API.',
          tone: 'success',
        });
        return;
      }
      setStatus({
        message: 'Could not decode VIN from the API. Loaded demo values instead.',
        tone: 'error',
      });
      onVehicleChange({
        vin: vinInput.trim(),
        make: 'Toyota',
        model: 'Corolla',
        year: 2018,
      });
    } catch (err) {
      console.error('VIN decode failed', err);
      setStatus({
        message: 'VIN decoding failed. Using demo vehicle details for now.',
        tone: 'error',
      });
      onVehicleChange({
        vin: vinInput.trim(),
        make: 'Toyota',
        model: 'Corolla',
        year: 2018,
      });
    } finally {
      setIsDecoding(false);
    }
  };

  const vehicleSummary = useMemo(() => {
    if (vehicle.make && vehicle.model && vehicle.year) {
      return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    }
    return '';
  }, [vehicle]);

  return (
    <div className="card">
      <h2>Step 1: Vehicle identification</h2>
      <p className="muted">Enter your VIN or fill in the vehicle details manually.</p>
      <div className="form-grid">
        <label className="form-field">
          <span>VIN / מספר שילדה</span>
          <div className="vin-row">
            <input
              value={vinInput}
              onChange={(e) => setVinInput(e.target.value)}
              placeholder="e.g., 1HGCM82633A123456"
            />
            <button type="button" className="secondary" onClick={handleDecode} disabled={isDecoding}>
              {isDecoding ? 'Decoding...' : 'Decode VIN'}
            </button>
          </div>
        </label>
        <label className="form-field">
          <span>Make / Brand</span>
          <input
            value={vehicle.make || ''}
            placeholder="e.g., Toyota"
            onChange={(e) => manualUpdate('make', e.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Model</span>
          <input
            value={vehicle.model || ''}
            placeholder="e.g., Corolla"
            onChange={(e) => manualUpdate('model', e.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Year</span>
          <input
            type="number"
            value={vehicle.year?.toString() || ''}
            placeholder="e.g., 2019"
            onChange={(e) => manualUpdate('year', e.target.value)}
            min={1990}
            max={2030}
          />
        </label>
      </div>
      {status && <div className={`status ${status.tone}`}>{status.message}</div>}
      {vehicleSummary && (
        <div className="vehicle-summary">
          <div>
            <p className="muted">Detected vehicle</p>
            <p className="vehicle-title">{vehicleSummary}</p>
          </div>
          <img src={getCarImage(vehicle.make, vehicle.model)} alt="Detected vehicle" />
        </div>
      )}
    </div>
  );
}
