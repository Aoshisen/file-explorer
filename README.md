# File Explorer - Tauri + React + D3

A beautiful, modern file system visualization tool built with Tauri, React, and D3.js. Visualize your disk usage with an interactive sunburst diagram.

## Features

- 🎨 **Dark Tech Aesthetic**: Sleek dark interface with neon cyan, magenta, and lime accents
- 📊 **D3 Sunburst Diagram**: Interactive visualization of file system hierarchy and size distribution
- 🖱️ **Interactive Navigation**: Click folders to navigate, hover for detailed information
- 🚀 **Cross-Platform**: Built with Tauri for Windows, macOS, and Linux
- ⚡ **Fast Scanning**: Efficient recursive directory traversal with Rust backend
- 🎯 **Smart Filtering**: Automatically hides system folders and empty directories

## Project Structure

```
file-explorer/
├── src/                    # React frontend
│   ├── components/        # React components
│   │   ├── Sunburst.tsx  # D3 sunburst visualization
│   │   ├── Breadcrumb.tsx # Navigation breadcrumb
│   │   └── Tooltip.tsx    # Hover tooltip
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # React entry point
│   └── index.css          # Styling with Tailwind
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs        # Tauri commands
│   │   └── lib.rs         # File system logic
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Node dependencies
```

## Getting Started

### Prerequisites

- Node.js 16+
- Rust 1.70+
- Tauri CLI

### Installation

```bash
cd file-explorer
npm install
```

### Development

```bash
npm run tauri:dev
```

This will start the Vite dev server and open the Tauri window.

### Building

```bash
npm run tauri:build
```

Creates a production build and packages it as a desktop application.

## Architecture

### Backend (Rust)

- **File System Scanning**: Recursive directory traversal using `walkdir`
- **Size Calculation**: Efficient cumulative size computation
- **System Filtering**: Automatically skips system folders and inaccessible directories
- **Depth Limiting**: Prevents infinite recursion with configurable max depth

### Frontend (React)

- **State Management**: React hooks for path and data management
- **D3 Visualization**: Sunburst diagram with smooth transitions
- **Interactions**: Click to navigate, hover for tooltips
- **Styling**: Tailwind CSS with custom animations and neon theme

## Design Aesthetic

The interface follows a **dark, tech-forward aesthetic** with:
- Deep charcoal background (#0f0f1e)
- Neon cyan (#00d9ff), magenta (#ff006e), and lime (#39ff14) accents
- Monospace typography for technical feel
- Smooth animations and glowing effects
- Minimalist layout with maximum visual impact

## Performance Considerations

- Large directories (>100k files) are handled efficiently with async scanning
- D3 rendering is optimized with proper data binding
- System folders are filtered to reduce noise
- Breadcrumb navigation allows quick path changes

## Future Enhancements

- [ ] Search functionality with real-time filtering
- [ ] Export visualization as SVG/PNG
- [ ] Custom folder selection dialog
- [ ] Folder size comparison view
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts for navigation
