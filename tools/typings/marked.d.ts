declare module 'marked' {
  export class Renderer {
    code(code: string, language?: string): string;
    // Add other methods as needed
  }

  export function parse(markdown: string, options?: any): string;
  export function setOptions(options: any): void;

  export { Renderer };
}
