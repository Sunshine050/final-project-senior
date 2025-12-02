declare module "react-native-maps" {
  import { Component } from "react";
  import { ViewProps } from "react-native";

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface LatLng {
    latitude: number;
    longitude: number;
  }

  export interface MapViewProps extends ViewProps {
    region?: Region;
    initialRegion?: Region;
    onRegionChange?: (region: Region) => void;
    onRegionChangeComplete?: (region: Region) => void;
    showsUserLocation?: boolean;
    followsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    showsPointsOfInterest?: boolean;
    showsCompass?: boolean;
    showsScale?: boolean;
    showsBuildings?: boolean;
    showsTraffic?: boolean;
    showsIndoors?: boolean;
    zoomEnabled?: boolean;
    zoomControlEnabled?: boolean;
    rotateEnabled?: boolean;
    scrollEnabled?: boolean;
    pitchEnabled?: boolean;
    toolbarEnabled?: boolean;
    mapType?: "standard" | "satellite" | "hybrid" | "terrain" | "none";
    minZoomLevel?: number;
    maxZoomLevel?: number;
    provider?: "google" | null;
  }

  export interface MarkerProps extends ViewProps {
    coordinate: LatLng;
    title?: string;
    description?: string;
    identifier?: string;
    pinColor?: string;
    image?: any;
    opacity?: number;
    anchor?: { x: number; y: number };
    centerOffset?: { x: number; y: number };
    calloutOffset?: { x: number; y: number };
    flat?: boolean;
    draggable?: boolean;
    onPress?: () => void;
    onSelect?: () => void;
    onDeselect?: () => void;
    onCalloutPress?: () => void;
    onDragStart?: () => void;
    onDrag?: () => void;
    onDragEnd?: (e: { nativeEvent: { coordinate: LatLng } }) => void;
  }

  export default class MapView extends Component<MapViewProps> {
    animateToRegion(region: Region, duration?: number): void;
    animateCamera(camera: any, duration?: number): void;
    fitToElements(animated?: boolean): void;
    fitToSuppliedMarkers(markers: string[], options?: any): void;
    fitToCoordinates(coordinates: LatLng[], options?: any): void;
  }

  export class Marker extends Component<MarkerProps> {}
  export class Callout extends Component<ViewProps> {}
  export class Polyline extends Component<any> {}
  export class Polygon extends Component<any> {}
  export class Circle extends Component<any> {}
}

