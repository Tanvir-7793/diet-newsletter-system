export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
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
    id: "modern-blue",
    name: "Modern Blue",
    description: "Clean design with blue gradient background",
    preview: "bg-gradient-to-br from-blue-500 to-purple-600",
    config: {
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #3B82F6 0%, #9333EA 100%)"
      },
      layout: {
        titlePosition: {
          x: "left-8",
          y: "top-12",
          textAlign: "left",
          fontSize: "text-3xl",
          fontWeight: "font-bold",
          color: "text-white"
        },
        contentPosition: {
          x: "left-8",
          y: "top-32",
          textAlign: "left",
          fontSize: "text-base",
          lineHeight: "leading-relaxed",
          color: "text-white"
        },
        logoPosition: {
          x: "right-8",
          y: "top-8",
          size: "w-16 h-16"
        }
      },
      footer: {
        position: "bottom-center",
        fontSize: "text-xs",
        color: "text-white",
        opacity: 70
      }
    }
  },
  {
    id: "classic-elegant",
    name: "Classic Elegant",
    description: "Traditional design with subtle background",
    preview: "bg-gradient-to-br from-gray-100 to-gray-200",
    config: {
      background: {
        type: "image",
        value: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&auto=format",
        overlay: {
          color: "#ffffff",
          opacity: 0.9
        }
      },
      layout: {
        titlePosition: {
          x: "left-8",
          y: "top-16",
          textAlign: "left",
          fontSize: "text-4xl",
          fontWeight: "font-bold",
          color: "text-gray-900"
        },
        contentPosition: {
          x: "left-8",
          y: "top-36",
          textAlign: "left",
          fontSize: "text-base",
          lineHeight: "leading-relaxed",
          color: "text-gray-800"
        },
        logoPosition: {
          x: "left-8",
          y: "top-8",
          size: "w-12 h-12"
        }
      },
      footer: {
        position: "bottom-left",
        fontSize: "text-xs",
        color: "text-gray-600",
        opacity: 80
      }
    }
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Simple and professional design",
    preview: "bg-white border-2 border-gray-300",
    config: {
      background: {
        type: "color",
        value: "#ffffff"
      },
      layout: {
        titlePosition: {
          x: "left-8",
          y: "top-12",
          textAlign: "left",
          fontSize: "text-3xl",
          fontWeight: "font-bold",
          color: "text-gray-900"
        },
        contentPosition: {
          x: "left-8",
          y: "top-28",
          textAlign: "left",
          fontSize: "text-base",
          lineHeight: "leading-relaxed",
          color: "text-gray-700"
        },
        logoPosition: {
          x: "right-8",
          y: "top-8",
          size: "w-14 h-14"
        }
      },
      footer: {
        position: "bottom-right",
        fontSize: "text-xs",
        color: "text-gray-500",
        opacity: 60
      }
    }
  },
  {
    id: "vibrant-creative",
    name: "Vibrant Creative",
    description: "Colorful design for creative content",
    preview: "bg-gradient-to-br from-pink-400 to-orange-400",
    config: {
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #F472B6 0%, #FB923C 100%)"
      },
      layout: {
        titlePosition: {
          x: "center-x",
          y: "top-16",
          textAlign: "center",
          fontSize: "text-4xl",
          fontWeight: "font-bold",
          color: "text-white"
        },
        contentPosition: {
          x: "center-x",
          y: "top-36",
          textAlign: "center",
          fontSize: "text-lg",
          lineHeight: "leading-relaxed",
          color: "text-white"
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
        color: "text-white",
        opacity: 80
      }
    }
  },
  {
    id: "professional-dark",
    name: "Professional Dark",
    description: "Corporate dark theme design",
    preview: "bg-gradient-to-br from-slate-600 to-slate-800",
    config: {
      background: {
        type: "gradient",
        value: "linear-gradient(135deg, #475569 0%, #1E293B 100%)"
      },
      layout: {
        titlePosition: {
          x: "left-8",
          y: "top-12",
          textAlign: "left",
          fontSize: "text-3xl",
          fontWeight: "font-bold",
          color: "text-white"
        },
        contentPosition: {
          x: "left-8",
          y: "top-32",
          textAlign: "left",
          fontSize: "text-base",
          lineHeight: "leading-relaxed",
          color: "text-gray-200"
        },
        logoPosition: {
          x: "right-8",
          y: "top-8",
          size: "w-14 h-14"
        }
      },
      footer: {
        position: "bottom-right",
        fontSize: "text-xs",
        color: "text-gray-400",
        opacity: 70
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
