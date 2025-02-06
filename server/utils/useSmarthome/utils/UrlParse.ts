import { Peer, type Hooks } from "crossws"

export type UpgradeRequest = (Request | {
    url: string;
    headers: Headers;
}) & { context: Peer["context"] };

export class UrlParse {
    constructor(private request: UpgradeRequest | Peer) {
        const _request = (request as Peer).id ? (request as Peer).request : request
        this._url1 = request ? (_request as any)._url as string : ""
        this._url2 = request ? (_request as any)._req.url as string : ""
        this.origin = this._url1.replace(this._url2, "")
        this.protocol = this.origin.split("//")[0].concat("//")
        this.port = Number(this.origin.split(":")[2])
        this.domain = this.origin.replace(this.protocol, "").replace(":".concat(this.port.toString()), "")
        this.fullPath = this._url2.split("?")[0]
        this.paths = this.fullPath.split("/")
        this.queries = Object.fromEntries(this._url2.split("?").pop()?.split("&")
            .filter((queryString) => queryString.split("=", 2).length === 2)
            .map((queryString) => queryString.split("=")) || [[]])
    }

    private _url1 = ""
    private _url2 = ""
    origin: string | undefined = undefined
    domain: string | undefined = undefined
    protocol: string | undefined = undefined
    port: number | undefined = undefined
    fullPath: string | undefined = undefined
    paths: string[] = []
    queries: Record<string, string> = {}
}