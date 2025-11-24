import { useEffect, useMemo, useState } from 'react';
import type { Filters, ReplacementOption, Vehicle } from '../types';

interface ReplacementOptionsStepProps {
  vehicle: Vehicle;
  requiredPart: string;
  baseOptions: ReplacementOption[];
  selectedOption: ReplacementOption | null;
  onSelectOption: (option: ReplacementOption | null) => void;
  onHasOptionsChange: (hasOptions: boolean) => void;
}

const defaultFilters: Filters = {
  priceMin: undefined,
  priceMax: undefined,
  origins: [],
  maxSupplyTime: undefined,
};

export default function ReplacementOptionsStep({
  vehicle,
  requiredPart,
  baseOptions,
  selectedOption,
  onSelectOption,
  onHasOptionsChange,
}: ReplacementOptionsStepProps) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsScanning(false), 600);
    return () => clearTimeout(timeout);
  }, []);

  const filteredOptions = useMemo(() => {
    return baseOptions.filter((option) => {
      if (filters.priceMin !== undefined && option.price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && option.price > filters.priceMax) return false;
      if (filters.maxSupplyTime !== undefined && option.supplyTimeDays > filters.maxSupplyTime) return false;
      if (filters.origins.length && !filters.origins.includes(option.origin)) return false;
      return true;
    });
  }, [baseOptions, filters]);

  useEffect(() => {
    onHasOptionsChange(filteredOptions.length > 0);
    if (selectedOption && !filteredOptions.find((opt) => opt.id === selectedOption.id)) {
      onSelectOption(null);
    }
  }, [filteredOptions, onHasOptionsChange, onSelectOption, selectedOption]);

  const updateFilter = (key: keyof Filters, value: number | string[] | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleOrigin = (origin: string) => {
    setFilters((prev) => {
      const exists = prev.origins.includes(origin);
      const origins = exists ? prev.origins.filter((o) => o !== origin) : [...prev.origins, origin];
      return { ...prev, origins };
    });
  };

  const clearFilters = () =>
    setFilters({ priceMin: undefined, priceMax: undefined, origins: [], maxSupplyTime: undefined });

  return (
    <div className="card">
      <h2>Step 3: Replacement options</h2>
      <p className="muted">
        Replacement options for {requiredPart || 'your part'} for your {vehicle.year || '...'}{' '}
        {vehicle.make || ''} {vehicle.model || ''}.
      </p>

      <div className="filters">
        <div className="filter-group">
          <label>
            <span>Price min ($)</span>
            <input
              type="number"
              value={filters.priceMin ?? ''}
              onChange={(e) => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
            />
          </label>
          <label>
            <span>Price max ($)</span>
            <input
              type="number"
              value={filters.priceMax ?? ''}
              onChange={(e) => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
            />
          </label>
        </div>
        <div className="filter-group">
          <span>Origin</span>
          <div className="chip-row">
            {['US', 'EU', 'IL'].map((origin) => (
              <button
                key={origin}
                type="button"
                className={`chip ${filters.origins.includes(origin) ? 'active' : ''}`}
                onClick={() => toggleOrigin(origin)}
              >
                {origin}
              </button>
            ))}
            <button type="button" className="chip" onClick={clearFilters}>
              All
            </button>
          </div>
        </div>
        <div className="filter-group">
          <label>
            <span>Max supply time (days)</span>
            <input
              type="number"
              value={filters.maxSupplyTime ?? ''}
              onChange={(e) => updateFilter('maxSupplyTime', e.target.value ? Number(e.target.value) : undefined)}
            />
          </label>
        </div>
      </div>

      {isScanning ? (
        <div className="status info">Scanning for replacement parts...</div>
      ) : filteredOptions.length === 0 ? (
        <div className="status warning">No options match your filters. Adjust price, origin, or supply time.</div>
      ) : null}

      <div className="options-grid">
        {filteredOptions.map((option) => (
          <label key={option.id} className={`option-card ${selectedOption?.id === option.id ? 'selected' : ''}`}>
            <input
              type="radio"
              name="replacement-option"
              checked={selectedOption?.id === option.id}
              onChange={() => onSelectOption(option)}
            />
            <div>
              <p className="muted">Origin</p>
              <p className="strong">{option.origin}</p>
            </div>
            <div>
              <p className="muted">Supply time</p>
              <p className="strong">{option.supplyTimeDays} days</p>
            </div>
            <div>
              <p className="muted">Price</p>
              <p className="strong">${option.price}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
