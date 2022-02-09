declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*!raw' {
  const content: string | any;
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare type Mutable<T> = { -readonly [P in keyof T]: T[P] };
