declare module "testdouble-jest" {
  const _default: (...args: any[]) => void;
  export default _default;
}

declare module "template-file" {
  export const renderTemplateFile: () => void;
  export const renderString: () => void;
}
