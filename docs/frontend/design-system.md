# Design System & Styling Tokens

## Theme Variables & Tokens

ContentPilot AI adheres to a dark-mode ready design token architecture inspired by modern enterprise design systems:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
```

## Typography & Components

- **Typography**: Inter / Outfit sans-serif typeface hierarchy.
- **Micro-Animations**: Framer-motion transitions for step timelines and streaming text cursors.
- **Badges & Indicators**:
  - `DRAFT`: Amber badge
  - `PUBLISHED`: Emerald badge
  - `ARCHIVED`: Slate badge
