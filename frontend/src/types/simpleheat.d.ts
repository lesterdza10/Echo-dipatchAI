declare module "simpleheat" {
  interface SimpleheatInstance {
    data(points: [number, number, number][]): this;
    radius(r: number, blur?: number): this;
    gradient(grad: Record<number, string>): this;
    draw(minOpacity?: number): this;
    clear(): this;
    resize(): this;
    max(max: number): this;
  }

  function simpleheat(
    canvas: HTMLCanvasElement | string
  ): SimpleheatInstance;

  export = simpleheat;
}
