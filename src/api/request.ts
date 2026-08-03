export class ApiRequest {
  constructor(
    public url: string | URL,
    public config: RequestInit = {},
  ) {}

  send() {
    return fetch(this.url, this.config);
  }

  setParams(params: Record<string, string>) {
    if (typeof this.url == "string") this.url = new URL(this.url);
    const search = new URLSearchParams(params);
    this.url.search = search.toString();
    return this;
  }

  async json<TResponse extends object>(): Promise<TResponse> {
    const response = await this.send();
    return await response.json();
  }

  async blob() {
    const response = await this.send();
    return await response.blob();
  }

  async text() {
    const response = await this.send();
    return await response.text();
  }
}
