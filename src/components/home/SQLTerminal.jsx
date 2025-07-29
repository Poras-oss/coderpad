import { useState, useEffect } from 'react';

const SQLTerminal = () => {
  const [currentQuery, setCurrentQuery] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const queries = [
    {
      query: "SELECT user_id, score FROM quiz_results WHERE score > 85 ORDER BY score DESC;",
      result: [
        "user_id | score",
        "--------|------",
        "  1337  |  98",
        "  2156  |  94",
        "  4021  |  89",
        "  7834  |  87",
        "",
        "4 rows returned"
      ]
    },
    {
      query: "UPDATE neural_matrix SET status = 'ACTIVE' WHERE node_id IN (SELECT id FROM nodes WHERE region = 'CYBER_CORE');",
      result: [
        "Query executed successfully.",
        "15 rows affected.",
        "",
        "Neural matrix updated.",
        "System status: ONLINE"
      ]
    },
    {
      query: "SELECT COUNT(*) as active_sessions FROM user_sessions WHERE last_activity > NOW() - INTERVAL '5 minutes';",
      result: [
        "active_sessions",
        "---------------",
        "     127",
        "",
        "1 row returned"
      ]
    },
    {
      query: "ANALYZE TABLE performance_metrics;",
      result: [
        "Analyzing table structure...",
        "Indexing neural pathways...",
        "Optimizing quantum queries...",
        "",
        "Analysis complete.",
        "Performance improved by 23.7%"
      ]
    }
  ];

  useEffect(() => {
    const typeText = async (text) => {
      setIsTyping(true);
      setDisplayText('');
      
      // Type the query
      for (let i = 0; i <= text.length; i++) {
        setDisplayText(text.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Pause before showing result
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show result lines
      const result = queries[currentQuery].result;
      for (let lineIndex = 0; lineIndex < result.length; lineIndex++) {
        setDisplayText(prev => prev + '\n' + result[lineIndex]);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      setIsTyping(false);
      
      // Wait before next query
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentQuery((prev) => (prev + 1) % queries.length);
    };

    typeText(queries[currentQuery].query);
  }, [currentQuery]);

  return (
    <div className="fixed z-20 w-60"
      style={{
          position: 'fixed',
          left: 18,
          top: 'calc(50% - 280px)',
          // width: HUD_WIDTH,
          // height: HUD_HEIGHT,
          pointerEvents: 'auto',
        }}
      >
      <div className="hud-overlay border-0 p-4 max-h-48 overflow-hidden">
      {/* <div className="hud-overlay border border-primary/30 p-4 h-64 overflow-hidden"> */}
        <div className="flex items-center gap-2 mb-3 border-b border-primary/20 pb-2">
          <div className="w-3 h-3 rounded-full bg-cyber-success animate-pulse" />
          <span className="text-xs font-mono text-primary">SQL NEURAL TERMINAL</span>
        </div>
        
        <div className="font-mono text-xs text-foreground/80 space-y-1">
          <div className="text-cyber-success">datasense@neural-core:~$</div>
          <pre className="whitespace-pre-wrap text-cyan-300 leading-relaxed">
            {displayText}
            {isTyping && <span className="animate-pulse">|</span>}
          </pre>
        </div>
        
        {/* Terminal scan line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-px bg-primary/40 animate-scan" />
        </div>
      </div>
    </div>
  );
};

export default SQLTerminal;