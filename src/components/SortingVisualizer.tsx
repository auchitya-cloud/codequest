"use client";

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import CodeEditor from "@/components/CodeEditor"; // or the relative path where you place this file
import { Play, Pause, RotateCcw, Settings, Code, BookOpen, Filter, Search, Moon, Sun } from 'lucide-react';



// Mock data for problems
const mockProblems = [
  { id: 1, title: "Two Sum", company: "Amazon", difficulty: "Easy", topic: "Arrays", status: "solved" },
  { id: 2, title: "Longest Substring Without Repeating Characters", company: "Google", difficulty: "Medium", topic: "Strings", status: "unsolved" },
  { id: 3, title: "Binary Tree Inorder Traversal", company: "Microsoft", difficulty: "Easy", topic: "Trees", status: "in-progress" },
  { id: 4, title: "Course Schedule", company: "Facebook", difficulty: "Medium", topic: "Graphs", status: "solved" },
  { id: 5, title: "Merge Intervals", company: "Apple", difficulty: "Medium", topic: "Arrays", status: "unsolved" },
  { id: 6, title: "Word Ladder", company: "Amazon", difficulty: "Hard", topic: "Graphs", status: "in-progress" },
  { id: 7, title: "Valid Parentheses", company: "Google", difficulty: "Easy", topic: "Stack", status: "solved" },
  { id: 8, title: "Maximum Depth of Binary Tree", company: "Microsoft", difficulty: "Easy", topic: "Trees", status: "solved" },
];

// Algorithm implementations
const algorithms = {
  bubbleSort: {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    pseudocode: `for i = 0 to n-1:
    for j = 0 to n-i-2:
        if arr[j] > arr[j+1]:
            swap arr[j] and arr[j+1]`
  },
  binarySearch: {
    name: "Binary Search",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    description: "Finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
    pseudocode: `left = 0, right = n-1
while left <= right:
    mid = (left + right) / 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1`
  },
  bfsTree: {
    name: "BFS Tree Traversal",
    timeComplexity: "O(n)",
    spaceComplexity: "O(w)",
    description: "Explores the tree level by level, visiting all nodes at the current depth before moving to nodes at the next depth.",
    pseudocode: `queue = [root]
while queue not empty:
    node = queue.dequeue()
    visit(node)
    for child in node.children:
        queue.enqueue(child)`
  }
};

// Sorting Algorithm Visualizer Component
const SortingVisualizer = ({ isPlaying, speed, onComplete }) => {
  const svgRef = useRef();
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);

  useEffect(() => {
    if (!isPlaying) return;

    const bubbleSort = async () => {
      const arr = [...array];
      const n = arr.length;
      let step = 0;

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          setComparing([j, j + 1]);
          await new Promise(resolve => setTimeout(resolve, 1000 / speed));

          if (arr[j] > arr[j + 1]) {
            setSwapping([j, j + 1]);
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
            await new Promise(resolve => setTimeout(resolve, 1000 / speed));
          }

          setComparing([]);
          setSwapping([]);
          step++;
        }
      }
      onComplete();
    };

    bubbleSort();
  }, [isPlaying, speed]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const xScale = d3.scaleBand()
      .domain(array.map((_, i) => i))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(array)])
      .range([height - margin.bottom, margin.top]);

    const bars = svg.selectAll("rect")
      .data(array)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i))
      .attr("y", d => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(0) - yScale(d))
      .attr("fill", (_, i) => {
        if (comparing.includes(i)) return "#f59e0b";
        if (swapping.includes(i)) return "#ef4444";
        return "#8b5cf6";
      })
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 1);

    svg.selectAll("text")
      .data(array)
      .enter()
      .append("text")
      .attr("x", (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937")
      .attr("font-size", "12px")
      .text(d => d);
  }, [array, comparing, swapping]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <svg ref={svgRef} width="600" height="300" className="border rounded"></svg>
    </div>
  );
};

// Binary Search Visualizer Component
const BinarySearchVisualizer = ({ isPlaying, speed, onComplete }) => {
  const svgRef = useRef();
  const [array] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
  const [target] = useState(7);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(9);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const binarySearch = async () => {
      let l = 0, r = array.length - 1;
      
      while (l <= r) {
        const m = Math.floor((l + r) / 2);
        setLeft(l);
        setRight(r);
        setMid(m);
        
        await new Promise(resolve => setTimeout(resolve, 1500 / speed));
        
        if (array[m] === target) {
          setFound(true);
          break;
        } else if (array[m] < target) {
          l = m + 1;
        } else {
          r = m - 1;
        }
      }
      onComplete();
    };

    binarySearch();
  }, [isPlaying, speed]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 200;
    const margin = { top: 40, right: 20, bottom: 40, left: 20 };

    const xScale = d3.scaleBand()
      .domain(array.map((_, i) => i))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const blocks = svg.selectAll("rect")
      .data(array)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i))
      .attr("y", 80)
      .attr("width", xScale.bandwidth())
      .attr("height", 50)
      .attr("fill", (_, i) => {
        if (found && i === mid) return "#10b981";
        if (i === mid) return "#f59e0b";
        if (i >= left && i <= right) return "#8b5cf6";
        return "#e5e7eb";
      })
      .attr("stroke", "#1f2937")
      .attr("stroke-width", 2);

    svg.selectAll("text")
      .data(array)
      .enter()
      .append("text")
      .attr("x", (_, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y", 110)
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(d => d);

    // Add labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text(`Target: ${target} | Left: ${left} | Right: ${right} | Mid: ${mid >= 0 ? array[mid] : 'N/A'}`);
      
    if (found) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 180)
        .attr("text-anchor", "middle")
        .attr("fill", "#10b981")
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .text("Target Found!");
    }
  }, [array, left, right, mid, found, target]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <svg ref={svgRef} width="700" height="200" className="border rounded"></svg>
    </div>
  );
};

