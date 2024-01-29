import { compile } from 'path-to-regexp';

export class RouteEntry {
  /**
   * Create a new url and populate the parameters with values
   */
  readonly createUrl: (params: Record<string, string>) => string;

  constructor(
    private readonly routePath: string,
    private parent?: RouteEntry
  ) {
    this.createUrl = compile(this.routePath);
  }

  /**
   * Returns the full path of the route including all parent segments
   */
  get fullPath() {
    return this.getPathStr().join('');
  }

  /**
   * Returns the configured path for the class instance
   */
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
