import "styled-components";
import { Colors } from "./styles/colors";

declare module "styled-components" {
  export interface DefaultTheme {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    background: string;
    error:string;
  }
}