// Tree Traversal Visualizer Component
const TreeVisualizer = ({ isPlaying, speed, onComplete }) => {
  const svgRef = useRef();
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);

  const treeData = {
    value: 1,
    children: [
      {
        value: 2,
        children: [
          { value: 4, children: [] },
          { value: 5, children: [] }
        ]
      },
      {
        value: 3,
        children: [
          { value: 6, children: [] },
          { value: 7, children: [] }
        ]
      }
    ]
  };

  useEffect(() => {
    if (!isPlaying) return;

    const bfs = async (root) => {
      const queue = [root];
      const visited = [];

      while (queue.length > 0) {
        const node = queue.shift();
        setCurrentNode(node.value);
        visited.push(node.value);
        setVisitedNodes([...visited]);

        await new Promise(resolve => setTimeout(resolve, 1500 / speed));

        for (const child of node.children) {
          queue.push(child);
        }
      }
      setCurrentNode(null);
      onComplete();
    };

    bfs(treeData);
  }, [isPlaying, speed]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 300;

    // Node positions (manually set for this example)
    const positions = {
      1: { x: 250, y: 50 },
      2: { x: 150, y: 120 },
      3: { x: 350, y: 120 },
      4: { x: 100, y: 200 },
      5: { x: 200, y: 200 },
      6: { x: 300, y: 200 },
      7: { x: 400, y: 200 }
    };

    // Draw edges
    const edges = [
      [1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [3, 7]
    ];

    edges.forEach(([parent, child]) => {
      svg.append("line")
        .attr("x1", positions[parent].x)
        .attr("y1", positions[parent].y)
        .attr("x2", positions[child].x)
        .attr("y2", positions[child].y)
        .attr("stroke", "#94a3b8")
        .attr("stroke-width", 2);
    });

    // Draw nodes
    Object.entries(positions).forEach(([value, pos]) => {
      const nodeValue = parseInt(value);
      svg.append("circle")
        .attr("cx", pos.x)
        .attr("cy", pos.y)
        .attr("r", 25)
        .attr("fill", () => {
          if (currentNode === nodeValue) return "#f59e0b";
          if (visitedNodes.includes(nodeValue)) return "#10b981";
          return "#8b5cf6";
        })
        .attr("stroke", "#1f2937")
        .attr("stroke-width", 2);

      svg.append("text")
        .attr("x", pos.x)
        .attr("y", pos.y + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text(value);
    });

    // Legend
    svg.append("text")
      .attr("x", 20)
      .attr("y", 280)
      .attr("fill", "#1f2937")
      .attr("font-size", "12px")
      .text(`Visited: [${visitedNodes.join(', ')}]`);
  }, [visitedNodes, currentNode]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <svg ref={svgRef} width="500" height="300" className="border rounded"></svg>
    </div>
  );
};

// Monaco Editor Component (Simplified)
import Editor from "@monaco-editor/react";

const CodeEditor = ({ darkMode }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, World!");');

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
      <div className="flex justify-between items-center mb-4">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
            Run
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            Reset
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Save
          </button>
        </div>
      </div>

      <Editor
        height="500px"
        theme={darkMode ? "vs-dark" : "light"}
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
        }}
      />
    </div>
  );
};

// const SortingVisualizer = () => {
//   const [activeTab, setActiveTab] = useState("visualizer");
//   const [darkMode, setDarkMode] = useState(false); // if you're using darkMode
//   <nav className="flex space-x-4 mb-4">
//   <button onClick={() => setActiveTab("visualizer")}>Visualizer</button>
//   <button onClick={() => setActiveTab("ide")}>IDE</button>
// </nav>
// {activeTab === "ide" && (
//   <div className="p-6">
//     <h2 className="text-2xl font-bold mb-4">Online IDE</h2>
//     <CodeEditor darkMode={darkMode} />
//   </div>
// )}

