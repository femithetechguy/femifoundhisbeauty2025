# 💍 Beauty & Femi 2025 Wedding Website

A modern, responsive, and dynamic wedding website built with vanilla JavaScript, Bootstrap 5, and JSON-driven content management.

![Wedding Website Preview](./images/website-preview.png)

**🌐 Live Website**: [femifoundhisbeauty2025.com](https://femifoundhisbeauty2025.com) | [GitHub Pages](https://femithetechguy.github.io/femifoundhisbeauty2025)

## 🌟 Features

### 🎯 Core Features
- **💌 Digital Guestbook** - Let visitors leave messages and blessings
- **⏳ Live Countdown Timer** - Dynamic countdown to the big day
- **🎵 Spotify Playlist Integration** - "Our Love Story in Songs"
- **📱 QR Code Ready** - Easy sharing and mobile access
- **📸 Photo Gallery** - Engagement and throwback photos with upload functionality
- **📝 RSVP System** - Complete RSVP form with meal preferences
- **📅 Wedding Schedule** - Detailed timeline of events
- **✈️ Travel Information** - Accommodations, transportation, and local tips
- **📹 Virtual Attendance** - Zoom integration for remote guests

### 🎨 Design & Technical
- **🎨 Custom Color Theme** - JSON-driven color system with Starfruit & Deep Olive palette
- **📱 Fully Responsive** - Mobile-first design that works on all devices
- **⚡ Fast Loading** - Optimized vanilla JavaScript with no heavy frameworks
- **♿ Accessible** - WCAG compliant with proper contrast ratios
- **🔧 JSON-Driven** - Easy content management through JSON files

## 🏗️ Architecture

### 📁 Project Structure
```
femifoundhisbeauty2025/
├── index.html              # Main landing page
├── rsvp.html               # Dedicated RSVP form page
├── gallery.html            # Full photo gallery page
├── CNAME                   # Domain configuration
├── README.md               # This file
├── json/
│   ├── wedding_outline.json # Main content data
│   ├── colors.json         # Color theme configuration
│   └── wedding_outline.md  # Original content outline
├── styles/
│   └── style.css           # Custom CSS with color variables
└── scripts/
    └── script.js           # Main JavaScript functionality
```

### 🔄 Hybrid Architecture
- **One-Page Experience**: Smooth scrolling navigation with anchor links
- **Dedicated Pages**: Separate RSVP and Gallery pages for detailed interactions
- **JSON-Driven Content**: All content dynamically loaded from JSON files

## 🎨 Color Palette

The website uses a fresh and elegant color scheme:

| Purpose | Color Code | Description |
|---------|------------|-------------|
| **Primary** | `#D8E460` | Starfruit – Fresh yellow-green |
| **Secondary** | `#FFFFFF` | Clean white for contrast & balance |
| **Accent 1** | `#586B36` | Deep olive for text, buttons, decor |
| **Accent 2** | `#A2C579` | Soft green for hover states, borders |
| **Neutral** | `#F9F9F9` | Light gray for backgrounds |

## 🚀 Getting Started

### Prerequisites
- A web server (local or hosted)
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/femithetechguy/femifoundhisbeauty2025.git
   cd femifoundhisbeauty2025
   ```

2. **Serve the files**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Customization

#### 📝 Update Content
Edit `json/wedding_outline.json` to customize:
- Wedding details (date, time, venues)
- Couple information and bios
- RSVP form fields
- Timeline and schedule
- Travel information
- Contact details

#### 🎨 Modify Colors
Edit `json/colors.json` to change the color scheme:
```json
{
  "colors": {
    "primary": {
      "hex": "#YOUR_COLOR",
      "name": "Your Color Name"
    }
  }
}
```

#### 🖼️ Add Photos
Replace placeholder images in the following directories:
- `images/couple-main.jpg` - Main couple photo
- `images/engagement/` - Engagement photos
- `images/throwback/` - Throwback memories
- `images/beauty-portrait.jpg` - Bride's portrait
- `images/femi-portrait.jpg` - Groom's portrait
- `images/website-preview.png` - Website preview image for README

**📸 Creating a Website Preview Image**:
1. Take a screenshot of your live website
2. Resize to 1200x630 pixels (optimal for social sharing)
3. Save as `images/website-preview.png`
4. The README will automatically display it

## 📱 Pages Overview

### 🏠 Main Page (`index.html`)
- Hero section with countdown timer
- Complete wedding information
- Photo gallery preview
- All wedding details in one scroll

### 📝 RSVP Page (`rsvp.html`)
- Comprehensive RSVP form
- Guest count management
- Meal preferences
- Event attendance selection
- Transportation needs

### 📸 Gallery Page (`gallery.html`)
- Filterable photo gallery
- Photo upload functionality
- Lightbox viewer
- Category organization

## 🛠️ Technical Details

### Dependencies
- **Bootstrap 5.3.0** - UI framework and responsive grid
- **Bootstrap Icons** - Icon library
- **Google Fonts** - Playfair Display & Inter fonts

### Browser Support
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### Performance
- **No heavy frameworks** - Pure vanilla JavaScript
- **Optimized images** - Placeholder system ready for real photos
- **Lazy loading** - Efficient content loading
- **CSS Variables** - Dynamic theming support

## 🎯 Features Checklist

- ✅ **Countdown Timer** - Live countdown to wedding day
- ✅ **RSVP System** - Complete form with validation
- ✅ **Photo Gallery** - With upload and filtering
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Color Theming** - JSON-driven color system
- ✅ **Navigation** - Smooth scrolling and sticky navbar
- ✅ **Contact Forms** - Multiple contact options
- ✅ **Social Integration** - Hashtag and sharing features
- ✅ **Wedding Timeline** - Detailed schedule display
- ✅ **Travel Info** - Comprehensive guest information
- ✅ **Gift Registry** - Multiple registry and cash gift options
- ✅ **Loading Animation** - Elegant loading screen
- ✅ **Floating Actions** - Quick access buttons
- ✅ **Back to Top** - Smooth scroll to top
- ✅ **Virtual Attendance** - Zoom integration for remote guests
- ✅ **Copy to Clipboard** - Easy sharing of links and information

## 📋 Content Management

The website is designed for easy content management through JSON files:

### Main Content (`wedding_outline.json`)
Contains all website sections including:
- Wedding basic info (date, time, hashtag)
- 12 main sections (Home, Our Story, Details, etc.)
- Navigation configuration
- Feature flags
- Meta information

### Color System (`colors.json`)
Comprehensive color management:
- Primary and accent colors
- Color variations (light/dark)
- CSS custom properties
- Semantic color assignments
- Accessibility guidelines

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main` or `master`)
4. Custom domain configuration via `CNAME` file

