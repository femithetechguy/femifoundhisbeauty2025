// Color theme application
function applyColorTheme() {
  if (!window.colorData || !window.colorData.cssVariables || !window.colorData.cssVariables[':root']) {
    console.warn('Color data not available or invalid. Using default theme.');
    return;
  }
  
  try {
    // Apply CSS variables from colors.json
    const root = document.documentElement;
    const cssVars = window.colorData.cssVariables[':root'];
    
    // Apply each CSS variable to the :root element
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Also update colors from wedding theme if available
    if (window.weddingData && window.weddingData.wedding && window.weddingData.wedding.theme) {
      const theme = window.weddingData.wedding.theme;
      
      // Only set these if the colors.json didn't already set them
      if (theme.primaryColor && !cssVars['--color-primary']) {
        root.style.setProperty('--color-primary', theme.primaryColor);
      }
      
      if (theme.secondaryColor && !cssVars['--color-secondary']) {
        root.style.setProperty('--color-secondary', theme.secondaryColor);
      }
      
      if (theme.accentColor && !cssVars['--color-accent-1']) {
        root.style.setProperty('--color-accent-1', theme.accentColor);
      }
    }
    
    // Update gradients after all colors are set to ensure they use the most current color values
    // Only do this if gradients weren't explicitly defined in colors.json
    if (!cssVars['--gradient-primary']) {
      const primary = getComputedStyle(root).getPropertyValue('--color-primary').trim();
      const accent2 = getComputedStyle(root).getPropertyValue('--color-accent-2').trim();
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${primary} 0%, ${accent2} 100%)`);
    }
    
    if (!cssVars['--gradient-secondary']) {
      const accent2 = getComputedStyle(root).getPropertyValue('--color-accent-2').trim();
      const accent1 = getComputedStyle(root).getPropertyValue('--color-accent-1').trim();
      root.style.setProperty('--gradient-secondary', `linear-gradient(135deg, ${accent2} 0%, ${accent1} 100%)`);
    }
    
    if (!cssVars['--gradient-hero']) {
      const primary = getComputedStyle(root).getPropertyValue('--color-primary').trim();
      const accent2 = getComputedStyle(root).getPropertyValue('--color-accent-2').trim();
      const accent1 = getComputedStyle(root).getPropertyValue('--color-accent-1').trim();
      root.style.setProperty('--gradient-hero', `linear-gradient(135deg, ${primary} 0%, ${accent2} 50%, ${accent1} 100%)`);
    }
    
    console.log('Color theme applied successfully');
  } catch (error) {
    console.error('Error applying color theme:', error);
  }
}
