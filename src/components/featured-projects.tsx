import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "MathViz",
    description: "Herramienta interactiva para visualizar conceptos matemáticos complejos usando D3.js y React.",
    tech: ["React", "D3.js", "TypeScript"],
    github: "https://github.com/nexans/mathviz",
    demo: "https://mathviz.nexans.com",
    category: "mathematics",
  },
  {
    id: 2,
    title: "Algorithm Playground",
    description: "Plataforma educativa para aprender algoritmos con visualizaciones paso a paso.",
    tech: ["Next.js", "Canvas API", "Tailwind"],
    github: "https://github.com/nexans/algo-playground",
    demo: "https://algo.nexans.com",
    category: "computer-science",
  },
  {
    id: 3,
    title: "LaTeX Editor",
    description: "Editor colaborativo en tiempo real para documentos LaTeX con preview instantáneo.",
    tech: ["Node.js", "Socket.io", "Monaco Editor"],
    github: "https://github.com/nexans/latex-editor",
    demo: "https://latex.nexans.com",
    category: "programming",
  },
];

export function FeaturedProjects() {
  const getCategoryStyle = (category: string) => {
    const styles = {
      "computer-science": "bg-blue-100 text-blue-800",
      "mathematics": "bg-green-100 text-green-800",
      "programming": "bg-purple-100 text-purple-800",
    };
    return styles[category as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div key={project.id} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`${getCategoryStyle(project.category)} px-2 py-1 rounded text-xs font-medium`}>
              {project.category.replace("-", " ")}
            </span>
            <div className="flex items-center gap-2">
              <a href={project.github} className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                <Github size={16} />
              </a>
              <a href={project.demo} className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-3 text-balance">{project.title}</h3>

          <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty">{project.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
