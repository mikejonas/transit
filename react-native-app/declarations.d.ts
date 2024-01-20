// https://github.com/kristerkari/react-native-svg-transformer?tab=readme-ov-file#using-typescript
declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }