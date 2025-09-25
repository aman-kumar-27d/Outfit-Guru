# Outfit Guru Documentation System

A comprehensive, responsive documentation system built with React and TypeScript, featuring modern UI components, code snippets with copy functionality, image previews, and a clean, navigable structure.

## 🌟 Features

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Navigation**: Sidebar navigation with search and progress indicators  
- **Code Snippets**: Syntax highlighting with one-click copy functionality
- **Image Previews**: Zoomable images with modal support and captions
- **Alert Components**: Contextual callouts for tips, warnings, and information
- **Extensible Structure**: Easy to add new pages and sections
- **Modern UI**: Clean design inspired by leading documentation sites like Shadcn

## 📁 Project Structure

```
src/docs/
├── components/           # Reusable documentation components
│   ├── CodeBlock.tsx    # Code syntax highlighting with copy
│   ├── ImagePreview.tsx # Image viewer with zoom functionality  
│   ├── Callout.tsx      # Alert/callout components
│   └── DocLayout.tsx    # Main documentation layout
├── pages/               # Documentation pages
│   ├── IntroductionPage.tsx
│   ├── InstallationPage.tsx
│   ├── QuickStartPage.tsx
│   └── OutfitDetectionPage.tsx
├── data/                # Configuration and navigation data
│   └── navigation.ts    # Sidebar navigation structure
├── DocsRouter.tsx       # Main router component
└── index.ts            # Module exports
```

## 🚀 Getting Started

### Option 1: Quick Integration

Replace your main `App.tsx` with the enhanced version:

```typescript
// In your main.tsx or index.tsx
import App from './AppWithDocs';  // Instead of './App'

// Your existing ReactDOM.render code...
```

### Option 2: Custom Integration

Integrate into your existing routing system:

```typescript
import { DocsRouter } from './docs';

function App() {
  const currentPath = window.location.pathname;
  
  if (currentPath.startsWith('/docs')) {
    return <DocsRouter currentPath={currentPath} />;
  }
  
  // Your existing app routes...
}
```

### Dependencies

Ensure these packages are installed:

```bash
npm install @radix-ui/react-scroll-area lucide-react
```

## 📖 Usage

### Adding New Pages

1. Create a new page component in `src/docs/pages/`:

```typescript
// src/docs/pages/MyNewPage.tsx
import React from 'react';
import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

const MyNewPage: React.FC = () => {
  return (
    <div className="prose prose-gray max-w-none">
      <h1>My New Page</h1>
      {/* Your content here */}
    </div>
  );
};

export default MyNewPage;
```

2. Add the page to the navigation in `src/docs/data/navigation.ts`:

```typescript
{
  title: "My New Section",
  items: [
    {
      title: "My New Page",
      href: "/docs/my-new-page",
      description: "Description of my new page"
    }
  ]
}
```

3. Add the route in `src/docs/DocsRouter.tsx`:

```typescript
case '/docs/my-new-page':
  return <MyNewPage />;
```

### Using Components

#### Code Blocks

```tsx
<CodeBlock language="javascript" filename="example.js" showLineNumbers>
{`const hello = "world";
console.log(hello);`}
</CodeBlock>
```

#### Image Previews

```tsx
<ImagePreview
  src="/path/to/image.jpg"
  alt="Description"
  caption="Image caption"
/>

// Or use ImageGrid for multiple images
<ImageGrid
  images={[
    { src: "/image1.jpg", alt: "Image 1", caption: "Caption 1" },
    { src: "/image2.jpg", alt: "Image 2", caption: "Caption 2" }
  ]}
  columns={2}
/>
```

#### Callouts/Alerts

```tsx
<Callout type="info" title="Information">
  <p>This is an informational message.</p>
</Callout>

<Callout type="warning" title="Warning">
  <p>This is a warning message.</p>
</Callout>

<Callout type="error" title="Error">
  <p>This is an error message.</p>
</Callout>
```

## 🎨 Styling

The documentation system uses Tailwind CSS for styling. Key design principles:

- **Clean Typography**: Using the `prose` classes for readable content
- **Consistent Spacing**: Standardized margins and paddings
- **Accessible Colors**: High contrast ratios and semantic color usage
- **Responsive Design**: Mobile-first approach with breakpoints

### Color Scheme

- Primary: Blue (`blue-600`, `blue-700`)
- Success: Green (`green-600`)  
- Warning: Amber (`amber-600`)
- Error: Red (`red-600`)
- Info: Blue (`blue-600`)

## 🔧 Customization

### Navigation Structure

Modify `src/docs/data/navigation.ts` to customize the sidebar navigation:

```typescript
export const docsConfig = {
  sidebarNav: [
    {
      title: "Section Title",
      items: [
        {
          title: "Page Title",
          href: "/docs/page-route",
          description: "Page description",
          new: true  // Optional: adds "New" badge
        }
      ]
    }
  ]
};
```

### Layout Customization

The main layout is defined in `DocLayout.tsx`. You can customize:

- Header styling and content
- Sidebar width and behavior  
- Main content area styling
- Mobile responsive breakpoints

### Theme Customization

Colors and styling can be customized by modifying the Tailwind classes in the components. Consider creating a theme configuration file for consistent theming.

## 📱 Mobile Responsiveness

The documentation system is fully responsive:

- **Mobile**: Single column layout with collapsible sidebar
- **Tablet**: Two column layout with persistent navigation
- **Desktop**: Full layout with sticky sidebar and navigation

Key responsive features:

- Touch-friendly navigation
- Collapsible mobile menu
- Responsive image galleries
- Mobile-optimized code blocks

## ⚡ Performance

Optimization features included:

- **Component Lazy Loading**: Pages loaded on demand
- **Image Optimization**: Responsive images with lazy loading
- **Efficient Rendering**: Minimal re-renders with React best practices
- **CSS Optimization**: Utility-first styling with Tailwind

## 🛠️ Development

### Local Development

```bash
# Start development server
npm run dev

# Access documentation
http://localhost:5173/docs
```

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

To contribute to the documentation:

1. Fork the repository
2. Create a feature branch
3. Add your documentation page or improvement
4. Test the changes locally
5. Submit a pull request

### Documentation Standards

- Use clear, concise language
- Include code examples for technical concepts
- Add appropriate callouts for important information
- Ensure all images have descriptive alt text
- Test responsiveness across different screen sizes

## 📄 License

This documentation system is part of the Outfit Guru project and follows the same licensing terms.

## 🆘 Support

If you encounter issues or need help:

1. Check the existing documentation
2. Search for similar issues in the repository
3. Create a new issue with detailed information
4. Join the community discussions

---

Built with ❤️ for the Outfit Guru community