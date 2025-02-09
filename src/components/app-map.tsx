'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import indonesia from '@/lib/indonesia.json'

import { GeoJsonObject } from 'geojson'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useLocation } from '@/hooks/use-location'

export default function AppMap({ data, width = 'auto', height = '80vh', center = [-2.5, 120], zoom = 5 }: { data: GroupedResult[]; width: string; height: string; center: [number, number]; zoom: number }) {
  const { location, setLocation } = useLocation()

  indonesia.features.forEach((feature: { properties: { KDPPUM: string; WADMPR: string; METADATA: string; UPDATED: string; positive?: number; negative?: number; ratio?: number } }) => {
    data.forEach((post) => {
      if (feature.properties.WADMPR.toLowerCase().replace(/\s/g, '-') === post.location) {
        feature.properties.positive = post.positive
        feature.properties.negative = post.negative
        feature.properties.ratio = post.ratio
      }
    })
  })

  function style(feature: FeatureProps['feature']) {
    function getColor(properties: FeatureProps['feature']['properties']) {
      if (properties.ratio) {
        return 'red'
      }

      return 'black'
    }

    function getCurrent(properties: FeatureProps['feature']['properties']) {
      if (properties.WADMPR.toLowerCase().replace(/\s/g, '-') === location.province) {
        return 3
      }
      return 1
    }

    return {
      fillColor: getColor(feature.properties),
      weight: getCurrent(feature.properties),
      opacity: 1,
      color: 'gray',
      fillOpacity: 0.5,
    }
  }

  function onEachFeature(feature: FeatureProps['feature'], layer: FeatureProps['layer']) {
    function onClick() {
      const province = feature.properties.WADMPR.toLowerCase().replace(/\s/g, '-')
      const positive = feature.properties.positive
      const negative = feature.properties.negative
      const ratio = feature.properties.ratio
      setLocation({ province, positive, negative, ratio })
    }

    function onMouseOver() {
      layer.setStyle({
        fillOpacity: 0.7,
      })
    }

    function onMouseOut() {
      layer.setStyle({
        fillOpacity: 0.5,
      })
    }

    layer.on({
      click: onClick,
      mouseover: onMouseOver,
      mouseout: onMouseOut,
    })
  }

  return (
    <div className="rounded overflow-hidden">
      <MapContainer style={{ height: height, width: width, zIndex: 0 }} center={center} zoom={zoom}>
        <TileLayer attribution="©OpenStreetMap, ©CartoDB" url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png" />
        <GeoJSON style={style} data={indonesia as GeoJsonObject} onEachFeature={onEachFeature} />

        <div className="leaflet-top leaflet-right">
          <div className="m-3 p-3 bg-white rounded-sm shadow text-slate-800">
            <h1 className="capitalize text-sm font-bold">{location.province ? location.province.replaceAll('-', ' ') : 'Choose Province'}</h1>
            {location.ratio && (
              <>
                <p>Positive: {location.positive}</p>
                <p>Negative: {location.negative}</p>
                <p>Ratio: {location.ratio.toFixed(2)}</p>
              </>
            )}
          </div>
        </div>
      </MapContainer>
    </div>
  )
}
