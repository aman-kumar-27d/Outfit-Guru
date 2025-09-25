export interface DocItem {
  title: string;
  href: string;
  description?: string;
  items?: DocItem[];
  new?: boolean;
}

export const docsConfig = {
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
          description: "Learn about Outfit Guru and its capabilities"
        },
        {
          title: "Installation",
          href: "/docs/installation",
          description: "How to set up Outfit Guru locally"
        },
        {
          title: "Quick Start",
          href: "/docs/quick-start",
          description: "Get up and running in minutes"
        },
        {
          title: "Project Structure",
          href: "/docs/project-structure",
          description: "Understanding the codebase organization"
        }
      ]
    },
    {
      title: "Features",
      items: [
        {
          title: "Outfit Detection",
          href: "/docs/outfit-detection",
          description: "AI-powered clothing item detection"
        },
        {
          title: "Style Analysis",
          href: "/docs/style-analysis",
          description: "Advanced outfit style analysis"
        },
        {
          title: "Recommendations",
          href: "/docs/recommendations",
          description: "Personalized outfit suggestions"
        },
        {
          title: "Face Blur",
          href: "/docs/face-blur",
          description: "Privacy protection with face blurring"
        }
      ]
    },
    {
      title: "API Reference",
      items: [
        {
          title: "Backend API",
          href: "/docs/api/backend",
          description: "Complete backend API documentation"
        },
        {
          title: "Endpoints",
          href: "/docs/api/endpoints",
          description: "Available API endpoints and usage"
        },
        {
          title: "Models",
          href: "/docs/api/models",
          description: "Data models and schemas"
        }
      ]
    },
    {
      title: "Components",
      items: [
        {
          title: "Overview",
          href: "/docs/components",
          description: "Component library overview"
        },
        {
          title: "Upload",
          href: "/docs/components/upload",
          description: "Image upload component"
        },
        {
          title: "Detection",
          href: "/docs/components/detection",
          description: "Outfit detection UI components"
        },
        {
          title: "Results",
          href: "/docs/components/results",
          description: "Results display components"
        }
      ]
    },
    {
      title: "Deployment",
      items: [
        {
          title: "Docker",
          href: "/docs/deployment/docker",
          description: "Deploy with Docker containers"
        },
        {
          title: "Production",
          href: "/docs/deployment/production",
          description: "Production deployment guide"
        },
        {
          title: "Environment Variables",
          href: "/docs/deployment/environment",
          description: "Configuration and environment setup"
        }
      ]
    },
    {
      title: "Contributing",
      items: [
        {
          title: "Guidelines",
          href: "/docs/contributing",
          description: "How to contribute to Outfit Guru"
        },
        {
          title: "Development Setup",
          href: "/docs/development-setup",
          description: "Setting up development environment"
        },
        {
          title: "Code Style",
          href: "/docs/code-style",
          description: "Code formatting and style guidelines"
        }
      ]
    }
  ]
};

export type SidebarNavItem = typeof docsConfig.sidebarNav[number];