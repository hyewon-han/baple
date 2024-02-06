import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { Tables } from '@/types/supabase';
import { Button } from '@nextui-org/react';
import { useRef, useState } from 'react';
import {
  CustomOverlayRoadview,
  Map,
  MapMarker,
  MapTypeControl,
  Roadview,
  ZoomControl,
} from 'react-kakao-maps-sdk';

interface Props {
  placeInfo: Tables<'places'>;
}

const PlaceDetailMap = ({ placeInfo }: Props) => {
  const { baple } = useCurrentTheme();
  const roadviewRef = useRef<kakao.maps.Roadview | null>(null);
  const [toggle, setToggle] = useState('map');

  let placePosition = {
    lat: placeInfo?.lat,
    lng: placeInfo?.lng,
  };

  const Content = () => {
    return (
      <div className='bg-white  text-black w-[250px] h-[100px] rounded-[20px] flex items-center justify-center text-[20px] font-bold text-wrap p-4'>
        <p>{placeInfo.place_name}</p>
        <div className='w-5 h-5 bg-white absolute bottom-[-10px] rotate-45'></div>
      </div>
    );
  };

  return (
    <section className='mb-[30px] relative'>
      {toggle === 'map' && (
        <Map
          center={placePosition}
          draggable={true}
          zoomable={true}
          scrollwheel={true}
          keyboardShortcuts={true}
          style={{
            width: '100%',
            height: '300px',
          }}
          level={4}
          minLevel={8}
        >
          <MapMarker
            position={placePosition}
            image={{
              src: `/images/icons/${
                baple ? 'marker.svg' : 'CBicons/CBmarker.svg'
              }`,
              size: {
                width: 44,
                height: 40,
              },
            }}
          />
          <Button
            className='absolute flex z-10 top-[3px] left-[130px] w-[90px] h-[32px] justify-center'
            variant='solid'
            color='primary'
            onClick={() => setToggle('roadview')}
            title='지도 보기'
          >
            로드뷰 보기
          </Button>
          <MapTypeControl position={'TOPLEFT'} />
          <ZoomControl position={'LEFT'} />
        </Map>
      )}

      {toggle === 'roadview' && (
        <Roadview
          position={{ ...placePosition, radius: 200 }}
          style={{
            width: '100%',
            height: '300px',
          }}
          ref={roadviewRef}
        >
          <Button
            className='absolute top-[5px] left-[5px] z-10 flex w-[90px] h-[32px] justify-center'
            variant='solid'
            color='primary'
            onClick={() => setToggle('map')}
            title='지도 보기'
          >
            지도
          </Button>
          <CustomOverlayRoadview
            position={placePosition}
            xAnchor={0.5}
            yAnchor={0.5}
            onCreate={(overlay) => {
              const roadview = roadviewRef.current;

              if (!roadview) {
                return;
              }

              const projection = roadview.getProjection();
              const viewpoint = projection.viewpointFromCoords(
                overlay.getPosition(),
                overlay.getAltitude(),
              );
              roadview.setViewpoint(viewpoint);
            }}
          >
            <Content />
          </CustomOverlayRoadview>
        </Roadview>
      )}
    </section>
  );
};

export default PlaceDetailMap;
