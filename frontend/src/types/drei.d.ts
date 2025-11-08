declare module '@react-three/drei' {
  import * as React from 'react';
  export const OrbitControls: React.ComponentType<any>;
  export const Environment: React.ComponentType<any>;
  export function useGLTF(path: string, useDraco?: boolean): any;
}
