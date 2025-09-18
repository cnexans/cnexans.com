"use client";

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node component
const CustomNode = ({ data, selected }) => {
  return (
    <div
      className={`px-4 py-2 shadow-md rounded-lg border-2 transition-all duration-500 ${
        data.visited 
          ? 'bg-green-500 border-green-600 text-white' 
          : data.current
          ? 'bg-yellow-400 border-yellow-500 text-black'
          : 'bg-blue-500 border-blue-600 text-white'
      }`}
      style={{
        minWidth: '50px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '16px'
      }}
    >
      {data.label}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const DFSTreeTraversal = () => {
  // Initial nodes and edges for the tree
  const initialNodes = [
    {
      id: 'A',
      type: 'custom',
      position: { x: 250, y: 50 },
      data: { label: 'A', visited: false, current: false },
    },
    {
      id: 'B',
      type: 'custom',
      position: { x: 150, y: 150 },
      data: { label: 'B', visited: false, current: false },
    },
    {
      id: 'C',
      type: 'custom',
      position: { x: 350, y: 150 },
      data: { label: 'C', visited: false, current: false },
    },
    {
      id: 'D',
      type: 'custom',
      position: { x: 100, y: 250 },
      data: { label: 'D', visited: false, current: false },
    },
    {
      id: 'E',
      type: 'custom',
      position: { x: 200, y: 250 },
      data: { label: 'E', visited: false, current: false },
    },
    {
      id: 'F',
      type: 'custom',
      position: { x: 300, y: 250 },
      data: { label: 'F', visited: false, current: false },
    },
    {
      id: 'G',
      type: 'custom',
      position: { x: 400, y: 250 },
      data: { label: 'G', visited: false, current: false },
    },
  ];

  const initialEdges = [
    { id: 'A-B', source: 'A', target: 'B', type: 'smoothstep' },
    { id: 'A-C', source: 'A', target: 'C', type: 'smoothstep' },
    { id: 'B-D', source: 'B', target: 'D', type: 'smoothstep' },
    { id: 'B-E', source: 'B', target: 'E', type: 'smoothstep' },
    { id: 'C-F', source: 'C', target: 'F', type: 'smoothstep' },
    { id: 'C-G', source: 'C', target: 'G', type: 'smoothstep' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visitOrder, setVisitOrder] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Tree structure for DFS
  const tree = {
    A: ['B', 'C'],
    B: ['D', 'E'],
    C: ['F', 'G'],
    D: [],
    E: [],
    F: [],
    G: [],
  };

  // DFS implementation
  const dfsTraversal = (startNode) => {
    const stack = [startNode];
    const visited = new Set();
    const order = [];

    while (stack.length > 0) {
      const current = stack.pop();
      
      if (!visited.has(current)) {
        visited.add(current);
        order.push(current);
        
        // Add children to stack in reverse order to maintain left-to-right traversal
        const children = tree[current];
        for (let i = children.length - 1; i >= 0; i--) {
          if (!visited.has(children[i])) {
            stack.push(children[i]);
          }
        }
      }
    }
    
    return order;
  };

  // Reset animation
  const resetAnimation = useCallback(() => {
    setNodes(initialNodes);
    setVisitOrder([]);
    setCurrentStep(0);
    setIsAnimating(false);
  }, []);

  // Start DFS animation
  const startDFS = useCallback(() => {
    if (isAnimating) return;
    
    resetAnimation();
    const order = dfsTraversal('A');
    setVisitOrder(order);
    setIsAnimating(true);
  }, [isAnimating, resetAnimation]);

  // Animate through the DFS steps
  useEffect(() => {
    if (!isAnimating || visitOrder.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStep < visitOrder.length) {
        const currentNodeId = visitOrder[currentStep];
        
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === currentNodeId) {
              return {
                ...node,
                data: { ...node.data, current: true, visited: false },
              };
            } else if (visitOrder.slice(0, currentStep).includes(node.id)) {
              return {
                ...node,
                data: { ...node.data, current: false, visited: true },
              };
            }
            return {
              ...node,
              data: { ...node.data, current: false, visited: false },
            };
          })
        );

        setCurrentStep(currentStep + 1);
      } else {
        // Animation complete - mark all as visited
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            data: { ...node.data, current: false, visited: true },
          }))
        );
        setIsAnimating(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStep, visitOrder, isAnimating, setNodes]);

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">DFS Tree Traversal Demo</h1>
            <p className="text-gray-600 mt-1">
              Depth-First Search visualization using a stack-based approach
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={startDFS}
              disabled={isAnimating}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isAnimating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAnimating ? 'Running...' : 'Start DFS'}
            </button>
            <button
              onClick={resetAnimation}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex h-full">
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#f1f5f9" />
            <Controls />
          </ReactFlow>
        </div>
        
        <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto border-l">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">DFS Information</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Legend:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                  <span>Unvisited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded border"></div>
                  <span>Currently processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded border"></div>
                  <span>Visited</span>
                </div>
              </div>
            </div>
            
            {visitOrder.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Visit Order:</h4>
                <div className="text-sm">
                  {visitOrder.map((nodeId, index) => (
                    <span
                      key={nodeId}
                      className={`inline-block px-2 py-1 m-1 rounded ${
                        index < currentStep
                          ? 'bg-green-100 text-green-800'
                          : index === currentStep
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {index + 1}. {nodeId}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">How DFS Works:</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p>1. Start at the root node (A)</p>
                <p>2. Push node onto stack and mark as visited</p>
                <p>3. Pop node from stack and visit it</p>
                <p>4. Push unvisited children onto stack</p>
                <p>5. Repeat until stack is empty</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Stack Behavior:</h4>
              <div className="text-sm text-gray-600">
                <p>DFS uses a Last-In-First-Out (LIFO) stack structure, which naturally leads to exploring deeper branches before visiting siblings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DFSDemo = () => {
  return (
    <ReactFlowProvider>
      <DFSTreeTraversal />
    </ReactFlowProvider>
  );
};

export default DFSDemo;