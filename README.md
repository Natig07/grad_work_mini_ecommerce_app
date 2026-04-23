# Mini E-Commerce Rendering Comparison

A Next.js 14+ application demonstrating the performance differences between **Client-Side Rendering (CSR)**, **Server-Side Rendering (SSR)**, and **Edge Rendering** with real product data from an external API.

## Features

- 🎯 **Three Rendering Strategies**: Compare CSR, SSR, and Edge rendering side-by-side
- 📦 **Real Product Data**: Integrated with external e-commerce API (50 products)
- 🖼️ **Product Detail Pages**: Individual product pages for each rendering strategy
- 📊 **Performance Metrics**: Measure TTFB, FCP, LCP, and TTI
- 📝 **Console Logging**: Detailed timing information for analysis
- 🔄 **Artificial Network Delay**: 500-800ms delay simulates real-world latency

## Project Structure

```
/app
  /api/products                 # API endpoint that fetches external product data
  /csr/products                 # Client-Side Rendering pages
    /page.tsx                   # CSR product list
    /[id]/page.tsx              # CSR product detail
  /ssr/products                 # Server-Side Rendering pages
    /page.tsx                   # SSR product list
    /[id]/page.tsx              # SSR product detail
  /edge/products                # Edge Runtime pages
    /page.tsx                   # Edge product list
    /[id]/page.tsx              # Edge product detail
  page.tsx                      # Homepage with navigation
/components
  ProductCard.tsx               # Individual product display with link
  ProductGrid.tsx               # Product grid with smart routing
  Loader.tsx                    # Loading spinner for CSR
  PageHeader.tsx                # Page header component
/types
  product.ts                    # TypeScript interfaces
```

## Rendering Strategies

### 1. Client-Side Rendering (CSR)
- **Routes**: `/csr/products` and `/csr/products/[id]`
- **Implementation**: Uses `useEffect()` to fetch data in the browser
- **Characteristics**:
  - Shows loading spinner while fetching
  - Data fetched after page loads in browser
  - Slower First Contentful Paint (FCP)
  - Slowest Time to Interactive (TTI)
  - Better for highly dynamic, interactive content
  - JavaScript required for rendering

### 2. Server-Side Rendering (SSR)
- **Routes**: `/ssr/products` and `/ssr/products/[id]`
- **Implementation**: Fetches data in server component
- **Characteristics**:
  - HTML fully rendered on server (Node.js)
  - Fast First Contentful Paint (FCP)
  - Excellent SEO support
  - Data included in initial HTML
  - Better TTI than CSR
  - Runtime rendering for dynamic content

### 3. Edge Rendering
- **Routes**: `/edge/products` and `/edge/products/[id]`
- **Implementation**: Uses `export const runtime = 'edge'`
- **Characteristics**:
  - Rendered at edge locations globally
  - Fastest Time to First Byte (TTFB)
  - Closest to user's geographic location
  - Minimal cold start times
  - Ideal for Vercel Edge Network deployment
  - Best performance for global audiences

## Product Data Source

- **External API**: https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json
- **Products**: 50 items (real e-commerce products)
- **Caching**: 1-hour server-side revalidation
- **Network Delay**: 500-800ms artificial delay added to simulate real conditions

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
npm start
```

## Routes

### Homepage
- **`/`** - Navigation hub with links to all rendering strategies

### Product Lists
- **`/csr/products`** - CSR product catalog
- **`/ssr/products`** - SSR product catalog
- **`/edge/products`** - Edge product catalog

### Product Details
- **`/csr/products/[id]`** - CSR product detail page
- **`/ssr/products/[id]`** - SSR product detail page
- **`/edge/products/[id]`** - Edge product detail page

## Performance Testing

### Using Chrome DevTools

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Enable **Disable cache**
4. Set network throttling to **Fast 3G** for dramatic differences
5. Compare across all three rendering strategies
6. Note the timing bars and resource loading patterns

### Using Lighthouse

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select **Performance** category
4. Run audit on each rendering strategy:
   - `/csr/products`
   - `/ssr/products`
   - `/edge/products`
5. Compare the Core Web Vitals:
   - **TTFB** (Time to First Byte)
   - **FCP** (First Contentful Paint)
   - **LCP** (Largest Contentful Paint)
   - **TTI** (Time to Interactive)

### Console Logs

Check browser and server console for timing information:

**Browser Console (CSR):**
```
[CSR] Component mounted, starting fetch at: 2026-03-31T...
[CSR] Data fetched in 782.5ms
[CSR] Render completed at: 2026-03-31T...
```

**Server/Build Console (SSR & Edge):**
```
[SSR] Server fetch started at: 2026-03-31T...
[SSR] Server fetch completed in 789ms
[SSR] Server render completed at: 2026-03-31T...

