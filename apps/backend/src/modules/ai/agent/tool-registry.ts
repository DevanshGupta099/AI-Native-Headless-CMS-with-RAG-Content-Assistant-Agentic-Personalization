import { AgentTool } from './types';
import { allAgentTools } from './tools';
import { AppError } from '../../../utils/AppError';

export class ToolRegistry {
  private tools = new Map<string, AgentTool<unknown, unknown>>();

  constructor() {
    for (const tool of allAgentTools) {
      this.register(tool as unknown as AgentTool<unknown, unknown>);
    }
  }

  register(tool: AgentTool<unknown, unknown>): void {
    this.tools.set(tool.name, tool);
  }

  get(name: string): AgentTool<unknown, unknown> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new AppError(`Agent tool '${name}' is not registered`, 400, 'TOOL_NOT_FOUND');
    }
    return tool;
  }

  list(): Array<{ name: string; description: string }> {
    return Array.from(this.tools.values()).map((t) => ({
      name: t.name,
      description: t.description,
    }));
  }
}

export const toolRegistry = new ToolRegistry();
