export interface StudentCard {
  id: string;
  name: string;
  department: string;
  imageUrl: string; // base64 or data URL
  position?: {
    gridCol: number; // 0-5 (column index)
    gridRow: number; // 0-3 (row index)
  };
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  students?: StudentCard[]; // Optional for student showcase templates
  config: {
    background: {
      type: 'image' | 'gradient' | 'color';
      value: string;
      overlay?: {
        color: string;
        opacity: number;
      };
    };
    layout: {
      titlePosition: {
        x: string;
        y: string;
        textAlign: 'left' | 'center' | 'right';
        fontSize: string;
        fontWeight: string;
        color: string;
      };
      contentPosition: {
        x: string;
        y: string;
        textAlign: 'left' | 'center' | 'right' | 'justify';
        fontSize: string;
        lineHeight: string;
        color: string;
      };
      logoPosition: {
        x: string;
        y: string;
        size: string;
      };
    };
    footer: {
      position: 'bottom-left' | 'bottom-center' | 'bottom-right';
      fontSize: string;
      color: string;
      opacity: number;
    };
  };
}

export const newsletterTemplates: NewsletterTemplate[] = [
  {
    id: "newspaper-marathi",
    name: "Newspaper Marathi",
    description: "Traditional newspaper-style layout for Marathi content",
    preview: "bg-white border-2 border-black",
    config: {
      background: {
        type: "color",
        value: "#ffffff"
      },
      layout: {
        titlePosition: {
          x: "center-x",
          y: "top-16",
          textAlign: "center",
          fontSize: "text-5xl",
          fontWeight: "font-bold",
          color: "text-black"
        },
        contentPosition: {
          x: "left-6",
          y: "top-32",
          textAlign: "justify",
          fontSize: "text-base",
          lineHeight: "leading-relaxed",
          color: "text-black"
        },
        logoPosition: {
          x: "center-x",
          y: "top-8",
          size: "w-16 h-16"
        }
      },
      footer: {
        position: "bottom-right",
        fontSize: "text-xs",
        color: "text-black",
        opacity: 100
      }
    }
  },
  {
    id: "coming-soon",
    name: "More Templates",
    description: "Coming Soon...",
    preview: "bg-gradient-to-br from-gray-200 to-gray-300",
    config: {
      background: {
        type: "color",
        value: "#e5e7eb"
      },
      layout: {
        titlePosition: {
          x: "center-x",
          y: "center",
          textAlign: "center",
          fontSize: "text-2xl",
          fontWeight: "font-medium",
          color: "text-gray-500"
        },
        contentPosition: {
          x: "center-x",
          y: "center",
          textAlign: "center",
          fontSize: "text-base",
          lineHeight: "leading-relaxed",
          color: "text-gray-400"
        },
        logoPosition: {
          x: "center-x",
          y: "top-8",
          size: "w-16 h-16"
        }
      },
      footer: {
        position: "bottom-center",
        fontSize: "text-xs",
        color: "text-gray-400",
        opacity: 50
      }
    }
  }
];

export function getTemplateById(id: string): NewsletterTemplate | undefined {
  return newsletterTemplates.find(template => template.id === id);
}

export function getTemplateStyles(template: NewsletterTemplate) {
  const { config } = template;

  return {
    background: getBackgroundStyle(config.background),
    title: config.layout.titlePosition,
    content: config.layout.contentPosition,
    logo: config.layout.logoPosition,
    footer: config.footer
  };
}

// Custom user templates management
export function saveCustomTemplate(template: NewsletterTemplate): void {
  if (typeof window === 'undefined') return;

  try {
    const customTemplates = getCustomTemplates();
    // Prevent duplicate IDs
    const filtered = customTemplates.filter(t => t.id !== template.id);
    filtered.push(template);
    localStorage.setItem('custom_templates', JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to save template:', error);
  }
}

export function getCustomTemplates(): NewsletterTemplate[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('custom_templates');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load custom templates:', error);
    return [];
  }
}

export function getAllTemplates(): NewsletterTemplate[] {
  if (typeof window === 'undefined') return newsletterTemplates;
  return [...newsletterTemplates, ...getCustomTemplates()];
}

export function deleteCustomTemplate(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const customTemplates = getCustomTemplates();
    const filtered = customTemplates.filter(t => t.id !== id);
    localStorage.setItem('custom_templates', JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete template:', error);
  }
}

function getBackgroundStyle(background: NewsletterTemplate['config']['background']) {
  switch (background.type) {
    case 'gradient':
      return { background: background.value };
    case 'image':
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    case 'color':
      return { backgroundColor: background.value };
    default:
      return { backgroundColor: '#ffffff' };
  }
}
