'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface ReactFlowRendererProps {
  nodes: Node[]
  edges: Edge[]
}

export default function ReactFlowRenderer({ nodes: initialNodes, edges: initialEdges }: ReactFlowRendererProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Update nodes and edges when props change
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="bg-black/50"
        nodeTypes={{}}
      >
        <Controls className="bg-black/80 border-white/20" />
        <MiniMap 
          className="bg-black/80 border-white/20"
          nodeColor={(node) => {
            switch (node.type) {
              case 'input': return '#8b5cf6'
              case 'output': return '#06b6d4'
              default: return '#6b7280'
            }
          }}
        />
        <Background color="#333333" gap={20} />
      </ReactFlow>
    </div>
  )
}