### Custom Domain
Update the `CNAME` file with your domain:
```
femifoundhisbeauty2025.com
```

**Current Setup**: The site is configured to use `femifoundhisbeauty2025.com` as the custom domain.

### Other Hosting Platforms
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **Firebase Hosting**: Google's hosting solution

## 🔧 Troubleshooting

### Website Preview Not Showing
If the README preview image doesn't display:
1. Ensure `images/website-preview.png` exists
2. Check the image file size (should be < 1MB for GitHub)
3. Verify the image path in README is correct
4. GitHub may cache images - try clearing browser cache

### Custom Domain Setup
1. Add your domain to `CNAME` file
2. Configure DNS settings with your domain provider
3. Point A records to GitHub Pages IPs:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
4. Wait for DNS propagation (can take up to 24 hours)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👰🏾🤵🏾 About

Created with ❤️ for Beauty & Femi's special day - December 31, 2025

**Built by**: [@femithetechguy](https://github.com/femithetechguy)  
**Wedding Date**: December 31, 2025  
**Location**: Lagos, Nigeria  
**Hashtag**: #BeautyAndFemi2025

---

### 🎉 Celebrate with us!

Visit the live website and RSVP for our special day. We can't wait to celebrate with all our loved ones!

**🌐 Live Website**: [femifoundhisbeauty2025.com](https://femifoundhisbeauty2025.com)  
**📱 GitHub Pages**: [femithetechguy.github.io/femifoundhisbeauty2025](https://femithetechguy.github.io/femifoundhisbeauty2025)

---

*Made with 💖 for our forever love story*
