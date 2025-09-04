const express = require('express');
const router = express.Router();

// Sample project data (in production, this would come from a database)
const projects = [
  {
    id: 1,
    title: "BePro",
    description: "An AI mentor that designs a personalized roadmap for your growth. It maps your learning journey, identifies strengths and gaps, and provides real-time guidance to accelerate your development.",
    role: "Frontend Dev",
    technologies: ["React", "TypeScript", "Redux", "GraphQL", "CSS in JS"],
    liveUrl: "https://www.bepro.live",
    githubUrl: null,
    caseStudyUrl: null,
    image: "/assets/logo.png",
    featured: true,
    category: "AI/Education",
    completionDate: "2024",
    status: "Live"
  },
  {
    id: 2,
    title: "Coinflow Pro Trading Dashboard",
    description: "I designed the core trading experience to advance traders handling millions in daily volume.",
    role: "Lead Frontend Engineer",
    technologies: ["React", "TypeScript", "Redux", "GraphQL", "CSS in JS"],
    liveUrl: null,
    githubUrl: null,
    caseStudyUrl: null,
    image: null,
    featured: true,
    category: "Finance/Trading",
    completionDate: "2023",
    status: "Live"
  },
  {
    id: 3,
    title: "Lyra Next-Gen Project Management",
    description: "Architected the frontend for a real-time collaborative project management suite within Jira.",
    role: "Frontend Engineer",
    technologies: ["React", "Next.js", "WebSockets", "GraphQL", "Styled Components"],
    liveUrl: null,
    githubUrl: null,
    caseStudyUrl: null,
    image: null,
    featured: true,
    category: "Project Management",
    completionDate: "2023",
    status: "Live"
  },
  {
    id: 4,
    title: "Pulse Analytics Dashboard",
    description: "A custom, real-time analytics platform for a Series D SaaS startup.",
    role: "Full-Stack Developer, UI Designer",
    technologies: ["Vue.js", "Nuxt.js", "TailwindCSS", "MongoDB", "AWS"],
    liveUrl: null,
    githubUrl: null,
    caseStudyUrl: null,
    image: null,
    featured: true,
    category: "Analytics/SaaS",
    completionDate: "2022",
    status: "Live"
  },
  {
    id: 5,
    title: "Basilisk Games Studio Website",
    description: "A performance-optimized marketing site for an independent game development studio.",
    role: "Frontend Engineer",
    technologies: ["Gatsby (React)", "Figma", "GSAP", "CMS"],
    liveUrl: null,
    githubUrl: null,
    caseStudyUrl: null,
    image: null,
    featured: false,
    category: "Gaming/Entertainment",
    completionDate: "2022",
    status: "Live"
  }
];

// Get all projects
router.get('/', (req, res) => {
  try {
    const { featured, category, limit } = req.query;
    
    let filteredProjects = [...projects];
    
    // Filter by featured status
    if (featured === 'true') {
      filteredProjects = filteredProjects.filter(project => project.featured);
    }
    
    // Filter by category
    if (category) {
      filteredProjects = filteredProjects.filter(project => 
        project.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply limit
    if (limit && !isNaN(limit)) {
      filteredProjects = filteredProjects.slice(0, parseInt(limit));
    }
    
    res.json({
      success: true,
      data: filteredProjects,
      total: filteredProjects.length
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// Get project by ID
router.get('/:id', (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// Get project categories
router.get('/categories/list', (req, res) => {
  try {
    const categories = [...new Set(projects.map(project => project.category))];
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get projects by category
router.get('/category/:category', (req, res) => {
  try {
    const category = req.params.category;
    const categoryProjects = projects.filter(project => 
      project.category.toLowerCase() === category.toLowerCase()
    );
    
    if (categoryProjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No projects found in this category'
      });
    }
    
    res.json({
      success: true,
      data: categoryProjects,
      total: categoryProjects.length,
      category: category
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects by category'
    });
  }
});

// Search projects
router.get('/search/:query', (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const searchResults = projects.filter(project => 
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.role.toLowerCase().includes(query) ||
      project.technologies.some(tech => tech.toLowerCase().includes(query))
    );
    
    res.json({
      success: true,
      data: searchResults,
      total: searchResults.length,
      query: query
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search projects'
    });
  }
});

// Get project statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = {
      totalProjects: projects.length,
      featuredProjects: projects.filter(p => p.featured).length,
      categories: [...new Set(projects.map(p => p.category))].length,
      technologies: [...new Set(projects.flatMap(p => p.technologies))].length,
      liveProjects: projects.filter(p => p.status === 'Live').length,
      completionYears: [...new Set(projects.map(p => p.completionDate))].sort((a, b) => b - a)
    };
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project statistics'
    });
  }
});

// Get technologies used across projects
router.get('/technologies/list', (req, res) => {
  try {
    const allTechnologies = projects.flatMap(project => project.technologies);
    const technologyCounts = {};
    
    allTechnologies.forEach(tech => {
      technologyCounts[tech] = (technologyCounts[tech] || 0) + 1;
    });
    
    const technologies = Object.entries(technologyCounts)
      .map(([tech, count]) => ({ technology: tech, count, projects: count }))
      .sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      data: technologies
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch technologies'
    });
  }
});

module.exports = router;
