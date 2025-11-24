interface RequiredPartStepProps {
  requiredPart: string;
  onUpdatePart: (part: string) => void;
}

const commonParts = ['Brake pads', 'Oil filter', 'Front bumper', 'Air filter', 'Windshield'];

export default function RequiredPartStep({ requiredPart, onUpdatePart }: RequiredPartStepProps) {
  return (
    <div className="card">
      <h2>Step 2: Required part</h2>
      <p className="muted">Tell us which part you need so we can find replacement options.</p>
      <div className="form-grid">
        <label className="form-field">
          <span>Describe the part</span>
          <input
            value={requiredPart}
            placeholder="e.g., Front left headlight"
            onChange={(e) => onUpdatePart(e.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Or choose from common parts</span>
          <select value={requiredPart} onChange={(e) => onUpdatePart(e.target.value)}>
            <option value="">Select a part</option>
            {commonParts.map((part) => (
              <option key={part} value={part}>
                {part}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
