# Custom Domain & Futsal Name Routing Setup

## Frontend Implementation ✅

The frontend is now configured to support accessing futsals by name or custom domain:

### URL Patterns Supported:

1. **By ID (existing)**
   - `localhost:3001/futsals/1` → Futsal details
   - `localhost:3001/futsals/1/bookings` → Bookings
   - `localhost:3001/futsals/1/reviews` → Reviews
   - `localhost:3001/futsals/1/gallery` → Gallery

2. **By Futsal Name (new)**
   - `localhost:3001/elite-sports-arena` → Futsal details
   - `localhost:3001/elite-sports-arena/bookings` → Bookings
   - `localhost:3001/elite-sports-arena/reviews` → Reviews
   - `localhost:3001/elite-sports-arena/gallery` → Gallery

3. **By Custom Domain (new)**
   - `localhost:3001/myfutsal.com` → Futsal details
   - `localhost:3001/myfutsal.com/bookings` → Bookings
   - `localhost:3001/myfutsal.com/reviews` → Reviews
   - `localhost:3001/myfutsal.com/gallery` → Gallery

### How It Works:

1. **FutsalResolver Component** (`FutsalResolver.tsx`)
   - Accepts a slug (can be ID, futsal name, or custom domain)
   - Detects page type from URL path (details/bookings/reviews/gallery)
   - Tries to resolve slug as numeric ID first
   - Falls back to name/domain lookup
   - Redirects to ID-based URL internally

2. **API Functions** (`futsalApi.ts`)
   - `getFutsalById(id)` - Existing function
   - `getFutsalByName(name)` - New function for name/domain lookup

## Backend Implementation Needed ❌

You need to add this endpoint to your backend:

### Endpoint: `GET /futsal/name/:slug`

This endpoint should:
1. Accept a slug parameter (futsal name or custom domain)
2. Look up futsal by:
   - Matching against futsal name
   - Matching against custom domain
3. Return the futsal details (same format as `/futsal/:id`)

### Example Backend Implementation (Express.js):

```javascript
router.get('/futsal/name/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const normalizedSlug = slug.toLowerCase().trim();

    // Try to find by futsal name (fuzzy match or exact match)
    let futsal = await Footsal.findOne({
      where: {
        futsalName: {
          [Op.like]: `%${normalizedSlug}%`
        }
      }
    });

    // If not found, try custom domain
    if (!futsal) {
      const customDomain = await CustomDomain.findOne({
        where: { domain: normalizedSlug }
      });
      
      if (customDomain) {
        futsal = await Footsal.findByPk(customDomain.futsalId);
      }
    }

    if (!futsal) {
      return res.status(404).json({
        success: false,
        message: 'Futsal not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: futsal
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

## Testing

Once backend endpoint is ready, you can test:

```bash
# Get futsal by ID
curl http://localhost:3001/futsals/1

# Get futsal by name
curl http://localhost:3001/elite-sports-arena

# Get futsal by custom domain
curl http://localhost:3001/myfutsal.com
```

## Files Modified

- ✅ `/users/src/App.tsx` - Added slug-based routes
- ✅ `/users/src/pages/FutsalResolver.tsx` - Created resolver component
- ✅ `/users/src/lib/futsalApi.ts` - Added `getFutsalByName()` function
