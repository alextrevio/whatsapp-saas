export interface WhiteLabelConfig {
  branding: {
    appName: string
    logo: string
    favicon: string
    primaryColor: string
    secondaryColor: string
  }
  domain: {
    customDomain?: string
    subdomain?: string
  }
  emails: {
    fromName: string
    fromEmail: string
    supportEmail: string
    customTemplates: boolean
  }
  features: {
    removeBranding: boolean
    customFooter?: string
    hideAtlasBranding: boolean
    customCss?: string
  }
  integrations: {
    googleAnalytics?: string
    facebookPixel?: string
    customScripts?: string[]
  }
}

export const DEFAULT_WHITELABEL_CONFIG: WhiteLabelConfig = {
  branding: {
    appName: 'WhatsApp SaaS',
    logo: '/logo.png',
    favicon: '/favicon.ico',
    primaryColor: '#16a34a', // green-600
    secondaryColor: '#059669'  // green-700
  },
  domain: {},
  emails: {
    fromName: 'WhatsApp SaaS',
    fromEmail: 'noreply@whatsappsaas.com',
    supportEmail: 'support@whatsappsaas.com',
    customTemplates: false
  },
  features: {
    removeBranding: false,
    hideAtlasBranding: false
  },
  integrations: {}
}

// Obtener configuración white-label para una organización
export async function getWhiteLabelConfig(organizationId: string): Promise<WhiteLabelConfig> {
  try {
    // En implementación real, esto vendría de Supabase
    // const { data } = await supabaseAdmin
    //   .from('organizations')
    //   .select('white_label_config')
    //   .eq('id', organizationId)
    //   .single()

    // Mock data - en producción vendría de la base de datos
    const mockConfig = {
      branding: {
        appName: 'MiPlataforma WhatsApp',
        logo: '/custom-logo.png',
        favicon: '/custom-favicon.ico',
        primaryColor: '#3b82f6', // blue-500
        secondaryColor: '#1d4ed8'  // blue-700
      },
      domain: {
        customDomain: 'whatsapp.miempresa.com',
        subdomain: 'miempresa'
      },
      emails: {
        fromName: 'Mi Empresa',
        fromEmail: 'noreply@miempresa.com',
        supportEmail: 'soporte@miempresa.com',
        customTemplates: true
      },
      features: {
        removeBranding: true,
        customFooter: '© 2024 Mi Empresa. Todos los derechos reservados.',
        hideAtlasBranding: true,
        customCss: `
          :root {
            --custom-accent: #3b82f6;
            --custom-bg: #f8fafc;
          }
        `
      },
      integrations: {
        googleAnalytics: 'GA-XXXXXXXXX',
        facebookPixel: 'XXXXXXXXXXXXXXXXX',
        customScripts: [
          'https://cdn.ejemplo.com/mi-script.js'
        ]
      }
    }

    return { ...DEFAULT_WHITELABEL_CONFIG, ...mockConfig }

  } catch (error) {
    console.error('Error fetching white-label config:', error)
    return DEFAULT_WHITELABEL_CONFIG
  }
}

// Aplicar configuración CSS personalizada
export function generateCustomCSS(config: WhiteLabelConfig): string {
  const { branding } = config
  
  let css = `
    :root {
      --primary: ${branding.primaryColor};
      --secondary: ${branding.secondaryColor};
      --brand-primary: ${branding.primaryColor};
      --brand-secondary: ${branding.secondaryColor};
    }
    
    .brand-primary {
      color: ${branding.primaryColor} !important;
    }
    
    .bg-brand-primary {
      background-color: ${branding.primaryColor} !important;
    }
    
    .border-brand-primary {
      border-color: ${branding.primaryColor} !important;
    }
    
    .text-brand-primary {
      color: ${branding.primaryColor} !important;
    }
  `

  if (config.features.customCss) {
    css += '\n' + config.features.customCss
  }

  return css
}

// Validar dominio personalizado
export function isValidCustomDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/
  return domainRegex.test(domain)
}

// Validar color hexadecimal
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(color)
}

// Generar subdomain URL
export function getSubdomainUrl(subdomain: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const baseDomain = new URL(baseUrl).hostname
  
  return `https://${subdomain}.${baseDomain}`
}

// Actualizar configuración white-label
export async function updateWhiteLabelConfig(
  organizationId: string,
  config: Partial<WhiteLabelConfig>
): Promise<void> {
  try {
    // En implementación real, actualizarías Supabase
    // await supabaseAdmin
    //   .from('organizations')
    //   .update({
    //     white_label_config: config,
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('id', organizationId)

    console.log('White-label config updated for organization:', organizationId)

  } catch (error) {
    console.error('Error updating white-label config:', error)
    throw error
  }
}

// Verificar si la organización tiene acceso a white-label
export function hasWhiteLabelAccess(plan: string): boolean {
  return plan === 'enterprise'
}

// Generar meta tags personalizados
export function generateCustomMetaTags(config: WhiteLabelConfig): string {
  return `
    <title>${config.branding.appName}</title>
    <link rel="icon" href="${config.branding.favicon}" />
    <meta name="theme-color" content="${config.branding.primaryColor}" />
    ${config.integrations.googleAnalytics ? `
      <!-- Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=${config.integrations.googleAnalytics}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${config.integrations.googleAnalytics}');
      </script>
    ` : ''}
    ${config.integrations.facebookPixel ? `
      <!-- Facebook Pixel -->
      <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${config.integrations.facebookPixel}');
        fbq('track', 'PageView');
      </script>
    ` : ''}
  `.trim()
}