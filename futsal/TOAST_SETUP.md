# React Hot Toast Setup Guide - Futsal Owner Dashboard

## Overview
The futsal owner dashboard is now using **react-hot-toast** for all toast notifications. This provides better performance and a cleaner API, with theme-aware styling that respects dark/light mode.

## Installation
✅ `react-hot-toast` is already installed in your project

## Usage

### Option 1: Direct Import (Simple)
```tsx
import toast from 'react-hot-toast';

// Success toast
toast.success('Facility updated!');

// Error toast
toast.error('Failed to save changes!');

// Loading toast
const toastId = toast.loading('Saving...');

// Dismiss a specific toast
toast.dismiss(toastId);
```

### Option 2: Using Custom Hook (Recommended)
```tsx
import { useToast } from '@/hooks/useToast';

const MyComponent = () => {
  const { success, error, loading, dismiss } = useToast();

  const handleSave = async () => {
    const toastId = loading('Saving facility data...');
    
    try {
      await saveFacility();
      success('Facility saved successfully!');
      dismiss(toastId);
    } catch (err) {
      error('Failed to save facility');
      dismiss(toastId);
    }
  };

  return <button onClick={handleSave}>Save</button>;
};
```

## Available Methods

### 1. **toast.success(message, options?)**
Display a success notification (green background)
```tsx
toast.success('Booking confirmed!');
```

### 2. **toast.error(message, options?)**
Display an error notification (red background)
```tsx
toast.error('Could not update pitch availability!');
```

### 3. **toast.loading(message)**
Display a loading notification with spinner (blue background)
```tsx
const id = toast.loading('Processing payment...');
```

### 4. **toast.info(message, options?)**
Display an info notification (cyan background)
```tsx
toast.info('New message received');
```

### 5. **toast.promise(promise, messages)**
Handle async operations with automatic state management
```tsx
toast.promise(
  fetchBookings(),
  {
    loading: 'Loading bookings...',
    success: 'Bookings loaded!',
    error: 'Failed to load bookings'
  }
);
```

### 6. **toast.dismiss(toastId?)**
Dismiss a specific toast or all toasts
```tsx
toast.dismiss();  // Dismiss all
toast.dismiss(toastId);  // Dismiss specific
```

## Theme-Aware Styling

The toaster component automatically adjusts to dark/light theme:
- **Light mode**: White background, dark text
- **Dark mode**: Dark background (#1f2937), light text

All toasts have:
- Position: Top-right
- Duration: 4 seconds (configurable)
- Rounded corners (8px)
- Smooth shadows
- Theme-aware borders

## Common Patterns

### Save with Loading State
```tsx
const handleUpdate = async () => {
  const id = toast.loading('Updating...');
  try {
    await updateFacility(data);
    toast.dismiss(id);
    toast.success('Facility updated!');
  } catch (error) {
    toast.dismiss(id);
    toast.error(error.message || 'Update failed');
  }
};
```

### Async Operation with Promise
```tsx
const handleDelete = (id: string) => {
  toast.promise(
    deletePitch(id),
    {
      loading: 'Deleting pitch...',
      success: 'Pitch deleted successfully!',
      error: 'Failed to delete pitch'
    }
  );
};
```

### Batch Notifications
```tsx
toast.success('3 bookings confirmed');
toast.error('1 booking failed');
// Show multiple toasts in sequence
```

## Files Updated

1. **package.json** - Replaced `sonner` with `react-hot-toast: ^2.6.0`
2. **src/App.tsx** - Updated ThemedToaster component
3. **src/hooks/useToast.ts** - Custom hook for easy usage
4. **All component/page files** - Updated imports:
   - OfflineBookingModal.tsx
   - BookingDetail.tsx
   - FacilityProfile.tsx
   - MediaManagement.tsx
   - Settings.tsx
   - Login.tsx
   - PitchManagement.tsx
   - BookingManagement.tsx
   - Visitors.tsx
   - ContactMessages.tsx

## Troubleshooting

**Toasts not appearing?**
- Ensure `<ThemedToaster />` is rendered in App.tsx (already done)
- Check browser console for errors

**Want different position?**
- Edit `src/App.tsx` and change `position="top-right"` to other values like `top-left`, `bottom-right`, etc.

**Need custom styling?**
- Edit `src/hooks/useToast.ts` to customize colors, fonts, or styling
