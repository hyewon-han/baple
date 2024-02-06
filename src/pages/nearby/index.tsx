import Seo from '@/components/layout/Seo';
import MarkerContainer from '@/components/map/MarkerContainer';
import MylocationButton from '@/components/map/MylocationButton';
import MylocationOverlayMap from '@/components/map/MylocationOverlayMap';
import PlacesModal from '@/components/map/PlacesModal';
import { useViewport } from '@/hooks/useViewport';
import { supabase } from '@/libs/supabase';
import { RootState } from '@/redux/config/configStore';
import { placesData } from '@/redux/modules/placesDataSlice';
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
import { useDispatch, useSelector } from 'react-redux';

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
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const dispatch = useDispatch();
  const places = useSelector((state: RootState) => state.placesData);

  useEffect(() => {
    if (isMobile) {
      setIsModalVisible(false);
    } else {
      setIsModalVisible(true);
    }
  }, [isMobile]);

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
        throw error;
      }
    };
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
        dispatch(placesData(places));
      }
      if (error) throw 'error';
    };

    if (regionName !== '') fetchPlaceData();
  }, [regionName, cityName]);

  useEffect(() => {
    if (navigator.geolocation) {
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
      setLocation((prev) => ({
        ...prev,
        errMsg: 'geolocation을 사용할수 없어요..',
        isLoading: false,
      }));
    }
  }, []);

  return (
    <div className='overflow-hidden flex relative'>
      <Seo />
      {!mylocation.isLoading ? (
        <Map
          center={location.center}
          style={{
            width: '100%',
            height: '93vh',
          }}
          level={8}
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
              src: '/images/icons/character.svg',
              size: {
                width: 44,
                height: 40,
              },
            }}
          />
          <MylocationOverlayMap mylocation={mylocation} />

          {/* 커스텀 오버레이를 뿌려줌 */}
          {places?.map((place) => (
            <MarkerContainer key={place.id} place={place} />
          ))}
          {places?.length !== 0 ? (
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
            label='로딩이 계속 된다면 새로고침 후 위치 접근 권한을 허용해 주세요!'
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