// Problem List Component
const ProblemList = ({ darkMode }) => {
  const [problems, setProblems] = useState(mockProblems);
  const [filters, setFilters] = useState({
    company: 'All',
    difficulty: 'All',
    topic: 'All',
    status: 'All'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const companies = ['All', ...new Set(mockProblems.map(p => p.company))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const topics = ['All', ...new Set(mockProblems.map(p => p.topic))];
  const statuses = ['All', 'solved', 'unsolved', 'in-progress'];

  const filteredProblems = problems.filter(problem => {
    return (filters.company === 'All' || problem.company === filters.company) &&
           (filters.difficulty === 'All' || problem.difficulty === filters.difficulty) &&
           (filters.topic === 'All' || problem.topic === filters.topic) &&
           (filters.status === 'All' || problem.status === filters.status) &&
           problem.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'solved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          {Object.entries({
            company: companies,
            difficulty: difficulties,
            topic: topics,
            status: statuses
          }).map(([filterType, options]) => (
            <select
              key={filterType}
              value={filters[filterType]}
              onChange={(e) => setFilters(prev => ({ ...prev, [filterType]: e.target.value }))}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            >
              {options.map(option => (
                <option key={option} value={option}>
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}: {option}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.map(problem => (
          <div
            key={problem.id}
            className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
              darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{problem.title}</h3>
                <div className="flex items-center space-x-4 text-sm">
                  <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-gray-600">{problem.company}</span>
                  <span className="text-gray-600">{problem.topic}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(problem.status)}`}>
                {problem.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Application Component
const DSAVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubbleSort');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [showExplanation, setShowExplanation] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    // Reset logic would go here
  };

  const handleComplete = () => {
    setIsPlaying(false);
  };

  const renderVisualizer = () => {
    switch (selectedAlgorithm) {
      case 'bubbleSort':
        return <SortingVisualizer isPlaying={isPlaying} speed={speed} onComplete={handleComplete} />;
      case 'binarySearch':
        return <BinarySearchVisualizer isPlaying={isPlaying} speed={speed} onComplete={handleComplete} />;
      case 'bfsTree':
        return <TreeVisualizer isPlaying={isPlaying} speed={speed} onComplete={handleComplete} />;
      default:
        return <SortingVisualizer isPlaying={isPlaying} speed={speed} onComplete={handleComplete} />;
    }
  };

  const currentAlgorithm = algorithms[selectedAlgorithm];

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-600">Code Quest</h1>
              <span className="ml-2 text-sm text-gray-500">DSA Learning Platform</span>
            </div>
            
            <nav className="flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('visualizer')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'visualizer' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Visualizer</span>
              </button>
              
              <button
                onClick={() => setActiveTab('ide')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'ide' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>IDE</span>
              </button>
              
              <button
                onClick={() => setActiveTab('problems')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'problems' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Problems</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'visualizer' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedAlgorithm}
                    onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="bubbleSort">Bubble Sort</option>
                    <option value="binarySearch">Binary Search</option>
                    <option value="bfsTree">BFS Tree Traversal</option>
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePlayPause}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                        isPlaying 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    
                    <button
                      onClick={handleReset}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Speed:</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm">{speed}x</span>
                  </div>
                  
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      showExplanation 
                        ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Explanation
                  </button>
                </div>
              </div>
            </div>

            {/* Complexity Info */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 shadow-sm`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{currentAlgorithm.name}</h3>
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="font-medium">Time: </span>
                    <span className="text-purple-600">{currentAlgorithm.timeComplexity}</span>
                  </div>
                  <div>
                    <span className="font-medium">Space: </span>
                    <span className="text-purple-600">{currentAlgorithm.spaceComplexity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualization Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {renderVisualizer()}
              </div>
              
              {/* Explanation Panel */}
              {showExplanation && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
                  <h3 className="text-lg font-semibold mb-4">Algorithm Explanation</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description:</h4>
                      <p className="text-sm text-gray-600">{currentAlgorithm.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Pseudocode:</h4>
                      <pre className={`text-xs p-3 rounded ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} overflow-x-auto`}>
                        {currentAlgorithm.pseudocode}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ide' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Online IDE</h2>
              <div className="flex items-center space-x-4">
                <a 
                  href="#working_ide_implementation" 
                  target="_blank"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  <span>Open Full IDE</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <div className="text-sm text-gray-500">
                  Write, test, and save your code
                </div>
              </div>
            </div>
            
            {/* Preview IDE Notice */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border-l-4 border-blue-500 p-4 rounded-md`}>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                    Full Featured IDE Available
                  </h3>
                  <div className={`mt-1 text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    Click "Open Full IDE" above to access the complete Monaco Editor with:
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>Real-time JavaScript execution</li>
                      <li>Multi-language syntax highlighting (JavaScript, Python, C++, Java, HTML, CSS)</li>
                      <li>IntelliSense and error detection</li>
                      <li>Code persistence and auto-save</li>
                      <li>Dark/Light theme toggle</li>
                      <li>Example code templates for DSA problems</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <CodeEditor darkMode={darkMode} />
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">DSA Problems</h2>
              <div className="text-sm text-gray-500">
                500+ Company-specific problems
              </div>
            </div>
            <ProblemList darkMode={darkMode} />
          </div>
        )}
      </main>
    </div>
  );
};

export default DSAVisualizer;