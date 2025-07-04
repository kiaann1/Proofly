# Proofly

Proofly is a modern SaaS platform for logging work, compiling achievements, and building ATS-optimised CVs—ideal for freelancers, creatives, and professionals who need proof-of-work and career documentation.

## ✨ Features

### 🎯 Core Functionality
- **Task Management**: Comprehensive work logging with summaries, attachments, and highlights
- **CV Builder**: Professional CV/portfolio builder with modern templates and real-time preview
- **ATS Optimisation**: Built-in compatibility checker with prioritised improvement suggestions
- **Dark/Light Mode**: Seamless theme switching with persistent preferences

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Modern, elegant interface with frosted glass effects
- **Responsive Layout**: Optimised for desktop, tablet, and mobile devices
- **Interactive Components**: Collapsible suggestion panels, tabbed navigation, and smooth animations
- **Professional Styling**: Clean, SaaS-like appearance with consistent spacing and typography

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable React components
- **Local Storage**: Client-side data persistence (database integration ready)
- **British Localisation**: Proper British spelling and terminology throughout

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (React 18+)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Storage**: LocalStorage (with database-ready architecture)
- **Build Tools**: ESLint, PostCSS

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Modern homepage with SaaS design
│   ├── layout.tsx         # Root layout with theme provider
│   ├── cv/                # CV builder application
│   ├── ats/               # ATS checker standalone
│   └── tasks/             # Task management system
├── components/            # Reusable UI components
│   ├── layout/           # Navigation and layout components
│   ├── cv/               # CV-specific components
│   ├── tasks/            # Task management components
│   └── providers/        # Context providers (theme, etc.)
├── lib/                  # Utilities and data handling
└── types/                # TypeScript type definitions
```

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd proofly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Key Pages & Features

### Homepage
Modern SaaS landing page with:
- Hero section with clear value proposition
- Feature highlights with icons and descriptions
- Call-to-action buttons leading to main features
- Responsive design with glassmorphism effects

### CV Builder (`/cv`)
Comprehensive CV creation tool featuring:
- Tabbed navigation (Personal, Experience, Education, Skills)
- Real-time preview with professional styling
- Form validation and data persistence
- Export-ready formatting

### ATS Checker (`/ats`)
Advanced CV optimisation tool with:
- File upload and text analysis
- Prioritised improvement suggestions (High, Medium, Low)
- Collapsible suggestion categories
- Detailed feedback with actionable recommendations

### Task Management (`/tasks`)
Work logging system with:
- Task creation and editing
- Category organisation
- Search and filtering capabilities
- Achievement tracking

## 🎭 Design Philosophy

Proofly embraces a modern, professional aesthetic with:
- **Glassmorphism**: Subtle transparency and blur effects
- **Consistent Spacing**: Harmonious padding and margins
- **Typography Hierarchy**: Clear information architecture
- **Colour Harmony**: Carefully selected colour palette
- **Accessibility**: Proper contrast ratios and semantic HTML

## 🔄 Status

**Active Development** — Modern UI implementation complete, core features functional.

### Recent Updates
- ✅ Complete UI/UX modernisation
- ✅ Dark/light mode implementation
- ✅ Responsive design improvements
- ✅ ATS checker with collapsible suggestions
- ✅ British localisation
- ✅ Component architecture refactoring

### Roadmap
- 🔄 Database integration (Prisma + PostgreSQL)
- 🔄 User authentication and profiles
- 🔄 Cloud storage for attachments
- 🔄 Advanced CV templates
- 🔄 Integration with job boards
- 🔄 Analytics and insights

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for modern professionals who value their career documentation**
