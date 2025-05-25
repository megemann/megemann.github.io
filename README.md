# Austin Fairbanks Portfolio Website

![Portfolio Screenshot](https://raw.githubusercontent.com/megemann/megemann.github.io/main/public/portfolio_screenshot.png)

## Overview

This is a personal portfolio website built with React that showcases my projects, skills, and experience in a Jupyter Notebook-inspired interface. The website features a clean, interactive design that mimics the experience of exploring a data science notebook.

## Features

- **Jupyter Notebook Interface**: The entire website is designed to look and feel like a Jupyter Notebook, complete with code cells, output areas, and a sidebar file explorer.
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing in any environment.
- **Interactive Elements**: Code cells can be "executed" to reveal content with a typing animation effect.
- **Responsive Design**: Fully responsive layout that works well on desktop, tablet, and mobile devices.
- **Project Showcase**: Detailed project cards with descriptions, technologies used, and links to live demos and repositories.
- **Resume Section**: View and download my resume directly from the website.
- **Skills Visualization**: Visual representation of my technical skills and proficiency levels.

## Technologies Used

- **React**: Frontend library for building the user interface
- **React Router**: For navigation between different sections
- **CSS3**: Custom styling with variables for theming
- **Font Awesome**: For icons throughout the site
- **React Markdown**: For rendering markdown content in project descriptions

## Project Structure

```
portfolio-website/
├── public/
│ ├── Resume_Austin_Fairbanks.pdf
│ └── ...
├── src/
│ ├── assets/
│ │ ├── ProfilePic.jpg
│ │ └── ...
│ ├── component/
│ │ ├── Sidebar/
│ │ └── ...
│ ├── content/
│ │ └── ...
│ ├── pages/
│ │ ├── aboutMe/
│ │ ├── home/
│ │ ├── projectList/
│ │ ├── projectPage/
│ │ └── resume/
│ ├── App.js
│ ├── ProjectData.js
│ ├── ThemeContext.js
│ └── ...
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/megemann/megemann.github.io.git
   cd megemann.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the website in your browser.

### Deployment

This website is deployed using GitHub Pages. To deploy your own version:

1. Update the `homepage` field in `package.json` to your GitHub Pages URL.
2. Build and deploy the website:
   ```bash
   npm run build
   npm run deploy
   ```

## Customization

### Adding Projects

To add new projects, edit the `ProjectData.js` file in the src directory:

```javascript
export const ProjectData = [
{
    title: "Project Title",
    key: "Project_Key",
    image: 'project_image.png',
    description: "Project description...",
    link: "https://github.com/username/project",
    highlight: true,
    date: "MM/YYYY",
    lastUpdate: "MM/YYYY",
    skills: ["Skill1", "Skill2", "Skill3"],
},
// Add more projects...
]
```

### Updating Resume

To update your resume:
1. Replace the PDF file in the public folder
2. Update the reference in `src/pages/resume/resume.jsx`

### Changing Theme Colors

Theme colors can be modified in the CSS files, particularly in the root variables defined in `App.css`.

## Browser Support

The website is compatible with:
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)
- Safari (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Jupyter Notebook's interface
- Font Awesome for the icons
- React community for the excellent documentation and resources

## Contact

Austin Fairbanks - [LinkedIn](https://www.linkedin.com/in/ajf2005/) - ajfairbanks2005@gmail.com

Project Link: [https://github.com/megemann/megemann.github.io](https://github.com/megemann/megemann.github.io)
