export default interface I {
  /** @description 获取分类 */
  categories: () => Promise<
    Array<{
      /** @description id */
      id: string;
      /** @description category name */
      name: string;
    }>
  >;

  items: () => Promise<
    Array<{
      id: string;
    }>
  >;

  item: (params: { id: string }) => Promise<any>;
}
