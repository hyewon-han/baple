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
      imageUrl:
        'https://velog.velcdn.com/images/laejunkim/post/18703d64-7922-4e58-9229-a17a4a8e4cf9/image.png',
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
