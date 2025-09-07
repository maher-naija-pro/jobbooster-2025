# GradientButton Component

A customizable gradient button component with loading states, disabled states, and hover effects.

## Features

- **Gradient Background**: Beautiful gradient backgrounds with multiple color variants
- **Loading State**: Animated spinner with customizable loading text
- **Disabled State**: Properly handles disabled state with visual feedback
- **Hover Effects**: Smooth color transitions and shadow effects on hover
- **Accessibility**: Full keyboard navigation and screen reader support
- **Multiple Variants**: Default, success, warning, and danger variants
- **Multiple Sizes**: Small, medium, and large sizes

## Usage

```tsx
import { GradientButton } from '@/components/ui/gradient-button'

// Basic usage
<GradientButton onClick={handleClick}>
  Click me
</GradientButton>

// With loading state
<GradientButton 
  isLoading={true} 
  loadingText="Processing..."
  onClick={handleClick}
>
  Save Changes
</GradientButton>

// With disabled state
<GradientButton 
  disabled={true}
  onClick={handleClick}
>
  Disabled Button
</GradientButton>

// Different variants
<GradientButton variant="success">Success</GradientButton>
<GradientButton variant="warning">Warning</GradientButton>
<GradientButton variant="danger">Danger</GradientButton>

// Different sizes
<GradientButton size="sm">Small</GradientButton>
<GradientButton size="md">Medium</GradientButton>
<GradientButton size="lg">Large</GradientButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Button content |
| `isLoading` | `boolean` | `false` | Shows loading spinner and disables button |
| `loadingText` | `string` | `"Loading..."` | Text to show during loading |
| `disabled` | `boolean` | `false` | Disables the button |
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Button color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |

## Design

The button features a gradient background that matches the design from the provided image:
- **Default**: Blue to purple gradient (`from-blue-500 to-purple-600`)
- **Success**: Green to emerald gradient
- **Warning**: Yellow to orange gradient  
- **Danger**: Red to pink gradient

Hover effects include:
- Darker gradient colors
- Enhanced shadow with color tinting
- Smooth transitions

## Accessibility

- Proper `aria-disabled` attribute when disabled
- Focus-visible ring for keyboard navigation
- Screen reader friendly loading states
- Semantic button element
