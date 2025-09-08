# Refresh Button Component

A reusable refresh button component built on top of the `MetaButton` component, providing consistent styling and behavior across the application.

## Features

- ✅ Built on top of `MetaButton` for consistent styling
- ✅ Loading states with customizable loading text and animations
- ✅ Multiple size options (sm, md, lg)
- ✅ Multiple variant options (primary, secondary, outline, ghost, etc.)
- ✅ Tooltip support
- ✅ Icon customization (can hide/show refresh icon)
- ✅ Disabled state support
- ✅ TypeScript support with full type safety

## Usage

### Basic Usage

```tsx
import { RefreshButton } from '@/components/buttons/refresh-button'

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    // Your refresh logic here
    await fetchData()
    setIsLoading(false)
  }

  return (
    <RefreshButton
      onRefresh={handleRefresh}
      isLoading={isLoading}
    />
  )
}
```

### Advanced Usage

```tsx
<RefreshButton
  onRefresh={handleRefresh}
  isLoading={isLoading}
  text="Reload Data"
  size="lg"
  variant="primary-outline"
  tooltip="Click to refresh all data from server"
  loadingText="Refreshing data..."
  width="fit"
  className="custom-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRefresh` | `() => void` | **required** | Function to call when refresh button is clicked |
| `isLoading` | `boolean` | `false` | Whether the refresh operation is currently loading |
| `text` | `string` | `"Refresh"` | Custom text for the button |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button size |
| `variant` | `MetaButtonProps['variant']` | `"primary-outline"` | Button variant |
| `width` | `"auto" \| "fit" \| "full"` | `"auto"` | Button width |
| `className` | `string` | - | Additional CSS classes |
| `tooltip` | `string` | `"Refresh data"` | Tooltip text |
| `showIcon` | `boolean` | `true` | Whether to show the refresh icon |
| `loadingText` | `string` | `"Refreshing..."` | Loading text when refreshing |
| `disabled` | `boolean` | `false` | Disable the button |

## Examples

### Different Sizes

```tsx
<RefreshButton onRefresh={handleRefresh} size="sm" text="Refresh" />
<RefreshButton onRefresh={handleRefresh} size="md" text="Refresh" />
<RefreshButton onRefresh={handleRefresh} size="lg" text="Refresh" />
```

### Different Variants

```tsx
<RefreshButton onRefresh={handleRefresh} variant="primary" text="Refresh" />
<RefreshButton onRefresh={handleRefresh} variant="primary-outline" text="Refresh" />
<RefreshButton onRefresh={handleRefresh} variant="primary-ghost" text="Refresh" />
<RefreshButton onRefresh={handleRefresh} variant="secondary" text="Refresh" />
<RefreshButton onRefresh={handleRefresh} variant="success-outline" text="Refresh" />
```

### With Custom Loading States

```tsx
<RefreshButton
  onRefresh={handleRefresh}
  isLoading={isLoading}
  loadingText="Updating data..."
  text="Refresh Data"
/>
```

### Without Icon

```tsx
<RefreshButton
  onRefresh={handleRefresh}
  showIcon={false}
  text="Refresh"
/>
```

### With Tooltip

```tsx
<RefreshButton
  onRefresh={handleRefresh}
  tooltip="Click to refresh all data from the server"
  text="Refresh"
/>
```

## Integration Examples

### In a Card Header

```tsx
<CardHeader>
  <div className="flex justify-between items-center">
    <CardTitle>Data List</CardTitle>
    <RefreshButton
      onRefresh={handleRefresh}
      isLoading={loading}
      size="sm"
      variant="primary-outline"
    />
  </div>
</CardHeader>
```

### In a Toolbar

```tsx
<div className="flex items-center space-x-2">
  <RefreshButton
    onRefresh={handleRefresh}
    isLoading={loading}
    size="sm"
    variant="ghost"
    text="Reload"
  />
  <Button>Export</Button>
  <Button>Import</Button>
</div>
```

### In a Dashboard

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Recent Activity</CardTitle>
        <RefreshButton
          onRefresh={refreshActivity}
          isLoading={activityLoading}
          size="sm"
        />
      </div>
    </CardHeader>
    {/* Card content */}
  </Card>
</div>
```

## Styling

The component inherits all styling from `MetaButton`, so you can use any of the MetaButton styling options:

- **Variants**: primary, secondary, success, warning, danger, and their outline/ghost variants
- **Sizes**: sm (32px), md (40px), lg (48px)
- **Width**: auto, fit, full
- **Custom classes**: via `className` prop

## Accessibility

- Full keyboard navigation support
- Screen reader friendly
- Proper ARIA attributes
- Focus management
- Loading state announcements

## Dependencies

- `MetaButton` component
- `Icons.refresh` (RotateCcw from Lucide React)
- React hooks (useState, useEffect)
