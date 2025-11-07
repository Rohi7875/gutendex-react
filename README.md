# Gutenberg Project

A beautiful React application for browsing books from the Gutendex API with custom Tailwind CSS design system.

## 🌐 Live Demo

**🚀 [View Live App](https://gutendex-react.vercel.app/)**

## ✨ Features

- 📚 **10 Genre Categories** - Fiction, Drama, Humour, Politics, Philosophy, History, Adventure, Children, Poetry, Romance
- 🔍 **Real-time Search** - Search by title or author with debouncing
- ♾️ **Infinite Scroll** - Automatically loads more books as you scroll
- 📖 **Smart Book Opening** - HTML > PDF > TXT priority with fallback alert
- 🖼️ **Cover Images Only** - Filters to show only books with covers
- 🎨 **Custom Design System** - Beautiful purple gradient with Montserrat fonts
- 📱 **Fully Responsive** - Works perfectly on all devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 📦 Build

```bash
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🎨 Design System

**Colors:**
- Primary: `#5E56E7` (Purple)
- Page: `#F8F7FF` (Light Purple)
- Gray Soft: `#F0F0F6`
- Mid Gray: `#A0A0A0`
- Dark: `#333333`

**Typography:**
- Font: Montserrat (Regular 400, SemiBold 600)
- H1: 48px | H2: 30px | Body: 16px | Small: 12px

## 🏗️ Project Structure

```
src/
├── components/      # Reusable components (GenreCard, BookCard)
├── pages/          # Page components (Home, Category)
├── assets/         # SVG icons and images
├── App.jsx         # Main app with state navigation
└── index.css       # Tailwind + custom styles

public/
└── fonts/          # Montserrat font files
```

## 🔌 API Integration

**Base URL:** `http://skunkworks.ignitesol.com:8000`

**Features:**
- Filters by `mime_type=image/` for books with covers
- Uses `topic` parameter for category filtering
- Uses `search` parameter for title/author search
- Handles pagination with `next` URLs

**Example:**
```
GET /books?mime_type=image/&topic=FICTION&search=vampire
```

## 💡 Key Implementation Details

1. **State-based Navigation** - No React Router, uses simple state management
2. **Intersection Observer** - Efficient infinite scroll implementation
3. **Debounced Search** - 450ms delay to reduce API calls
4. **Format Priority** - Intelligently selects best viewable format
5. **Error Handling** - User-friendly alerts for missing formats
6. **Performance** - Lazy loading images, async cancellation

## 🧪 Testing the App

1. Click on any genre category (e.g., "FICTION")
2. Scroll down to see infinite loading
3. Type in search box to filter by title/author
4. Click on any book to open in new tab
5. Click "Back" to return to categories

## 📋 Requirements Met

✅ Home page with category buttons  
✅ Category page with infinite scroll  
✅ Search within category  
✅ Books with covers only  
✅ Format priority: HTML > PDF > TXT  
✅ Zip files excluded  
✅ Alert for no viewable version  
✅ Tailwind CSS with custom theme  
✅ Montserrat fonts  
✅ Custom SVG icons  
✅ Responsive design  

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Fetch API** - HTTP requests
- **Intersection Observer** - Infinite scroll

## 📝 Notes

- All fonts are in `public/fonts/` directory
- All SVG icons are in `src/assets/` directory
- Background pattern adds visual appeal
- No external dependencies except React and Tailwind
- Clean, maintainable code structure

---

---

## 🔗 Links

- **Live App:** https://gutendex-react.vercel.app/
- **GitHub Repo:** https://github.com/Rohi7875/gutendex-react
- **API Source:** http://skunkworks.ignitesol.com:8000/

---

**Made with ❤️ using React + Tailwind CSS**

