interface ServerInterface {
    port: number;
    useMorgan: boolean;
}
interface StorageInterface {
    dsn: string;
}
interface ClientInterface {
    enabled: boolean;
}
export interface ServerConfigInterface {
    server: ServerInterface;
    storage: StorageInterface;
    client: ClientInterface;
}
