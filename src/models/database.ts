export interface DatabaseTable<TRecord> {
  name: string;
  records: TRecord[];
}
