# Auto parts replacement demo

A lightweight React + TypeScript single-page wizard that guides users through identifying a vehicle, picking a needed part, choosing a replacement option, optionally arranging a rental car, and finding nearby workshops. All data is mocked except VIN decoding, which attempts to use the public NHTSA API before falling back to demo data.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL to interact with the flow. Run `npm run build` to produce a production bundle.

## Features

- VIN decoding that auto-fills make, model, and year (with a demo fallback if the API is unavailable)
- Vehicle photo preview and detected vehicle summary
- Required part capture via free text or common part dropdown
- Three fixed replacement options with filters for price, origin, and max supply time
- Required selection of a visible replacement option to proceed
- Optional rental car choices sized to the selected supply time
- Workshop suggestions tailored to the user-provided location with a final summary of selections

## Notes

This project is a demo and uses mock data for everything except VIN decoding. UI is intentionally minimal and self-contained—no backend or external styling frameworks are required.
