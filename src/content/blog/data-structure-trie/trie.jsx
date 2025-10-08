"use client";

import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

// Clase para el nodo del Trie
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

// Clase principal del Trie
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char);
    }
    current.isEndOfWord = true;
  }

  searchPrefix(prefix) {
    let current = this.root;
    let found = true;
    for (const char of prefix) {
      if (!current.children.has(char)) {
        found = false;
        break;
      }
      current = current.children.get(char);
    }
    return { node: current, found };
  }

  getAllPaths(node = this.root, prefix = '', paths = []) {
    if (node.isEndOfWord) {
      paths.push(prefix);
    }
    
    for (const [char, childNode] of node.children) {
      this.getAllPaths(childNode, prefix + char, paths);
    }
    
    return paths;
  }

  generateMermaidDiagram(searchPrefix = '') {
    let diagram = 'flowchart TD;\n';
    let visited = new Set();
    
    const traverse = (node = this.root, path = '') => {
      for (const [char, childNode] of node.children) {
        const currentPath = path + char;
        const nodeId = currentPath || 'raiz';
        const parentId = path || 'raiz';
        
        if (!visited.has(nodeId)) {
          diagram += `    ${parentId}["${path ? path.slice(-1) : 'raiz'}"] --> ${nodeId}["${char}"];\n`;
          
          if (searchPrefix && currentPath.startsWith(searchPrefix)) {
            diagram += `    style ${nodeId} fill:#ff9,stroke:#f66;\n`;
          }
          
          visited.add(nodeId);
          traverse(childNode, currentPath);
        }
      }
    };

    traverse();
    return diagram;
  }

  getSuggestions(prefix) {
    const { node, found } = this.searchPrefix(prefix);
    if (!found) return [];
    
    const suggestions = [];
    this.getAllPaths(node, prefix, suggestions);
    return suggestions;
  }
}

const TrieComponent = () => {
  const [trie] = useState(() => {
    const trieInstance = new Trie();
    const words = ['gato', 'gallo', 'goma', 'perro', 'pato', 'pez', 'gata', 'gallina', 'gorila', 'gorra'];
    words.forEach(word => trieInstance.insert(word));
    return trieInstance;
  });

  const [prefix, setPrefix] = useState('');
  const [debouncedPrefix, setDebouncedPrefix] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [diagram, setDiagram] = useState('');
  const [svg, setSvg] = useState('');

  // Inicializar Mermaid solo una vez
  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'default'
    });
  }, []);

  // Debounce del prefix para el diagrama
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPrefix(prefix);
    }, 300);

    return () => clearTimeout(timer);
  }, [prefix]);

  // Actualizar sugerencias inmediatamente
  useEffect(() => {
    const suggestions = trie.getSuggestions(prefix);
    setSuggestions(suggestions);
  }, [prefix, trie]);

  // Generar diagrama solo cuando cambia el debouncedPrefix
  useEffect(() => {
    const diagram = trie.generateMermaidDiagram(debouncedPrefix);
    setDiagram(diagram);
  }, [debouncedPrefix, trie]);

  // Renderizar el diagrama cuando cambia
  useEffect(() => {
    async function renderDiagram() {
      if (diagram) {
        try {
          const res = await mermaid.render("trieGraph", diagram);
          setSvg(res.svg);
          // After rendering the Trie diagram, parse any other Mermaid diagrams
          await mermaid.run({
            querySelector: '.mermaid:not(#trieGraph)'
          });
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }
    }
    renderDiagram();
  }, [diagram]);

  return (
    <div className="flex flex-col py-4 px-2 border border-gray-300 rounded-md">
      
        <input 
          type="text" 
          placeholder="Escribe el nombre de un animal..."
          className="p-2 text-lg outline-0"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value.toLowerCase())}
        />

      <div className="p-2">
        {prefix.length > 0 && suggestions.length > 0 ? (
          <div>Sugerencias: {suggestions.join(', ')}</div>
        ) : null}
      </div>

      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};

export default TrieComponent;