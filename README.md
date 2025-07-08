# Git Repository Visualizer

A beautiful, interactive radial tree visualization for exploring the structure of any GitHub repository. This tool fetches repository data and creates a circular tree diagram where file sizes are represented by circle sizes and file types are color-coded by programming language.

![Repository Visualization Example](./public/hero.png)

## Features

- **Radial Tree Layout**: Clean, circular visualization of repository structure
- **Size-Based Scaling**: Circle sizes represent actual file sizes (logarithmic scale)
- **Language Color Coding**: Files are colored by programming language/file type
- **Interactive Legend**: Shows file type colors and size information
- **GitHub Integration**: Fetches live data from any public GitHub repository

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- GitHub Personal Access Token (for API access)

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd repo-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your GitHub token:
```bash
GITHUB_TOKEN=your_github_personal_access_token_here
```

### Usage

1. **Fetch Repository Data**:
```bash
node fetchRepoTree.js https://github.com/owner/repository-name
```

2. **View the Visualization**:
   - Open `public/index.html` in your web browser
   - Or serve it with a local server:
```bash
npx serve public
```

## How It Works

### Data Fetching
The `fetchRepoTree.js` script:
- Parses the GitHub repository URL
- Uses GitHub's API to fetch the complete file tree
- Builds a hierarchical structure with file sizes and extensions
- Saves the data as `public/tree.json`

### Visualization
The D3.js-powered visualization:
- Creates a radial tree layout from the JSON data
- Scales circle sizes logarithmically based on file size (2px - 15px)
- Colors files by extension using GitHub's language color scheme
- Displays file names with rotation for readability

## Color Coding

Files are colored by their programming language:

- **JavaScript** (.js) - Yellow
- **TypeScript** (.ts, .tsx) - Blue
- **HTML** (.html) - Orange-red
- **CSS** (.css) - Blue
- **JSON** (.json) - Dark gray
- **Markdown** (.md) - Blue
- **Python** (.py) - Blue-green
- **Images** (.png, .jpg, .svg) - Purple
- **Directories** - Gray
- And many more...

## GitHub Token Setup

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate a new token with `public_repo` scope
3. Add it to your `.env` file as `GITHUB_TOKEN`

## Examples

Visualize popular repositories:
```bash
node fetchRepoTree.js https://github.com/facebook/react
node fetchRepoTree.js https://github.com/microsoft/vscode
node fetchRepoTree.js https://github.com/nodejs/node
```

## Project Structure

```
repo-visualizer/
├── fetchRepoTree.js     # GitHub API fetcher
├── public/
│   ├── index.html       # Main visualization
│   └── tree.json        # Generated repository data
├── package.json
└── README.md
```

## Customization

### Modify Colors
Edit the `languageColors` object in `public/index.html` to change file type colors.

### Adjust Size Scaling
Modify the `sizeScale` range in `public/index.html` to change circle size limits.

### Add New File Types
Add new extensions to the `languageColors` mapping with appropriate colors.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Troubleshooting

**API Rate Limiting**: GitHub API has rate limits. If you hit them, wait an hour or use a different token.

**Large Repositories**: Very large repositories may take longer to fetch and visualize.

**Browser Performance**: For repositories with thousands of files, the visualization might be slow in older browsers.