[EDGE] Edge fetch started at: 2026-03-31T...
[EDGE] Edge fetch completed in 745ms
```

## Expected Performance Results

### TTFB (Time to First Byte)
- **Edge**: Fastest (100-200ms) - rendered at edge
- **SSR**: Medium (200-400ms) - server processing + network
- **CSR**: Medium (50-100ms) - empty HTML delivered quickly

### FCP (First Contentful Paint)
- **Edge**: Fastest (200-300ms) - content already in HTML
- **SSR**: Fast (300-500ms) - full HTML sent
- **CSR**: Slower (1000-1500ms) - waits for JS and fetch

### LCP (Largest Contentful Paint)
- **Edge**: Fastest (500-800ms) - images start loading immediately
- **SSR**: Fast (600-1000ms) - images in HTML
- **CSR**: Slowest (1500-2500ms) - images load after fetch completes

### TTI (Time to Interactive)
- **Edge**: Fastest (600-900ms)
- **SSR**: Fast (700-1100ms)
- **CSR**: Slowest (2000-3000ms) - hydration after fetch

## Real-World Implications

### CSR Best For:
- Highly interactive dashboards
- Frequent updates without page refresh
- Applications where SEO isn't critical
- Single Page Apps (SPAs)

### SSR Best For:
- E-commerce product listings
- Content-heavy sites (blogs, news)
- SEO-critical pages
- Server-side validation needed

### Edge Best For:
- Global audience distribution
- APIs and serverless functions
- Sub-100ms latency requirements
- Vercel-deployed applications

## Deployment

### Deploy to Vercel

```bash
npx vercel
```

The application is production-ready with:
- Automatic edge runtime support
- Global CDN distribution
- Serverless API routes
- Zero-config deployment

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, set:

```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Technical Specifications

### API Endpoint
- **URL**: `/api/products`
- **Method**: GET
- **Response**: JSON array of products
- **Network Delay**: 500-800ms (configurable)
- **External Source**: Free E-commerce Products API

### Product Object
```typescript
{
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  discount?: number;
  discountedPrice?: number;
  rating?: number;
}
```

### Image Loading
- Images use `loading="eager"` (not lazy-loaded) for consistent LCP measurement
- Large images (real product images from API)
- No image optimization (for testing purposes)
- Full resolution served to ensure LCP variance

### Performance Tuning (Disabled for Testing)
- No aggressive caching strategies
- No automatic image optimization
- No code splitting or prefetching
- Pure rendering method comparison

## Key Takeaways

1. **CSR** shows the fastest initial HTML delivery but slowest time to interactive
2. **SSR** provides balanced performance with better SEO than CSR
3. **Edge** offers the best TTFB and is ideal for global performance
4. Real-world choice depends on your specific use case and audience distribution
5. Network conditions dramatically affect these metrics (test with throttling)

## Technologies Used

- **Next.js 14+** (App Router)
- **React 18** (Server & Client Components)
- **TypeScript** (Type-safe development)
- **Tailwind CSS** (Utility-first styling)
- **Lucide React** (Icon library)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with ES2020 support

## Performance Optimization Tips

To see even clearer differences:

1. **Use Network Throttling**: DevTools → Network → "Fast 3G"
2. **Disable Cache**: DevTools → Settings → "Disable cache"
3. **Test with Real Network**: Use Chrome's "Slow 4G" preset
4. **Multiple Runs**: Test 3-5 times for consistent results
5. **Clear Browser Cache**: Ctrl+Shift+Delete to clear all cache

## License

MIT

## Contributing

Feel free to fork and submit pull requests for improvements!
