interface Props {
  address: string;
  place_name: string;
  placeId: string;
}

export const shareKakao = async ({ address, place_name, placeId }: Props) => {
  await window.Kakao.Share.sendDefault({
    objectType: 'location',
    address: `${address}`,
    addressTitle: `${place_name}`,
    content: {
      title: 'Baple',
      description: `${place_name}`,
      imageUrl: '/images/aboutPage/about_LOGO.png',
      link: {
        mobileWebUrl: `${process.env.NEXT_PUBLIC_BASEURL}/place/${placeId}`,
        webUrl: `${process.env.NEXT_PUBLIC_BASEURL}/place/${placeId}`,
      },
    },
    buttons: [
      {
        title: '웹으로 보기',
        link: {
          mobileWebUrl: `${process.env.NEXT_PUBLIC_BASEURL}/place/${placeId}`,
          webUrl: `${process.env.NEXT_PUBLIC_BASEURL}/place/${placeId}`,
        },
      },
    ],
  });
};
