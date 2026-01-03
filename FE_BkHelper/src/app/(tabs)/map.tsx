import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CS1 from '@/assets/map/CS1.json';
import CS2 from '@/assets/map/CS2.json';

type MapKey = 'CS1' | 'CS2';

const MapTab = () => {
    const [MapModule, setMapModule] = useState<any>(null);
    const [selectedMap, setSelectedMap] = useState<MapKey>('CS1');
    const mapRef = useRef<any>(null);

    /* =========================
       Load react-native-maps safely
    ========================== */
    useEffect(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const m = require('react-native-maps');
            setMapModule(m);
        } catch (err: any) {
            console.warn('react-native-maps not available:', err?.message ?? err);
            setMapModule(null);
        }
    }, []);

    const MapView: any = MapModule?.default ?? MapModule;
    const Geojson: any = MapModule?.Geojson ?? null;

    /* =========================
       Choose current GeoJSON
    ========================== */
    const currentGeoJSON = selectedMap === 'CS1' ? CS1 : CS2;

    /* =========================
       Extract polygons from GeoJSON
    ========================== */
    const extractPolygons = (geojson: any) => {
        const polygons: Array<Array<{ latitude: number; longitude: number }>> = [];
        if (!geojson) return polygons;

        const features =
            geojson.type === 'FeatureCollection'
                ? geojson.features
                : [geojson];

        for (const feat of features) {
            const geom = feat.geometry ?? feat;
            if (!geom) continue;

            const { type, coordinates } = geom;
            if (!coordinates) continue;

            if (type === 'Polygon') {
                for (const ring of coordinates) {
                    polygons.push(
                        ring.map((pt: any) => ({
                            latitude: pt[1],
                            longitude: pt[0],
                        }))
                    );
                }
            }

            if (type === 'MultiPolygon') {
                for (const poly of coordinates) {
                    for (const ring of poly) {
                        polygons.push(
                            ring.map((pt: any) => ({
                                latitude: pt[1],
                                longitude: pt[0],
                            }))
                        );
                    }
                }
            }
        }

        return polygons;
    };

    const polygons = useMemo(
        () => extractPolygons(currentGeoJSON),
        [currentGeoJSON]
    );

    /* =========================
       Compute initial region (only for first render)
    ========================== */
    const initialRegion = useMemo(() => {
        if (polygons.length === 0) {
            return {
                latitude: 10.77,
                longitude: 106.66,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };
        }

        let minLat = 90,
            maxLat = -90,
            minLng = 180,
            maxLng = -180;

        polygons.forEach(ring => {
            ring.forEach(p => {
                minLat = Math.min(minLat, p.latitude);
                maxLat = Math.max(maxLat, p.latitude);
                minLng = Math.min(minLng, p.longitude);
                maxLng = Math.max(maxLng, p.longitude);
            });
        });

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: Math.max(0.005, (maxLat - minLat) * 1.3),
            longitudeDelta: Math.max(0.005, (maxLng - minLng) * 1.3),
        };
    }, []);

    /* =========================
       FIT MAP when CS1 / CS2 changes
    ========================== */
    const getAllPoints = (polys: any[]) => {
        const pts: { latitude: number; longitude: number }[] = [];
        polys.forEach((ring: { latitude: number; longitude: number }[]) => ring.forEach((p: { latitude: number; longitude: number }) => pts.push(p)));
        return pts;
    };

    useEffect(() => {
        if (!mapRef.current || polygons.length === 0) return;

        const points = getAllPoints(polygons);

        mapRef.current.fitToCoordinates(points, {
            edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
            animated: true,
        });
    }, [selectedMap, polygons]);

    /* =========================
       Fallback UI
    ========================== */
    if (!MapModule) {
        return (
            <SafeAreaView
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <Text style={{ color: 'gray' }}>
                    react-native-maps chưa khả dụng trên nền tảng này
                </Text>
            </SafeAreaView>
        );
    }

    /* =========================
       Render
    ========================== */
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* ===== Switch CS1 / CS2 ===== */}
            <View
                style={{
                    flexDirection: 'row',
                    padding: 8,
                    backgroundColor: '#fff',
                    zIndex: 10,
                }}
            >
                {(['CS1', 'CS2'] as MapKey[]).map(key => (
                    <TouchableOpacity
                        key={key}
                        onPress={() => setSelectedMap(key)}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            marginRight: 8,
                            borderRadius: 20,
                            backgroundColor:
                                selectedMap === key ? '#2563eb' : '#e5e7eb',
                        }}
                    >
                        <Text
                            style={{
                                color: selectedMap === key ? '#fff' : '#000',
                                fontWeight: '600',
                            }}
                        >
                            {key}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* ===== Map ===== */}
            <MapView
                ref={mapRef}
                style={{ flex: 1 }}
                initialRegion={initialRegion}
                zoomEnabled
                scrollEnabled
                rotateEnabled
                pitchEnabled
            >
                {Geojson ? (
                    <Geojson
                        geojson={currentGeoJSON}
                        strokeColor="#2563eb"
                        fillColor="rgba(37,99,235,0.25)"
                        strokeWidth={1}
                    />
                ) : (
                    polygons.map((coords, idx) => (
                        <MapView.Polygon
                            key={`poly-${idx}`}
                            coordinates={coords}
                            strokeColor="#2563eb"
                            fillColor="rgba(37,99,235,0.25)"
                            strokeWidth={1}
                        />
                    ))
                )}
            </MapView>
        </SafeAreaView>
    );
};

export default MapTab;
