import { compile } from 'path-to-regexp';

export class RouteEntry {
  readonly createUrl: (params: Record<string, string>) => string;

  constructor(
    private readonly routePath: string,
    private parent?: RouteEntry
  ) {
    this.createUrl = compile(this.routePath);
  }

  get fullPath() {
    return this.getPathStr().join('');
  }

  get path() {
    return this.routePath;
  }

  private getPathStr(): string[] {
    if (this.parent) {
      return [this.parent.getPathStr(), this.routePath].flat();
    }

    return [this.routePath];
  }
}
