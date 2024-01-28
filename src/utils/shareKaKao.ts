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
        'https://velog.velcdn.com/images/jetiiin/post/3e477527-5e73-4a52-a8de-c0d1dec00f8a/image.png',
      link: {
        webUrl: `${process.env.NEXT_PUBLIC_BASEURL}/place/${placeId}`,
      },
    },
    buttons: [
      {
        title: '웹으로 보기',
        link: {
          webUrl: `${process.env.NEXT_PUBLIC_BASEURL}/place/${placeId}`,
        },
      },
    ],
  });
};
