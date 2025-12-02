declare module '@expo/vector-icons' {
  import * as React from 'react';
  import { StyleProp, TextStyle } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }

  export class MaterialCommunityIcons extends React.Component<IconProps> {}
  export class MaterialIcons extends React.Component<IconProps> {}
  export class FontAwesome5 extends React.Component<IconProps> {}
}

