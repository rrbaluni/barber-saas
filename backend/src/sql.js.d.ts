declare module 'sql.js' {
  interface Statement {
    bind(params: unknown[]): void;
    run(params: unknown[]): void;
    step(): boolean;
    getAsObject(): Record<string, unknown>;
    free(): void;
  }

  interface Database {
    run(sql: string): void;
    prepare(sql: string): Statement;
    export(): Uint8Array;
    getRowsModified(): number;
  }

  interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  const initSqlJs: () => Promise<SqlJsStatic>;
  export type { Database, Statement };
  export default initSqlJs;
}
