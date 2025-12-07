export type RootStackParamList = {
  Home: undefined;        // Home 화면은 파라미터 없음
  CreateQuest: undefined; // CreateQuest 화면도 파라미터 없음
  // 만약 id를 넘겨야 한다면? Detail: { id: number };
  FetchQuest: {id: number};
  //이렇게 타입을 넘겨받을걸 정해주어야 route.param을 받아갈 수 있다.
};