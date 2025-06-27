"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";

type Props = {
  darkMode: boolean;
};

const CodeEditor = ({ darkMode }: Props) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState("");

  const runCode = () => {
    if (language !== "javascript") {
      setOutput("⚠️ Only JavaScript execution is supported in this demo.");
      return;
    }

    try {
      const logs: any[] = [];
      const originalLog = console.log;
      console.log = (...args) => logs.push(args.join(" "));

      // ⚠️ eval is only for trusted JS — okay in local demos
      // eslint-disable-next-line no-eval
      eval(code);

      console.log = originalLog;
      setOutput(logs.join("\n") || "(no output)");
    } catch (err: any) {
      setOutput("❌ Error: " + err.message);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} rounded-lg p-6`}>
      <div className="flex justify-between items-center mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <div className="space-x-2">
          <button onClick={runCode} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Run
          </button>
          <button onClick={() => setCode("")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Reset
          </button>
          <button onClick={() => setOutput("")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Clear Output
          </button>
        </div>
      </div>

      <Editor
        height="400px"
        language={language}
        theme={darkMode ? "vs-dark" : "light"}
        value={code}
        onChange={(val) => setCode(val || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          lineNumbers: "on",
        }}
      />

      <div className={`mt-4 p-4 rounded text-sm whitespace-pre-wrap ${darkMode ? "bg-black text-green-400" : "bg-gray-100 text-gray-800"}`}>
        {output || "🖥️ Output will appear here..."}
      </div>
    </div>
  );
};

export default CodeEditor;
