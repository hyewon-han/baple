import Seo from '@/components/layout/Seo';
import EventMarkerContainer from '@/components/map/MarkerContainer';
import MylocationButton from '@/components/map/MylocationButton';
import MylocationOverlayMap from '@/components/map/MylocationOverlayMap';
import PlacesModal from '@/components/map/PlacesModal';
import { useViewport } from '@/hooks/useViewport';
import { supabase } from '@/libs/supabase';
import { placesData } from '@/redux/modules/placesDataSlice';
import { Tables } from '@/types/supabase';
import { Maplocation } from '@/types/types';
import { Spinner } from '@nextui-org/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Map,
  MapMarker,
  MapTypeControl,
  ZoomControl,
} from 'react-kakao-maps-sdk';
import { useDispatch } from 'react-redux';

// TODO: 고민 포인트
// 1. zoom level에 따라 radius 를 설정 가능한지
// 2. radius 에 맞는 지도 사이즈가 나오는지
// 3. 지도 사이즈에 맞는 데이터를 가져올 수 있는가?

const NearByPage = () => {
  const [location, setLocation] = useState<Maplocation>({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: null,
    isLoading: true,
  });
  const [mylocation, setMyLocation] = useState<Maplocation>({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: null,
    isLoading: true,
  });

  const { isMobile } = useViewport();
  const [regionName, setRegionName] = useState<string>('');
  const [cityName, setCityName] = useState<string>('');
  const [place, setplace] = useState<Tables<'places'>[] | null>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isMobile) {
      setIsModalVisible(false);
    } else {
      setIsModalVisible(true);
    }
  }, [isMobile]);
  // console.log('windowkakao', window.kakao);
  /**
   * 현재 할것
   * 1. 현재 위경도 값을 동적으로 변환 시키기 위해 sdk제공 코드 사용
   * 2.
   */

  // 함수로 만들어 useEffect에서 실행
  // 해당 함수는 place에 대한 위경도값을 주소로 변환 후 구 정보를 뽑아오는 코드

  useEffect(() => {
    const fetchMap = async () => {
      try {
        axios
          .get(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${location.center.lng}&y=${location.center.lat}&input_coord=WGS84`,
            {
              headers: {
                Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
              },
            },
          )
          .then((res) => {
            setRegionName(res.data.documents[0]?.address.region_2depth_name);
            setCityName(res.data.documents[0]?.address.region_1depth_name);
          });
      } catch (error) {
        console.log(error);
      }
    };
    // 초기값과 같지 않다면 실행
    if (
      location.center.lng !== 126.570667 &&
      location.center.lat !== 33.450701
    ) {
      fetchMap();
    }
  }, [location]);

  useEffect(() => {
    const fetchPlaceData = async () => {
      let { data: places, error } = await supabase
        .from('places')
        .select('*')
        .eq('district', regionName)
        .eq('city', cityName);
      if (places !== null) {
        setplace(places);
        dispatch(placesData(places));
      }
      if (error) console.log('error');
    };

    /** 이유를 모르겠으나 regionName이 빈 문자열일때 fecthPlaceData가 작동을 한다(세종시 데이터를 가져옴) 초기 렌더링시 데이터를 두번을 가져오는건
     *  비용적인 측면에서 너무 아깝기 때문에 한번만 가져올 수 있도록 조치하였다.
     */

    if (regionName !== '') fetchPlaceData();
  }, [regionName, cityName]);

  useEffect(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
          setMyLocation((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        (err) => {
          setLocation((prev) => ({
            ...prev,
            errMsg: err.message,
          }));
        },
      );
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setLocation((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false,
      }));
    }
  }, []);

  return (
    <div
      // style={{ position: 'relative', display: 'flex' }}
      className='overflow-hidden flex relative'
    >
      <Seo />
      {!mylocation.isLoading ? (
        <Map // 지도를 표시할 Container
          center={location.center}
          style={{
            // 지도의 크기
            width: '100%',
            height: '93vh',
          }}
          // className='relative flex'
          level={8} // 지도의 확대 레벨
          minLevel={11}
          draggable={true}
          zoomable={true}
          keyboardShortcuts={true}
          scrollwheel={true}
          onDragEnd={(map) =>
            setLocation({
              center: {
                lat: map.getCenter().getLat(),
                lng: map.getCenter().getLng(),
              },
              errMsg: null,
              isLoading: false,
            })
          }
        >
          <MapMarker
            position={mylocation.center}
            image={{
              src: '/images/icons/character.svg', // 마커이미지의 주소입니다
              size: {
                width: 44,
                height: 40,
              },
            }}
          />
          <MylocationOverlayMap mylocation={mylocation} />

          {/* 커스텀 오버레이를 뿌려줌 */}
          {place?.map((place) => (
            <EventMarkerContainer key={place.id} place={place} />
          ))}
          {place?.length !== 0 ? (
            <PlacesModal
              cityName={cityName}
              regionName={regionName}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            />
          ) : null}

          <MylocationButton mylocation={mylocation} setLocation={setLocation} />
          <MapTypeControl position={'TOPLEFT'} />
          <ZoomControl position={'LEFT'} />
        </Map>
      ) : (
        <div className='w-[100%] h-[90vh] flex items-center justify-center'>
          <Spinner
            label='현재위치 불러오는중 혹은 현재위치 사용불가'
            color='primary'
            size='lg'
            labelColor='primary'
          />
        </div>
      )}
    </div>
  );
};

export default NearByPage;
